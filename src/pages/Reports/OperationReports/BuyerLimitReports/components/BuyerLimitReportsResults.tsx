import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import React from 'react';
import type { BuyerLimitReportItem } from '../buyer-limit-reports.types';

interface BuyerLimitReportsResultsProps {
  data: BuyerLimitReportItem | null;
  isLoading?: boolean;
  error?: unknown;
}

export const BuyerLimitReportsResults: React.FC<BuyerLimitReportsResultsProps> = ({
  data,
  isLoading = false,
  error,
}) => {
  // Handle error state
  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error" align="center">
            Veri yüklenirken bir hata oluştu.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state - matching legacy "lang.allowanceReportAllowances.noResult"
  if (!isLoading && !data) {
    return (
      <Box sx={{ p: 5, border: '1px solid #e0e0e0', bgcolor: 'grey.100', borderRadius: 1, textAlign: 'center' }}>
        <Typography color="text.secondary">Sonuç bulunamadı.</Typography>
      </Box>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="text.secondary">
            Yükleniyor...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Display results - single line layout
  if (data) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Company Name Column */}
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Alıcı
                </Typography>
                <Typography variant="body2">{data.CompanyName || '-'}</Typography>
              </Box>
            </Grid>

            {/* Available Limit Column */}
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Kullanılabilir
                </Typography>
                <Typography variant="body2">{currencyFormatter(data.AvailableLimit || 0, 'TRY')}</Typography>
              </Box>
            </Grid>

            {/* Used Limit Column */}
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Kullanılan
                </Typography>
                <Typography variant="body2">{currencyFormatter(data.UsedLimit || 0, 'TRY')}</Typography>
              </Box>
            </Grid>

            {/* Total Limit Column */}
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Toplam
                </Typography>
                <Typography variant="body2">{currencyFormatter(data.TotalLimit || 0, 'TRY')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return null;
};
