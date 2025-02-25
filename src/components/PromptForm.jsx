import React from 'react';
import { Grid, FormControl, TextField, Box, useTheme } from '@mui/material';
import PresetButtons from './PresetButtons';

const PromptForm = ({ fields, formData, onInputChange, onPresetClick, focusedField, onInputFocus, onInputBlur, selectedCategory }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      {fields.map((field) => (
        <Grid item xs={12} md={6} key={field.id}>
          <FormControl 
            fullWidth 
            sx={{ 
              mb: field.presets || (field.presetsByCategory && field.presetsByCategory[selectedCategory]) ? 0.5 : 0,
              position: 'relative',
              '& + .MuiFormControl-root': {
                mt: field.presets || (field.presetsByCategory && field.presetsByCategory[selectedCategory]) ? 0.5 : 0
              },
              transition: 'all 0.3s ease-in-out',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <TextField
              fullWidth
              label={field.label}
              placeholder={`请输入${field.label}...`}
              value={formData[field.id] || ''}
              onChange={onInputChange(field.id)}
              onFocus={() => onInputFocus(field.id)}
              onBlur={onInputBlur}
              multiline={field.multiline}
              rows={field.multiline ? 2 : 1}
              required
              InputProps={{
                startAdornment: (
                  <Box sx={{ color: 'text.secondary', mr: 1 }}>
                    ✏️
                  </Box>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: 1.5, sm: 2 },
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'text',
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px'
                    }
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-focused': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            />
            {((field.presets && focusedField === field.id) || 
              (field.presetsByCategory && 
               field.presetsByCategory[selectedCategory] && 
               focusedField === field.id)) && (
              <PresetButtons
                presets={field.presetsByCategory ? field.presetsByCategory[selectedCategory] : field.presets}
                selectedValues={formData[field.id]}
                onPresetClick={onPresetClick}
                fieldId={field.id}
              />
            )}
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
};

export default PromptForm;