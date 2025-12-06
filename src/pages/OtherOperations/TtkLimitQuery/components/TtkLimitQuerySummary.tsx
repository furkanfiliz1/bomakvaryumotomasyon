import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import type { TtkLimitStats } from '../ttk-limit-query.types';

interface TtkLimitQuerySummaryProps {
  stats: TtkLimitStats | null;
}

const TtkLimitQuerySummary: React.FC<TtkLimitQuerySummaryProps> = ({ stats }) => {
  const summaryCards = [
    {
      title: 'Toplam Sorgu Sayısı',
      value: stats?.TotalCount ?? 0,
    },
    {
      title: 'Firma Başı Sorgu Sayısı',
      value: stats?.CompanyQueryCount ?? 0,
    },
    {
      title: 'Şahış Şirketi Sorgu Sayısı',
      value: stats?.TCKNQueryCount ?? 0,
    },
    {
      title: 'Tüzel Şirket Sorgu Sayısı',
      value: stats?.VKNQueryCount ?? 0,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {summaryCards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Card sx={{ height: '100%', minHeight: '140px' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
              }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  minHeight: '45px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {card.title}
              </Typography>
              <Typography
                variant="h3"
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: '2rem',
                }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TtkLimitQuerySummary;
