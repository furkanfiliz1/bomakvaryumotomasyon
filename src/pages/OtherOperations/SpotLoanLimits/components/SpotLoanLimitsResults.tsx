import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import { formatSpotLoanCurrency } from '../helpers';
import type { SpotLoanLimitsResponse } from '../spot-loan-limits.types';

interface SpotLoanLimitsResultsProps {
  result: SpotLoanLimitsResponse;
  tcknSnapshot: string;
  vknSnapshot: string;
}

const SpotLoanLimitsResults: React.FC<SpotLoanLimitsResultsProps> = ({ result, tcknSnapshot, vknSnapshot }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sonuç
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="caption" color="textSecondary" display="block">
                Şirket Adı
              </Typography>
              <Typography variant="body1">{result.CompanyName || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary" display="block">
                TCKN
              </Typography>
              <Typography variant="body1">{tcknSnapshot || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary" display="block">
                VKN
              </Typography>
              <Typography variant="body1">{vknSnapshot || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary" display="block">
                Aktif Limit
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatSpotLoanCurrency(result.AvailableLimit)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" color="textSecondary" display="block">
                Maksimum Vade
              </Typography>
              <Typography variant="body1">{result.MaxTerm ? `${result.MaxTerm} ay` : '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default SpotLoanLimitsResults;
