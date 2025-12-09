import { Box, Paper, Typography, LinearProgress, Grid, Chip } from '@mui/material';
import { Tank, TankStock } from '../../../types/tank';
import WaterIcon from '@mui/icons-material/Water';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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

      return {
        ...tank,
        totalFish,
        fishTypes,
        stocks,
      };
    });
  };

  const tankData = getTankData();
  const activeTanks = tankData.filter((t) => t.isActive);
  const totalFishInAllTanks = tankData.reduce((sum, t) => sum + t.totalFish, 0);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WaterIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tank Durumu
          </Typography>
        </Box>
        <Chip
          label={`${activeTanks.length} Aktif Tank`}
          color="primary"
          size="small"
          variant="outlined"
        />
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
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Toplam Balık
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalFishInAllTanks}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Aktif Tank
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {activeTanks.length}/{tanks.length}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Tank Listesi */}
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {tankData.map((tank) => {
              const utilizationPercent = tank.totalFish > 0 ? Math.min((tank.totalFish / 1000) * 100, 100) : 0;
              const isLow = utilizationPercent < 30;
              const isMedium = utilizationPercent >= 30 && utilizationPercent < 70;

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
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Toplam Balık
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {tank.totalFish} adet
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Balık Türü
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {tank.fishTypes} tür
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Doluluk Oranı
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {utilizationPercent.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={utilizationPercent}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isLow ? 'info.main' : isMedium ? 'warning.main' : 'success.main',
                        },
                      }}
                    />
                  </Box>

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
                              label={`${stock.fishTypeName}: ${stock.quantity}`}
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
