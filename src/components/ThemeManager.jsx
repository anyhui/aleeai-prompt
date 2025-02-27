import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Tooltip, useTheme } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';

const ThemeManager = ({ sx = {}, onThemeChange }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleThemeChange = (themeName) => {
    if (onThemeChange) {
      onThemeChange(themeName);
    }
    handleClose();
  };

  // 获取当前主题名称
  const getCurrentThemeName = () => {
    // 这里可以根据主题的特征来判断当前使用的是哪个主题
    // 简单示例：根据模式判断
    return theme.palette.mode === 'dark' ? 'default' : 'light';
  };
  
  const currentTheme = getCurrentThemeName();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <Tooltip title="选择主题">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('default')}>
          {currentTheme === 'default' && <CheckIcon sx={{ mr: 1 }} />}
          <Box sx={{ ml: currentTheme === 'default' ? 0 : 4 }}>默认主题</Box>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('light')}>
          {currentTheme === 'light' && <CheckIcon sx={{ mr: 1 }} />}
          <Box sx={{ ml: currentTheme === 'light' ? 0 : 4 }}>明亮主题</Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemeManager;