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

// 渐变配置
export const gradients = {
  light: {
    primary: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
    secondary: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.95))',
    hover: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.98))',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(241, 245, 249, 0.85))'
  },
  dark: {
    primary: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))',
    secondary: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
    hover: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))'
  }
};

// z-index配置
export const zIndex = {
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500
};