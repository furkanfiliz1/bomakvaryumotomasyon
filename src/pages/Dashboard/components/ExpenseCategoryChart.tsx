import { Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { CategoryExpense } from '../dashboard-analytics.types';

interface ExpenseCategoryChartProps {
  data: CategoryExpense[];
}

export const ExpenseCategoryChart = ({ data }: ExpenseCategoryChartProps) => {
  const chartData = data.map((item, index) => ({
    id: index,
    value: item.amount,
    label: `${item.category} (${item.percentage.toFixed(1)}%)`,
  }));

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Gider Kategorileri Dağılımı
      </Typography>
      {chartData.length > 0 ? (
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={300}
          margin={{ right: 200 }}
          slotProps={{
            legend: {
              direction: 'column',
              position: { vertical: 'middle', horizontal: 'right' },
              padding: 0,
            },
          }}
        />
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz gider bulunmuyor
        </Typography>
      )}
    </Paper>
  );
};
