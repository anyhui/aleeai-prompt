import { styled } from '@mui/material/styles';
import { Card, Box, Button, Paper, Typography } from '@mui/material';
import { transitions, borderRadius, blur, gradients, shadows } from './constants';

// 通用卡片样式
export const BaseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: transitions.spring,
  backdropFilter: blur.lg,
  background: theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
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
    background: theme.palette.mode === 'dark' ? gradients.dark.hover : gradients.light.hover,
    zIndex: 1
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
  background: theme.palette.mode === 'dark' ? gradients.dark.secondary : gradients.light.secondary,
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

export const GlassCard = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? gradients.dark.card : gradients.light.card,
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

export const GradientText = styled(Typography)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.8) 90%)'
    : 'linear-gradient(135deg, #000 30%, rgba(0,0,0,0.8) 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700
}));

// 通用Flex容器样式
export const FlexBox = styled(Box)({
  display: 'flex',
  gap: 1.5,
  flexWrap: 'wrap',
  alignItems: 'center'
});
