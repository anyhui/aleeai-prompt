import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { transitions, borderRadius, blur, gradients, shadows } from '../styles/constants';

const StatsCards = ({ stats }) => {
  // 确保stats对象存在且elapsedTime为数字
  const elapsedTime = typeof stats?.elapsedTime === 'number' ? stats.elapsedTime : 0;

  // 根据不同模型设置不同的费率
  const getModelRate = (model) => {
    const rates = {
      'deepseek-ai/DeepSeek-V3': {
        input: 5/1000000,
        output: 15/1000000
      },
      'deepseek-ai/DeepSeek-R1': {
        input: 0.15/1000000,
        output: 0.6/1000000
      },
      'gpt-4': {
        input: 0.03/1000,
        output: 0.06/1000
      },
      'gpt-4-1106-preview': {
        input: 0.01/1000,
        output: 0.03/1000
      },
      'gpt-3.5-turbo': {
        input: 0.001/1000,
        output: 0.002/1000
      }
    };
    return rates[model] || { input: 0.00002, output: 0.00002 };
  };

  const calculateCost = () => {
    if (!stats || typeof stats.promptTokens !== 'number' || typeof stats.completionTokens !== 'number') {
      return '0.0000';
    }
    const rates = getModelRate(stats.model);
    const cost = (stats.promptTokens * rates.input) + (stats.completionTokens * rates.output);
    return cost.toFixed(4);
  };

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
    },
    {
      title: '预计成本',
      value: `$${calculateCost()}`,
      description: '基于令牌数量的估算成本'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
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