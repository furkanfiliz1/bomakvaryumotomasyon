import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import type { EnumData, FigoScoreProFormData } from '../../customer-request-branch-detail.types';
import { getCityName } from '../../helpers';

export interface CompanyInformationProps {
  figoScoreData?: FigoScoreProFormData;
  enumData: EnumData;
  isLoading: boolean;
}

/**
 * Company Information Step Component
 * Displays company basic information matching legacy layout exactly
 */
export const CompanyInformation: React.FC<CompanyInformationProps> = ({ figoScoreData, enumData, isLoading }) => {
  const stepData = figoScoreData?.CompanyInformation;

  // Extract cities from enumData
  const { cities } = enumData;

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Firma bilgileri yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      {/* Company Information Section */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Şirket Bilgileri
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Firma Ünvanı
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.CompanyTitle ? 'normal' : 'italic',
                color: stepData?.CompanyTitle ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.CompanyTitle || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Vergi Numarası
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.TaxNumber ? 'normal' : 'italic',
                color: stepData?.TaxNumber ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.TaxNumber || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Vergi Dairesi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.TaxOffice ? 'normal' : 'italic',
                color: stepData?.TaxOffice ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.TaxOffice || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Vergi Dairesi İli
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.TaxOfficeCity ? 'normal' : 'italic',
                color: stepData?.TaxOfficeCity ? 'inherit' : 'text.secondary',
              }}>
              {getCityName(stepData?.TaxOfficeCity, cities)}
              {/* Debug: {JSON.stringify(stepData?.TaxOfficeCity)} */}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Adres
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.Address ? 'normal' : 'italic',
                color: stepData?.Address ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.Address || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Contact Information Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'bold' }}>
        İletişim Bilgileri
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Telefon Numarası
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.PhoneNumber ? 'normal' : 'italic',
                color: stepData?.PhoneNumber ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.PhoneNumber || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              E-posta Adresi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.Email ? 'normal' : 'italic',
                color: stepData?.Email ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.Email || 'Veri bekleniyor...'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Web Sitesi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: stepData?.WebsiteAddress ? 'normal' : 'italic',
                color: stepData?.WebsiteAddress ? 'inherit' : 'text.secondary',
              }}>
              {stepData?.WebsiteAddress ? (
                <a
                  href={stepData.WebsiteAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit' }}>
                  {stepData.WebsiteAddress}
                </a>
              ) : (
                'Veri bekleniyor...'
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
