import { Paper, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { MonthlyRevenue } from '../dashboard-analytics.types';

interface MonthlyTrendChartProps {
  data: MonthlyRevenue[];
}

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  const months = data.map((d) => d.month);
  const salesData = data.map((d) => d.sales);
  const purchasesData = data.map((d) => d.purchases);
  const expensesData = data.map((d) => d.expenses);
  const profitData = data.map((d) => d.profit);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Aylık Gelir-Gider Trendi
      </Typography>
      <LineChart
        xAxis={[{ scaleType: 'point', data: months }]}
        series={[
          {
            data: salesData,
            label: 'Satışlar',
            color: '#4caf50',
            curve: 'linear',
          },
          {
            data: purchasesData,
            label: 'Alışlar',
            color: '#f44336',
            curve: 'linear',
          },
          {
            data: expensesData,
            label: 'Giderler',
            color: '#ff9800',
            curve: 'linear',
          },
          {
            data: profitData,
            label: 'Kar',
            color: '#2196f3',
            curve: 'linear',
          },
        ]}
        height={300}
        margin={{ left: 70, right: 20, top: 20, bottom: 30 }}
        sx={{
          '& .MuiChartsAxis-tickLabel': {
            fontSize: '0.875rem',
          },
        }}
      />
    </Paper>
  );
};
