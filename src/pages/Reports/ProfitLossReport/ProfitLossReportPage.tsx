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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { salesService } from '../../../services/salesService';
import { purchaseService } from '../../../services/purchaseService';
import { expenseService } from '../../../services/expenseService';
import { Sale } from '../../../types/sale';
import { Purchase } from '../../../types/purchase';
import { Expense } from '../../../types/expense';
import { formatTurkishCurrency } from '../../../utils/currency';
import { calculateProfitLossReport } from '../utils/reportCalculations';
import { ProfitLossReportData } from '../types';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';

const ProfitLossReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reportData, setReportData] = useState<ProfitLossReportData[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const years = [2023, 2024, 2025, 2026];

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, purchasesData, expensesData] = await Promise.all([
        salesService.getAllSales(),
        purchaseService.getAllPurchases(),
        expenseService.getAllExpenses(),
      ]);
      setSales(salesData);
      setPurchases(purchasesData);
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
    if (sales.length > 0 || purchases.length > 0 || expenses.length > 0) {
      const data = calculateProfitLossReport(sales, purchases, expenses, selectedYear);
      setReportData(data);
    }
  }, [sales, purchases, expenses, selectedYear]);

  const totalRevenue = reportData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalCost = reportData.reduce((sum, item) => sum + item.totalCost, 0);
  const totalExpenses = reportData.reduce((sum, item) => sum + item.totalExpenses, 0);
  const totalGrossProfit = reportData.reduce((sum, item) => sum + item.grossProfit, 0);
  const totalNetProfit = reportData.reduce((sum, item) => sum + item.netProfit, 0);
  const avgProfitMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  const handleExport = () => {
    const headers = ['Ay', 'Gelir', 'Maliyet', 'Gider', 'Brüt Kar', 'Net Kar', 'Kar Marjı %'];
    const rows = reportData.map((item) => [
      item.month,
      item.totalRevenue,
      item.totalCost,
      item.totalExpenses,
      item.grossProfit,
      item.netProfit,
      item.profitMargin.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kar-zarar-raporu-${selectedYear}.csv`;
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
            Kar-Zarar Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aylık gelir, maliyet ve kar analizi
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={reportData.length === 0}>
          CSV İndir
        </Button>
      </Box>

      {/* Yıl Seçici */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Yıl Seçin</InputLabel>
            <Select value={selectedYear} label="Yıl Seçin" onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Özet Kartlar */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard title="Toplam Gelir" value={totalRevenue} subtitle={`${selectedYear} yılı`} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard title="Toplam Maliyet" value={totalCost} subtitle="Alış maliyeti" color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard title="Toplam Gider" value={totalExpenses} subtitle="İşletme giderleri" color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Net Kar"
            value={totalNetProfit}
            subtitle={`%${avgProfitMargin.toFixed(1)} kar marjı`}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Grafik */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {selectedYear} Yılı Aylık Kar-Zarar Analizi
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <BarChart
              xAxis={[{ scaleType: 'band', data: reportData.map((item) => item.month) }]}
              series={[
                {
                  data: reportData.map((item) => item.totalRevenue),
                  label: 'Gelir',
                  color: theme.palette.success.main,
                },
                { data: reportData.map((item) => item.totalCost), label: 'Maliyet', color: theme.palette.warning.main },
                { data: reportData.map((item) => item.totalExpenses), label: 'Gider', color: theme.palette.error.main },
                { data: reportData.map((item) => item.netProfit), label: 'Net Kar', color: theme.palette.info.main },
              ]}
              height={400}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Detaylı Tablo */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Aylık Kar-Zarar Tablosu
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Ay</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Gelir
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Maliyet
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Brüt Kar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Gider
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Net Kar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Kar Marjı
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.month}</TableCell>
                    <TableCell align="right">{formatTurkishCurrency(item.totalRevenue)}</TableCell>
                    <TableCell align="right">{formatTurkishCurrency(item.totalCost)}</TableCell>
                    <TableCell align="right">
                      <Typography color={item.grossProfit >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                        {formatTurkishCurrency(item.grossProfit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatTurkishCurrency(item.totalExpenses)}</TableCell>
                    <TableCell align="right">
                      <Typography color={item.netProfit >= 0 ? 'success.main' : 'error.main'} fontWeight={600}>
                        {formatTurkishCurrency(item.netProfit)}
                        {/* Grafik */}
                        <Card sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                              {selectedYear} Yılı Aylık Kar-Zarar Analizi
                            </Typography>
                            <Box sx={{ height: 400, width: '100%' }}>
                              <BarChart
                                xAxis={[{ scaleType: 'band', data: reportData.map((item) => item.month) }]}
                                series={[
                                  {
                                    data: reportData.map((item) => item.totalRevenue),
                                    label: 'Gelir',
                                    color: theme.palette.success.main,
                                  },
                                  {
                                    data: reportData.map((item) => item.totalCost),
                                    label: 'Maliyet',
                                    color: theme.palette.warning.main,
                                  },
                                  {
                                    data: reportData.map((item) => item.totalExpenses),
                                    label: 'Gider',
                                    color: theme.palette.error.main,
                                  },
                                  {
                                    data: reportData.map((item) => item.netProfit),
                                    label: 'Net Kar',
                                    color: theme.palette.info.main,
                                  },
                                ]}
                                height={400}
                              />
                            </Box>
                          </CardContent>
                        </Card>{' '}
                        %{item.profitMargin.toFixed(1)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: 'grey.50', fontWeight: 600 }}>
                  <TableCell sx={{ fontWeight: 700 }}>TOPLAM</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatTurkishCurrency(totalRevenue)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatTurkishCurrency(totalCost)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatTurkishCurrency(totalGrossProfit)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatTurkishCurrency(totalExpenses)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    <Typography color={totalNetProfit >= 0 ? 'success.main' : 'error.main'} fontWeight={700}>
                      {formatTurkishCurrency(totalNetProfit)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    <Typography fontWeight={700}>%{avgProfitMargin.toFixed(1)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfitLossReportPage;
