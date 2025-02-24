import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { blur, gradients } from '../styles/constants';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
  backdropFilter: blur.xl,
  zIndex: 9999,
  transition: 'opacity 0.5s ease-in-out',
}));

const LoadingIcon = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: `3px solid ${theme.palette.primary.main}`,
  borderTop: `3px solid ${theme.palette.background.paper}`,
  animation: `${rotate} 1s infinite linear`,
  marginBottom: theme.spacing(2),
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  animation: `${pulse} 2s infinite ease-in-out`,
  textAlign: 'center',
  fontWeight: 500,
  letterSpacing: '0.1em',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)'
    : 'linear-gradient(45deg, #000 30%, rgba(0,0,0,0.8) 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

function LoadingScreen() {
  return (
    <LoadingContainer>
      <LoadingIcon />
      <LoadingText variant="h6">
        AI提示词助手
      </LoadingText>
      <LoadingText variant="subtitle1" sx={{ mt: 1, opacity: 0.8 }}>
        正在加载中...
      </LoadingText>
    </LoadingContainer>
  );
}

export default LoadingScreen;