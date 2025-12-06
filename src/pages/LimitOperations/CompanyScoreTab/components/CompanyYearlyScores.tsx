/**
 * Company Yearly Scores Component
 * Displays yearly score data matching legacy design exactly
 * Based on ScoreCompanyYearlyScores.js from legacy system
 */

import { Alert, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';

import type { CompanyScoreInfoProps } from '../company-score-tab.types';
import { useCompanyScoreTabData } from '../hooks';

// Type conversion function from legacy component
const getTypeDescription = (type: number): string => {
  switch (type) {
    case 1:
      return 'Mizan';
    case 2:
      return 'Geçici Beyanname';
    case 3:
      return 'Beyanname';
    case 4:
      return 'eDefter';
    default:
      return 'Tanımsız';
  }
};

// Year Score Card Component matching legacy design
const YearScoreCard: React.FC<{
  year: number;
  score: number;
  periods: Array<{
    Year: number;
    Type: number;
    PeriodQuarter: number | null;
    PeriodMonth: number;
  }>;
}> = ({ year, score, periods }) => (
  <Card
    sx={{
      width: '180px',
      backgroundColor: '#f6f8fb',
      border: '1px solid #e0e0e0',
      borderRadius: 1,
    }}>
    {/* Blue header with year and score */}
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
        {year}
      </Typography>
      <Typography variant="h4" sx={{ py: 2, px: 2, fontWeight: 'bold' }}>
        {score?.toFixed(2)}
      </Typography>
    </Box>

    {/* Period details */}
    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
      {periods?.map((period) => (
        <Typography
          key={`${period.Year}-${period.Type}-${period.PeriodQuarter}-${period.PeriodMonth}`}
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
          {period.Year}
          {period.PeriodQuarter !== null && `/${period.PeriodQuarter}`}
          {period.PeriodMonth !== 0 && period.PeriodMonth !== null && `/${period.PeriodMonth}`}{' '}
          {getTypeDescription(period.Type)}
        </Typography>
      ))}
      {/* Add spacing if only one period */}
      {periods?.length === 1 && <Box sx={{ height: '16px' }} />}
    </CardContent>
  </Card>
);

export const CompanyYearlyScores: React.FC<CompanyScoreInfoProps> = ({ companyId }) => {
  const { figoScoreData, financialAnalysisData, isLoading } = useCompanyScoreTabData(companyId.toString());
  // Show loading skeleton
  if (isLoading) {
    return (
      <Box sx={{ mb: 4, p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg="auto">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={300} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={120} height={16} />
          </Grid>
          <Grid item xs={12} lg="auto">
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={180} height={150} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // If no financial analysis data available, show message
  if (!financialAnalysisData || financialAnalysisData.length === 0) {
    return (
      <Box sx={{ mb: 4, p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 1, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg="auto" sx={{ mr: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
              Firma Bilgileri
            </Typography>
            {figoScoreData ? (
              <>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {figoScoreData.CompanyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {figoScoreData.Identifier}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Firma bilgileri yükleniyor...
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} lg="auto">
            <Alert severity="info">Yıllık skor verileri bulunamadı.</Alert>
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <Box sx={{ mb: 4, p: 4, backgroundColor: 'white', borderRadius: 1, boxShadow: 1, border: '1px solid #e0e0e0' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Company Info Section */}
        <Grid item xs={12} lg="auto" sx={{ mr: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'medium' }}>
            Firma Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {figoScoreData?.CompanyName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {figoScoreData?.Identifier}
          </Typography>
        </Grid>

        {/* Yearly Score Cards */}
        <Grid item xs={12} lg="auto">
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {financialAnalysisData.map((score) => (
              <YearScoreCard
                key={score.Year}
                year={score.Year}
                score={score.Analysis?.Total || 0}
                periods={score.Periods || []}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
