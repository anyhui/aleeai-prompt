import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Card, Box, Button, Paper, Typography, AppBar, Container, Chip, Tabs } from '@mui/material';

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
    appBar: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
    card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
    hover: 'linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.98))',
    text: 'linear-gradient(to right, #000, rgba(0,0,0,0.8))'
  },
  dark: {
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

// ============================================================
// 共享组件样式
// ============================================================

// 内容容器样式
export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: borderRadius.lg,
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: blur.md,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? 'none'
    : `${shadows.sm} rgba(0, 0, 0, 0.1)`
}));

// 通用卡片样式
export const BaseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: transitions.spring,
  backdropFilter: blur.lg,
  background: theme.palette.mode === 'dark' ? gradientColors.dark.card : gradientColors.light.card,
  borderRadius: borderRadius.xl,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
    : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? `${shadows.xl} ${theme.palette.primary.dark}40, inset 0 1px 2px rgba(255, 255, 255, 0.08)`
      : `${shadows.xl} ${theme.palette.primary.light}75, inset 0 1px 2px rgba(255, 255, 255, 0.9)`,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : theme.palette.primary.main}`,
    background: theme.palette.mode === 'dark' ? gradientColors.dark.hover : gradientColors.light.hover,
    zIndex: 1
  }
}));

// 模板卡片样式
export const TemplateCard = styled(BaseCard)(({ theme, selected }) => ({
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : undefined,
  transition: transitions.spring,
  backdropFilter: blur.lg,
  opacity: selected ? 1 : 0.85,
  background: selected
    ? theme.palette.mode === 'dark'
      ? `${theme.palette.primary.main}${opacity.light.high}`
      : `${theme.palette.primary.main}${opacity.light.low}`
    : theme.palette.mode === 'dark'
      ? gradientColors.dark.card
      : gradientColors.light.card,
  boxShadow: selected
    ? theme.palette.mode === 'dark'
      ? `${shadows.xl} ${theme.palette.primary.dark}90, inset 0 1px 3px rgba(255, 255, 255, 0.3)`
      : `${shadows.xl} ${theme.palette.primary.main}75, inset 0 1px 3px rgba(255, 255, 255, 1)`
    : theme.palette.mode === 'dark'
      ? `${shadows.md} rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
      : `${shadows.md} rgba(99, 102, 241, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
  '&:hover': {
    transform: 'translateY(-5px)',
    border: `2px solid ${theme.palette.primary.main}`
  }
}));

// 通用按钮样式
export const BaseButton = styled(Button)(({ theme }) => ({
  borderRadius: borderRadius.lg,
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  minHeight: '36px',
  padding: '8px 20px',
  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)',
  color: theme.palette.text.primary,
  transition: transitions.normal,
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    boxShadow: `${shadows.md} ${theme.palette.primary.main}40`
  },
  '&:active': {
    transform: 'translateY(0)'
  }
}));

// 通用容器样式
export const BasePaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(4),
  borderRadius: borderRadius.lg,
  backdropFilter: blur.md,
  background: theme.palette.mode === 'dark' ? gradientColors.dark.secondary : gradientColors.light.secondary,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `${shadows.lg} rgba(0, 0, 0, 0.5)`
    : `${shadows.lg} rgba(0, 0, 0, 0.06)`,
  transition: transitions.slow,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `${shadows.xl} ${theme.palette.primary.dark}60`
      : `${shadows.xl} ${theme.palette.primary.light}40`,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : theme.palette.primary.light}25`
  }
}));

// 通用文本溢出处理样式
export const TruncatedText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.5,
  margin: '8px 0'
});

// 玻璃卡片样式
export const GlassCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? gradientColors.dark.card : gradientColors.light.card,
  backdropFilter: blur.md,
  borderRadius: borderRadius.lg,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  transition: transitions.spring,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.15)'
  }
}));

// 渐变文本样式
export const GradientText = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.8) 90%)'
    : 'linear-gradient(135deg, #000 30%, rgba(0,0,0,0.8) 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700
}));

// 预设按钮样式
export const PresetButton = styled(BaseButton)(({ theme, selected }) => ({
  minWidth: 'auto',
  minHeight: '32px',
  padding: '4px 12px',
  fontSize: '0.85rem',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
    transform: 'translateY(-2px)'
  }
}));

// 通用Flex容器样式
export const FlexBox = styled(Box)({
  display: 'flex',
  gap: 1.5,
  flexWrap: 'wrap',
  alignItems: 'center'
});

// 应用栏样式
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))'
    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
  backdropFilter: 'blur(12px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
    : '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
  zIndex: theme.zIndex.drawer + 1,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: theme.spacing(0.5, 0)
}));

// 标题样式
export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))'
    : 'linear-gradient(to right, #000, rgba(0,0,0,0.8))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  marginRight: 3,
  textShadow: theme.palette.mode === 'dark'
    ? '0 2px 4px rgba(0,0,0,0.1)'
    : '0 1px 2px rgba(0,0,0,0.2)',
  fontSize: '1.5rem',
  '@media (max-width: 600px)': {
    fontSize: '1.25rem'
  }
}));

// 导航按钮样式
export const StyledNavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.primary,
  letterSpacing: '0.3px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(120deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))'
      : 'linear-gradient(120deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0))',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease-out'
  },
  '&:hover': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-1px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(255, 255, 255, 0.08)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
    '&:before': {
      transform: 'translateX(100%)'
    }
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: 'none'
  },
  '@media (max-width: 600px)': {
    margin: theme.spacing(0, 0.5),
    padding: theme.spacing(0.75, 1.25),
    fontSize: '0.85rem',
    minWidth: '64px',
    letterSpacing: '0.25px',
    borderRadius: '8px'
  }
}));

// 主容器样式
export const MainContainer = styled(Container)({
  marginTop: '80px',
  '@media (max-width: 600px)': {
    marginTop: '100px',
    padding: '0 16px'
  },
  padding: '24px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 4,
  flex: 1
});

// 页脚样式
export const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  marginTop: 'auto',
  backgroundColor: theme.palette.background.paper
}));

// 根容器样式
export const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});

// 标签样式
export const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '0 8px 8px 0',
  borderRadius: borderRadius.sm,
  transition: transitions.fast,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'scale(1.05)'
  },
  '&.selected': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}));

// 标签容器样式
export const ChipsContainer = styled(FlexBox)({
  marginBottom: '16px',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center'
});

// 过滤标签容器样式
export const FilterChipsContainer = styled(FlexBox)(({ theme }) => ({
  marginBottom: '24px',
  marginTop: '16px',
  padding: '16px',
  background: theme.palette.mode === 'dark' ? alphaColors.dark.white.low : alphaColors.light.white.medium,
  borderRadius: borderRadius.sm,
  backdropFilter: blur.sm,
  boxShadow: `${shadows.sm} ${theme.palette.mode === 'dark' ? alphaColors.dark.black.medium : alphaColors.light.black.medium}`
}));

// 分类标签样式
export const CategoryTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    display: 'wrap',
    flexWrap: 'wrap',
    gap: 3
  },
  '& .MuiTab-root': {
    minWidth: '140px',
    flex: '0 0 auto',
    marginBottom: 1,
    borderRadius: borderRadius.sm,
    transition: transitions.normal,
    opacity: 0.8,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.light}${opacity.light.medium}`,
      transform: 'translateY(-2px)',
      opacity: 0.9
    },
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main}${opacity.light.high}`,
      opacity: 1,
      transform: 'scale(1.05)',
      boxShadow: `${shadows.md} ${theme.palette.primary.main}40`
    }
  }
}));

// 评估容器样式
export const EvaluationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  backdropFilter: blur.sm,
  borderRadius: borderRadius.md,
  border: `1px solid ${theme.palette.divider}`,
  transition: transitions.normal,
  '&:hover': {
    boxShadow: `${shadows.md} ${theme.palette.primary.light}${opacity.light.medium}`
  }
}));

// 导出主题配置函数
export const exportTheme = (theme) => {
  // 提取主题的关键配置
  return {
    mode: theme.palette.mode,
    colors: {
      primary: {
        main: theme.palette.primary.main,
        light: theme.palette.primary.light,
        dark: theme.palette.primary.dark
      },
      secondary: {
        main: theme.palette.secondary.main,
        light: theme.palette.secondary.light,
        dark: theme.palette.secondary.dark
      },
      background: {
        default: theme.palette.background.default,
        paper: theme.palette.background.paper
      },
      text: {
        primary: theme.palette.text.primary,
        secondary: theme.palette.text.secondary
      }
    }
  };
};

// 导入主题配置函数
export const importTheme = (themeConfig, colorMode) => {
  // 首先切换到正确的模式（亮色/暗色）
  if (themeConfig.mode) {
    colorMode.toggleColorMode(themeConfig.mode);
  }
  
  // 注意：完整的主题自定义需要更复杂的实现
  // 这里只是一个基本示例，实际应用中可能需要更新全局CSS变量或重新创建主题
  console.log('主题配置已导入:', themeConfig);
};

// 创建主题函数
export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light' ? lightColors : darkColors),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: gradientColors.primary,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '2rem',
          border: '1px solid rgba(226, 232, 240, 0.1)',
          '@media (max-width: 600px)': {
            padding: '1rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '1.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => `0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
});