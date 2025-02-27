import React from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress, Slider } from '@mui/material';

// 默认配置
const defaultConfig = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4',
  apiKey: import.meta.env.VITE_API_KEY || 'xxx'
};

// 验证配置
const validateConfig = (config) => {
  if (!config.apiEndpoint) {
    throw new Error('API端点未配置');
  }
  if (!config.model) {
    throw new Error('模型未选择');
  }
  if (!config.apiKey) {
    throw new Error('API密钥未配置');
  }
};

// 常用端点
const commonEndpoints = [
  { label: 'OpenAI', value: 'https://api.openai.com/v1/chat/completions' },
  { label: 'Anthropic', value: 'https://api.anthropic.com/v1/messages' },
  { label: 'Azure OpenAI', value: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment-name/chat/completions?api-version=2023-05-15' },
  { label: 'Deepseek', value: 'https://api.deepseek.com/v1/chat/completions' },
  { label: 'SiliconFlow', value: 'https://api.siliconflow.cn/v1/chat/completions' },
  { label: '自定义', value: 'custom' }
];

// 模型选项
const modelOptions = [
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-1106-preview' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'Claude 2.1', value: 'claude-2.1' },
  { label: 'Claude Instant', value: 'claude-instant-1.2' },
  { label: 'Deepseek-Chat', value: 'deepseek-chat' },
  { label: 'Deepseek-Coder', value: 'deepseek-reasoner' },
  { label: 'SiliconFlow-deepseek-V2.5', value: 'deepseek-ai/DeepSeek-V2.5' },
  { label: 'SiliconFlow-deepseek-V3', value: 'deepseek-ai/DeepSeek-V3' },
  { label: 'SiliconFlow-deepseek-R1', value: 'deepseek-ai/DeepSeek-R1' }
];

// 检查API连接
const checkConnection = async (config, setConnectionStatus, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen) => {
  setConnectionStatus(prev => ({ ...prev, isChecking: true, error: null }));
  try {
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: 'test' }]
      })
    });

    if (!response.ok) {
      throw new Error(`API连接失败: ${response.status} ${response.statusText}`);
    }

    setConnectionStatus(prev => ({ ...prev, isConnected: true, error: null }));
    setSnackbarMessage('API连接成功！');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  } catch (error) {
    setConnectionStatus(prev => ({
      ...prev,
      isConnected: false,
      error: error.message
    }));
    setSnackbarMessage(`API连接失败: ${error.message}`);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  } finally {
    setConnectionStatus(prev => ({ ...prev, isChecking: false }));
  }
};

const ModelConfig = ({ 
  config, 
  setConfig, 
  connectionStatus, 
  setConnectionStatus, 
  customEndpoint, 
  setCustomEndpoint, 
  isCustomEndpoint, 
  setIsCustomEndpoint,
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen
}) => {
  const handleEndpointChange = (event) => {
    const value = event.target.value;
    if (value === 'custom') {
      setIsCustomEndpoint(true);
      setConfig(prev => ({ ...prev, apiEndpoint: customEndpoint }));
    } else {
      setIsCustomEndpoint(false);
      setConfig(prev => ({ ...prev, apiEndpoint: value }));
    }
  };

  const handleCustomEndpointChange = (event) => {
    const value = event.target.value;
    setCustomEndpoint(value);
    if (isCustomEndpoint) {
      setConfig(prev => ({ ...prev, apiEndpoint: value }));
    }
  };

  const handleConfigChange = (field) => (event) => {
    setConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setConnectionStatus(prev => ({ ...prev, isConnected: false }));
  };

  const handleCheckConnection = () => {
    checkConnection(config, setConnectionStatus, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        配置信息
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>API端点</InputLabel>
          <Select
            value={isCustomEndpoint ? 'custom' : config.apiEndpoint}
            label="API端点"
            onChange={handleEndpointChange}
          >
            {commonEndpoints.map((endpoint) => (
              <MenuItem key={endpoint.value} value={endpoint.value}>
                {endpoint.label}
              </MenuItem>
            ))}
          </Select>
          {isCustomEndpoint && (
            <TextField
              fullWidth
              label="自定义API端点"
              value={customEndpoint}
              onChange={handleCustomEndpointChange}
              sx={{ mt: 2 }}
            />
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>模型</InputLabel>
          <Select
            value={config.model}
            label="模型"
            onChange={handleConfigChange('model')}
          >
            {modelOptions.map((model) => (
              <MenuItem key={model.value} value={model.value}>
                {model.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="API密钥"
          type="password"
          value={config.apiKey}
          onChange={handleConfigChange('apiKey')}
        />
        <Box>
          <Typography gutterBottom>Temperature (创造性程度)</Typography>
          <Slider
            value={config.temperature}
            onChange={(e, newValue) => setConfig(prev => ({ ...prev, temperature: newValue }))}
            min={0}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleCheckConnection}
            disabled={connectionStatus.isChecking}
            sx={{ mr: 2 }}
          >
            {connectionStatus.isChecking ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                检查中...
              </>
            ) : (
              '检查连接'
            )}
          </Button>
          {connectionStatus.isConnected && (
            <Alert severity="success" sx={{ flex: 1 }}>
              API连接正常
            </Alert>
          )}
          {connectionStatus.error && (
            <Alert severity="error" sx={{ flex: 1 }}>
              {connectionStatus.error}
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export { ModelConfig as default, defaultConfig, validateConfig, commonEndpoints, modelOptions, checkConnection };