import React from 'react';
import { Grid, Typography, CardActionArea, CardContent } from '@mui/material';
import { TemplateCard, TruncatedText, ContentPaper } from '../styles/shared.styles';

const TemplateSelector = ({ templates, selectedTemplate, onTemplateChange }) => {
  return (
    <ContentPaper>
      <Typography variant="h6" gutterBottom>
        选择模板
      </Typography>
      <Grid container spacing={1}>
        {Object.entries(templates).map(([key, template]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <TemplateCard 
              selected={selectedTemplate === key}
              onClick={() => onTemplateChange(key)}
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
  );
};

export default TemplateSelector;