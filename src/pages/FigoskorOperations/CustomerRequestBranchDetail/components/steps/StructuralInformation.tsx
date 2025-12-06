import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type { FigoScoreProFormData } from '../../customer-request-branch-detail.types';

export interface StructuralInformationProps {
  figoScoreData?: FigoScoreProFormData;
  isLoading: boolean;
}

/**
 * Structural Information Step Component
 * Displays capital and shareholding structure information matching legacy layout
 */
export const StructuralInformation: React.FC<StructuralInformationProps> = ({ figoScoreData, isLoading }) => {
  const stepData = figoScoreData?.StructuralInformation;

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Veri bekleniyor...';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Veri bekleniyor...';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Yapısal bilgiler yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Capital Information */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Sermaye Bilgileri
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Sermaye
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.Capital ? 'normal' : 'italic',
                color: stepData?.Capital ? 'inherit' : 'text.secondary',
              }}>
              {formatCurrency(stepData?.Capital)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ödenmiş Sermaye
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.PaidCapital ? 'normal' : 'italic',
                color: stepData?.PaidCapital ? 'inherit' : 'text.secondary',
              }}>
              {formatCurrency(stepData?.PaidCapital)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Son Sermaye Artırım Tarihi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.LatestCapitalIncreaseDate ? 'normal' : 'italic',
                color: stepData?.LatestCapitalIncreaseDate ? 'inherit' : 'text.secondary',
              }}>
              {formatDate(stepData?.LatestCapitalIncreaseDate)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Shareholding Structure - Always show */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        Ortaklık Yapısı
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tüzel/Gerçek Ortaklarınız</TableCell>
              <TableCell>Hisse Oranı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stepData?.ShareholdingStructure && stepData.ShareholdingStructure.length > 0 ? (
              stepData.ShareholdingStructure.map((shareholder, index) => (
                <TableRow key={`shareholder-${shareholder.ShareholderTitle}-${shareholder.ShareRatio}-${index}`}>
                  <TableCell>{shareholder.ShareholderTitle}</TableCell>
                  <TableCell>%{shareholder.ShareRatio}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                  Veri bekleniyor...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
