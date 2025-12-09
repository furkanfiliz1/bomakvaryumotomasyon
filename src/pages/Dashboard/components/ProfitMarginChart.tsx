import { Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { ProfitMargin } from '../dashboard-analytics.types';

interface ProfitMarginChartProps {
  data: ProfitMargin[];
}

export const ProfitMarginChart = ({ data }: ProfitMarginChartProps) => {
  const months = data.map((d) => d.period);
  const revenues = data.map((d) => d.revenue);
  const costs = data.map((d) => d.cost);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Aylık Kar Marjı Analizi
      </Typography>
      <BarChart
        xAxis={[{ scaleType: 'band', data: months }]}
        series={[
          { data: revenues, label: 'Gelir', color: '#4caf50', stack: 'total' },
          { data: costs, label: 'Maliyet', color: '#f44336', stack: 'total' },
        ]}
        height={300}
        margin={{ left: 70, right: 20, top: 20, bottom: 30 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        Ortalama Kar Marjı:{' '}
        <strong>{data.length > 0 ? (data.reduce((sum, d) => sum + d.margin, 0) / data.length).toFixed(1) : 0}%</strong>
      </Typography>
    </Paper>
  );
};
