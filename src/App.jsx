import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toolbar, CssBaseline, Container, Typography, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
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
import { AppProvider, useAppContext } from './context/AppContext'

const evaluationCriteria = {
  relevance: { label: '相关性', description: '输出是否符合需求' },
  accuracy: { label: '准确性', description: '内容是否准确无误' },
  completeness: { label: '完整性', description: '是否覆盖所需信息' },
  creativity: { label: '创新性', description: '是否有创新思路' }
};

function App() {
  // 使用主题名称来管理当前主题
  const [currentTheme, setCurrentTheme] = useState('default');

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
                <StyledNavButton color="inherit" component={RouterLink} to="/">
                  提示词库
                </StyledNavButton>
                <StyledNavButton color="inherit" component={RouterLink} to="/generator">
                  生成器
                </StyledNavButton>
                <StyledNavButton color="inherit" component={RouterLink} to="/optimizer">
                  优化器
                </StyledNavButton>
                <ThemeManager onThemeChange={handleThemeChange} />
              </Box>
            </Toolbar>
          </StyledAppBar>

          <MainContainer component="main">
            <Routes>
              <Route path="/" element={<PromptLibrary />} />
              <Route path="/generator" element={<PromptGenerator />} />
              <Route path="/optimizer" element={<PromptOptimizer />} />
            </Routes>
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