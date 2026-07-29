/**
 * 应用全局配置文件
 * 集中管理应用的各种配置项，实现配置软编码
 */

// API配置
export const apiConfig = {
  // 默认API端点
  defaultEndpoints: [
    { label: 'OpenAI 兼容端点示例', value: 'https://api.openai.com/v1/chat/completions' },
    { label: 'DeepSeek 兼容端点示例', value: 'https://api.deepseek.com/v1/chat/completions' },
    { label: 'SiliconFlow 兼容端点示例', value: 'https://api.siliconflow.cn/v1/chat/completions' }
  ],
  
  // 默认模型选项
  defaultModels: [
    { label: '示例：gpt-4.1-mini', value: 'gpt-4.1-mini' },
    { label: '示例：deepseek-chat', value: 'deepseek-chat' },
    { label: '示例：deepseek-reasoner', value: 'deepseek-reasoner' }
  ],
  
  // 默认API配置
  defaultConfig: {
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4.1-mini',
    apiKey: ''
  }
};

// 存储配置
export const storageConfig = {
  // 本地存储键名
  keys: {
    versionHistory: 'prompt_versions',
    userPreferences: 'user_preferences',
    recentPrompts: 'recent_prompts',
    savedTemplates: 'saved_templates'
  },
  
  // 存储限制
  limits: {
    maxVersionsPerPrompt: 50,
    maxRecentPrompts: 20,
    maxSavedTemplates: 100
  }
};

// UI配置
export const uiConfig = {
  // 主题配置
  themes: {
    available: ['default', 'light'],
    defaultTheme: 'default'
  },
  
  // 动画配置
  animations: {
    fast: 'all 0.2s ease-in-out',
    normal: 'all 0.3s ease-in-out',
    slow: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  
  // 布局配置
  layout: {
    maxContentWidth: '1200px',
    sidebarWidth: '280px',
    headerHeight: '64px',
    footerHeight: '60px'
  }
};

// 功能配置
export const featureConfig = {
  // 提示词优化器配置
  optimizer: {
    steps: ['analyzing', 'suggesting', 'decomposing', 'completed'],
    defaultTemperature: 0
  },
  
  // 提示词生成器配置
  generator: {
    defaultTemplate: 'basic',
    defaultCategory: 'general'
  },
  
  // 版本控制配置
  versionControl: {
    enabled: true,
    autoSave: true,
    compareEnabled: true
  }
};

// 导出默认配置
export default {
  api: apiConfig,
  storage: storageConfig,
  ui: uiConfig,
  features: featureConfig
};
