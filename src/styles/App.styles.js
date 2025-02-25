import { styled } from '@mui/material/styles';
import { AppBar, Box, Button, Typography, Container } from '@mui/material';

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
    borderRadius: '8px',
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.08)',
      transform: 'translateY(-1px)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 2px 8px rgba(255, 255, 255, 0.1)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    '&:active': {
      transform: 'translateY(1px)',
      boxShadow: 'none'
    }
  }
}));

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

export const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  marginTop: 'auto',
  backgroundColor: theme.palette.background.paper
}));

export const RootBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});