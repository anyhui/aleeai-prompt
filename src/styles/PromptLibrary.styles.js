import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { BaseCard, TruncatedText, FlexBox } from './shared.styles';

export const StyledCard = styled(BaseCard)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  borderRadius: '16px',
  padding: '20px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${theme.palette.primary.main}40`,
    background: `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`
  }
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '0 8px 8px 0',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
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

export const FilterChipsContainer = styled(FlexBox)({
  marginBottom: '24px',
  marginTop: '16px',
  padding: '16px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
});