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

export const PromptDescription = styled(TruncatedText)({});

export const ChipsContainer = styled(FlexBox)({
  marginBottom: '16px',
  gap: '8px',
  flexWrap: 'wrap',
  alignItems: 'center'
});

export const FilterChipsContainer = styled(FlexBox)(({ theme }) => ({
  marginBottom: '24px',
  marginTop: '16px',
  padding: '16px',
  background: theme.palette.mode === 'dark' ? alphaColors.dark.white.low : alphaColors.light.white.medium,
  borderRadius: borderRadius.sm,
  backdropFilter: blur.sm,
  boxShadow: `${shadows.sm} ${theme.palette.mode === 'dark' ? alphaColors.dark.black.medium : alphaColors.light.black.medium}`
}));