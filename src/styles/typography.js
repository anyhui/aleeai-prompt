/**
 * 排版样式常量
 * 定义应用中使用的文本样式常量，确保样式一致性
 */

// 字体粗细
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800
};

// 字体大小
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  md: '1.1rem',     // 17.6px
  lg: '1.25rem',    // 20px
  xl: '1.5rem',     // 24px
  '2xl': '1.75rem', // 28px
  '3xl': '2rem',    // 32px
  '4xl': '2.5rem'   // 40px
};

// 文本变体样式
export const textVariants = {
  // 标题样式
  h1: {
    fontSize: '2.5rem',
    fontWeight: fontWeight.bold,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: fontWeight.bold,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: fontWeight.semiBold,
    lineHeight: 1.4
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: fontWeight.semiBold,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: fontWeight.semiBold,
    lineHeight: 1.5
  },
  h6: {
    fontSize: '1rem',
    fontWeight: fontWeight.semiBold,
    lineHeight: 1.5
  },
  
  // 正文样式
  body1: {
    fontSize: '1rem',
    fontWeight: fontWeight.regular,
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.9rem',
    fontWeight: fontWeight.regular,
    lineHeight: 1.5
  },
  
  // 特殊文本样式
  caption: {
    fontSize: '0.8rem',
    fontWeight: fontWeight.regular,
    lineHeight: 1.5
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: fontWeight.medium,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  
  // 强调文本样式
  emphasis: {
    fontWeight: fontWeight.semiBold
  },
  error: {
    fontWeight: fontWeight.bold,
    color: 'error.main',
    fontSize: fontSize.md
  }
};

// 行高
export const lineHeight = {
  none: 1,
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2
};

// 字母间距
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
};