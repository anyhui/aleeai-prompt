import React from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { borderRadius, blur, gradients, shadows } from '../styles/constants';
import StatsCards from './StatsCards';

const OptimizedPromptOutput = ({
  optimizationStep,
  stepResults,
  stats,
  handleCopy,
  error
}) => {
  return (
    <Card sx={{
      borderRadius: borderRadius.lg,
      backdropFilter: blur.lg,
      background: theme => theme.palette.mode === 'dark' ? gradients.dark.primary : gradients.light.primary,
      boxShadow: theme => theme.palette.mode === 'dark'
        ? `${shadows.lg} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
        : `${shadows.lg} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          优化后的提示词
        </Typography>
        <Box sx={{ width: '100%', mb: 2 }}>
          <StatsCards stats={stats} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{
              width: '100%',
              height: '4px',
              backgroundColor: 'background.paper',
              borderRadius: '2px',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                backgroundColor: 'primary.main',
                borderRadius: '2px',
                transition: 'width 0.3s ease-in-out',
                width: optimizationStep === 'idle' ? '0%' :
                       optimizationStep === 'analyzing' ? '33%' :
                       optimizationStep === 'suggesting' ? '66%' :
                       optimizationStep === 'decomposing' ? '90%' :
                       optimizationStep === 'completed' ? '100%' : '0%'
              }} />
            </Box>
            <Typography variant="body2" sx={{ ml: 2, minWidth: '100px' }}>
              {optimizationStep === 'idle' ? '等待开始' :
               optimizationStep === 'analyzing' ? '分析中...' :
               optimizationStep === 'suggesting' ? '优化中...' :
               optimizationStep === 'decomposing' ? '分解中...' :
               optimizationStep === 'completed' ? '已完成' :
               optimizationStep === 'error' ? '出错了' : ''}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {stepResults.analysis && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              分析结果
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows="Infinity"
              value={stepResults.analysis}
              InputProps={{ readOnly: true }}
              sx={{ mb: 1 }}
            />
          </Box>
        )}

        {stepResults.suggestions && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              优化建议
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows="Infinity"
              value={stepResults.suggestions}
              InputProps={{ readOnly: true }}
              sx={{ mb: 1 }}
            />
          </Box>
        )}

        {stepResults.decomposition && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              任务分解
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows="Infinity"
              value={stepResults.decomposition}
              InputProps={{ readOnly: true }}
              sx={{ mb: 1 }}
            />
          </Box>
        )}

        {(stepResults.analysis || stepResults.decomposition) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon />}
            sx={{ mt: 2 }}
          >
            复制优化结果
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedPromptOutput;