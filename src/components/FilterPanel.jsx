import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Typography } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { borderRadius, blur, gradients, shadows } from '../styles/constants';

const FilterPanel = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  categories,
  tags,
  clearFilters
}) => {
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Box sx={{
      p: 2,
      borderRadius: borderRadius.md,
      backdropFilter: blur.md,
      background: theme => theme.palette.mode === 'dark' ? gradients.dark.secondary : gradients.light.secondary,
      boxShadow: theme => theme.palette.mode === 'dark'
        ? `${shadows.md} rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)`
        : `${shadows.md} rgba(99, 102, 241, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
      mb: 3
    }}>
      <Typography variant="h6" gutterBottom>过滤选项</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="搜索提示词"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: searchTerm ? (
              <IconButton size="small" onClick={() => setSearchTerm('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : null
          }}
        />
        
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>分类</InputLabel>
          <Select
            value={selectedCategory}
            label="分类"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">全部</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>标签</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              color={selectedTags.includes(tag) ? "primary" : "default"}
              onClick={() => handleTagClick(tag)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>
      
      {(searchTerm || selectedCategory || selectedTags.length > 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={clearFilters} title="清除所有过滤器">
            <ClearIcon /> 清除过滤器
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FilterPanel;