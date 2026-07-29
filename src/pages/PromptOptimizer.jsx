import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Typography
} from '@mui/material'
import ModelConfig, { defaultConfig, validateConfig } from '../components/ModelConfig'
import PromptInput from '../components/PromptInput'
import OptimizedPromptOutput from '../components/OptimizedPromptOutput'
import VersionControl from '../components/VersionControl'
import { compareVersions, getVersionHistory, saveVersion } from '../services/versionControlService'
import { handleStreamResponse, sendApiRequest } from '../services/apiService'

const methodDescriptions = {
  analysis: '综合分析优化：依次分析、建议并分解提示词',
  cfpo: '内容-格式集成优化：分析提示词的内容和格式',
  ape: '自动化提示词工程：通过系统化方法优化提示词',
  broke: 'BROKE 框架：Background、Role、Objective、Key Context、Execution Plan',
  chat: 'CHAT 框架：Context、Hint、Action、Task',
  crispe: 'CRISPE 框架：Capacity、Role、Insight、Specification、Purpose、Example'
}

function PromptOptimizer() {
  const promptId = 'default-prompt'
  const [config, setConfig] = useState({ ...defaultConfig, temperature: 0 })
  const [connectionStatus, setConnectionStatus] = useState({ isChecking: false, isConnected: false, error: null })
  const [prompt, setPrompt] = useState('')
  const [optimizationMethod, setOptimizationMethod] = useState('analysis')
  const [optimizerTemplates, setOptimizerTemplates] = useState(null)
  const [optimizationStep, setOptimizationStep] = useState('idle')
  const [stepResults, setStepResults] = useState({ analysis: '', suggestions: '', decomposition: '' })
  const [optimizedResult, setOptimizedResult] = useState('')
  const [stats, setStats] = useState({ promptTokens: 0, completionTokens: 0, elapsedTime: 0 })
  const [versions, setVersions] = useState(() => getVersionHistory(promptId))
  const [currentVersion, setCurrentVersion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    fetch('/optimizer_templates.json')
      .then(response => {
        if (!response.ok) throw new Error('template request failed')
        return response.json()
      })
      .then(setOptimizerTemplates)
      .catch(() => setError('加载优化器模板失败，本地提示词库和生成器仍可正常使用'))
  }, [])

  const showMessage = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

  const runTemplate = async (template, input, placeholder, resultKey) => {
    let accountedPromptTokens = 0
    let accountedCompletionTokens = 0
    const response = await sendApiRequest(config, [
      { role: 'system', content: template.system },
      { role: 'user', content: template.user.replace(placeholder, input) }
    ], { stream: true, temperature: config.temperature })

    return handleStreamResponse(response, (_chunk, result) => {
      setStepResults(previous => ({ ...previous, [resultKey]: result }))
    }, undefined, undefined, event => {
      if (event.usage) {
        const promptTokens = event.usage.prompt_tokens || 0
        const completionTokens = event.usage.completion_tokens || 0
        setStats(previous => ({
          ...previous,
          promptTokens: previous.promptTokens + promptTokens - accountedPromptTokens,
          completionTokens: previous.completionTokens + completionTokens - accountedCompletionTokens
        }))
        accountedPromptTokens = promptTokens
        accountedCompletionTokens = completionTokens
      }
    })
  }

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词')
      return
    }

    const startedAt = Date.now()
    try {
      validateConfig(config)
      if (!optimizerTemplates) throw new Error('优化器模板尚未加载完成')
      setLoading(true)
      setError(null)
      setOptimizedResult('')
      setStepResults({ analysis: '', suggestions: '', decomposition: '' })
      setStats({ promptTokens: 0, completionTokens: 0, elapsedTime: 0 })
      setOptimizationStep('analyzing')

      let result
      if (optimizationMethod === 'analysis') {
        const analysis = await runTemplate(
          optimizerTemplates.templates.analysis,
          prompt,
          '${inputPrompt}',
          'analysis'
        )
        setOptimizationStep('suggesting')
        const suggestions = await runTemplate(
          optimizerTemplates.templates.suggestions,
          prompt,
          '${inputPrompt}',
          'suggestions'
        )
        setOptimizationStep('decomposing')
        const decomposition = await runTemplate(
          optimizerTemplates.templates.decomposition,
          analysis,
          '${expandedPrompt}',
          'decomposition'
        )
        result = [analysis, suggestions, decomposition].filter(Boolean).join('\n\n')
      } else {
        const template = optimizerTemplates.templates[optimizationMethod]
        if (!template) throw new Error('未找到所选优化方法')
        result = await runTemplate(template, prompt, '${inputPrompt}', 'analysis')
      }

      setOptimizedResult(result)
      setOptimizationStep('completed')
      const version = saveVersion(promptId, result, '远程优化结果')
      if (version) {
        setVersions(getVersionHistory(promptId))
        setCurrentVersion(version)
      }
    } catch (caught) {
      setError(caught.message)
      setOptimizationStep('error')
      showMessage(`优化失败：${caught.message}`, 'error')
    } finally {
      setStats(previous => ({ ...previous, elapsedTime: (Date.now() - startedAt) / 1000 }))
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      if (!optimizedResult.trim()) throw new Error('没有可复制的内容')
      await navigator.clipboard.writeText(optimizedResult)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      showMessage('已复制优化结果')
    } catch {
      showMessage('复制失败，请手动选择文本复制', 'error')
    }
  }
  handleCopy.isCopied = isCopied

  const handleVersionSelect = version => {
    setCurrentVersion(version)
    setPrompt(version.content)
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        AI 提示词优化
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        可选的远程优化功能，仅兼容 OpenAI Chat Completions 格式的端点
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ModelConfig
            config={config}
            setConfig={setConfig}
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
            setSnackbarMessage={message => setSnackbar(previous => ({ ...previous, message }))}
            setSnackbarSeverity={severity => setSnackbar(previous => ({ ...previous, severity }))}
            setSnackbarOpen={open => setSnackbar(previous => ({ ...previous, open }))}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>选择优化方法</Typography>
            <FormControl component="fieldset">
              <RadioGroup row value={optimizationMethod} onChange={event => setOptimizationMethod(event.target.value)}>
                {Object.keys(methodDescriptions).map(method => (
                  <FormControlLabel key={method} value={method} control={<Radio />} label={method === 'analysis' ? '综合分析' : method.toUpperCase()} />
                ))}
              </RadioGroup>
            </FormControl>
            <Typography variant="body2" color="text.secondary">{methodDescriptions[optimizationMethod]}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PromptInput prompt={prompt} setPrompt={setPrompt} loading={loading} handleOptimize={handleOptimize} />
        </Grid>
        <Grid item xs={12}>
          <OptimizedPromptOutput
            optimizationStep={optimizationStep}
            stepResults={stepResults}
            optimizedResult={optimizedResult}
            setOptimizedResult={setOptimizedResult}
            stats={stats}
            handleCopy={handleCopy}
            error={error}
          />
        </Grid>
        <Grid item xs={12}>
          <VersionControl
            versions={versions}
            currentVersion={currentVersion}
            onVersionSelect={handleVersionSelect}
            onCompareVersions={compareVersions}
          />
        </Grid>
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(previous => ({ ...previous, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(previous => ({ ...previous, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PromptOptimizer
