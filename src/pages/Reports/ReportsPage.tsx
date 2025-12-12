import { Box, Typography, useTheme, Grid, Card, CardContent, CardActionArea, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart as BarChartIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

interface ReportCardData {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  badge?: string;
}

const ReportsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const reports: ReportCardData[] = [
    {
      title: 'Satış İstatistikleri',
      description: 'Tüm balık türlerine göre detaylı satış analizi ve istatistikler',
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      path: '/reports/sales',
      color: theme.palette.success.main,
      badge: 'Popüler',
    },
    {
      title: 'Müşteri Satış Raporu',
      description: 'Müşteri bazında satış analizi ve performans takibi',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/reports/customer-sales',
      color: theme.palette.info.main,
    },
    {
      title: 'Kar-Zarar Raporu',
      description: 'Aylık gelir, maliyet ve kar zarar tablosu',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      path: '/reports/profit-loss',
      color: theme.palette.primary.main,
      badge: 'Önemli',
    },
    {
      title: 'Stok Raporu',
      description: 'Tank bazlı stok durumu, değer analizi ve ölüm raporları',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      path: '/reports/stock',
      color: theme.palette.warning.main,
    },
    {
      title: 'Tedarikçi Alış Raporu',
      description: 'Tedarikçi bazlı alış analizi ve karşılaştırma',
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      path: '/reports/supplier-purchases',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Gider Raporu',
      description: 'Kategori bazlı gider analizi ve trend takibi',
      icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
      path: '/reports/expenses',
      color: theme.palette.error.main,
    },
    {
      title: 'Kasa Raporu',
      description: 'Nakit akışı ve kasa bakiye geçmişi',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: '/reports/cash-flow',
      color: theme.palette.success.dark,
    },
    {
      title: 'Bölge Satış Raporu',
      description: 'Şehir ve bölge bazında satış dağılımı analizi',
      icon: <PublicIcon sx={{ fontSize: 40 }} />,
      path: '/reports/region-sales',
      color: theme.palette.info.dark,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.dark?.[800] || '#000', mb: 0.5 }}>
          Raporlar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Detaylı iş analizleri ve raporlar
        </Typography>
      </Box>

      {/* Rapor Kartları */}
      <Grid container spacing={3}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}>
              <CardActionArea onClick={() => navigate(report.path)} sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${report.color}20`,
                          color: report.color,
                        }}>
                        {report.icon}
                      </Box>
                      {report.badge && (
                        <Chip
                          label={report.badge}
                          size="small"
                          color={report.badge === 'Popüler' ? 'success' : 'primary'}
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {report.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {report.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReportsPage;
