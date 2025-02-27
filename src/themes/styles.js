// 基础样式常量定义文件
// 这个文件包含所有主题共享的基础样式常量

// ============================================================
// 基础颜色
// ============================================================
export const baseColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent'
};

// 主题颜色 - 浅色模式
export const lightColors = {
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
    contrastText: '#ffffff'
  },
  background: {
    default: '#f8fafc',
    paper: 'rgba(255, 255, 255, 0.9)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))'
  },
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    disabled: '#94a3b8'
  }
};

// 主题颜色 - 深色模式
export const darkColors = {
  primary: {
    main: '#818cf8',
    light: '#a5b4fc',
    dark: '#6366f1',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#f472b6',
    light: '#fb7185',
    dark: '#ec4899',
    contrastText: '#ffffff'
  },
  background: {
    default: '#0f172a',
    paper: 'rgba(30, 41, 59, 0.8)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))'
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    disabled: '#64748b'
  }
};

// 透明度颜色
export const alphaColors = {
  light: {
    white: {
      low: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      high: 'rgba(255, 255, 255, 0.2)'
    },
    black: {
      low: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      high: 'rgba(0, 0, 0, 0.2)'
    }
  },
  dark: {
    white: {
      low: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.15)',
      high: 'rgba(255, 255, 255, 0.3)'
    },
    black: {
      low: 'rgba(0, 0, 0, 0.2)',
      medium: 'rgba(0, 0, 0, 0.4)',
      high: 'rgba(0, 0, 0, 0.6)'
    }
  }
};

// 边框颜色
export const borderColors = {
  light: {
    primary: 'rgba(99, 102, 241, 0.1)',
    secondary: 'rgba(236, 72, 153, 0.1)',
    default: 'rgba(0, 0, 0, 0.06)',
    divider: 'rgba(0, 0, 0, 0.08)',
    hover: 'rgba(99, 102, 241, 0.3)'
  },
  dark: {
    primary: 'rgba(129, 140, 248, 0.2)',
    secondary: 'rgba(244, 114, 182, 0.2)',
    default: 'rgba(255, 255, 255, 0.1)',
    divider: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(255, 255, 255, 0.15)'
  }
};

// 阴影颜色
export const shadowColors = {
  light: {
    primary: {
      low: 'rgba(99, 102, 241, 0.1)',
      medium: 'rgba(99, 102, 241, 0.2)',
      high: 'rgba(99, 102, 241, 0.3)'
    },
    secondary: {
      low: 'rgba(236, 72, 153, 0.1)',
      medium: 'rgba(236, 72, 153, 0.2)',
      high: 'rgba(236, 72, 153, 0.3)'
    },
    black: {
      low: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      high: 'rgba(0, 0, 0, 0.15)'
    }
  },
  dark: {
    primary: {
      low: 'rgba(129, 140, 248, 0.15)',
      medium: 'rgba(129, 140, 248, 0.25)',
      high: 'rgba(129, 140, 248, 0.4)'
    },
    secondary: {
      low: 'rgba(244, 114, 182, 0.15)',
      medium: 'rgba(244, 114, 182, 0.25)',
      high: 'rgba(244, 114, 182, 0.4)'
    },
    black: {
      low: 'rgba(0, 0, 0, 0.2)',
      medium: 'rgba(0, 0, 0, 0.3)',
      high: 'rgba(0, 0, 0, 0.4)'
    }
  }
};

// 渐变颜色
export const gradientColors = {
  primary: 'linear-gradient(45deg, #6366f1, #ec4899)',
  secondary: 'linear-gradient(135deg, #ec4899, #6366f1)',
  light: {
    primary: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
    secondary: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
    appBar: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
    card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
    hover: 'linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.98))',
    text: 'linear-gradient(to right, #000, rgba(0,0,0,0.8))'
  },
  dark: {
    primary: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))',
    secondary: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
    appBar: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
    card: 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))',
    hover: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
    text: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))'
  }
};

// ============================================================
// 常量配置
// ============================================================

// 间距配置
export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem'
};

// 边框半径配置
export const borderRadius = {
  xs: '6px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '28px'
};

// 动画配置
export const transitions = {
  fast: 'all 0.2s ease-in-out',
  normal: 'all 0.3s ease-in-out',
  slow: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  spring: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
};

// 阴影配置
export const shadows = {
  sm: '0 8px 16px',
  md: '0 12px 32px',
  lg: '0 24px 64px',
  xl: '0 32px 96px'
};

// 透明度配置
export const opacity = {
  light: {
    low: '0.08',
    medium: '0.15',
    high: '0.25'
  },
  dark: {
    low: '0.15',
    medium: '0.25',
    high: '0.35'
  }
};

// 模糊效果配置
export const blur = {
  sm: 'blur(12px)',
  md: 'blur(20px)',
  lg: 'blur(28px)'
};

// z-index配置
export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500
};