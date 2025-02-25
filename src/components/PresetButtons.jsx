import React from 'react';
import { Box } from '@mui/material';
import { FlexBox, PresetButton } from '../styles/shared.styles';

const PresetButtons = ({ presets, selectedValues, onPresetClick, fieldId }) => {
  const isSelected = (preset) => {
    return Array.isArray(selectedValues)
      ? selectedValues?.includes(preset)
      : selectedValues === preset;
  };

  return (
    <Box
      sx={{
        mt: 1,
        backgroundColor: theme => theme.palette.background.paper,
        borderRadius: 1,
        padding: 1,
        boxShadow: theme => theme.palette.mode === 'dark' 
          ? '0 4px 20px 0 rgba(0,0,0,0.5)'
          : '0 4px 20px 0 rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <FlexBox sx={{ gap: 1, flexWrap: 'wrap' }}>
        {presets.map((preset, index) => (
          <PresetButton
            key={index}
            size="small"
            variant="outlined"
            selected={isSelected(preset)}
            onClick={() => onPresetClick(fieldId, preset)}
          >
            {preset}
          </PresetButton>
        ))}
      </FlexBox>
    </Box>
  );
};

export default PresetButtons;