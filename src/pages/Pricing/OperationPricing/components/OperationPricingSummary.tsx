import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

interface OperationPricingSummaryData {
  TotalAmount?: number;
  TotalReturnAmount?: number;
  TotalSubAmount?: number;
  TotalDiscountAmount?: number;
  TotalCount?: number;
}

interface OperationPricingSummaryProps {
  data: OperationPricingSummaryData | undefined;
  currencySymbol?: string;
}

export const OperationPricingSummary: React.FC<OperationPricingSummaryProps> = ({ data, currencySymbol = '₺' }) => {
  if (!data) return null;

  const formatCurrency = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalAmount = data.TotalAmount || 0;
  const totalReturnAmount = data.TotalReturnAmount || 0;
  const netAmount = totalAmount - totalReturnAmount;
  const totalTransactions = data.TotalCount || 0;

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: (theme) => theme.palette.grey[50],
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Toplam İşlem Ücreti
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              İade Tutarı
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(totalReturnAmount)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Net Ödenen
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(netAmount)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Toplam İşlem Adedi
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalTransactions.toLocaleString('tr-TR')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
