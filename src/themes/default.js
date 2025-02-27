import { createTheme } from '@mui/material/styles';
import {
  baseColors,
  darkColors,
  alphaColors,
  borderColors,
  shadowColors,
  gradientColors,
  spacing,
  borderRadius,
  transitions,
  shadows,
  opacity,
  blur,
  zIndex
} from './styles';

// 默认主题 - 基于深色模式
const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkColors,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: gradientColors.primary,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(255, 255, 255, 0.12)`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '2rem',
          border: '1px solid rgba(226, 232, 240, 0.1)',
          '@media (max-width: 600px)': {
            padding: '1rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '1.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: blur.md,
          borderRadius: borderRadius.lg,
        }
      }
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
});

export default defaultTheme;