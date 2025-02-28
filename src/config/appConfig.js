/**
 * 应用全局配置文件
 * 集中管理应用的各种配置项，实现配置软编码
 */

// API配置
export const apiConfig = {
  // 默认API端点
  defaultEndpoints: [
    { label: 'OpenAI', value: 'https://api.openai.com/v1/chat/completions' },
    { label: 'Anthropic', value: 'https://api.anthropic.com/v1/messages' },
    { label: 'Azure OpenAI', value: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment-name/chat/completions?api-version=2023-05-15' },
    { label: 'Deepseek', value: 'https://api.deepseek.com/v1/chat/completions' },
    { label: 'SiliconFlow', value: 'https://api.siliconflow.cn/v1/chat/completions' },
    { label: '自定义', value: 'custom' }
  ],
  
  // 默认模型选项
  defaultModels: [
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
  ],
  
  // 默认API配置
  defaultConfig: {
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4',
    apiKey: import.meta.env.VITE_DEFAULT_API_KEY || ''
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

// 性能配置
export const performanceConfig = {
  // 请求限制
  rateLimit: {
    maxRequests: parseInt(import.meta.env.VITE_MAX_REQUESTS) || 100,
    timeWindow: parseInt(import.meta.env.VITE_RATE_LIMIT) || 60,
    enabled: import.meta.env.VITE_ENABLE_RATE_LIMIT === 'true' || false
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    maxAge: 3600, // 缓存有效期（秒）
    maxSize: 100  // 最大缓存条目数
  }
};

// 安全配置
export const securityConfig = {
  // CORS配置
  cors: {
    origin: import.meta.env.VITE_CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  },
  
  // 内容安全策略
  contentSecurity: {
    enabled: true,
    policy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:']
    }
  }
};

// 导出默认配置
export default {
  api: apiConfig,
  storage: storageConfig,
  ui: uiConfig,
  features: featureConfig
};