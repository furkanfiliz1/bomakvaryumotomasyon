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
import { purchaseService } from '../../../services/purchaseService';
import { supplierService } from '../../../services/supplierService';
import { Purchase } from '../../../types/purchase';
import { Supplier } from '../../../types/supplier';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateSupplierReport } from '../utils/reportCalculations';
import { SupplierReportData } from '../types';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const SupplierPurchasesReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [reportData, setReportData] = useState<SupplierReportData[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const [purchasesData, suppliersData] = await Promise.all([
        purchaseService.getAllPurchases(),
        supplierService.getAllSuppliers(),
      ]);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
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
    if (purchases.length > 0 && suppliers.length > 0) {
      const data = calculateSupplierReport(purchases, suppliers, startDate || undefined, endDate || undefined);
      setReportData(data);
    }
  }, [purchases, suppliers, startDate, endDate]);

  const totalAmount = reportData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalPurchases = reportData.reduce((sum, item) => sum + item.totalPurchases, 0);
  const avgPurchaseValue = reportData.reduce((sum, item) => sum + item.avgPurchaseValue, 0) / (reportData.length || 1);

  const handleExport = () => {
    const headers = ['Tedarikçi', 'Toplam Alış Adedi', 'Toplam Tutar', 'Alış Sayısı', 'Ort. Alış Değeri', 'Son Alış'];
    const rows = reportData.map((item) => [
      item.supplierName,
      item.totalPurchases,
      item.totalAmount,
      item.purchaseCount,
      item.avgPurchaseValue.toFixed(2),
      formatDate(item.lastPurchaseDate),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tedarikci-alis-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
            Tedarikçi Alış Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tedarikçi bazında alış analizi
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
            title="Toplam Alış Tutarı"
            value={totalAmount}
            subtitle={`${reportData.length} tedarikçi`}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard
            title="Toplam Alış Adedi"
            value={`${totalPurchases} adet`}
            subtitle="Tüm tedarikçiler"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Ort. Alış Değeri" value={avgPurchaseValue} subtitle="Tedarikçi başına" color="primary" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Tedarikçi Alış Listesi
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tedarikçi</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Alış
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Tutar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Alış Sayısı
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Ort. Alış Değeri
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Son Alış</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Seçilen tarih aralığında alış bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.supplierName}</TableCell>
                      <TableCell align="right">{item.totalPurchases} adet</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalAmount)}</TableCell>
                      <TableCell align="center">{item.purchaseCount}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.avgPurchaseValue)}</TableCell>
                      <TableCell>{formatDate(item.lastPurchaseDate)}</TableCell>
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

export default SupplierPurchasesReportPage;
