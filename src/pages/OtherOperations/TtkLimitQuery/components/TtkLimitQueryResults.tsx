import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { formatTtkLimitCurrency } from '../helpers';
import type { TtkLimitQueryResponse } from '../ttk-limit-query.types';

interface TtkLimitQueryResultsProps {
  result: TtkLimitQueryResponse;
  tcknSnapshot: string;
  vknSnapshot: string;
}

const TtkLimitQueryResults: React.FC<TtkLimitQueryResultsProps> = ({ result, tcknSnapshot, vknSnapshot }) => {
  const resultFields = [
    {
      label: 'Şirket Adı',
      value: result?.CompanyName || '-',
    },
    {
      label: 'TCKN',
      value: tcknSnapshot || '-',
    },
    {
      label: 'VKN',
      value: vknSnapshot || '-',
    },
    {
      label: 'Aktif Limit',
      value: formatTtkLimitCurrency(result?.AvailableLimit),
    },
  ];

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Sorgu Sonucu
        </Typography>
        <Grid container spacing={2}>
          {resultFields.map((field) => (
            <Grid item xs={12} sm={6} md={3} key={field.label}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  textTransform: 'uppercase',
                  mb: 0.5,
                }}>
                {field.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: field.label === 'Aktif Limit' ? 600 : 400,
                }}>
                {field.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TtkLimitQueryResults;
