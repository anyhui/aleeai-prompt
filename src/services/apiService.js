/**
 * API服务模块
 * 提供统一的API调用接口，实现API调用功能组件化
 */
import { apiConfig } from '../config/appConfig';

/**
 * 发送API请求
 * @param {Object} config - API配置
 * @param {Array} messages - 消息数组
 * @param {Object} options - 请求选项
 * @returns {Promise} - 请求结果
 */
export const sendApiRequest = async (config, messages, options = {}) => {
  const { stream = false, temperature = 0.7, maxTokens = null } = options;
  
  try {
    // 验证配置
    validateConfig(config);
    
    // 构建请求体
    const requestBody = {
      model: config.model,
      messages,
      stream,
      temperature
    };
    
    // 添加可选参数
    if (maxTokens) {
      requestBody.max_tokens = maxTokens;
    }
    
    // 发送请求
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API请求失败: ${response.status} ${response.statusText}`);
    }
    
    // 处理流式响应
    if (stream) {
      return response;
    }
    
    // 处理普通响应
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

/**
 * 处理流式响应
 * @param {Response} response - 流式响应对象
 * @param {Function} onChunk - 处理每个数据块的回调函数
 * @param {Function} onDone - 处理完成时的回调函数
 * @param {Function} onError - 处理错误的回调函数
 */
export const handleStreamResponse = async (response, onChunk, onDone, onError) => {
  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    
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
                const content = json.choices[0].delta.content;
                result += content;
                onChunk && onChunk(content, result, json);
              }
            }
          } catch (error) {
            console.error('解析JSON失败:', error, '数据:', data);
            onError && onError(error);
          }
        }
      }
    }
    
    onDone && onDone(result);
    return result;
  } catch (error) {
    console.error('处理流式响应错误:', error);
    onError && onError(error);
    throw error;
  }
};

/**
 * 验证API配置
 * @param {Object} config - API配置
 */
export const validateConfig = (config) => {
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

/**
 * 检查API连接
 * @param {Object} config - API配置
 * @returns {Promise} - 连接检查结果
 */
export const checkApiConnection = async (config) => {
  try {
    validateConfig(config);
    
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
    
    return { success: true, message: 'API连接成功' };
  } catch (error) {
    console.error('API连接检查错误:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 计算API使用费用
 * @param {Object} stats - 使用统计
 * @returns {Object} - 费用信息
 */
export const calculateApiCost = (stats) => {
  const { model, promptTokens, completionTokens } = stats;
  let cost = 0;
  
  // 根据不同模型计算费用
  // 价格可能会变动，这里仅作示例
  if (model.includes('gpt-4')) {
    cost = (promptTokens / 1000) * 0.03 + (completionTokens / 1000) * 0.06;
  } else if (model.includes('gpt-3.5')) {
    cost = (promptTokens / 1000) * 0.0015 + (completionTokens / 1000) * 0.002;
  } else if (model.includes('claude')) {
    cost = (promptTokens / 1000) * 0.008 + (completionTokens / 1000) * 0.024;
  }
  
  return {
    cost: cost.toFixed(5),
    currency: 'USD',
    details: {
      promptCost: ((promptTokens / 1000) * 0.03).toFixed(5),
      completionCost: ((completionTokens / 1000) * 0.06).toFixed(5)
    }
  };
};

export default {
  sendApiRequest,
  handleStreamResponse,
  validateConfig,
  checkApiConnection,
  calculateApiCost
};