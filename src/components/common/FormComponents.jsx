/**
 * 通用表单组件库
 * 提供可复用的表单组件，实现表单功能组件化
 */
import React, { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Switch,
  Autocomplete,
  Box,
  Chip,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PresetButtons from '../PresetButtons';
import { FormField } from './CommonComponents';

// 样式化的表单控件容器
const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '100%'
}));

/**
 * 通用文本输入组件
 */
export const TextInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  helperText, 
  error, 
  required = false,
  multiline = false,
  rows = 1,
  fullWidth = true,
  ...props 
}) => (
  <FormField label={label} required={required} helperText={helperText}>
    <TextField
      id={id}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      required={required}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      {...props}
    />
  </FormField>
);

/**
 * 通用选择器组件
 */
export const SelectInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options = [], 
  helperText, 
  error, 
  required = false,
  fullWidth = true,
  ...props 
}) => (
  <FormField label={label} required={required}>
    <FormControl fullWidth={fullWidth} error={error} size="small">
      <Select
        id={id}
        value={value || ''}
        onChange={onChange}
        displayEmpty
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  </FormField>
);

/**
 * 通用复选框组件
 */
export const CheckboxInput = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  helperText,
  ...props 
}) => (
  <FormControlLabel
    control={
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        {...props}
      />
    }
    label={label}
  />
);

/**
 * 通用单选按钮组组件
 */
export const RadioGroupInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options = [], 
  helperText,
  row = false,
  ...props 
}) => (
  <FormField label={label}>
    <RadioGroup
      id={id}
      value={value || ''}
      onChange={onChange}
      row={row}
      {...props}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio />}
          label={option.label}
        />
      ))}
    </RadioGroup>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormField>
);

/**
 * 通用滑块组件
 */
export const SliderInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  marks = false,
  valueLabelDisplay = 'auto',
  helperText,
  ...props 
}) => (
  <FormField label={label}>
    <Slider
      id={id}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      marks={marks}
      valueLabelDisplay={valueLabelDisplay}
      {...props}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormField>
);

/**
 * 通用开关组件
 */
export const SwitchInput = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  helperText,
  ...props 
}) => (
  <FormControlLabel
    control={
      <Switch
        id={id}
        checked={checked}
        onChange={onChange}
        {...props}
      />
    }
    label={label}
  />
);

/**
 * 通用自动完成组件
 */
export const AutocompleteInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options = [], 
  helperText, 
  error,
  required = false,
  multiple = false,
  freeSolo = false,
  ...props 
}) => (
  <FormField label={label} required={required}>
    <Autocomplete
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      multiple={multiple}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <TextField 
          {...params} 
          error={error}
          helperText={helperText}
          size="small"
          fullWidth
        />
      )}
      {...props}
    />
  </FormField>
);

/**
 * 带预设按钮的输入组件
 */
export const PresetInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  presets = [], 
  onPresetClick,
  helperText,
  error,
  required = false,
  multiline = false,
  rows = 1,
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <FormField label={label} required={required} helperText={helperText}>
      <TextField
        id={id}
        value={value || ''}
        onChange={onChange}
        error={error}
        required={required}
        multiline={multiline}
        rows={rows}
        fullWidth
        variant="outlined"
        size="small"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        {...props}
      />
      {focused && presets.length > 0 && (
        <PresetButtons
          presets={presets}
          selectedValues={value}
          onPresetClick={onPresetClick}
          fieldId={id}
        />
      )}
    </FormField>
  );
};

/**
 * 标签输入组件
 */
export const TagInput = ({ 
  id, 
  label, 
  value = [], 
  onChange, 
  helperText,
  error,
  required = false,
  ...props 
}) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      if (!value.includes(inputValue.trim())) {
        const newValue = [...value, inputValue.trim()];
        onChange(newValue);
      }
      setInputValue('');
    }
  };
  
  const handleDelete = (tagToDelete) => {
    const newValue = value.filter(tag => tag !== tagToDelete);
    onChange(newValue);
  };
  
  return (
    <FormField label={label} required={required} helperText={helperText}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入标签并按回车添加"
          error={error}
          fullWidth
          variant="outlined"
          size="small"
          {...props}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {value.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDelete(tag)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    </FormField>
  );
};

/**
 * 表单分组组件
 */
export const FormGroup = ({ title, children, ...props }) => (
  <Box sx={{ mb: 3 }} {...props}>
    {title && (
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
    )}
    <Box sx={{ pl: title ? 2 : 0 }}>
      {children}
    </Box>
  </Box>
);