import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { Tank, TankStock } from '../../../types/tank';
import WaterIcon from '@mui/icons-material/Water';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatTurkishCurrency } from '@utils';

interface TankOverviewProps {
  tanks: Tank[];
  tankStocks: TankStock[];
}

export const TankOverview = ({ tanks, tankStocks }: TankOverviewProps) => {
  // Tank başına toplam balık sayısını hesapla
  const getTankData = () => {
    return tanks.map((tank) => {
      const stocks = tankStocks.filter((s) => s.tankId === tank.id);
      const totalFish = stocks.reduce((sum, s) => sum + s.quantity, 0);
      const fishTypes = stocks.length;
      const estimatedValue = stocks.reduce((sum, s) => sum + s.quantity * (s.estimatedPrice || 0), 0);

      return {
        ...tank,
        totalFish,
        fishTypes,
        estimatedValue,
        stocks,
      };
    });
  };

  const tankData = getTankData();
  const activeTanks = tankData.filter((t) => t.isActive);
  const totalFishInAllTanks = tankData.reduce((sum, t) => sum + t.totalFish, 0);
  const totalEstimatedValue = tankData.reduce((sum, t) => sum + t.estimatedValue, 0);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WaterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tank Durumu
          </Typography>
        </Box>
        <Chip label={`${activeTanks.length} Aktif Tank`} color="primary" size="small" variant="outlined" />
      </Box>

      {tankData.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz tank bulunmuyor
        </Typography>
      ) : (
        <Box>
          {/* Genel Özet */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200',
            }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Toplam Balık
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalFishInAllTanks}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Aktif Tank
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {activeTanks.length}/{tanks.length}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Tahmini Satış Değeri
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {formatTurkishCurrency(totalEstimatedValue)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Tank Listesi */}
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {tankData
              .filter((tank) => tank.totalFish > 0)
              .map((tank) => {
                return (
                  <Box
                    key={tank.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateX(4px)',
                      },
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {tank.name}
                        </Typography>
                        <Chip label={tank.code} size="small" variant="outlined" />
                      </Box>
                      {!tank.isActive && (
                        <Chip label="Pasif" size="small" color="default" icon={<WarningAmberIcon />} />
                      )}
                    </Box>

                    <Grid container spacing={1} sx={{ mb: 1.5 }}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Toplam Balık
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tank.totalFish} adet
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Balık Türü
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tank.fishTypes} tür
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Tahmini Değer
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                          {formatTurkishCurrency(tank.estimatedValue)}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* En çok bulunan 3 balık türü */}
                    {tank.stocks.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          En Çok Bulunan Türler:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {tank.stocks
                            .sort((a, b) => b.quantity - a.quantity)
                            .slice(0, 3)
                            .map((stock) => (
                              <Chip
                                key={stock.id}
                                label={`${stock.fishTypeName} (${stock.size === 'small' ? 'S' : stock.size === 'large' ? 'L' : 'M'}): ${stock.quantity}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
