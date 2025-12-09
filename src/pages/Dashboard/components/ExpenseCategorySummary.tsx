import { Box, Paper, Typography, Grid, Card, CardContent, useTheme, alpha } from '@mui/material';
import { CategoryExpense } from '../dashboard-analytics.types';
import HomeIcon from '@mui/icons-material/Home';
import BoltIcon from '@mui/icons-material/Bolt';
import SetMealIcon from '@mui/icons-material/SetMeal';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface ExpenseCategorySummaryProps {
  data: CategoryExpense[];
}

export const ExpenseCategorySummary = ({ data }: ExpenseCategorySummaryProps) => {
  const theme = useTheme();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kira':
        return <HomeIcon sx={{ fontSize: 32 }} />;
      case 'elektrik':
        return <BoltIcon sx={{ fontSize: 32 }} />;
      case 'yem':
        return <SetMealIcon sx={{ fontSize: 32 }} />;
      case 'malzeme':
        return <BuildIcon sx={{ fontSize: 32 }} />;
      case 'kargo':
        return <LocalShippingIcon sx={{ fontSize: 32 }} />;
      default:
        return <MoreHorizIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.primary.main,
    ];
    return colors[index % colors.length];
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // İlk 4 kategoriyi al, eğer 4'ten az varsa hepsini göster
  const topCategories = data.slice(0, 4);

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Kategori Bazlı Gider Özeti
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz gider bulunmuyor
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Kategori Bazlı Gider Özeti
        </Typography>
        <Typography variant="body2" color="text.secondary">
          En yüksek gider kategorileri
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {topCategories.map((item, index) => {
          const color = getCategoryColor(index);
          return (
            <Grid item xs={12} sm={6} key={item.category}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(color, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(color, 0.2)}`,
                  },
                }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: alpha(color, 0.15),
                        color: color,
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {getCategoryIcon(item.category)}
                    </Box>
                    <Box
                      sx={{
                        bgcolor: alpha(color, 0.15),
                        color: color,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}>
                      %{item.percentage.toFixed(1)}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {item.category}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: color }}>
                    ₺{item.amount.toFixed(2)}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1.5,
                      height: 4,
                      bgcolor: alpha(color, 0.15),
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        bgcolor: color,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Toplam Gider */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Toplam Gider
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            ₺{totalAmount.toFixed(2)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {data.length} farklı kategori
        </Typography>
      </Box>
    </Paper>
  );
};
