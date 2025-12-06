import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { formatRevolvingLoanCurrency } from '../helpers';
import type { RevolvingLoanLimitsResponse } from '../revolving-loan-limits.types';

interface RevolvingLoanLimitsResultsProps {
  results: RevolvingLoanLimitsResponse;
  searchedIdentifier: string; // TCKN that was searched for
}

const RevolvingLoanLimitsResults: React.FC<RevolvingLoanLimitsResultsProps> = ({ results, searchedIdentifier }) => {
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rotatif Kredi Limit Bilgileri
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {/* First Row - matches legacy layout exactly */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Finansör Adı
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {results.FinancerName || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Finansör VKN
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {results.FinancerIdentifier || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              TCKN
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {searchedIdentifier || '-'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Faiz Oranı
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {results.InterestRate || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Marj Oranı
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {results.MarginRatio || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Aktif Limit
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatRevolvingLoanCurrency(results.ActiveLimit)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
              Toplam Limit
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatRevolvingLoanCurrency(results.TotalLimit)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RevolvingLoanLimitsResults;
