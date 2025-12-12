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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { salesService } from '../../../services/salesService';
import { customerService } from '../../../services/customerService';
import { Sale } from '../../../types/sale';
import { Customer } from '../../../types/customer';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateRegionSalesReport } from '../utils/reportCalculations';
import { RegionSalesData } from '../types';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

const RegionSalesReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reportData, setReportData] = useState<RegionSalesData[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, customersData] = await Promise.all([
        salesService.getAllSales(),
        customerService.getAllCustomers(),
      ]);
      setSales(salesData);
      setCustomers(customersData);
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
    if (sales.length > 0 && customers.length > 0) {
      const data = calculateRegionSalesReport(sales, customers, startDate || undefined, endDate || undefined);
      setReportData(data);
    }
  }, [sales, customers, startDate, endDate]);

  const totalRevenue = reportData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalSales = reportData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalCustomers = reportData.reduce((sum, item) => sum + item.customerCount, 0);

  const handleExport = () => {
    const headers = ['Şehir', 'Toplam Satış', 'Toplam Gelir', 'Müşteri Sayısı', 'Müşteri Başı Ort. Gelir'];
    const rows = reportData.map((item) => [
      item.city,
      item.totalSales,
      item.totalRevenue,
      item.customerCount,
      item.avgRevenuePerCustomer.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bolge-satis-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.dark?.[800] || '#000', mb: 0.5 }}>
            Bölge Satış Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Şehir bazında satış dağılımı
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={reportData.length === 0}>
          CSV İndir
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Toplam Gelir"
            value={totalRevenue}
            subtitle={`${reportData.length} şehir`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Toplam Satış" value={`${totalSales} adet`} subtitle="Tüm bölgeler" color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Toplam Müşteri"
            value={`${totalCustomers} müşteri`}
            subtitle="Aktif müşteriler"
            color="primary"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Şehir Bazlı Satış Listesi
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Şehir</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Satış
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Gelir
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Müşteri Sayısı
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Müşteri Başı Ort.
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Gelir Payı
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Seçilen tarih aralığında satış bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((item, index) => {
                    const percentage = totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0;
                    return (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography fontWeight={600}>{item.city}</Typography>
                        </TableCell>
                        <TableCell align="right">{item.totalSales} adet</TableCell>
                        <TableCell align="right">{formatTurkishCurrency(item.totalRevenue)}</TableCell>
                        <TableCell align="center">{item.customerCount}</TableCell>
                        <TableCell align="right">{formatTurkishCurrency(item.avgRevenuePerCustomer)}</TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight={600}
                            color={percentage > 20 ? 'success.main' : percentage > 10 ? 'info.main' : 'text.secondary'}>
                            %{percentage.toFixed(1)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegionSalesReportPage;
