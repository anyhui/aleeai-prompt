import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { transitions, borderRadius, blur, gradients, shadows } from '../styles/constants';

const StatsCards = ({ stats }) => {
  // 确保stats对象存在且elapsedTime为数字
  const elapsedTime = typeof stats?.elapsedTime === 'number' ? stats.elapsedTime : 0;

  const cards = [
    {
      title: '执行时间',
      value: `${elapsedTime.toFixed(2)}秒`,
      description: '优化过程耗时'
    },
    {
      title: '提示词令牌数',
      value: stats.promptTokens,
      description: '输入提示词的令牌数量'
    },
    {
      title: '完成令牌数',
      value: stats.completionTokens,
      description: '生成结果的令牌数量'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={4} md={4} key={index}>
          <Card
            sx={{
              height: '100%',
              background: gradients.card,
              backdropFilter: blur.light,
              transition: transitions.default,
              borderRadius: borderRadius.medium,
              boxShadow: shadows.card,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: shadows.cardHover
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;
