// 主题组件样式定义文件
// 这个文件包含所有主题共享的组件样式定义

import { styled } from '@mui/material/styles';
import { Card, Box, Button, Paper, Typography, AppBar, Container, Tabs } from '@mui/material';
import { borderRadius, blur, shadows, transitions, opacity } from './styles';

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
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
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
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))' 
      : 'linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.98))',
    zIndex: 1
  }
}));

// 模板卡片样式
export const TemplateCard = styled(BaseCard)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: transitions.spring,
  backdropFilter: blur.lg,
  opacity: selected ? 1 : 0.85,
  background: selected
    ? theme.palette.mode === 'dark'
      ? `${theme.palette.primary.main}${opacity.light.high}`
      : `${theme.palette.primary.main}${opacity.light.low}`
    : theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
  border: `2px solid ${selected
    ? theme.palette.primary.main
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(99, 102, 241, 0.1)'}`,
  boxShadow: selected
    ? theme.palette.mode === 'dark'
      ? `${shadows.xl} ${theme.palette.primary.dark}90, inset 0 1px 3px rgba(255, 255, 255, 0.3)`
      : `${shadows.xl} ${theme.palette.primary.main}75, inset 0 1px 3px rgba(255, 255, 255, 1)`
    : theme.palette.mode === 'dark'
      ? `${shadows.md} rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
      : `${shadows.md} rgba(99, 102, 241, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.03)',
    boxShadow: theme.palette.mode === 'dark'
      ? `${shadows.lg} ${theme.palette.primary.dark}75, inset 0 1px 2px rgba(255, 255, 255, 0.2)`
      : `${shadows.lg} ${theme.palette.primary.light}50, inset 0 1px 2px rgba(255, 255, 255, 0.9)`,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.primary.main}`,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))' 
      : 'linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.98))'
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
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))' 
    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
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
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.92))',
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
  transition: transitions.fast,
  opacity: selected ? 1 : 0.75,
  backgroundColor: selected
    ? theme.palette.mode === 'dark'
      ? `${theme.palette.primary.dark}${opacity.light.high}`
      : `${theme.palette.primary.main}${opacity.light.medium}`
    : 'transparent',
  transform: selected ? 'scale(1.05)' : 'scale(1)',
  padding: '4px 12px',
  minHeight: '28px',
  fontSize: '0.85rem',
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.primary.light}`,
  boxShadow: selected
    ? `${shadows.sm} ${theme.palette.primary.main}60`
    : 'none',
  '&:hover': {
    transform: selected ? 'scale(1.05)' : 'translateY(-2px)',
    backgroundColor: selected
      ? theme.palette.mode === 'dark'
        ? `${theme.palette.primary.dark}${opacity.light.high}`
        : `${theme.palette.primary.main}${opacity.light.high}`
      : `${theme.palette.primary.light}${opacity.light.low}`,
    opacity: selected ? 1 : 0.9,
    border: `1px solid ${theme.palette.primary.main}`
  }
}));

// 分类标签页样式
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

// 通用Flex容器样式
export const FlexBox = styled(Box)({
  display: 'flex',
  gap: '1.5rem',
  flexWrap: 'wrap',
  alignItems: 'center'
});

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