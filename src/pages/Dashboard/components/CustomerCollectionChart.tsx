import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { CustomerCollectionSummary } from '../dashboard-analytics.types';
import { formatTurkishCurrency } from '../../../utils/currency';

interface CustomerCollectionChartProps {
  data: CustomerCollectionSummary[];
}

export const CustomerCollectionChart = ({ data }: CustomerCollectionChartProps) => {
  const topCustomers = data.slice(0, 10);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Müşteri Bazlı Tahsilat Durumu
      </Typography>
      {topCustomers.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz tahsilat bulunmuyor
        </Typography>
      ) : (
        <Box>
          {topCustomers.map((customer, index) => (
            <Box
              key={customer.customerId}
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: index < topCustomers.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {customer.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  %{customer.collectionRate.toFixed(1)} tahsil edildi
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(customer.collectionRate, 100)}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      customer.collectionRate >= 80
                        ? 'success.main'
                        : customer.collectionRate >= 50
                          ? 'warning.main'
                          : 'error.main',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Toplam: {formatTurkishCurrency(customer.totalSales)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Kalan: {formatTurkishCurrency(customer.remaining)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
