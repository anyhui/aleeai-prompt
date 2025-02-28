/**
 * 通用UI组件库
 * 提供可复用的UI组件，实现功能组件化
 */
import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  TextField,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { uiConfig } from '../../config/appConfig';

// 通用容器组件
export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: uiConfig.animations.normal,
  '&:hover': {
    boxShadow: theme.shadows[3],
  }
}));

// 通用卡片组件
export const EnhancedCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: uiConfig.animations.normal,
  overflow: 'hidden',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)'
  }
}));

// 通用标题组件
export const SectionTitle = ({ children, ...props }) => (
  <Typography 
    variant="h5" 
    component="h2" 
    sx={{ 
      mb: 2, 
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }} 
    {...props}
  >
    {children}
  </Typography>
);

// 通用加载组件
export const LoadingIndicator = ({ size = 40, message = '加载中...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
    <CircularProgress size={size} />
    <Typography variant="body2" sx={{ mt: 2 }}>{message}</Typography>
  </Box>
);

// 通用操作按钮
export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  transition: uiConfig.animations.fast,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2]
  }
}));

// 通用分隔线
export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  opacity: theme.palette.mode === 'dark' ? 0.2 : 0.7
}));

// 通用表单字段
export const FormField = ({ label, children, required = false, helperText = null }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" component="label" sx={{ mb: 0.5, display: 'block' }}>
      {label} {required && <span style={{ color: 'error.main' }}>*</span>}
    </Typography>
    {children}
    {helperText && (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {helperText}
      </Typography>
    )}
  </Box>
);

// 通用错误显示
export const ErrorDisplay = ({ message }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 2, 
      bgcolor: 'error.main', 
      color: 'error.contrastText',
      borderRadius: 1,
      mb: 2
    }}
  >
    <Typography variant="body2">{message}</Typography>
  </Paper>
);

// 通用工具提示按钮
export const TooltipIconButton = ({ title, icon, onClick, ...props }) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick} size="small" {...props}>
      {icon}
    </IconButton>
  </Tooltip>
);

// 通用卡片内容
export const CardBody = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

// 通用页面标题
export const PageTitle = ({ title, subtitle, icon, action }) => (
  <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <Box>
      <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
        {icon && <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box>{action}</Box>}
  </Box>
);