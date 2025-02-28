import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Box, Typography, Grid, Card, CardContent, IconButton, Chip, Snackbar, CircularProgress, Alert, Button, Collapse } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { transitions, borderRadius, blur, gradients, shadows, spacing, zIndex } from '../styles/constants'
import { fontWeight, fontSize } from '../styles/typography'
import { StyledChip, ChipsContainer } from '../styles/PromptLibrary.styles'
import { BaseCard } from '../styles/shared.styles'
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
  const [expandedPromptId, setExpandedPromptId] = useState(null)
  const [copiedPromptId, setCopiedPromptId] = useState(null)
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

  const handleCopy = useCallback((text, promptId) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
      setCopiedPromptId(promptId);
      
      // 2秒后重置复制状态
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
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

  const handleToggleExpand = useCallback((promptId) => {
    setExpandedPromptId(prev => prev === promptId ? null : promptId);
  }, []);

  if (loading) {
    return <LoadingScreen />
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
      <Box sx={{ mb: { xs: spacing.md, sm: spacing.lg } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontSize: { xs: fontSize['2xl'], sm: fontSize['4xl'] },
          fontWeight: fontWeight.bold,
          mb: { xs: 1, sm: 2 },
          background: theme => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          提示词库
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{
          fontSize: { xs: fontSize.base, sm: fontSize.lg },
          mb: { xs: 2, sm: 3 },
          color: 'text.secondary',
          maxWidth: '800px'
        }}>
          精选的AI提示词模板，点击复制按钮即可使用
        </Typography>
      </Box>

      <Box sx={{ mb: spacing.lg, mt: spacing.md }}>
        <ChipsContainer>
          {availableTags.map((tag) => (
            <StyledChip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={selectedTags.includes(tag) ? 'primary' : 'default'}
              variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
              className={selectedTags.includes(tag) ? 'selected' : ''}
            />
          ))}
        </ChipsContainer>
      </Box>

      <Typography variant="subtitle1" sx={{ color: 'text.secondary', minWidth: 'fit-content' }}>
        当前：{prompts.filter(prompt =>
          selectedTags.length === 0 || 
          prompt.group?.some(tag => selectedTags.includes(tag))
        ).length} 条
      </Typography>

      <Grid container spacing={3} sx={{ mt: { xs: spacing.md, sm: spacing.lg } }}>
        {displayedPrompts.map((prompt, index) => (
          <Grid item xs={6} sm={6} md={4} key={index} sx={{
            display: 'flex',
            alignSelf: 'flex-start'
          }}>
            <BaseCard>
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
                    onClick={() => prompt?.prompt ? handleCopy(prompt.prompt, index) : null}
                    size="small"
                    disabled={!prompt?.prompt}
                    color={copiedPromptId === index ? "success" : "default"}
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
                {prompt?.prompt && (
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => handleToggleExpand(index)}
                    sx={{ 
                      mt: 1,
                      mb: -1,
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                    endIcon={expandedPromptId === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  >
                    {expandedPromptId === index ? '收起' : '查看详细'}
                  </Button>
                )}
                <Collapse in={expandedPromptId === index} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      提示词内容：
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      p: 1.5,
                      borderRadius: borderRadius.xs,
                      mb: spacing.sm
                    }}>
                      {prompt.prompt}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => handleCopy(prompt.prompt, index)}
                      color={copiedPromptId === index ? "success" : "primary"}
                      fullWidth
                    >
                      {copiedPromptId === index ? '已复制' : '复制提示词'}
                    </Button>
                  </Box>
                </Collapse>
              </CardContent>
            </BaseCard>
          </Grid>
        ))}
      </Grid>

      {loadingMore && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          bottom: spacing.md,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: zIndex.tooltip,
          backgroundColor: theme => theme.palette.background.paper,
          borderRadius: borderRadius.sm,
          padding: spacing.sm,
          boxShadow: theme => `${shadows.md} ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
        }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            加载更多...
          </Typography>
        </Box>
      )}



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