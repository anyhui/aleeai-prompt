import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { BaseCard, TruncatedText, FlexBox } from './shared.styles';
import { borderRadius, transitions, blur, shadows } from './constants';
import { alphaColors } from './colors';

export const StyledCard = styled(BaseCard)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  borderRadius: borderRadius.md,
  padding: '20px',
  transition: transitions.normal,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `${shadows.md} ${theme.palette.primary.main}40`,
    background: `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`
  }
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  borderRadius: borderRadius.lg,
  transition: transitions.fast,
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  color: theme.palette.text.primary,
  fontWeight: 500,
  padding: '4px 8px',
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  '&.selected': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
}));

export const PromptDescription = styled(TruncatedText)({});

export const ChipsContainer = styled(FlexBox)(({ theme }) => ({
  marginBottom: '24px',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '16px',
  borderRadius: borderRadius.lg,
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: blur.md,
  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
}));

export const FilterChipsContainer = styled(FlexBox)(({ theme }) => ({
  marginBottom: '24px',
  marginTop: '16px',
  padding: '16px',
  background: theme.palette.mode === 'dark' ? alphaColors.dark.white.low : alphaColors.light.white.medium,
  borderRadius: borderRadius.sm,
  backdropFilter: blur.sm,
  boxShadow: `${shadows.sm} ${theme.palette.mode === 'dark' ? alphaColors.dark.black.medium : alphaColors.light.black.medium}`
}));