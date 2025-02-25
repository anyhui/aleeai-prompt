import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, Card, CardContent, Snackbar, Paper, Tab } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ContentPaper, CategoryTabs } from '../styles/PromptGenerator.styles';
import { FlexBox, TemplateCard, TruncatedText, PresetButton } from '../styles/shared.styles';
import LoadingScreen from '../components/LoadingScreen';
import TemplateSelector from '../components/TemplateSelector';
import PromptForm from '../components/PromptForm';
import { CardActionArea, FormControl } from '@mui/material';

function PromptGenerator() {
  // 将所有useState声明移到组件顶部
  const [templates, setTemplates] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  const [selectedCategory, setSelectedCategory] = useState('content');
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentFields, setCurrentFields] = useState([]);
  const [currentPresets, setCurrentPresets] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const loadPresets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/presets.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplates(data.templates);
        setCategories(data.categories);
      } catch (error) {
        console.error('Error loading presets:', error);
        setError('加载预设数据失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    loadPresets();
  }, []);

  useEffect(() => {
    if (!templates[selectedTemplate]) return;
    
    const templateFields = templates[selectedTemplate].fields;
    const categoryFields = categories.find(c => c.id === selectedCategory)?.extraFields || [];
    setCurrentFields([...templateFields, ...categoryFields]);
    
    const newFormData = {};
    const allFieldIds = [...templateFields, ...categoryFields].map(f => f.id);
    Object.keys(formData).forEach(key => {
      if (allFieldIds.includes(key)) {
        newFormData[key] = formData[key];
      }
    });
    setFormData(newFormData);
  }, [selectedTemplate, selectedCategory, formData, templates]);

  if (loading) {
    return <LoadingScreen />
  }

  const handlePresetClick = (fieldId, value) => {
    setFormData(prev => {
      const currentValue = prev[fieldId] || [];
      const isArray = Array.isArray(currentValue);
      
      // 如果当前值不是数组，且字段有multiSelect属性，则转换为数组
      if (!isArray && currentFields.find(f => f.id === fieldId)?.multiSelect) {
        return {
          ...prev,
          [fieldId]: currentValue ? [currentValue, value] : [value]
        };
      }
      
      // 如果是数组（多选模式）
      if (isArray) {
        return {
          ...prev,
          [fieldId]: currentValue.includes(value)
            ? currentValue.filter(v => v !== value) // 如果已选中则移除
            : [...currentValue, value] // 如果未选中则添加
        };
      }
      
      // 单选模式，不再自动隐藏预设面板
      return {
        ...prev,
        [fieldId]: value
      };
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setHasGenerated(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setSnackbarOpen(true);
    });
  };

  const generatePrompt = () => {
    let prompt = '';
    const categoryInfo = categories.find(c => c.id === selectedCategory);
    setHasGenerated(true);

    // 从formData中提取并格式化字段值
    const fieldValues = currentFields
      .map(field => {
        const value = formData[field.id];
        if (!value) return null;
        return `${field.label}：${Array.isArray(value) ? value.join('、') : value}`;
      })
      .filter(Boolean)
      .join('\n');

    const promptStructure = [
      '1. 角色与背景',
      '   - 执行角色定位',
      '   - 专业领域要求',
      '   - 知识储备要求',
      '',
      '2. 任务详情',
      '   - 项目背景说明',
      '   - 具体目标定义',
      '   - 关键需求描述',
      '   - 限制条件说明',
      '',
      '3. 目标受众分析',
      '   - 用户画像描述',
      '   - 需求痛点分析',
      '   - 期望价值阐述',
      '   - 使用场景界定',
      '',
      '4. 执行指南',
      '   - 方法论说明',
      '   - 步骤分解',
      '   - 资源配置',
      '   - 时间节点',
      '',
      '5. 输出规范',
      '   - 内容框架',
      '   - 格式要求',
      '   - 语言风格',
      '   - 专业术语规范',
      '',
      '6. 质量标准',
      '   - 完整性要求',
      '   - 准确性标准',
      '   - 专业度评估',
      '   - 实用性衡量',
      '',
      '7. 风险管理',
      '   - 潜在问题识别',
      '   - 预防措施制定',
      '   - 应急方案设计',
      '   - 持续优化机制'
    ];

    prompt = `领域：${categoryInfo.name}

${fieldValues}

===== 提示词框架 =====
${promptStructure.join('\n')}

===== 执行要求 =====
1. 严格遵循角色定位和专业要求
2. 确保输出内容的完整性和逻辑性
3. 使用清晰、专业的语言表达
4. 提供具体、可操作的执行方案
5. 注重实用性和可行性
6. 包含必要的示例和说明
7. 设定明确的评估标准
8. 预留优化和调整空间

===== 质量检查 =====
1. 内容完整度：确保覆盖所有必要环节
2. 专业准确度：术语使用准确、逻辑严密
3. 可执行性：方案具体、步骤清晰
4. 实用价值：解决实际问题、创造实际价值
5. 创新思维：提供创新性的解决方案
6. 风险控制：包含完善的风险防控措施`;
    setGeneratedPrompt(prompt);
  };

  const handleInputFocus = (fieldId) => {
    setFocusedField(fieldId);
  };

  const handleInputBlur = (e) => {
    // 检查点击事件是否发生在预设面板内
    const isClickInPresets = e.relatedTarget && e.currentTarget.contains(e.relatedTarget);
    if (!isClickInPresets) {
      setFocusedField(null);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontSize: { xs: '1.75rem', sm: '2.5rem' },
          fontWeight: 700,
          mb: { xs: 1, sm: 2 },
          background: theme => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          提示词生成器
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 2, sm: 3 },
          color: 'text.secondary',
          maxWidth: '800px'
        }}>
          根据需求自定义生成AI提示词
        </Typography>
      </Box>

      <ContentPaper>
        <Typography variant="h6" gutterBottom>
          选择模板
        </Typography>
        <Grid container spacing={1}>
          {Object.entries(templates).map(([key, template]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <TemplateCard 
                selected={selectedTemplate === key}
                onClick={() => handleTemplateChange(key)}
                sx={{ height: '100%' }}
              >
                <CardActionArea>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '0.9rem', mb: 0.5 }}>{template.name}</Typography>
                    <TruncatedText color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {template.description}
                    </TruncatedText>
                  </CardContent>
                </CardActionArea>
              </TemplateCard>
            </Grid>
          ))}
        </Grid>
      </ContentPaper>

      <Paper sx={{ mb: { xs: 2, sm: 3 }, p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          选择行业分类
        </Typography>
        <CategoryTabs
          value={selectedCategory}
          onChange={(e, newValue) => {
            setSelectedCategory(newValue);
            setHasGenerated(false);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map(category => (
            <Tab
              key={category.id}
              value={category.id}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{category.icon}</Typography>
                  <Typography>{category.name}</Typography>
                </Box>
              }
            />
          ))}
        </CategoryTabs>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {currentFields.map((field, index) => (
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
                onChange={handleInputChange(field.id)}
                onFocus={() => handleInputFocus(field.id)}
                onBlur={handleInputBlur}
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
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    cursor: 'text',
                    '&:hover': {
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                        borderWidth: '2px'
                      }
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    fontWeight: 500
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: { xs: '0.75rem', sm: '1rem' },
                    '&::placeholder': {
                      color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                      opacity: 1
                    }
                  },
                  '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 12px) scale(1)'
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                    color: theme => theme.palette.primary.main,
                    fontWeight: 600
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: 1.5,
                    borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    borderWidth: '1.5px',
                    transition: 'all 0.3s ease-in-out'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme => theme.palette.primary.main,
                    borderWidth: '2px',
                    boxShadow: theme => `0 0 0 3px ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)'}`,
                  }
                }}
              />
              {(field.presets || (field.presetsByCategory && field.presetsByCategory[selectedCategory])) && (
                <Box 
                  sx={{
                    mt: 1,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    opacity: focusedField === field.id ? 1 : 0,
                    visibility: focusedField === field.id ? 'visible' : 'hidden',
                    transform: focusedField === field.id ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                    {(field.presetsByCategory?.[selectedCategory] || field.presets || []).map((preset, index) => (
                      <PresetButton
                        key={index}
                        size="small"
                        variant="outlined"
                        selected={Array.isArray(formData[field.id])
                          ? formData[field.id]?.includes(preset)
                          : formData[field.id] === preset}
                        onClick={() => {
                          handlePresetClick(field.id, preset);
                        }}
                      >
                        {preset}
                      </PresetButton>
                    ))}
                  </FlexBox>
                </Box>
              )}
            </FormControl>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card className="output-card" sx={{ mb: 3, borderRadius: 2, boxShadow: theme => `0 8px 32px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}` }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                生成的提示词
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={generatedPrompt}
                placeholder="在下方填写相关信息后，点击生成按钮获取提示词"
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <FlexBox sx={{ gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCopy}
                  startIcon={<ContentCopyIcon />}
                  disabled={!generatedPrompt}
                >
                  复制提示词
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={generatePrompt}
                  disabled={Object.keys(formData).length === 0}
                >
                  生成提示词
                </Button>
              </FlexBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="提示词已复制到剪贴板"
      />
    </Box>
  )
}

export default PromptGenerator