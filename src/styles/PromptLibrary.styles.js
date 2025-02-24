import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import { BaseCard, TruncatedText, FlexBox } from './shared.styles';

export const StyledCard = styled(BaseCard)(({ theme }) => ({
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${theme.palette.primary.light}25`
  }
}));

export const StyledChip = styled(Chip)({
  margin: '0 4px 4px 0'
});

export const PromptDescription = styled(TruncatedText)({});

export const ChipsContainer = styled(FlexBox)({
  marginBottom: 1,
  gap: 0.5
});

export const FilterChipsContainer = styled(FlexBox)({
  marginBottom: 3,
  marginTop: 2
});