import { styled } from '@mui/material/styles';
import { Box, Paper, Tabs } from '@mui/material';
import { BaseCard, BaseButton, BasePaper } from './shared.styles';
import { transitions, borderRadius, blur, gradients, shadows, opacity } from './constants';

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
      ? gradients.dark.primary
      : gradients.light.primary,
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
    background: theme.palette.mode === 'dark' ? gradients.dark.hover : gradients.light.hover
  }
}));

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

export const ContentPaper = styled(BasePaper)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.secondary,
  backdropFilter: blur.md,
  borderRadius: borderRadius.lg,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `${shadows.md} rgba(0, 0, 0, 0.45)`
    : `${shadows.md} rgba(0, 0, 0, 0.08)`,
  padding: theme.spacing(4),
  transition: transitions.slow,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? `${shadows.lg} ${theme.palette.primary.dark}40`
      : `${shadows.lg} ${theme.palette.primary.light}30`,
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.palette.primary.light}`
  }
}));

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