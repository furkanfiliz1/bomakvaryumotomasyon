import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { tankService } from '../../../services/tankService';
import { TankStock } from '../../../types/tank';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateStockReport } from '../utils/reportCalculations';
import { StockReportData } from '../types';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

const StockReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [tankStocks, setTankStocks] = useState<TankStock[]>([]);
  const [reportData, setReportData] = useState<StockReportData[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const tankStocksData = await tankService.getAllTankStocks();
      setTankStocks(tankStocksData);
    } catch (error) {
      console.error('Rapor verileri yüklenirken hata:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Rapor verileri yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tankStocks.length > 0) {
      const data = calculateStockReport(tankStocks);
      setReportData(data);
    }
  }, [tankStocks]);

  const totalQuantity = reportData.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = reportData.reduce((sum, item) => sum + item.totalCost, 0);
  const totalEstimatedValue = reportData.reduce((sum, item) => sum + item.estimatedValue, 0);
  const totalPotentialProfit = reportData.reduce((sum, item) => sum + item.potentialProfit, 0);
  const totalDeathCount = reportData.reduce((sum, item) => sum + item.deathCount, 0);
  const totalDeathLoss = reportData.reduce((sum, item) => sum + item.deathLoss, 0);

  const lowStockItems = reportData.filter((item) => item.quantity < 50);
  const ownProductionItems = reportData.filter((item) => item.unitCost === 0);
  const resaleItems = reportData.filter((item) => item.unitCost > 0);

  const handleExport = () => {
    const headers = [
      'Tank',
      'Balık Adı',
      'Kategori',
      'Boy',
      'Adet',
      'Birim Maliyet',
      'Toplam Maliyet',
      'Tahmini Fiyat',
      'Tahmini Değer',
      'Potansiyel Kar',
      'Ölü Sayısı',
      'Ölüm Zararı',
    ];
    const rows = reportData.map((item) => [
      item.tankName,
      item.fishName,
      item.categoryName,
      item.size || '-',
      item.quantity,
      item.unitCost,
      item.totalCost,
      item.estimatedPrice,
      item.estimatedValue,
      item.potentialProfit,
      item.deathCount,
      item.deathLoss,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `stok-raporu-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.dark?.[800] || '#000', mb: 0.5 }}>
            Stok Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tank bazlı stok durumu ve değer analizi
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={reportData.length === 0}>
          CSV İndir
        </Button>
      </Box>

      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Toplam Stok"
            value={`${totalQuantity} adet`}
            subtitle={`${reportData.length} stok kalemi`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard title="Stok Maliyeti" value={totalCost} subtitle="Toplam yatırım" color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Tahmini Değer"
            value={totalEstimatedValue}
            subtitle={`+${formatTurkishCurrency(totalPotentialProfit)} kar`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Balık Ölümü"
            value={`${totalDeathCount} adet`}
            subtitle={`${formatTurkishCurrency(totalDeathLoss)} zarar`}
            color="error"
          />
        </Grid>
      </Grid>

      {/* İkinci Sıra Kartlar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Düşük Stok"
            value={`${lowStockItems.length} ürün`}
            subtitle="50 adetin altında"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Kendi Üretim"
            value={`${ownProductionItems.reduce((s, i) => s + i.quantity, 0)} adet`}
            subtitle={`${ownProductionItems.length} tür`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Al-Sat Balığı"
            value={formatTurkishCurrency(resaleItems.reduce((s, i) => s + i.totalCost, 0))}
            subtitle={`${resaleItems.length} tür`}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Detaylı Tablo */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Detaylı Stok Listesi
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Balık Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Boy
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Adet
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Birim Maliyet
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Maliyet
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Tahmini Fiyat
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Tahmini Değer
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Potansiyel Kar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Ölü
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Ölüm Zararı
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Stok bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.tankName}</TableCell>
                      <TableCell>{item.fishName}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell align="center">{item.size || '-'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.unitCost === 0 ? 'Kendi' : 'Al-Sat'}
                          size="small"
                          color={item.unitCost === 0 ? 'success' : 'info'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={item.quantity < 50 ? 'warning.main' : 'text.primary'}
                          fontWeight={item.quantity < 50 ? 600 : 400}>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.unitCost)}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalCost)}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.estimatedPrice)}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.estimatedValue)}</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={item.potentialProfit > 0 ? 'success.main' : 'text.secondary'}
                          fontWeight={600}>
                          {formatTurkishCurrency(item.potentialProfit)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={item.deathCount > 0 ? 'error.main' : 'text.secondary'}>
                          {item.deathCount}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={item.deathLoss > 0 ? 'error.main' : 'text.secondary'}>
                          {formatTurkishCurrency(item.deathLoss)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockReportPage;
