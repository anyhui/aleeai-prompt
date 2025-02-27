import React from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { borderRadius, blur, gradients, shadows } from '../styles/constants';

const PromptInput = ({ 
  prompt, 
  setPrompt, 
  loading, 
  handleOptimize 
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
          原始提示词
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="在此输入需要优化的提示词"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleOptimize}
          disabled={loading}
          sx={{ float: 'right' }}
        >
          {loading ? <CircularProgress size={24} /> : '优化提示词'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptInput;