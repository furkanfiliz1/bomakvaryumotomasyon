import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { formatCurrency } from '../helpers';

interface LegalProceedingsSummaryProps {
  // Per-page totals
  perPageCompensationAmount: number;
  perPageCollectionAmount: number;
  perPageRemainingCompensationAmount: number;

  // Overall totals
  totalCompensationAmount: number;
  totalCollectionAmount: number;
  totalRemainingCompensationAmount: number;

  // Additional info
  currentPageItemCount: number;
  totalItemCount: number;
}

export const LegalProceedingsSummary: React.FC<LegalProceedingsSummaryProps> = ({
  perPageCompensationAmount,
  perPageCollectionAmount,
  perPageRemainingCompensationAmount,
  totalCompensationAmount,
  totalCollectionAmount,
  totalRemainingCompensationAmount,
  currentPageItemCount,
  totalItemCount,
}) => {
  return (
    <Card sx={{ mt: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          Kanuni Takip İşlemleri Özeti
        </Typography>

        <Grid container spacing={2}>
          {/* Current Page Totals */}
          <Grid item xs={12} md={12}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Sayfa Toplamları ({currentPageItemCount} kayıt)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Sayfa Başı Toplam Tazmin Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="info.main">
                      {formatCurrency(perPageCompensationAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Sayfa Başı Toplam Tahsilat Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatCurrency(perPageCollectionAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Sayfa Başı Toplam Kalan Tazmin Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="warning.main">
                      {formatCurrency(perPageRemainingCompensationAmount)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Overall Totals */}
          <Grid item xs={12} md={12}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="secondary" gutterBottom>
                Genel Toplamlar ({totalItemCount} kayıt)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Genel Toplam Tazmin Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="info.main">
                      {formatCurrency(totalCompensationAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Genel Toplam Tahsilat Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {formatCurrency(totalCollectionAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={1} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="body2" color="text.secondary">
                      Genel Toplam Kalan Tazmin Tutarı
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="warning.main">
                      {formatCurrency(totalRemainingCompensationAmount)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
