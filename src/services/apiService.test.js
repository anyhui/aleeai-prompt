import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  checkApiConnection,
  handleStreamResponse,
  sendApiRequest,
  validateConfig,
  validateEndpoint
} from './apiService'
import { apiConfig } from '../config/appConfig'
import appConfigSource from '../config/appConfig.js?raw'

const validConfig = {
  apiEndpoint: 'https://api.example.com/v1/chat/completions',
  model: 'example-model',
  apiKey: 'session-secret'
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('browser API security boundary', () => {
  test('never provides a build-time default API key', () => {
    expect(apiConfig.defaultConfig.apiKey).toBe('')
    expect(appConfigSource).not.toMatch(/VITE_(?:DEFAULT_)?API_KEY/)
  })

  test.each([
    ['https://api.example.com/v1/chat/completions', true],
    ['http://localhost:11434/v1/chat/completions', true],
    ['http://127.0.0.1:8000/v1/chat/completions', true],
    ['http://api.example.com/v1/chat/completions', false],
    ['ftp://api.example.com/model', false],
    ['https://user:password@api.example.com/model', false]
  ])('validates endpoint %s', (endpoint, accepted) => {
    const action = () => validateEndpoint(endpoint)
    if (accepted) expect(action).not.toThrow()
    else expect(action).toThrow()
  })

  test('fails closed with Chinese guidance when the session key is missing', () => {
    expect(() => validateConfig({ ...validConfig, apiKey: '' })).toThrow(
      '请先输入当前浏览器会话使用的 API 密钥'
    )
  })

  test('aborts requests after the configured timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
    })))

    const request = expect(sendApiRequest(validConfig, [], { timeoutMs: 100 })).rejects.toThrow('请求超时')
    await vi.advanceTimersByTimeAsync(100)
    await request
  })

  test('keeps the timeout active while a streamed response is being consumed', async () => {
    vi.useFakeTimers()
    let requestSignal = new AbortController().signal
    vi.stubGlobal('fetch', vi.fn(async (_url, options) => {
      requestSignal = options.signal
      return new Response(new ReadableStream({ start() {} }))
    }))

    await sendApiRequest(validConfig, [], { stream: true, timeoutMs: 100 })
    await vi.advanceTimersByTimeAsync(100)

    expect(requestSignal.aborted).toBe(true)
  })

  test('requests usage events for streamed Chat Completions', async () => {
    let requestBody
    const fetchMock = vi.fn(async (_url, options) => {
      requestBody = JSON.parse(options.body)
      return new Response(new ReadableStream({ start() {} }))
    })
    vi.stubGlobal('fetch', fetchMock)

    await sendApiRequest(validConfig, [], { stream: true })

    expect(requestBody).toEqual(expect.objectContaining({
      stream_options: { include_usage: true }
    }))
  })

  test('does not expose provider response bodies or keys in errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify({ error: { message: 'leaked session-secret provider detail' } }),
      { status: 401, statusText: 'Unauthorized' }
    )))

    await expect(sendApiRequest(validConfig, [])).rejects.toThrow('远程服务请求失败（HTTP 401）')
    try {
      await sendApiRequest(validConfig, [])
    } catch (error) {
      expect(error.message).not.toContain('session-secret')
      expect(error.message).not.toContain('provider detail')
    }
  })
})

test('parses SSE JSON and UTF-8 content split across chunk boundaries', async () => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode('data: {"choices":[{"delta":{"content":"你好"}}]}\n\ndata: [DONE]\n\n')
  const response = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, 20))
      controller.enqueue(bytes.slice(20, 47))
      controller.enqueue(bytes.slice(47))
      controller.close()
    }
  }))
  const chunks = []

  const result = await handleStreamResponse(response, content => chunks.push(content))

  expect(result).toBe('你好')
  expect(chunks).toEqual(['你好'])
})

test('cancels an unclosed stream immediately after DONE', async () => {
  const reader = {
    read: vi.fn().mockResolvedValueOnce({
      done: false,
      value: new TextEncoder().encode('data: [DONE]\n\n')
    }),
    cancel: vi.fn().mockResolvedValue(undefined),
    releaseLock: vi.fn()
  }

  await handleStreamResponse({ body: { getReader: () => reader } })

  expect(reader.read).toHaveBeenCalledTimes(1)
  expect(reader.cancel).toHaveBeenCalledTimes(1)
})

test('joins multiline SSE data fields and ignores comments and other fields', async () => {
  const response = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(
        ': keepalive\nevent: message\ndata: {"choices":[{"delta":\ndata: {"content":"joined"}}]}\n\n'
      ))
      controller.close()
    }
  }))

  await expect(handleStreamResponse(response)).resolves.toBe('joined')
})

test('supports CR-only SSE separators split across chunk boundaries', async () => {
  const encoder = new TextEncoder()
  const response = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"CR"}}]}\r'))
      controller.enqueue(encoder.encode('\rdata: [DONE]\r'))
      controller.enqueue(encoder.encode('\r'))
    },
    cancel() {}
  }))

  await expect(handleStreamResponse(response)).resolves.toBe('CR')
})

test('stops at DONE without processing following data in the same chunk', async () => {
  const events = []
  const response = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(
        'data: [DONE]\n\ndata: {"choices":[{"delta":{"content":"must not appear"}}]}\n\n'
      ))
    },
    cancel() {}
  }))

  const result = await handleStreamResponse(response, undefined, undefined, undefined, event => events.push(event))

  expect(result).toBe('')
  expect(events).toEqual([])
})

test('exposes usage-only JSON events', async () => {
  const usage = { prompt_tokens: 3, completion_tokens: 5, total_tokens: 8 }
  const events = []
  const response = new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(
        `data: {"choices":[],"usage":${JSON.stringify(usage)}}\n\ndata: [DONE]\n\n`
      ))
    },
    cancel() {}
  }))

  await handleStreamResponse(response, undefined, undefined, undefined, event => events.push(event))

  expect(events).toEqual([{ choices: [], usage }])
})

test('cancels malformed streams and reports a sanitized parser error', async () => {
  const reader = {
    read: vi.fn().mockResolvedValueOnce({
      done: false,
      value: new TextEncoder().encode('data: provider-secret-not-json\n\n')
    }),
    cancel: vi.fn().mockResolvedValue(undefined),
    releaseLock: vi.fn()
  }

  await expect(handleStreamResponse({ body: { getReader: () => reader } })).rejects.toThrow(
    '远程服务返回了无法解析的流式数据'
  )
  expect(reader.cancel).toHaveBeenCalledTimes(1)
})

test('sanitizes streaming timeout errors and cancels the reader', async () => {
  vi.useFakeTimers()
  const reader = {
    read: vi.fn(),
    cancel: vi.fn().mockResolvedValue(undefined),
    releaseLock: vi.fn()
  }
  vi.stubGlobal('fetch', vi.fn(async (_url, options) => {
    reader.read.mockImplementation(() => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        reject(new DOMException('provider-secret timeout detail', 'AbortError'))
      })
    }))
    return { ok: true, body: { getReader: () => reader } }
  }))
  const response = await sendApiRequest(validConfig, [], { stream: true, timeoutMs: 100 })
  const stream = handleStreamResponse(response).catch(error => error)

  await vi.advanceTimersByTimeAsync(100)

  const error = await stream
  expect(error.message).toBe('请求超时，请检查端点或稍后重试')
  expect(error.message).not.toContain('provider-secret')
  expect(reader.cancel).toHaveBeenCalledTimes(1)
})

test('connection checks reject unrelated successful JSON', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', {
    headers: { 'Content-Type': 'application/json' }
  })))

  await expect(checkApiConnection(validConfig)).resolves.toEqual({
    success: false,
    error: '远程服务返回的不是兼容的 Chat Completions 响应'
  })
})

test('connection checks accept a plausible Chat Completions response', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
    id: 'chatcmpl-test',
    choices: [{ index: 0, message: { role: 'assistant', content: 'OK' }, finish_reason: 'stop' }]
  }))))

  await expect(checkApiConnection(validConfig)).resolves.toEqual({
    success: true,
    message: 'API 连接成功'
  })
})
