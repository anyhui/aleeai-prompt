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
  const [selectedCategory, setSelectedCategory] = useState('general');
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
        const [presetsResponse, templatesResponse] = await Promise.all([
          fetch('/presets.json'),
          fetch('/output_templates.json')
        ]);
        if (!presetsResponse.ok || !templatesResponse.ok) {
          throw new Error(`HTTP error! status: ${presetsResponse.status || templatesResponse.status}`);
        }
        const [presetsData, templatesData] = await Promise.all([
          presetsResponse.json(),
          templatesResponse.json()
        ]);
        setTemplates(presetsData.templates);
        setCategories(presetsData.categories);
        window.outputTemplates = templatesData; // 存储模板数据
      } catch (error) {
        console.error('Error loading data:', error);
        setError('加载数据失败，请刷新页面重试');
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
    const categoryInfo = categories.find(c => c.id === selectedCategory) || { name: '未知领域' };
    setHasGenerated(true);

    // 获取选定模板的输出格式
    const templateData = window.outputTemplates?.templates?.[selectedTemplate];
    if (!templateData) {
      setError('模板数据加载失败');
      return;
    }

    // 如果是基础框架模式，需要根据行业选择具体模板
    let template = templateData.template;
    if (selectedTemplate === 'basic' && templateData.templates) {
      // 根据行业选择对应的子模板
      const industry = categoryInfo.name;
      
      // 计算每个模板与当前行业的匹配度
      const templateMatches = Object.entries(templateData.templates).map(([key, tmpl]) => {
        const matchScore = tmpl.industries.reduce((score, i) => {
          if (i.toLowerCase() === industry.toLowerCase()) return score + 3;
          if (industry.toLowerCase().includes(i.toLowerCase())) return score + 2;
          if (i.toLowerCase().includes(industry.toLowerCase())) return score + 1;
          return score;
        }, 0);
        return { key, score: matchScore, template: tmpl };
      });
      
      // 选择匹配度最高的模板
      const bestMatch = templateMatches.reduce((best, current) => 
        current.score > best.score ? current : best
      , { score: -1 });
      
      if (bestMatch.score > 0) {
        template = bestMatch.template.template;
      } else {
        // 如果没有找到匹配的模板，根据行业特征选择最适合的模板
        const industryKeywords = {
          tech: ['技术', '开发', '工程', '系统', '数据'],
          business: ['商业', '管理', '营销', '战略'],
          creative: ['设计', '创意', '广告', '品牌'],
          healthcare: ['医疗', '健康', '临床', '诊断'],
          education: ['教育', '培训', '学习', '教学']
        };
        
        const defaultTemplate = Object.entries(industryKeywords).reduce((selected, [type, keywords]) => {
          const matchCount = keywords.filter(keyword => 
            industry.toLowerCase().includes(keyword.toLowerCase())
          ).length;
          return matchCount > selected.count ? { type, count: matchCount } : selected;
        }, { type: 'tech', count: 0 });
        
        template = templateData.templates[defaultTemplate.type].template;
      }
    }
    // 创建字段值映射
    const fieldMap = {};
    const requiredFields = new Set();
    const missingFields = [];

    // 收集必填字段
    currentFields.forEach(field => {
      if (field.required) {
        requiredFields.add(field.id);
      }
    });

    // 处理字段值
    currentFields.forEach(field => {
      const value = formData[field.id];
      if (value !== undefined && value !== '') {
        // 处理数组类型的值
        fieldMap[field.id] = Array.isArray(value) ? 
          value.map(v => v.trim()).filter(v => v).join('、') : 
          value.trim();
      } else if (requiredFields.has(field.id)) {
        missingFields.push(field.label || field.id);
      }
    });

    // 检查必填字段
    if (missingFields.length > 0) {
      setError(`请填写以下必填字段：${missingFields.join('、')}`);
      return;
    }

    // 添加行业信息
    fieldMap.industry = categoryInfo.name;

    let prompt = template;

    // 替换模板中的占位符
    Object.entries(fieldMap).forEach(([key, value]) => {
      const placeholder = new RegExp(`\{${key}\}`, 'g');
      prompt = prompt.replace(placeholder, value || '');
    });

    // 处理未替换的占位符
    const remainingPlaceholders = prompt.match(/\{[^}]+\}/g);
    if (remainingPlaceholders) {
      remainingPlaceholders.forEach(placeholder => {
        const key = placeholder.slice(1, -1);
        prompt = prompt.replace(new RegExp(placeholder, 'g'), `[${key}]`);
      });
    }

    // 优化格式
    prompt = prompt
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n\n');

    setGeneratedPrompt(prompt);
    setError(null); // 清除之前的错误信息
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
            <Grid item xs={6} sm={6} md={4} key={key}>
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
          // variant="scrollable"
          // scrollButtons="auto"
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
        <Grid item xs={6} md={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: theme => `0 8px 32px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}` }}>
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
          </Paper>
        </Grid>
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
        autoHideDuration={500}
        onClose={() => setSnackbarOpen(false)}
        message="提示词已复制到剪贴板"
      />
    </Box>
  </ErrorBoundary>
)}

export default PromptGenerator