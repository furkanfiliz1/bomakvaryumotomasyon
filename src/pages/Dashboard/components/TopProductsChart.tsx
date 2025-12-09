import { Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { TopProduct } from '../dashboard-analytics.types';

interface TopProductsChartProps {
  data: TopProduct[];
}

export const TopProductsChart = ({ data }: TopProductsChartProps) => {
  const products = data.map((p) => p.name);
  const quantities = data.map((p) => p.quantity);
  const revenues = data.map((p) => p.revenue);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        En Çok Satan Ürünler
      </Typography>
      {data.length > 0 ? (
        <BarChart
          xAxis={[{ scaleType: 'band', data: products }]}
          series={[
            { data: quantities, label: 'Adet', color: '#2196f3' },
            { data: revenues, label: 'Gelir (₺)', color: '#4caf50' },
          ]}
          height={300}
          margin={{ left: 70, right: 20, top: 20, bottom: 80 }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 0,
            },
          }}
          sx={{
            '& .MuiChartsAxis-tickLabel': {
              fontSize: '0.75rem',
            },
          }}
        />
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz satış bulunmuyor
        </Typography>
      )}
    </Paper>
  );
};
