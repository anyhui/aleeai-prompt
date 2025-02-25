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
              transition: 'all 0.3s ease-in-out'
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
                  transition: 'all 0.3s ease-in-out',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: 1, sm: 1.5 },
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  cursor: 'text',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                      borderWidth: '2px'
                    }
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