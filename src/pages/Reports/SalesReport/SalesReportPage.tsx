import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { salesService } from '../../../services/salesService';
import { fishService } from '../../../services/fishService';
import { Sale } from '../../../types/sale';
import { Fish } from '../../../types/fish';
import { formatTurkishCurrency } from '../../../utils/currency';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

interface SalesReportData {
  fishId: string;
  fishName: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  avgUnitPrice: number;
  salesCount: number;
  saleType: 'own-production' | 'resale';
}

const SalesReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [reportData, setReportData] = useState<SalesReportData[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null); // Tüm veriyi göster
  const [endDate, setEndDate] = useState<Date | null>(null); // Tüm veriyi göster
  const [filterType, setFilterType] = useState<'all' | 'own-production' | 'resale'>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, fishesData] = await Promise.all([salesService.getAllSales(), fishService.getAllFishes()]);
      setSales(salesData);
      setFishes(fishesData);
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
    if (sales.length > 0 && fishes.length > 0) {
      // Dashboard ile aynı hesaplama mantığını kullan
      const filteredSales = sales.filter((sale) => {
        const saleDate = sale.date?.toDate?.();
        if (!saleDate) return false;
        if (startDate && saleDate < startDate) return false;
        if (endDate && saleDate > endDate) return false;
        return true;
      });

      const fishMap: { [key: string]: SalesReportData } = {};

      filteredSales.forEach((sale) => {
        sale.items?.forEach((item) => {
          if (!fishMap[item.fishId]) {
            const fish = fishes.find((f) => f.id === item.fishId);
            fishMap[item.fishId] = {
              fishId: item.fishId,
              fishName: fish?.name || item.fishName || 'Bilinmeyen',
              categoryName: item.categoryName || 'Kategori Yok',
              totalQuantity: 0,
              totalRevenue: 0,
              totalProfit: 0,
              profitMargin: 0,
              avgUnitPrice: 0,
              salesCount: 0,
              saleType: 'own-production',
            };
          }
          fishMap[item.fishId].totalQuantity += item.soldQuantity;
          fishMap[item.fishId].totalRevenue += item.total;
          fishMap[item.fishId].totalProfit += item.profit || 0;
          fishMap[item.fishId].salesCount += 1;
        });
      });

      // Satış türünü belirle (Dashboard ile aynı mantık)
      Object.values(fishMap).forEach((product) => {
        if (product.totalQuantity > 0) {
          product.avgUnitPrice = product.totalRevenue / product.totalQuantity;
          // Toplam ile kar eşit mi kontrol et (küçük farkları tolere et)
          const difference = Math.abs(product.totalRevenue - product.totalProfit);
          product.saleType = difference < 0.01 ? 'own-production' : 'resale';
        }
        product.profitMargin = product.totalRevenue > 0 ? (product.totalProfit / product.totalRevenue) * 100 : 0;
      });

      const data = Object.values(fishMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
      setReportData(data);
    }
  }, [sales, fishes, startDate, endDate]);

  // Filtreleme ve toplamları hesapla
  const filteredReportData =
    filterType === 'all' ? reportData : reportData.filter((item) => item.saleType === filterType);

  const totalRevenue = filteredReportData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = filteredReportData.reduce((sum, item) => sum + item.totalProfit, 0);
  const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // TÜM VERİDEN hesapla (filtre uygulanmadan)
  const allOwnProductionData = reportData.filter((item) => item.saleType === 'own-production');
  const allResaleData = reportData.filter((item) => item.saleType === 'resale');

  const ownProductionRevenue = allOwnProductionData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const resaleRevenue = allResaleData.reduce((sum, item) => sum + item.totalRevenue, 0);

  const handleExport = () => {
    // CSV export fonksiyonu
    const headers = [
      'Balık Adı',
      'Kategori',
      'Toplam Adet',
      'Toplam Gelir',
      'Toplam Kar',
      'Kar Marjı %',
      'Ort. Birim Fiyat',
      'Satış Sayısı',
      'Tip',
    ];
    const rows = filteredReportData.map((item) => [
      item.fishName,
      item.categoryName,
      item.totalQuantity,
      item.totalRevenue,
      item.totalProfit,
      item.profitMargin.toFixed(2),
      item.avgUnitPrice.toFixed(2),
      item.salesCount,
      item.saleType === 'own-production' ? 'Kendi Üretim' : 'Al-Sat',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `balik-satis-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
            Satış İstatistikleri Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tüm balık türlerine göre detaylı satış analizi
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={filteredReportData.length === 0}>
          CSV İndir
        </Button>
      </Box>

      {/* Filtreler */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Balık Tipi</InputLabel>
              <Select
                value={filterType}
                label="Balık Tipi"
                onChange={(e) => setFilterType(e.target.value as 'all' | 'own-production' | 'resale')}>
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="own-production">Kendi Üretim</MenuItem>
                <MenuItem value="resale">Al-Sat</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Kendi Üretim Satış"
            value={ownProductionRevenue}
            subtitle={`${allOwnProductionData.length} farklı balık türü`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Al-Sat Balığı Satış"
            value={resaleRevenue}
            subtitle={`${allResaleData.length} farklı balık türü`}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Toplam Gelir"
            value={totalRevenue}
            subtitle={`${filteredReportData.length} farklı balık`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Toplam Kar"
            value={totalProfit}
            subtitle={`%${avgProfitMargin.toFixed(1)} kar marjı`}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Detaylı Tablo */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Detaylı Satış Listesi
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Balık Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Adet
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Gelir
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Kar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Kar Marjı
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Ort. Birim Fiyat
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Satış Sayısı
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Seçilen tarih aralığında satış bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReportData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.fishName}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.saleType === 'own-production' ? 'Kendi Üretim' : 'Al-Sat'}
                          size="small"
                          color={item.saleType === 'own-production' ? 'success' : 'info'}
                        />
                      </TableCell>
                      <TableCell align="right">{item.totalQuantity}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalRevenue)}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalProfit)}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={
                            item.profitMargin > 20
                              ? 'success.main'
                              : item.profitMargin > 10
                                ? 'warning.main'
                                : 'error.main'
                          }
                          fontWeight={600}>
                          %{item.profitMargin.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.avgUnitPrice)}</TableCell>
                      <TableCell align="center">{item.salesCount}</TableCell>
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

export default SalesReportPage;
