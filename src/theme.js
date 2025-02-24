import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff'
          },
          secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff'
          },
          background: {
            default: '#f8fafc',
            paper: 'rgba(255, 255, 255, 0.9)',
            gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))'
          },
          text: {
            primary: '#1e293b',
            secondary: '#475569',
            disabled: '#94a3b8'
          },
        }
      : {
          primary: {
            main: '#818cf8',
            light: '#a5b4fc',
            dark: '#6366f1',
            contrastText: '#ffffff'
          },
          secondary: {
            main: '#f472b6',
            light: '#fb7185',
            dark: '#ec4899',
            contrastText: '#ffffff'
          },
          background: {
            default: '#0f172a',
            paper: 'rgba(30, 41, 59, 0.8)',
            gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))'
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            disabled: '#64748b'
          },
        }),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #6366f1, #ec4899)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
            boxShadow: (theme) => `0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        },
      },
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

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));