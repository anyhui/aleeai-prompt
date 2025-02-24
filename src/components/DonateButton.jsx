import React, { useState } from 'react';
import { Box, Typography, Fade, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { transitions, borderRadius, blur, shadows } from '../styles/constants';
import donateImage from '../assets/donate.jpg';

const FloatingContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(3),
  bottom: theme.spacing(3),
  zIndex: 1000,
  cursor: 'pointer',
  transition: transitions.spring,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backdropFilter: blur.md,
  borderRadius: borderRadius.lg,
  boxShadow: `${shadows.lg} ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
  background: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  maxWidth: '200px'
}));

const DonateImage = styled('img')({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: 1
});

const QRCodeImage = styled('img')({
  width: '200px',
  height: '200px',
  objectFit: 'contain'
});

function DonateButton() {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <FloatingContainer
      onMouseEnter={() => setShowQRCode(true)}
      onMouseLeave={() => setShowQRCode(false)}
    >
      <Box sx={{ textAlign: 'center' }}>
        <DonateImage
          src={donateImage}
          alt="打赏"
        />
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 700,
            fontSize: '0.75rem',
            mt: 0.5,
            background: 'linear-gradient(90deg, #12c2e9, #c471ed, #f64f59)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 2s linear infinite',
            '@keyframes shine': {
              '0%': {
                backgroundPosition: '-200% 50%'
              },
              '100%': {
                backgroundPosition: '0% 50%'
              }
            }
          }}
        >
          如果对您有帮助，能请我喝杯奶茶吗？
        </Typography>
      </Box>

      <Fade in={showQRCode}>
        <StyledPaper
          sx={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            mb: 2
          }}
        >
          <QRCodeImage
            src={donateImage}
            alt="打赏二维码"
          />
        </StyledPaper>
      </Fade>
    </FloatingContainer>
  );
}

export default DonateButton;