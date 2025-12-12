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
import { expenseService } from '../../../services/expenseService';
import { Expense } from '../../../types/expense';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateExpenseReport } from '../utils/reportCalculations';
import { ExpenseReportData } from '../types';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';

const ExpensesReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reportData, setReportData] = useState<ExpenseReportData[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const expensesData = await expenseService.getAllExpenses();
      setExpenses(expensesData);
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
    if (expenses.length > 0) {
      const data = calculateExpenseReport(expenses, startDate || undefined, endDate || undefined);
      setReportData(data);
    }
  }, [expenses, startDate, endDate]);

  const totalAmount = reportData.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalItems = reportData.reduce((sum, item) => sum + item.itemCount, 0);
  const avgAmount = totalAmount / (totalItems || 1);

  const pieChartData = reportData.map((item, index) => ({
    id: index,
    value: item.totalAmount,
    label: item.category,
  }));

  const handleExport = () => {
    const headers = ['Kategori', 'Toplam Tutar', 'Yüzde', 'Gider Sayısı', 'Ort. Tutar'];
    const rows = reportData.map((item) => [
      item.category,
      item.totalAmount,
      item.percentage.toFixed(2),
      item.itemCount,
      item.avgAmount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gider-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
            Gider Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kategori bazlı gider analizi
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
            title="Toplam Gider"
            value={totalAmount}
            subtitle={`${reportData.length} kategori`}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Gider Kalemi Sayısı" value={`${totalItems} adet`} subtitle="Toplam" color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ReportCard title="Ort. Gider Tutarı" value={avgAmount} subtitle="Gider başına" color="info" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Gider Dağılımı
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <PieChart series={[{ data: pieChartData }]} height={300} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Kategori Özeti
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Tutar
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Yüzde
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{formatTurkishCurrency(item.totalAmount)}</TableCell>
                        <TableCell align="right">%{item.percentage.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Detaylı Gider Tablosu
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Toplam Tutar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Yüzde
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Gider Sayısı
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Ort. Tutar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Seçilen tarih aralığında gider bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.totalAmount)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color={item.percentage > 30 ? 'error.main' : 'text.primary'}>
                          %{item.percentage.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{item.itemCount}</TableCell>
                      <TableCell align="right">{formatTurkishCurrency(item.avgAmount)}</TableCell>
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

export default ExpensesReportPage;
