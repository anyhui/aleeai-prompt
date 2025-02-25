import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { transitions, borderRadius, blur, gradients, shadows } from '../styles/constants';
import Slider from '@mui/material/Slider';
import StatsCards from '../components/StatsCards';

const defaultConfig = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4',
  apiKey: import.meta.env.VITE_API_KEY || ''
};

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

function PromptOptimizer() {
  const [optimizationStep, setOptimizationStep] = useState('idle');  // 初始化 optimizationStep
  const [stepResults, setStepResults] = useState({
    analysis: '',
    suggestions: '',
    decomposition: ''
  });

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

  const commonEndpoints = [
    { label: 'OpenAI', value: 'https://api.openai.com/v1/chat/completions' },
    { label: 'Anthropic', value: 'https://api.anthropic.com/v1/messages' },
    { label: 'Azure OpenAI', value: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment-name/chat/completions?api-version=2023-05-15' },
    { label: 'Deepseek', value: 'https://api.deepseek.com/v1/chat/completions' },
    { label: 'SiliconFlow', value: 'https://api.siliconflow.cn/v1/chat/completions' },
    { label: '自定义', value: 'custom' }
  ];

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

  const ConnectionStatus = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={checkConnection}
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
    );
  };

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

  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const checkConnection = async () => {
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

  const handleConfigChange = (field) => (event) => {
    setConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setConnectionStatus(prev => ({ ...prev, isConnected: false }));
  };

  const analyzeAndExpandInput = async (inputPrompt) => {
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
            content: '你是一个高度智能的AI助手。你的任务是分析和理解提供的提示，然后严格按照给定的指示提供清晰简洁的回应。不要包含任何超出所需输出的额外解释或上下文。'
          },
          {
            role: 'user',
            content: `分析提供的提示词并为以下关键方面生成简洁的答案：

        - **提示的主要目标：** 识别提供的提示中的核心主题或请求。
        - **角色：** 推荐AI模型采用的最相关角色（例如：专家、教师、对话式等）。
        - **最佳输出长度：** 根据任务建议最佳输出长度（短、简短、中等、长），如果适合的话，给出大致的字数。
        - **最方便的输出格式：** 推荐结果的最佳格式（例如：列表、段落、代码片段、表格、JSON等）。
        - **具体要求：** 突出显示提示中明确或暗含的任何特殊条件、规则或期望。
        - **建议改进：** 提供如何修改或增强提示以获得更精确或高效输出的建议。
        - **一次性提示：** 创建一个相关示例来指导输出生成。
        
        然后使用它们重新构建和扩展提供的提示词。
        以文本格式返回扩展后的提示。避免解释生成过程。

        示例1：
        提示词："向一个10岁的孩子解释量子纠缠。"
        
        *思考过程*：
        - **提示的主要目标：** 为儿童简化复杂的量子物理概念。
        - **角色：** 耐心、友好的老师
        - **最佳输出长度：** 简短（100-150字）
        - **最方便的输出格式：** 带有类比的叙述
        - **具体要求：** 适合年龄的解释（10岁）
        - **建议改进：**
            - 使用具体的类比
            - 包含互动元素
            - 添加后续问题
            - 建议使用视觉辅助
        - **一次性提示：**
        输出示例：
            "想象你有两双特别的袜子。当你把一只袜子放在你的房间，另一只放在厨房时，
            神奇的事情发生了！无论对一只袜子做什么，另一只袜子都会立即受到影响。
            如果你把一只袜子翻过来，另一只袜子也会自动翻过来，不管它们相距多远！"
        
        *输出*：
        作为一个友好的科学老师，请使用以下指南向10岁的学生解释量子纠缠：

        从使用日常物品的类比开始
        使用简单、清晰的语言，避免技术术语
        包含2-3个演示概念的互动示例
        添加能激发好奇心的有趣事实
        以简单的问题结束以检查理解程度
        保持解释简短（100-150字）

        按以下结构组织你的解释：
        
        开场类比
        主要解释和示例
        互动"如果这样呢？场景
        关于量子纠缠的有趣事实
        检查理解的问题

        请记住在整个讲解过程中保持热情和鼓励的语气。
        
        输出示例：
        想象你有两双特殊的袜子。当你把一只袜子放在房间里，另一只袜子放在厨房里时，
        神奇的事情发生了！一只袜子发生的任何事情都会立即影响另一只袜子。
        如果你把一只袜子翻过来，另一只袜子也会自动翻过来，不管它们相隔多远！
        示例2：
        提示词："编写一个函数来计算数字的阶乘。"
        
        ##思考过程##
        *子任务1*：
        - **描述**：定义什么是阶乘。
        - **推理**：从定义开始确保用户理解所需的数学运算。
        - **成功标准**：提供一个简洁的定义和示例（例如，5! = 5 x 4 x 3 x 2 x 1 = 120）。
        *子任务2*：
        - **描述**：编写阶乘函数的基本情况。
        - **推理**：在递归编程中，定义基本情况对于避免无限递归至关重要。
        - **成功标准**：包含一个明确的基本情况，如\`n = 1\`，以确保递归终止。
        *子任务3*：
        - **描述**：实现阶乘函数的递归步骤。
        - **推理**：递归情况应该反映阶乘的数学定义。
        - **成功标准**：函数应该对正整数返回\`n * factorial(n-1)\`。
        
        示例3：
        提示词："解释植物进行光合作用的过程。"

        ##思考过程##
        *子任务1*：
        - **描述**：定义光合作用及其在植物中的整体目的。
        - **推理**：从定义开始确保用户理解所需的基本概念。
        - **成功标准**：提供一个简洁的定义和示例（例如，植物如何将光能转化为化学能）。
        *子任务2*：
        - **描述**：编写光合作用的基本过程。
        - **推理**：在生物学中，理解基本过程对于避免混淆至关重要。
        - **成功标准**：包含一个明确的过程说明，确保理解的完整性。
        *子任务3*：
        - **描述**：实现光合作用的具体步骤。
        - **推理**：具体步骤应该反映光合作用的科学定义。
        - **成功标准**：过程应该清晰地展示从光能到化学能的转化。

        示例4：
        提示词："设计一个用户友好的移动应用登录界面。"

        ##思考过程##
        *子任务1*：
        - **描述**：确定关键用户界面元素（例如，用户名字段、密码字段、登录按钮）。
        - **推理**：确定这些核心元素确保界面包含必要的功能组件。
        - **成功标准**：界面应包含用户名输入、密码输入和清晰标记的登录按钮。
        *子任务2*：
        - **描述**：专注于用户体验，确保简单性和直观导航。
        - **推理**：直观的设计确保用户在登录过程中有流畅的体验，减少摩擦。
        - **成功标准**：布局应该简约，标签清晰，使登录过程简单快捷。
        *子任务3*：
        - **描述**：实现安全功能，如密码掩码和错误登录处理。
        - **推理**：安全措施确保用户数据得到保护，并在出现错误时帮助指导用户。
        - **成功标准**：密码应默认掩码显示，错误信息应该具有信息性但安全（例如，"用户名或密码不正确"）。

        示例5：
        提示词："列出从头开始烤巧克力蛋糕的步骤。"

        ##思考过程##
        *子任务1*：
        - **描述**：列出制作蛋糕所需的所有配料。
        - **推理**：从配料开始确保在开始制作过程前准备好所有必要的材料。
        - **成功标准**：提供完整的配料清单，包括计量（例如，2杯面粉，1杯糖等）。
        *子任务2*：
        - **描述**：描述准备步骤，如混合干湿原料。
        - **推理**：详细说明准备步骤确保用户按正确顺序混合配料。
        - **成功标准**：实例化配料混合。
        *子任务3*：
        - **描述**：说明烘焙过程和完成步骤。
        - **推理**：准确的烘焙说明对于成功制作蛋糕至关重要。
        - **成功标准**：包括温度设置、烘焙时间和冷却说明。
        *子任务 3*:
        - **描述**：讨论如何交叉验证结果的平均以提供最终评估指标。
        - **推理**：平均结果有助于减轻误差的发生，是由于不同训练/验证分割引起的。
        - **成功标准**：输出应该清晰地解释如何从多迭代交叉验证中产生最终模型的评估。

        示例 6:
        提示词: "为一个环保产品创建营销计划。"
        
        ##思考过程##
        *子任务1*:
        - **描述**：确定环保产品的目标受众。
        - **推理**：定义目标受众对于有效定制营销信息和策略至关重要。
        - **成功标准**：提供详细的描述，包括人口统计和心理特征（例如，年龄、价值观、环保意识）。
        *子任务2*：
        - **描述**：概述关键信息和品牌定位。
        - **推理**：清晰的信息传达确保产品的优势和独特卖点能有效地传达给目标受众。
        - **成功标准**：制定一个突出环保性、可持续性和产品优势的有说服力的信息。
        *子任务3*:
        - **描述**：确定要使用的营销渠道（例如，社交媒体、电子邮件营销、意见领袖合作）。
        - **推理**：选择合适的渠道确保营销计划能以有影响力的方式触达正确的受众。
        - **成功标准**：根据目标受众的偏好和行为选择包含数字和传统媒体的渠道组合。
        

        现在，分析以下提示，然后仅返回生成的输出：
提示词：${inputPrompt}`
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
            content: '你是一个高度能干的AI助手，负责改进复杂任务的执行。'
          },
          {
            role: 'user',
            content: `分析提供的提示词，并生成以下输出：

- **子任务分解：** 将提示中描述的任务分解为AI模型需要处理的可管理且具体的子任务。
- **思维链推理：** 对于涉及批判性思维或复杂步骤的子任务，使用逐步方法添加推理以改进决策和输出质量。
- **成功标准：** 为每个子任务定义构成成功完成的要素，确保对预期结果有明确的指导。

提示词：${expandedPrompt}`
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
            content: '你是一个专门负责参考建议和工具集成的高度智能助手。'
          },
          {
            role: 'user',
            content: `分析提供的提示词和可用的字典来推荐改进：${inputPrompt}`
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

  // 添加工具字典
  const [toolsDict, setToolsDict] = useState({});

  // 添加更新工具字典的函数
  const updateToolsDict = (newTools) => {
    setToolsDict(prev => ({
      ...prev,
      ...newTools
    }));
  };

  // 添加函数调用方法
  const callFunction = async (functionName, ...args) => {
    if (typeof window[functionName] === 'function') {
      return await window[functionName](...args);
    }
    throw new Error(`Function ${functionName} not found`);
  };

  const assemblePrompt = (components) => {
    const { analysis, suggestions, decomposition } = components;
    return `${analysis}\n\n${suggestions}\n\n${decomposition}`;
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

      setOptimizedPrompt(optimizedResult);
      setOptimizationStep('completed');

      // 更新最终的时间统计
      setStats(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
      }));

    } catch (err) {
      setError(err.message);
      setOptimizationStep('error');
    } finally {
      setLoading(false);
    }
  };

  // 更新计时器
  React.useEffect(() => {
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
          使用AI技术优化提示词，提升其清晰度、具体性和有效性
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: borderRadius.lg,
            backdropFilter: blur.lg,
            background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
            boxShadow: theme => theme.palette.mode === 'dark'
              ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
              : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                配置信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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
                </Grid>
                <Grid item xs={12} md={4}>
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="API密钥"
                    type="password"
                    value={config.apiKey}
                    onChange={handleConfigChange('apiKey')}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <ConnectionStatus />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{
            borderRadius: borderRadius.lg,
            backdropFilter: blur.lg,
            background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
            boxShadow: theme => theme.palette.mode === 'dark'
              ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
              : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                原始提示词
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="在此输入需要优化的提示词"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleOptimize}
                disabled={loading}
                sx={{ float: 'right' }}
              >
                {loading ? <CircularProgress size={24} /> : '优化提示词'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{
            borderRadius: borderRadius.lg,
            backdropFilter: blur.lg,
            background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
            boxShadow: theme => theme.palette.mode === 'dark'
              ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
              : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                优化后的提示词
              </Typography>
              <Box sx={{ width: '100%', mb: 2 }}>
              <StatsCards stats={stats} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'background.paper',
                    borderRadius: '2px',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      backgroundColor: 'primary.main',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease-in-out',
                      width: optimizationStep === 'idle' ? '0%' :
                             optimizationStep === 'analyzing' ? '33%' :
                             optimizationStep === 'suggesting' ? '66%' :
                             optimizationStep === 'decomposing' ? '90%' :
                             optimizationStep === 'done' ? '100%' : '0%'
                    }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2, minWidth: '100px' }}>
                    {optimizationStep === 'idle' ? '等待开始' :
                     optimizationStep === 'analyzing' ? '分析中...' :
                     optimizationStep === 'suggesting' ? '优化中...' :
                     optimizationStep === 'decomposing' ? '分解中...' :
                     optimizationStep === 'done' ? '已完成' : ''}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2, maxHeight: 'none', overflowY: 'visible' }}>
                {stepResults.analysis && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>分析结果：</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{stepResults.analysis}</Typography>
                  </Box>
                )}
                {stepResults.suggestions && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>优化建议：</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{stepResults.suggestions}</Typography>
                  </Box>
                )}
                {stepResults.decomposition && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>任务分解：</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{stepResults.decomposition}</Typography>
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => handleCopy()}
                disabled={!optimizedPrompt}
                startIcon={<ContentCopyIcon />}
                sx={{ float: 'right' }}
              >
                复制优化结果
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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