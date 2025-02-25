import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Grid, Button, Typography, Card, CardContent, Snackbar, Paper, Tab, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ContentPaper, CategoryTabs } from '../styles/PromptGenerator.styles';
import { FlexBox, TemplateCard, TruncatedText } from '../styles/shared.styles';
import { CardActionArea } from '@mui/material';
import { PromptGeneratorSkeleton } from '../components/SkeletonLoader';
import PromptForm from '../components/PromptForm';
import ErrorBoundary from '../components/ErrorBoundary';

function PromptGenerator() {
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

  const handlePresetClick = useCallback((fieldId, value) => {
    setFormData(prev => {
      const currentValue = prev[fieldId] || [];
      const isArray = Array.isArray(currentValue);
      const field = currentFields.find(f => f.id === fieldId);
      
      if (!isArray && field?.multiSelect) {
        return {
          ...prev,
          [fieldId]: currentValue ? [currentValue, value] : [value]
        };
      }
      
      if (isArray) {
        return {
          ...prev,
          [fieldId]: currentValue.includes(value)
            ? currentValue.filter(v => v !== value)
            : [...currentValue, value]
        };
      }
      
      return {
        ...prev,
        [fieldId]: value
      };
    });
  }, [currentFields]);

  const currentTemplateFields = useMemo(() => {
    if (!templates[selectedTemplate]) return [];
    const templateFields = templates[selectedTemplate].fields;
    const categoryFields = categories.find(c => c.id === selectedCategory)?.extraFields || [];
    return [...templateFields, ...categoryFields];
  }, [templates, selectedTemplate, selectedCategory, categories]);

  const handleInputChange = useCallback((field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  useEffect(() => {
    if (!templates[selectedTemplate]) return;
    setCurrentFields(currentTemplateFields);
    
    const newFormData = {};
    const allFieldIds = currentTemplateFields.map(f => f.id);
    Object.keys(formData).forEach(key => {
      if (allFieldIds.includes(key)) {
        newFormData[key] = formData[key];
      }
    });
    setFormData(newFormData);
  }, [currentTemplateFields, formData, templates, selectedTemplate]);

  if (loading) {
    return <PromptGeneratorSkeleton />
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
    <ErrorBoundary>
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
        <PromptForm
          fields={currentFields}
          formData={formData}
          onInputChange={handleInputChange}
          onPresetClick={handlePresetClick}
          selectedCategory={selectedCategory}
          focusedField={focusedField}
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
        />

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
  </ErrorBoundary>
)}

export default PromptGenerator