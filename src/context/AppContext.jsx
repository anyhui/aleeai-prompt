import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiConfig } from '../config/appConfig';

// 创建上下文
const AppContext = createContext();

// 初始状态
const initialState = {
  // API配置相关状态
  apiConfig: {
    ...apiConfig.defaultConfig,
    isCustomEndpoint: false,
    customEndpoint: '',
    connectionStatus: {
      isChecking: false,
      isConnected: false,
      error: null
    }
  },
  
  // 提示词相关状态
  prompt: {
    current: '',
    optimized: '',
    history: [],
    id: 'default-prompt',
    versions: [],
    currentVersion: null,
    loading: false,
    error: null
  },
  
  // 优化器相关状态
  optimizer: {
    step: 'idle', // idle, analyzing, suggesting, decomposing, completed
    results: {
      analysis: '',
      suggestions: '',
      decomposition: ''
    },
    stats: {
      promptTokens: 0,
      completionTokens: 0,
      elapsedTime: 0,
      startTime: null
    }
  },
  
  // UI相关状态
  ui: {
    snackbar: {
      open: false,
      message: '',
      severity: 'info' // success, error, warning, info
    },
    theme: localStorage.getItem('theme') || 'default'
  },
  
  // 工具相关状态
  tools: {}
};

// 定义操作类型
const ActionTypes = {
  // API配置相关操作
  SET_API_CONFIG: 'SET_API_CONFIG',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_CUSTOM_ENDPOINT: 'SET_CUSTOM_ENDPOINT',
  
  // 提示词相关操作
  SET_PROMPT: 'SET_PROMPT',
  SET_OPTIMIZED_PROMPT: 'SET_OPTIMIZED_PROMPT',
  SET_PROMPT_LOADING: 'SET_PROMPT_LOADING',
  SET_PROMPT_ERROR: 'SET_PROMPT_ERROR',
  SET_PROMPT_VERSIONS: 'SET_PROMPT_VERSIONS',
  SET_CURRENT_VERSION: 'SET_CURRENT_VERSION',
  
  // 优化器相关操作
  SET_OPTIMIZER_STEP: 'SET_OPTIMIZER_STEP',
  SET_STEP_RESULTS: 'SET_STEP_RESULTS',
  SET_OPTIMIZER_STATS: 'SET_OPTIMIZER_STATS',
  RESET_OPTIMIZER: 'RESET_OPTIMIZER',
  
  // UI相关操作
  SHOW_SNACKBAR: 'SHOW_SNACKBAR',
  HIDE_SNACKBAR: 'HIDE_SNACKBAR',
  SET_THEME: 'SET_THEME',
  
  // 工具相关操作
  UPDATE_TOOLS: 'UPDATE_TOOLS'
};

// Reducer函数
const appReducer = (state, action) => {
  switch (action.type) {
    // API配置相关操作处理
    case ActionTypes.SET_API_CONFIG:
      return {
        ...state,
        apiConfig: {
          ...state.apiConfig,
          ...action.payload
        }
      };
    
    case ActionTypes.SET_CONNECTION_STATUS:
      return {
        ...state,
        apiConfig: {
          ...state.apiConfig,
          connectionStatus: {
            ...state.apiConfig.connectionStatus,
            ...action.payload
          }
        }
      };
    
    case ActionTypes.SET_CUSTOM_ENDPOINT:
      return {
        ...state,
        apiConfig: {
          ...state.apiConfig,
          isCustomEndpoint: action.payload.isCustom,
          customEndpoint: action.payload.endpoint,
          apiEndpoint: action.payload.isCustom ? action.payload.endpoint : action.payload.endpoint
        }
      };
    
    // 提示词相关操作处理
    case ActionTypes.SET_PROMPT:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          current: action.payload
        }
      };
    
    case ActionTypes.SET_OPTIMIZED_PROMPT:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          optimized: action.payload
        }
      };
    
    case ActionTypes.SET_PROMPT_LOADING:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          loading: action.payload
        }
      };
    
    case ActionTypes.SET_PROMPT_ERROR:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          error: action.payload
        }
      };
    
    case ActionTypes.SET_PROMPT_VERSIONS:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          versions: action.payload
        }
      };
    
    case ActionTypes.SET_CURRENT_VERSION:
      return {
        ...state,
        prompt: {
          ...state.prompt,
          currentVersion: action.payload,
          current: action.payload ? action.payload.content : state.prompt.current
        }
      };
    
    // 优化器相关操作处理
    case ActionTypes.SET_OPTIMIZER_STEP:
      return {
        ...state,
        optimizer: {
          ...state.optimizer,
          step: action.payload
        }
      };
    
    case ActionTypes.SET_STEP_RESULTS:
      return {
        ...state,
        optimizer: {
          ...state.optimizer,
          results: {
            ...state.optimizer.results,
            ...action.payload
          }
        }
      };
    
    case ActionTypes.SET_OPTIMIZER_STATS:
      return {
        ...state,
        optimizer: {
          ...state.optimizer,
          stats: {
            ...state.optimizer.stats,
            ...action.payload
          }
        }
      };
    
    case ActionTypes.RESET_OPTIMIZER:
      return {
        ...state,
        optimizer: {
          ...initialState.optimizer,
          stats: {
            ...initialState.optimizer.stats,
            startTime: Date.now()
          }
        }
      };
    
    // UI相关操作处理
    case ActionTypes.SHOW_SNACKBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          snackbar: {
            open: true,
            message: action.payload.message,
            severity: action.payload.severity || 'info'
          }
        }
      };
    
    case ActionTypes.HIDE_SNACKBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          snackbar: {
            ...state.ui.snackbar,
            open: false
          }
        }
      };
    
    case ActionTypes.SET_THEME:
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload
        }
      };
    
    // 工具相关操作处理
    case ActionTypes.UPDATE_TOOLS:
      return {
        ...state,
        tools: {
          ...state.tools,
          ...action.payload
        }
      };
    
    default:
      return state;
  }
};

// 提供者组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 保存主题到本地存储
  useEffect(() => {
    localStorage.setItem('theme', state.ui.theme);
  }, [state.ui.theme]);
  
  // 提供上下文值
  const contextValue = {
    state,
    dispatch,
    actions: {
      // API配置相关操作
      setApiConfig: (config) => dispatch({ type: ActionTypes.SET_API_CONFIG, payload: config }),
      setConnectionStatus: (status) => dispatch({ type: ActionTypes.SET_CONNECTION_STATUS, payload: status }),
      setCustomEndpoint: (isCustom, endpoint) => dispatch({
        type: ActionTypes.SET_CUSTOM_ENDPOINT,
        payload: { isCustom, endpoint }
      }),
      
      // 提示词相关操作
      setPrompt: (prompt) => dispatch({ type: ActionTypes.SET_PROMPT, payload: prompt }),
      setOptimizedPrompt: (prompt) => dispatch({ type: ActionTypes.SET_OPTIMIZED_PROMPT, payload: prompt }),
      setPromptLoading: (loading) => dispatch({ type: ActionTypes.SET_PROMPT_LOADING, payload: loading }),
      setPromptError: (error) => dispatch({ type: ActionTypes.SET_PROMPT_ERROR, payload: error }),
      setPromptVersions: (versions) => dispatch({ type: ActionTypes.SET_PROMPT_VERSIONS, payload: versions }),
      setCurrentVersion: (version) => dispatch({ type: ActionTypes.SET_CURRENT_VERSION, payload: version }),
      
      // 优化器相关操作
      setOptimizerStep: (step) => dispatch({ type: ActionTypes.SET_OPTIMIZER_STEP, payload: step }),
      setStepResults: (results) => dispatch({ type: ActionTypes.SET_STEP_RESULTS, payload: results }),
      setOptimizerStats: (stats) => dispatch({ type: ActionTypes.SET_OPTIMIZER_STATS, payload: stats }),
      resetOptimizer: () => dispatch({ type: ActionTypes.RESET_OPTIMIZER }),
      
      // UI相关操作
      showSnackbar: (message, severity) => dispatch({
        type: ActionTypes.SHOW_SNACKBAR,
        payload: { message, severity }
      }),
      hideSnackbar: () => dispatch({ type: ActionTypes.HIDE_SNACKBAR }),
      setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
      
      // 工具相关操作
      updateTools: (tools) => dispatch({ type: ActionTypes.UPDATE_TOOLS, payload: tools })
    }
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook，方便使用上下文
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext必须在AppProvider内部使用');
  }
  return context;
};

export { ActionTypes };
export default AppContext;