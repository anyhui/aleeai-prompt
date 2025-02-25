import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Box, Typography, Grid, Card, CardContent, IconButton, Chip, Snackbar, CircularProgress, Alert, Popper, Paper, Fade } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { transitions, borderRadius, blur, gradients, shadows } from '../styles/constants'
import LoadingScreen from '../components/LoadingScreen'
import { PromptLibrarySkeleton } from '../components/SkeletonLoader';

function PromptLibrary() {
  const [prompts, setPrompts] = useState([])
  const [displayedPrompts, setDisplayedPrompts] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [availableTags, setAvailableTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [hoveredPrompt, setHoveredPrompt] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 12

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/agents.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPrompts(data)
        
        // 提取所有唯一的标签
        const tags = new Set(data.flatMap(prompt => prompt.group || []))
        setAvailableTags(Array.from(tags))

        // 初始化显示的提示词
        setDisplayedPrompts(data.slice(0, itemsPerPage))
        setHasMore(data.length > itemsPerPage)
      } catch (error) {
        console.error('Error loading prompts:', error)
        setError('加载提示词数据失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [itemsPerPage]) // 添加itemsPerPage作为依赖项

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt =>
      selectedTags.length === 0 || 
      prompt.group?.some(tag => selectedTags.includes(tag))
    );
  }, [prompts, selectedTags]);

  useEffect(() => {
    setDisplayedPrompts(filteredPrompts.slice(0, page * itemsPerPage));
    setHasMore(filteredPrompts.length > page * itemsPerPage);
  }, [filteredPrompts, page, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, hasMore]);

  // 添加滚动监听以实现无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  }, []);

  const handleTagClick = useCallback((tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  }, []);

  const handleMouseEnter = useCallback((event, prompt) => {
    setHoveredPrompt(prompt);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMouseLeave = () => {
    setHoveredPrompt(null)
    setAnchorEl(null)
  }

  if (loading) {
    return <PromptLibrarySkeleton />
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 }, minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem' },
          fontWeight: 700,
          mb: { xs: 1, sm: 2 },
          background: theme => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          提示词库
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 2, sm: 3 },
          color: 'text.secondary',
          maxWidth: '800px'
        }}>
          精选的AI提示词模板，点击复制按钮即可使用
        </Typography>
      </Box>

      <Box sx={{ mb: 4, mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
          {availableTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              sx={{
                transition: transitions.spring,
                opacity: selectedTags.includes(tag) ? 1 : 0.7,
                transform: selectedTags.includes(tag) ? 'scale(1.1)' : 'scale(1)',
                boxShadow: theme => selectedTags.includes(tag) 
                  ? `${shadows.xl} ${theme.palette.primary.main}60`
                  : 'none',
                '&:hover': {
                  opacity: 0.9,
                  transform: 'scale(1.05)',
                  boxShadow: theme => `${shadows.md} ${theme.palette.primary.main}40`
                },
                '&:active': {
                  transform: 'scale(0.95)',
                  transition: transitions.normal
                }
              }}
            />
          ))}
        </Box>
      </Box>

      <Typography variant="subtitle1" sx={{ color: 'text.secondary', minWidth: 'fit-content' }}>
        当前：{prompts.filter(prompt =>
          selectedTags.length === 0 || 
          prompt.group?.some(tag => selectedTags.includes(tag))
        ).length} 条
      </Typography>

      <Grid container spacing={3} sx={{ mt: { xs: 3, sm: 4 } }}>
        {displayedPrompts.map((prompt, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{
            display: 'flex'
          }}>
            <Card 
              sx={{ 
                width: '100%',
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: transitions.spring,
                backdropFilter: blur.lg,
                background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
                borderRadius: { xs: borderRadius.lg, sm: borderRadius.xl },
                border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.1)'}`,
                boxShadow: theme => theme.palette.mode === 'dark'
                  ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
                  : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
                '&:hover': {
                  transform: { xs: 'scale(1.02)', sm: 'translateY(-10px) scale(1.02)' },
                  boxShadow: theme => theme.palette.mode === 'dark'
                    ? `${shadows.xl} ${theme.palette.primary.dark}40, inset 0 1px 2px rgba(255, 255, 255, 0.08)`
                    : `${shadows.xl} ${theme.palette.primary.light}75, inset 0 1px 2px rgba(255, 255, 255, 0.9)`,
                  border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : theme.palette.primary.main}`,
                  background: theme => theme.palette.mode === 'dark' ? gradients.dark.hover : gradients.light.hover,
                  zIndex: 1
                },
                '@media (hover: none)': {
                  '&:active': {
                    transform: 'scale(0.98)',
                    transition: transitions.normal
                  }
                }
              }}
              onMouseEnter={(e) => handleMouseEnter(e, prompt)}
              onMouseLeave={handleMouseLeave}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="span">
                      {prompt.emoji}
                    </Typography>
                    <Typography variant="h6" component="h2">
                      {prompt.name}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => prompt?.prompt ? handleCopy(prompt.prompt) : null}
                    size="small"
                    disabled={!prompt?.prompt}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
                {prompt.group && (
                  <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {prompt.group.map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" />
                    ))}
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ 
                  whiteSpace: 'pre-wrap',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-word'
                }}>
                  {prompt.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loadingMore && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: theme => theme.palette.background.paper,
          borderRadius: 2,
          padding: 2,
          boxShadow: theme => `0 4px 20px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            加载更多...
          </Typography>
        </Box>
      )}

      <Popper
        open={Boolean(hoveredPrompt)}
        anchorEl={anchorEl}
        placement="right-start"
        transition
        sx={{
          zIndex: 1300,
          maxWidth: 400,
          ml: 1
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: 1
              }}
            >
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {hoveredPrompt?.prompt}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="提示词已复制到剪贴板"
      />
    </Box>
  )
}

export default PromptLibrary