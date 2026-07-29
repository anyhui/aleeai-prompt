const DEFAULT_TIMEOUT_MS = 30_000
const streamLifecycles = new WeakMap()

export const validateEndpoint = endpoint => {
  let url
  try {
    url = new URL(endpoint)
  } catch {
    throw new Error('API 端点必须是有效的 URL')
  }

  if (url.username || url.password) {
    throw new Error('API 端点不能包含用户名或密码')
  }

  const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLocalhost)) {
    throw new Error('API 端点必须使用 HTTPS；仅本机开发可使用 HTTP localhost')
  }

  return url.toString()
}

export const validateConfig = config => {
  validateEndpoint(config.apiEndpoint)
  if (!config.model?.trim()) throw new Error('请输入模型标识')
  if (!config.apiKey?.trim()) {
    throw new Error('请先输入当前浏览器会话使用的 API 密钥；密钥只保存在 React 内存中，刷新即清除')
  }
}

export const sendApiRequest = async (config, messages, options = {}) => {
  validateConfig(config)
  const {
    stream = false,
    temperature = 0.7,
    maxTokens,
    timeoutMs = DEFAULT_TIMEOUT_MS
  } = options
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  let streamResponse

  try {
    const requestBody = { model: config.model.trim(), messages, stream, temperature }
    if (maxTokens) requestBody.max_tokens = maxTokens
    if (stream) requestBody.stream_options = { include_usage: true }

    const response = await fetch(validateEndpoint(config.apiEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
        Accept: stream ? 'text/event-stream' : 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    if (!response.ok) {
      throw new Error(`远程服务请求失败（HTTP ${response.status}）`)
    }
    if (stream) {
      streamResponse = response
      streamLifecycles.set(response, { signal: controller.signal, timeout })
      return response
    }
    return response.json()
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('请求超时，请检查端点或稍后重试', { cause: error })
    if (error instanceof Error && error.message.startsWith('远程服务请求失败')) throw error
    throw new Error('无法连接远程服务，请检查端点、网络和跨域设置', { cause: error })
  } finally {
    if (!streamResponse) clearTimeout(timeout)
  }
}

export const handleStreamResponse = async (response, onChunk, onDone, onError, onEvent) => {
  if (!response.body) throw new Error('远程服务未返回可读取的响应流')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const lifecycle = streamLifecycles.get(response)
  let lineBuffer = ''
  let dataLines = []
  let pendingCarriageReturn = false
  let result = ''
  let finished = false
  let reachedEnd = false

  const processEvent = () => {
    if (!dataLines.length || finished) return
    const data = dataLines.join('\n')
    dataLines = []
    if (data === '[DONE]') {
      finished = true
      return
    }
    let json
    try {
      json = JSON.parse(data)
    } catch {
      throw new Error('远程服务返回了无法解析的流式数据')
    }
    onEvent?.(json)
    const content = json.choices?.[0]?.delta?.content
    if (content) {
      result += content
      onChunk?.(content, result, json)
    }
  }

  const processLine = line => {
    if (!line) {
      processEvent()
      return
    }
    if (line.startsWith(':')) return
    const separator = line.indexOf(':')
    const field = separator === -1 ? line : line.slice(0, separator)
    if (field !== 'data') return
    let value = separator === -1 ? '' : line.slice(separator + 1)
    if (value.startsWith(' ')) value = value.slice(1)
    dataLines.push(value)
  }

  const processText = text => {
    for (let index = 0; index < text.length && !finished; index += 1) {
      const character = text[index]
      if (pendingCarriageReturn) {
        pendingCarriageReturn = false
        if (character === '\n') continue
      }
      if (character === '\r' || character === '\n') {
        processLine(lineBuffer)
        lineBuffer = ''
        pendingCarriageReturn = character === '\r'
      } else {
        lineBuffer += character
      }
    }
  }

  try {
    while (!finished) {
      const { done, value } = await reader.read()
      processText(decoder.decode(value || new Uint8Array(), { stream: !done }))
      if (done) {
        reachedEnd = true
        if (lineBuffer) processLine(lineBuffer)
        break
      }
    }
    onDone?.(result)
    return result
  } catch (error) {
    const exposedError = lifecycle?.signal.aborted
      ? new Error('请求超时，请检查端点或稍后重试', { cause: error })
      : error
    onError?.(exposedError)
    throw exposedError
  } finally {
    if (!reachedEnd) {
      try {
        await reader.cancel()
      } catch {
        // The stream may already be errored by an abort.
      }
    }
    if (lifecycle?.timeout) clearTimeout(lifecycle.timeout)
    streamLifecycles.delete(response)
    reader.releaseLock()
  }
}

const isChatCompletionsResponse = response => Array.isArray(response?.choices)
  && response.choices.length > 0
  && response.choices.some(choice => {
    const messageContent = choice?.message?.content
    const deltaContent = choice?.delta?.content
    return typeof messageContent === 'string' || typeof deltaContent === 'string'
  })

export const checkApiConnection = async config => {
  try {
    const response = await sendApiRequest(config, [{ role: 'user', content: '请仅回复 OK' }], {
      temperature: 0,
      maxTokens: 2,
      timeoutMs: 10_000
    })
    if (!isChatCompletionsResponse(response)) {
      throw new Error('远程服务返回的不是兼容的 Chat Completions 响应')
    }
    return { success: true, message: 'API 连接成功' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default { sendApiRequest, handleStreamResponse, validateConfig, validateEndpoint, checkApiConnection }
