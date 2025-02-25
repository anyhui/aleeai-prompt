import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

export const PromptGeneratorSkeleton = () => (
  <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 } }}>
    <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
    
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="20%" height={30} sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>

    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="20%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
    </Box>

    <Grid container spacing={2}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} md={6} key={item}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export const PromptLibrarySkeleton = () => (
  <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 4 } }}>
    <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
    
    <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
      ))}
    </Box>

    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                {[1, 2].map((tag) => (
                  <Skeleton key={tag} variant="rectangular" width={60} height={24} sx={{ borderRadius: 16 }} />
                ))}
              </Box>
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);