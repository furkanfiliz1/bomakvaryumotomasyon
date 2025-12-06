import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import type { EnumData, FigoScoreProFormData } from '../../customer-request-branch-detail.types';
import { getCityName } from '../../helpers';

export interface RegistrationInformationProps {
  figoScoreData?: FigoScoreProFormData;
  enumData: EnumData;
  isLoading: boolean;
}

/**
 * Registration Information Step Component
 * Displays company registration details matching legacy layout
 */
export const RegistrationInformation: React.FC<RegistrationInformationProps> = ({
  figoScoreData,
  enumData,
  isLoading,
}) => {
  const stepData = figoScoreData?.RegistryInformation;

  // Extract cities from enumData
  const { cities } = enumData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Veri bekleniyor...';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Kayıt bilgileri yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Full width address field */}
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ticaret Sicil Gazetesinde Kayıtlı Adres
            </Typography>
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2,
                minHeight: '60px',
                maxHeight: '120px',
                overflow: 'auto',
                fontStyle: stepData?.RegistrationAddress ? 'normal' : 'italic',
                color: stepData?.RegistrationAddress ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.RegistrationAddress || 'Veri bekleniyor...'}
            </Box>
          </Box>
        </Grid>

        {/* Trade register number and Chamber of commerce number */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ticaret Sicil Numarası
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.TradeRegisterNumber ? 'normal' : 'italic',
                color: stepData?.TradeRegisterNumber ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.TradeRegisterNumber || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ticaret Odası Numarası
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.ChamberOfCommerceNumber ? 'normal' : 'italic',
                color: stepData?.ChamberOfCommerceNumber ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.ChamberOfCommerceNumber || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        {/* Registration office and city */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Ticaret Sicil Müdürlüğü
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.RegistrationOffice ? 'normal' : 'italic',
                color: stepData?.RegistrationOffice ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.RegistrationOffice || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Sicil Müdürlüğü İli
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.RegistrationCity ? 'normal' : 'italic',
                color: stepData?.RegistrationCity ? 'inherit' : 'text.secondary',
              }}>
              {getCityName(stepData?.RegistrationCity, cities)}
            </Typography>
          </Box>
        </Grid>

        {/* Registration date and Mersis number */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Sicile Kayıt Tarihi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.RegistrationDate ? 'normal' : 'italic',
                color: stepData?.RegistrationDate ? 'inherit' : 'text.secondary',
              }}>
              {formatDate(stepData?.RegistrationDate)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Mersis Numarası
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontStyle: stepData?.MersisNumber ? 'normal' : 'italic',
                color: stepData?.MersisNumber ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.MersisNumber || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
