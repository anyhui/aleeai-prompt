import { createTheme } from '@mui/material/styles';
import {
  baseColors,
  lightColors,
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

// 明亮主题 - 基于浅色模式
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightColors,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: gradientColors.secondary,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(0, 0, 0, 0.08)`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
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
          border: '1px solid rgba(0, 0, 0, 0.05)',
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
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)',
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

export default lightTheme;