/**
 * Analysis Summary Component
 * Displays financial analysis summary following OperationPricing pattern
 */

import { Alert, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';

import type { AnalysisSummaryProps } from '../company-score-tab.types';

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ financialAnalysisData, figoScoreData, loading }) => {
  // Extract data from the first available year
  const analysisItem = financialAnalysisData?.[0];
  const analysis = analysisItem?.Analysis;

  // Show loading skeleton
  if (loading) {
    return (
      <Box sx={{ mb: 4, p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg="auto">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={300} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={120} height={16} />
          </Grid>
          <Grid item xs={12} lg="auto">
            <Skeleton variant="rectangular" width={180} height={120} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="text" width={150} height={16} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Show no data state
  if (!financialAnalysisData || financialAnalysisData.length === 0 || !analysis) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Analiz özeti bulunamadı.
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4, p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 1, border: '1px solid #e0e0e0' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Company Info Section - Left */}
        <Grid item xs={12} lg="auto" sx={{ mr: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            Firma Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {figoScoreData?.CompanyName || '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {figoScoreData?.Identifier || '-'}
          </Typography>
        </Grid>

        {/* Figo Score Card - Right */}
        <Grid item xs={12} lg="auto">
          <Card
            sx={{
              width: '180px',
              backgroundColor: '#f6f8fb',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
            }}>
            {/* Blue header with Figo Score */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                textAlign: 'center',
                borderRadius: '4px 4px 0 0',
              }}>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  display: 'block',
                  py: 0.5,
                  px: 2,
                  borderRadius: '4px 4px 0 0',
                  color: 'white',
                }}>
                Figo Skor
              </Typography>
              <Typography variant="h4" sx={{ py: 2, px: 2, fontWeight: 'bold' }}>
                {figoScoreData?.Score?.toFixed(2) || '-'}
              </Typography>
            </Box>

            {/* Loan Decision Type */}
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  mb: 0.5,
                  lineHeight: 1.2,
                }}>
                <Box component="span" sx={{ mr: 0.5 }}>
                  ⊚
                </Box>
                {figoScoreData?.LoanDecisionTypeDescription || '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info Rows - Matching Legacy */}
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Kredi Modeli: {figoScoreData?.FigoScoreModel || '-'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Finansal Dönem:{' '}
            {figoScoreData?.FinancialDate ? new Date(figoScoreData.FinancialDate).toLocaleDateString('tr-TR') : '-'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
