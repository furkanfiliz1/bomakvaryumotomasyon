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
import { salesService } from '../../../services/salesService';
import { customerService } from '../../../services/customerService';
import { Sale } from '../../../types/sale';
import { Customer } from '../../../types/customer';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateCustomerSalesReport } from '../utils/reportCalculations';
import { CustomerSalesReportData } from '../types';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const CustomerSalesReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reportData, setReportData] = useState<CustomerSalesReportData[]>([]);

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
      const data = calculateCustomerSalesReport(sales, customers, startDate || undefined, endDate || undefined);
      setReportData(data);
    }
  }, [sales, customers, startDate, endDate]);

  const totalRevenue = reportData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = reportData.reduce((sum, item) => sum + item.totalProfit, 0);
  const avgOrderValue = reportData.reduce((sum, item) => sum + item.avgOrderValue, 0) / (reportData.length || 1);

  const getCustomerTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      arabacı: 'Arabacı',
      petshop: 'Petshop',
      bireysel: 'Bireysel',
    };
    return labels[type] || type;
  };

  const getCustomerTypeColor = (type: string): 'success' | 'info' | 'warning' => {
    const colors: { [key: string]: 'success' | 'info' | 'warning' } = {
      arabacı: 'success',
      petshop: 'info',
      bireysel: 'warning',
    };
    return colors[type] || 'info';
  };

  const handleExport = () => {
    const headers = [
      'Müşteri Adı',
      'Tip',
      'Şehir',
      'Toplam Satış Adedi',
      'Toplam Gelir',
      'Toplam Kar',
      'Satış Sayısı',
      'Ort. Sipariş Değeri',
      'Son Satış',
    ];
    const rows = reportData.map((item) => [
      item.customerName,
      getCustomerTypeLabel(item.customerType),
      item.city || '-',
      item.totalSales,
      item.totalRevenue,
      item.totalProfit,
      item.salesCount,
      item.avgOrderValue.toFixed(2),
      formatDate(item.lastSaleDate),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `musteri-satis-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
            Müşteri Satış Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Müşteri bazında detaylı satış analizi
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={reportData.length === 0}>
          CSV İndir
        </Button>
      </Box>

      {/* Filtreler */}
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

      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Toplam Gelir"
            value={totalRevenue}
            subtitle={`${reportData.length} müşteri`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Toplam Kar"
            value={totalProfit}
            subtitle={`%${totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0} kar marjı`}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Ort. Sipariş Değeri" value={avgOrderValue} subtitle="Müşteri başına" color="primary" />
        </Grid>
      </Grid>

      {/* Detaylı Tablo */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Müşteri Satış Listesi
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Müşteri Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Şehir</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Satış
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Gelir
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Kar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Satış Sayısı
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Ort. Sipariş
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Son Satış</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Seçilen tarih aralığında satış bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getCustomerTypeLabel(item.customerType)}
                          size="small"
                          color={getCustomerTypeColor(item.customerType)}
                        />
                      </TableCell>
                      <TableCell>{item.city || '-'}</TableCell>
                      <TableCell align="right">{item.totalSales} adet</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalRevenue)}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalProfit)}</TableCell>
                      <TableCell align="center">{item.salesCount}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.avgOrderValue)}</TableCell>
                      <TableCell>{formatDate(item.lastSaleDate)}</TableCell>
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

export default CustomerSalesReportPage;
