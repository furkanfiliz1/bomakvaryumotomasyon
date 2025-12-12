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
import { cashService } from '../../../services/cashService';
import { CashTransaction } from '../../../types/cash';
import { formatTurkishCurrency } from '../../../utils/currency';
import { ReportCard } from '../components/ReportCard';
import { Download } from '@mui/icons-material';

const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CashFlowReportPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const transactionsData = await cashService.getAllTransactions();
      setTransactions(transactionsData);
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

  // İşlemleri tarihe göre sırala
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Bakiye hesapla
  let runningBalance = 0;
  const transactionsWithBalance = sortedTransactions
    .reverse()
    .map((transaction) => {
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
      }
      return { ...transaction, balance: runningBalance };
    })
    .reverse();

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const handleExport = () => {
    const headers = ['Tarih', 'Tip', 'Tutar', 'Açıklama', 'Bakiye'];
    const rows = transactionsWithBalance.map((item) => [
      formatDateTime(new Date(item.createdAt || 0)),
      item.type === 'income' ? 'Gelir' : 'Gider',
      item.amount,
      item.description || '-',
      item.balance,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kasa-raporu-${new Date().toISOString().split('T')[0]}.csv`;
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
            Kasa Raporu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nakit akışı ve kasa bakiye geçmişi
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport} disabled={transactions.length === 0}>
          CSV İndir
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Mevcut Bakiye"
            value={currentBalance}
            subtitle={`${transactions.length} işlem`}
            color={currentBalance >= 0 ? 'success' : 'error'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Toplam Gelir"
            value={totalIncome}
            subtitle={`${transactions.filter((t) => t.type === 'income').length} işlem`}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Toplam Gider"
            value={totalExpense}
            subtitle={`${transactions.filter((t) => t.type === 'expense').length} işlem`}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ReportCard
            title="Net Akış"
            value={totalIncome - totalExpense}
            subtitle="Gelir - Gider"
            color={totalIncome - totalExpense >= 0 ? 'success' : 'error'}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Kasa Hareketleri
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Tutar
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Bakiye
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsWithBalance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">Kasa hareketi bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionsWithBalance.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{formatDateTime(new Date(item.createdAt || 0))}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.type === 'income' ? 'Gelir' : 'Gider'}
                          size="small"
                          color={item.type === 'income' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={item.type === 'income' ? 'success.main' : 'error.main'} fontWeight={600}>
                          {item.type === 'income' ? '+' : '-'}
                          {formatTurkishCurrency(item.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell align="right">
                        <Typography color={item.balance >= 0 ? 'text.primary' : 'error.main'} fontWeight={600}>
                          {formatTurkishCurrency(item.balance)}
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

export default CashFlowReportPage;
