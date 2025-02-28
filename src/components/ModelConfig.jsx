import React from 'react';
import { Box, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { apiConfig } from '../config/appConfig';
import { validateConfig, checkApiConnection as checkApiConnectionService } from '../services/apiService';
import { SelectInput, TextInput, SliderInput, PresetInput } from './common/FormComponents';
import { ActionButton, FormField } from './common/CommonComponents';
import { GlassCard, GradientText } from '../styles/shared.styles';
import { transitions, shadows, borderRadius } from '../styles/constants';
import { alphaColors } from '../styles/colors';

// 导出配置常量，方便其他组件使用
export const { defaultConfig, defaultEndpoints: commonEndpoints, defaultModels: modelOptions } = apiConfig;

// 检查API连接
export const checkConnection = async (config, setConnectionStatus, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen) => {
  setConnectionStatus(prev => ({ ...prev, isChecking: true, error: null }));
  try {
    const result = await checkApiConnectionService(config);
    
    if (result.success) {
      setConnectionStatus(prev => ({ ...prev, isConnected: true, error: null }));
      setSnackbarMessage('API连接成功！');
      setSnackbarSeverity('success');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    setConnectionStatus(prev => ({
      ...prev,
      isConnected: false,
      error: error.message
    }));
    setSnackbarMessage(`API连接失败: ${error.message}`);
    setSnackbarSeverity('error');
  } finally {
    setSnackbarOpen(true);
    setConnectionStatus(prev => ({ ...prev, isChecking: false }));
  }
};

// 导出验证函数，方便其他组件使用
export { validateConfig };

const ModelConfig = ({ 
  config, 
  setConfig, 
  connectionStatus, 
  setConnectionStatus, 
  setSnackbarMessage,
  setSnackbarSeverity,
  setSnackbarOpen
}) => {
  const handleEndpointChange = (event) => {
    const value = event.target.value;
    setConfig(prev => ({ ...prev, apiEndpoint: value }));
    setConnectionStatus(prev => ({ ...prev, isConnected: false }));
  };

  const handlePresetClick = (fieldId, value) => {
    if (fieldId === 'apiEndpoint') {
      setConfig(prev => ({ ...prev, apiEndpoint: value }));
    } else if (fieldId === 'model') {
      setConfig(prev => ({ ...prev, model: value }));
    }
    setConnectionStatus(prev => ({ ...prev, isConnected: false }));
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
    <GlassCard>
      <GradientText variant="h6" gutterBottom sx={{ mb: 3 }}>
        配置信息
      </GradientText>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: 2, 
        mb: 3,
        '& > *': {
          flex: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }
      }}>
        <PresetInput
          id="apiEndpoint"
          label="API端点"
          value={config.apiEndpoint}
          onChange={handleEndpointChange}
          presets={commonEndpoints.map(option => option.value)}
          onPresetClick={handlePresetClick}
          placeholder="输入API端点或从下方选择"
          helperText="点击输入框可快速选择"
        />
        <PresetInput
          id="model"
          label="模型"
          value={config.model}
          onChange={handleConfigChange('model')}
          presets={modelOptions.map(option => option.value)}
          onPresetClick={handlePresetClick}
          placeholder="输入模型名称或从下方选择"
          helperText="点击输入框可快速选择"
        />
        <TextInput
          label="API密钥"
          type="password"
          value={config.apiKey}
          onChange={handleConfigChange('apiKey')}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: 'error.main',
          textAlign: 'center',
          mb: 3,
          p: 2,
          borderRadius: borderRadius.sm,
          bgcolor: theme => theme.palette.mode === 'dark'? alphaColors.dark.white.low : alphaColors.light.black.low,
          border: '1px solid',
          borderColor: 'error.main'
        }}
      >
        如果默认KEY失效，可以注册自己的KEY使用。
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 700,
          color: 'error.main',
          textAlign: 'center',
          mb: 3,
          p: 2,
          borderRadius: borderRadius.sm,
          bgcolor: theme => theme.palette.mode === 'dark' ? alphaColors.dark.white.low : alphaColors.light.black.low,
          border: '1px solid',
          borderColor: 'error.main'
        }}
      >
        免费注册 &gt;&gt;&gt;
        <Link 
          href="https://cloud.siliconflow.cn/i/VHoWjuwZ" 
          target="_blank" 
          rel="noopener"
          sx={{
            mx: 1,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          硅基流动
        </Link>
        &lt;&lt;&lt;获取KEY
      </Typography>
      <SliderInput
        label="Temperature (创造性程度)"
        value={config.temperature}
        onChange={(e, newValue) => setConfig(prev => ({ ...prev, temperature: newValue }))}
        min={0}
        max={2}
        step={0.1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <ActionButton
          variant="contained"
          onClick={handleCheckConnection}
          disabled={connectionStatus.isChecking}
          sx={{
            minWidth: 120,
            transition: transitions.normal,
            '&:not(:disabled):hover': {
              transform: 'translateY(-2px)',
              boxShadow: shadows.md
            }
          }}
        >
          {connectionStatus.isChecking ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              检查中...
            </>
          ) : (
            '检查连接'
          )}
        </ActionButton>
        {connectionStatus.isConnected && (
          <Alert 
            severity="success" 
            sx={{ 
              flex: 1,
              animation: 'fadeIn 0.5s ease'
            }}
          >
            API连接正常
          </Alert>
        )}
        {connectionStatus.error && (
          <Alert 
            severity="error" 
            sx={{ 
              flex: 1,
              animation: 'fadeIn 0.5s ease'
            }}
          >
            {connectionStatus.error}
          </Alert>
        )}
      </Box>
    </GlassCard>
  );
};

export default ModelConfig;
