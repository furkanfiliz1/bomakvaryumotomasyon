import { Paper, Typography, Box, useTheme, alpha, Card, Stack, Chip } from '@mui/material';
import { TopProduct } from '../dashboard-analytics.types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatTurkishCurrency } from '../../../utils/currency';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface TopFishSalesListProps {
  data: TopProduct[];
}

export const TopFishSalesList = ({ data }: TopFishSalesListProps) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Henüz satış verisi bulunmamaktadır</Typography>
      </Paper>
    );
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return theme.palette.primary.main;
    }
  };

  const getRankGradient = (index: number) => {
    switch (index) {
      case 0:
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
      case 1:
        return 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)';
      case 2:
        return 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)';
      default:
        return `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(
          theme.palette.primary.dark,
          0.9,
        )} 100%)`;
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(
          theme.palette.primary.main,
          0.05,
        )} 100%)`,
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            mr: { xs: 1, sm: 2 },
          }}>
          <TrendingUpIcon sx={{ color: 'white', fontSize: { xs: 24, sm: 28 } }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.dark?.[800] || '#000',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}>
            En Çok Satılan Balıklar
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Adet, fiyat ve toplam satış bilgileri
          </Typography>
        </Box>
      </Box>

      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        {data.map((product, index) => (
          <Card
            key={product.id}
            sx={{
              background: 'white',
              borderRadius: 2,
              p: { xs: 2, sm: 2.5 },
              transition: 'all 0.3s ease',
              border: `2px solid ${alpha(getRankColor(index), 0.2)}`,
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: `0 4px 20px ${alpha(getRankColor(index), 0.25)}`,
                borderColor: getRankColor(index),
              },
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
              {/* Rank Badge */}
              <Box
                sx={{
                  minWidth: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: '12px',
                  background: getRankGradient(index),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(getRankColor(index), 0.3)}`,
                }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}>
                  #{index + 1}
                </Typography>
              </Box>

              {/* Fish Name */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: index < 3 ? 700 : 600,
                      color: theme.palette.dark?.[800],
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.3,
                    }}>
                    {product.name}
                  </Typography>
                  <Chip
                    icon={product.saleType === 'own-production' ? <AutoAwesomeIcon /> : <SwapHorizIcon />}
                    label={product.saleType === 'own-production' ? 'Kendi Üretim' : 'Al-Sat'}
                    size="small"
                    sx={{
                      backgroundColor:
                        product.saleType === 'own-production'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.info.main, 0.1),
                      color:
                        product.saleType === 'own-production' ? theme.palette.success.dark : theme.palette.info.dark,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-icon': {
                        fontSize: 14,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3, md: 4 },
                  flexWrap: 'wrap',
                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                }}>
                {/* Quantity */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 100, sm: 120 } }}>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                    }}>
                    <InventoryIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: theme.palette.info.main }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      Adet
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.info.main,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      }}>
                      {product.quantity.toLocaleString('tr-TR')}
                    </Typography>
                  </Box>
                </Box>

                {/* Average Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 100, sm: 120 } }}>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    }}>
                    <ShowChartIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: theme.palette.warning.main }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      Ort. Fiyat
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.dark?.[700],
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      }}>
                      {formatTurkishCurrency(product.averagePrice)}
                    </Typography>
                  </Box>
                </Box>

                {/* Total Amount */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 120, sm: 140 } }}>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                    }}>
                    <AttachMoneyIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: theme.palette.success.main }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      Toplam
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.success.main,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                      }}>
                      {formatTurkishCurrency(product.totalAmount)}
                    </Typography>
                  </Box>
                </Box>

                {/* Total Profit */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 120, sm: 140 } }}>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.success.dark, 0.1),
                    }}>
                    <TrendingUpIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: theme.palette.success.dark }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      Toplam Kar
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.success.dark,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                      }}>
                      {formatTurkishCurrency(product.totalProfit)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Summary Footer */}
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: `2px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Toplam {data.length} ürün
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: theme.palette.success.main,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}>
            {formatTurkishCurrency(data.reduce((sum, product) => sum + product.totalAmount, 0))}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
