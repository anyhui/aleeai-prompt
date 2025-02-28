import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Snackbar, Alert } from '@mui/material';
// import { borderRadius, blur, gradients, shadows } from '../styles/constants';
import ModelConfig, { defaultConfig, validateConfig, checkConnection as checkApiConnection, commonEndpoints, modelOptions } from '../components/ModelConfig';
import PromptInput from '../components/PromptInput';
import OptimizedPromptOutput from '../components/OptimizedPromptOutput';
import VersionControl from '../components/VersionControl';
import { getVersionHistory, saveVersion, compareVersions } from '../services/versionControlService';
import { useAppContext } from '../context/AppContext';



function PromptOptimizer() {
  const { actions } = useAppContext();
  const [optimizationStep, setOptimizationStep] = useState('idle');
  const [stepResults, setStepResults] = useState({
    analysis: '',
    suggestions: '',
    decomposition: ''
  });
  
  // 优化步骤配置
  const [optimizationSteps, setOptimizationSteps] = useState([]);
  const [optimizationStats, setOptimizationStats] = useState({});
  
  // 版本控制相关状态
  const [promptId, setPromptId] = useState('default-prompt');
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);

  const [config, setConfig] = useState({
    ...defaultConfig,
    temperature: 0
  });

  const [connectionStatus, setConnectionStatus] = useState({
    isChecking: false,
    isConnected: false,
    error: null
  });

  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState({
    promptTokens: 0,
    completionTokens: 0,
    elapsedTime: 0
  });

  const [customEndpoint, setCustomEndpoint] = useState('');
  const [isCustomEndpoint, setIsCustomEndpoint] = useState(false);



  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 工具字典 - 用于未来功能扩展
  const [toolsDict, setToolsDict] = useState({});
  
  // 加载版本历史
  useEffect(() => {
    if (promptId) {
      const history = getVersionHistory(promptId);
      setVersions(history);
    }
  }, [promptId]);

  // const checkConnection = () => {
  //   checkApiConnection(config, setConnectionStatus, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen);
  // };

  // 加载优化器模板配置
  const [optimizerTemplates, setOptimizerTemplates] = useState(null);
  
  useEffect(() => {
    // 加载优化器模板配置
    fetch('/optimizer_templates.json')
      .then(response => response.json())
      .then(data => {
        setOptimizerTemplates(data);
        // 初始化优化步骤和统计信息
        if (data.steps) {
          setOptimizationSteps(data.steps);
        }
        if (data.stats) {
          setOptimizationStats(data.stats);
        }
      })
      .catch(error => {
        console.error('加载优化器模板失败:', error);
        setError('加载优化器模板失败');
      });
  }, []);

  const analyzeAndExpandInput = async (inputPrompt) => {
    if (!optimizerTemplates) {
      throw new Error('优化器模板尚未加载完成');
    }
    
    const template = optimizerTemplates.templates.analysis;
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        stream: true,  // 启用流式响应
        messages: [
          {
            role: 'system',
            content: template.system
          },
          {
            role: 'user',
            content: template.user.replace('${inputPrompt}', inputPrompt)
          }
        ]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          
          try {
            if (data) {
              const json = JSON.parse(data);
              if (json.choices?.[0]?.delta?.content) {
                result += json.choices[0].delta.content;
                setStepResults(prev => ({
                  ...prev,
                  analysis: result
                }));

                // 移除流式响应中的统计信息更新
                if (json.usage) {
                  totalPromptTokens = json.usage.prompt_tokens || 0;
                  totalCompletionTokens = json.usage.completion_tokens || 0;
                }
              }
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error, 'Data:', data);
            if (error.message.includes('429')) {
              throw new Error('请求过于频繁，请稍后再试');
            }
            throw new Error(`Invalid API response format: ${data}`);
          }
        }
      }
    }

    // 最终更新统计信息
    setStats(prev => ({
      ...prev,
      model: config.model, // 添加模型信息用于费率计算
      promptTokens: totalPromptTokens,
      completionTokens: totalCompletionTokens,
      elapsedTime: Math.floor((Date.now() - startTime) / 1000)
    }));

    return result;
  };

  const decomposeAndAddReasoning = async (expandedPrompt) => {
    if (!optimizerTemplates) {
      throw new Error('优化器模板尚未加载完成');
    }
    
    const template = optimizerTemplates.templates.decomposition;
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        stream: true,
        messages: [
          {
            role: 'system',
            content: template.system
          },
          {
            role: 'user',
            content: template.user.replace('${expandedPrompt}', expandedPrompt)
          }
        ]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          
          try {
            if (data) {
              const json = JSON.parse(data);
              if (json.choices?.[0]?.delta?.content) {
                result += json.choices[0].delta.content;
                setStepResults(prev => ({
                  ...prev,
                  decomposition: result
                }));

                if (json.usage) {
                  totalPromptTokens = json.usage.prompt_tokens || 0;
                  totalCompletionTokens = json.usage.completion_tokens || 0;
                }
              }
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error, 'Data:', data);
            if (error.message.includes('429')) {
              throw new Error('请求过于频繁，请稍后再试');
            }
            throw new Error(`Invalid API response format: ${data}`);
          }
        }
      }
    }

    setStats(prev => ({
      ...prev,
      promptTokens: prev.promptTokens + totalPromptTokens,
      completionTokens: prev.completionTokens + totalCompletionTokens
    }));

    return result;
  };

  const suggestEnhancements = async (inputPrompt, tools_dict = {}) => {
    if (!optimizerTemplates) {
      throw new Error('优化器模板尚未加载完成');
    }
    
    const template = optimizerTemplates.templates.suggestions;
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        stream: true,
        messages: [
          {
            role: 'system',
            content: template.system
          },
          {
            role: 'user',
            content: template.user.replace('${inputPrompt}', inputPrompt)
          }
        ]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          
          try {
            if (data) {
              const json = JSON.parse(data);
              if (json.choices?.[0]?.delta?.content) {
                result += json.choices[0].delta.content;
                setStepResults(prev => ({
                  ...prev,
                  suggestions: result
                }));

                if (json.usage) {
                  totalPromptTokens = json.usage.prompt_tokens || 0;
                  totalCompletionTokens = json.usage.completion_tokens || 0;
                }
              }
            }
          } catch (error) {
            console.error('Failed to parse JSON:', error, 'Data:', data);
            if (error.message.includes('429')) {
              throw new Error('请求过于频繁，请稍后再试');
            }
            throw new Error(`Invalid API response format: ${data}`);
          }
        }
      }
    }

    setStats(prev => ({
      ...prev,
      promptTokens: prev.promptTokens + totalPromptTokens,
      completionTokens: prev.completionTokens + totalCompletionTokens
    }));

    return result;
  };

  // 更新工具字典的函数 - 用于未来功能扩展
  const updateToolsDict = (newTools) => {
    setToolsDict(prev => ({
      ...prev,
      ...newTools
    }));
  };
  
  // 处理版本选择
  const handleVersionSelect = (version) => {
    setCurrentVersion(version);
    setPrompt(version.content);
  };
  
  // 保存当前版本
  const handleSaveVersion = (description = '') => {
    if (!prompt) return;
    
    const newVersion = saveVersion(promptId, prompt, description);
    if (newVersion) {
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersion(newVersion);
      setSnackbarMessage('版本保存成功');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  const handleOptimize = async () => {
    if (!prompt) {
      setError('请输入提示词');
      return;
    }

    try {
      validateConfig(config);
      setLoading(true);
      setError(null);
      setOptimizationStep('analyzing');
      
      // 重置统计数据
      setStats({
        promptTokens: 0,
        completionTokens: 0,
        elapsedTime: 0
      });
      setStartTime(Date.now());

      // 分析和扩展输入
      const expandedPrompt = await analyzeAndExpandInput(prompt);
      setStepResults(prev => ({ ...prev, analysis: expandedPrompt }));
      setOptimizationStep('suggesting');

      // 建议改进
      const enhancements = await suggestEnhancements(prompt);
      setStepResults(prev => ({ ...prev, suggestions: enhancements }));
      setOptimizationStep('decomposing');

      // 分解和添加推理
      const decomposition = await decomposeAndAddReasoning(expandedPrompt);
      setStepResults(prev => ({ ...prev, decomposition }));

      // 组装最终的优化提示词
      const optimizedResult = [
        expandedPrompt,
        enhancements,
        decomposition
      ].filter(Boolean).join('\n\n');

      setOptimizationStep('completed');
      
      // 自动保存优化后的版本
      handleSaveVersion('优化后的提示词');

      // 更新最终的时间统计
      setStats(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
      }));

    } catch (err) {
      setError(err.message);
      setSnackbarMessage(`优化失败: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setOptimizationStep('error');
    } finally {
      setLoading(false);
    }
  };

  // 更新计时器
  useEffect(() => {
    let timer;
    if (startTime && optimizationStep !== 'completed' && optimizationStep !== 'error') {
      timer = setInterval(() => {
        setStats(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);
    } else if (startTime && (optimizationStep === 'completed' || optimizationStep === 'error')) {
      // 在优化完成或出错时，设置最终的执行时间
      setStats(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
      }));
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [startTime, optimizationStep]);

  const handleCopy = async () => {
    try {
      const textToCopy = stepResults.analysis + '\n\n' + '\n\n' + stepResults.decomposition;
      if (!textToCopy) {
        throw new Error('没有可复制的内容');
      }
      
      // 使用现代 Clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // 备选方案：使用 document.execCommand
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';  // 避免滚动到页面底部
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('无法复制文本');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
      setSnackbarMessage('已复制优化结果');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to copy:', error);
      setSnackbarMessage('复制失败，请手动复制');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
      
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem' },
          fontWeight: 700,
          mb: { xs: 1, sm: 2 },
          background: theme => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI提示词优化
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 2, sm: 3 },
          color: 'text.secondary',
          maxWidth: '800px'
        }}>
          使用AI技术优化您的提示词，提高效率和质量
        </Typography>
          
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ModelConfig 
            config={config}
            setConfig={setConfig}
            connectionStatus={connectionStatus}
            setConnectionStatus={setConnectionStatus}
            customEndpoint={customEndpoint}
            setCustomEndpoint={setCustomEndpoint}
            isCustomEndpoint={isCustomEndpoint}
            setIsCustomEndpoint={setIsCustomEndpoint}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
            setSnackbarOpen={setSnackbarOpen}
          />
        </Grid>
        
        <Grid item xs={12}>
          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            handleOptimize={handleOptimize}
          />
        </Grid>
        
        <Grid item xs={12}>
          <OptimizedPromptOutput 
            optimizationStep={optimizationStep}
            stepResults={stepResults}
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
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PromptOptimizer;