import { Paper, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { TankStock } from '../../../types/tank';

interface TankStockDistributionProps {
  tankStocks: TankStock[];
}

export const TankStockDistribution = ({ tankStocks }: TankStockDistributionProps) => {
  // Balık türü + boy bazlı toplam stok dağılımı
  const fishSizeDistribution = tankStocks.reduce(
    (acc, stock) => {
      const fishName = stock.fishTypeName || 'Bilinmeyen Balık';
      const size = stock.size || 'medium';
      const sizeLabel = size === 'small' ? 'S' : size === 'large' ? 'L' : 'M';
      const key = `${fishName} (${sizeLabel})`;

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += stock.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(fishSizeDistribution)
    .sort(([, a], [, b]) => b - a) // En çok olandan aza sırala
    .slice(0, 10) // İlk 10 tanesini göster
    .map(([name, quantity], index) => ({
      id: index,
      value: quantity,
      label: `${name}: ${quantity} adet`,
    }));

  const totalFish = Object.values(fishSizeDistribution).reduce((sum, qty) => sum + qty, 0);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Balık Türü & Boy Dağılımı
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Toplam {totalFish} balık, {Object.keys(fishSizeDistribution).length} farklı tür/boy kombinasyonu
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
          height={500}
          margin={{ bottom: 170 }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
            },
          }}
        />
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz tank stoğu bulunmuyor
        </Typography>
      )}
    </Paper>
  );
};
