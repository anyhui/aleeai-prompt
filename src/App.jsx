import React, { useState, useEffect } from 'react'
import { Toolbar, CssBaseline, Container, Typography, Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { StyledAppBar, StyledTitle, StyledNavButton, MainContainer, Footer, RootBox } from './styles/App.styles'
import DonateButton from './components/DonateButton'
import ThemeManager from './components/ThemeManager'

// 页面组件
import PromptLibrary from './pages/PromptLibrary'
import PromptGenerator from './pages/PromptGenerator'
import PromptOptimizer from './pages/PromptOptimizer'

// 导入主题映射
import { themeMap as themes } from './theme'

// 导入AppContext提供者和钩子
import { AppProvider } from './context/AppContext'

function App() {
  // 使用主题名称来管理当前主题
  const [currentTheme, setCurrentTheme] = useState('default');
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (event, nextPath) => {
    event.preventDefault();
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  const page = path === '/generator'
    ? <PromptGenerator />
    : path === '/optimizer'
      ? <PromptOptimizer />
      : <PromptLibrary />;

  // 处理主题变更
  const handleThemeChange = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <AppProvider>
      <ThemeProvider theme={themes[currentTheme]}>
        <CssBaseline />
        <RootBox>
          <StyledAppBar position="fixed">
            <Toolbar sx={{
              padding: { xs: '0.5rem 1rem', sm: '0.5rem 2rem' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
              minHeight: { xs: 'auto', sm: '64px' }
            }}>
              <StyledTitle variant="h6" component="div" sx={{
                width: { xs: '100%', sm: 'auto' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                AI提示词助手
              </StyledTitle>
              <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flex: { xs: '0 0 auto', sm: 1 },
                justifyContent: { xs: 'center', sm: 'flex-end' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <StyledNavButton color="inherit" href="/" onClick={event => navigate(event, '/')}>
                  提示词库
                </StyledNavButton>
                <StyledNavButton color="inherit" href="/generator" onClick={event => navigate(event, '/generator')}>
                  生成器
                </StyledNavButton>
                <StyledNavButton color="inherit" href="/optimizer" onClick={event => navigate(event, '/optimizer')}>
                  优化器
                </StyledNavButton>
                <ThemeManager onThemeChange={handleThemeChange} />
              </Box>
            </Toolbar>
          </StyledAppBar>

          <MainContainer component="main">
            {page}
          </MainContainer>

          <Footer component="footer">
            <Container maxWidth="sm">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} AI提示词助手 | 让与AI大模型的沟通更高效
              </Typography>
            </Container>
          </Footer>
          <DonateButton />
        </RootBox>
      </ThemeProvider>
    </AppProvider>
  )
}

export default App
