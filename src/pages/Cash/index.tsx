import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Drawer,
  Badge,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useMemo } from 'react';
import { useNotice, Form } from '@components';
import { useForm } from 'react-hook-form';
import { createCashTransactionSchema, CashTransactionFormData } from './cash.validation';
import { cashService } from '../../services/cashService';
import { userService } from '../../services/userService';
import { expenseService } from '../../services/expenseService';
import { CashTransaction, CashBalance } from '../../types/cash';
import { User } from '../../types/user';
import { Expense } from '../../types/expense';
import useResponsive from '../../hooks/useResponsive';
import { formatTurkishCurrency } from '../../utils/currency';

const CashPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [balances, setBalances] = useState<CashBalance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Create schema with current users
  const cashTransactionSchema = useMemo(() => createCashTransactionSchema(users), [users]);

  const form = useForm<CashTransactionFormData>({
    defaultValues: { userId: '', amount: 0, type: 'income', description: '' },
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, usersData, expensesData] = await Promise.all([
        cashService.getAllTransactions(),
        userService.getAllUsers(),
        expenseService.getAllExpenses(),
      ]);

      setTransactions(transactionsData);
      setUsers(usersData);
      setExpenses(expensesData);

      const balancesData = await cashService.getBalanceByUser(transactionsData);
      setBalances(balancesData);
    } catch (error) {
      console.error('❌ Data loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Veriler yüklenirken hata oluştu',
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

  const handleAddTransaction = async (values: CashTransactionFormData) => {
    try {
      setLoading(true);
      const user = users.find((u) => u.id === values.userId);

      await cashService.addTransaction({
        userId: values.userId,
        type: values.type as 'income' | 'expense',
        amount: values.amount,
        description: values.description,
        username: user?.username || '',
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem başarıyla kaydedildi',
        buttonTitle: 'Tamam',
      });

      form.reset();
      setOpenDialog(false);
      await loadData();
    } catch (error) {
      console.error('❌ Transaction add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'İşlem eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      await cashService.deleteTransaction(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem silindi',
        buttonTitle: 'Tamam',
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'İşlem silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  // Ana kullanıcı ID'si (diğer kullanıcılar yatırımcı olarak kabul edilir)
  const MAIN_USER_ID = 'CEUQM60I32jmou5sA4rU';

  // Sadece ana kullanıcının bakiyesini hesapla
  const mainUserBalance = balances.find((b) => b.userId === MAIN_USER_ID);
  const totalBalance = mainUserBalance?.balance || 0;

  // Diğer kullanıcılar yatırımcı olarak kabul edilir
  const investorBalances = balances.filter((b) => b.userId !== MAIN_USER_ID);

  // Her kullanıcı için kart harcamalarını hesapla
  const cardExpensesByUser = useMemo(() => {
    const expenseMap: { [userId: string]: number } = {};

    expenses.forEach((expense) => {
      if (expense.paymentType === 'kart' && expense.userId) {
        expenseMap[expense.userId] = (expenseMap[expense.userId] || 0) + (expense.amount || 0);
      }
    });

    return expenseMap;
  }, [expenses]);

  // Yatırımcılar için toplam cepten çıkan parayı hesapla (Gider + Kart Harcamaları)
  const totalOutOfPocket = useMemo(() => {
    return investorBalances.reduce((total, balance) => {
      const outOfPocket = balance.totalExpense + (cardExpensesByUser[balance.userId] || 0);
      return total + outOfPocket;
    }, 0);
  }, [investorBalances, cardExpensesByUser]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by user
    if (filterUserId) {
      filtered = filtered.filter((t) => t.userId === filterUserId);
    }

    // Filter by type
    if (filterType) {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by start date
    if (filterStartDate) {
      filtered = filtered.filter((t) => {
        const transactionDate = t.createdAt ? new Date(t.createdAt) : new Date();
        return transactionDate >= new Date(filterStartDate);
      });
    }

    // Filter by end date
    if (filterEndDate) {
      filtered = filtered.filter((t) => {
        const transactionDate = t.createdAt ? new Date(t.createdAt) : new Date();
        return transactionDate <= new Date(filterEndDate);
      });
    }

    return filtered;
  }, [transactions, filterUserId, filterType, filterStartDate, filterEndDate]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterUserId) count++;
    if (filterType) count++;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    return count;
  }, [filterUserId, filterType, filterStartDate, filterEndDate]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
        }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Kasa Yönetimi
        </Typography>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Badge badgeContent={activeFilterCount} color="primary">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              size="small"
              fullWidth={isMobile}>
              Filtreler
            </Button>
          </Badge>
          {activeFilterCount > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={() => {
                setFilterUserId('');
                setFilterType('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              size="small"
              fullWidth={isMobile}>
              Temizle
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            size="small"
            fullWidth={isMobile}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni İşlem
          </Button>
        </Stack>
      </Box>

      {/* Filter Drawer */}
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 400 }, p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtreler
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Kullanıcı"
              select
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              fullWidth
              size="small">
              <MenuItem value="">Tümü</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="İşlem Türü"
              select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              fullWidth
              size="small">
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="income">Gelir</MenuItem>
              <MenuItem value="expense">Gider</MenuItem>
            </TextField>
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterUserId('');
                setFilterType('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              fullWidth>
              Temizle
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)} fullWidth>
              Uygula
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Bakiye Kartları */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: theme.palette.success.light }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Toplam Bakiye
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatTurkishCurrency(totalBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kullanıcı Bakiyeleri - Yatırımcılar */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        Yatırımcı Bakiyeleri
      </Typography>
      {isMobile ? (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {investorBalances.map((balance) => (
            <Card key={balance.userId} variant="outlined">
              <CardContent>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {balance.username}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gelir
                  </Typography>
                  <Chip
                    label={formatTurkishCurrency(balance.totalIncome)}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gider
                  </Typography>
                  <Chip
                    label={formatTurkishCurrency(balance.totalExpense)}
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Kart Harcamaları
                  </Typography>
                  <Chip
                    label={formatTurkishCurrency(cardExpensesByUser[balance.userId] || 0)}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cepten Çıkan
                  </Typography>
                  <Chip
                    label={formatTurkishCurrency(balance.totalExpense + (cardExpensesByUser[balance.userId] || 0))}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
          {/* Toplam Cepten Çıkan */}
          <Card sx={{ background: theme.palette.primary.light }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Toplam Cepten Çıkan
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatTurkishCurrency(totalOutOfPocket)}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Gelir
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Gider
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Kart Harcamaları
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Cepten Çıkan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investorBalances.map((balance) => (
                <TableRow key={balance.userId}>
                  <TableCell>{balance.username}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatTurkishCurrency(balance.totalIncome)}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatTurkishCurrency(balance.totalExpense)}
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatTurkishCurrency(cardExpensesByUser[balance.userId] || 0)}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatTurkishCurrency(balance.totalExpense + (cardExpensesByUser[balance.userId] || 0))}
                      color="info"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {/* Toplam Satırı */}
              <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>TOPLAM</TableCell>
                <TableCell align="right">
                  <Chip
                    label={formatTurkishCurrency(investorBalances.reduce((sum, b) => sum + b.totalIncome, 0))}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={formatTurkishCurrency(investorBalances.reduce((sum, b) => sum + b.totalExpense, 0))}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={formatTurkishCurrency(
                      investorBalances.reduce((sum, b) => sum + (cardExpensesByUser[b.userId] || 0), 0),
                    )}
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={formatTurkishCurrency(totalOutOfPocket)}
                    color="info"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* İşlem Geçmişi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        İşlem Geçmişi
      </Typography>
      {isMobile ? (
        <Stack spacing={2}>
          {filteredTransactions.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary" align="center">
                {transactions.length === 0 ? 'İşlem bulunmamaktadır' : 'Filtreye uygun işlem bulunamadı'}
              </Typography>
            </Paper>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Kullanıcı
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {transaction.username}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tutar
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatTurkishCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tür
                        </Typography>
                        {transaction.type === 'income' ? (
                          <Chip icon={<AddIcon />} label="Gelir" color="success" size="small" />
                        ) : (
                          <Chip icon={<RemoveIcon />} label="Gider" color="error" size="small" />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Açıklama
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                          {transaction.description}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tarih
                        </Typography>
                        <Typography variant="caption">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('tr-TR') : '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteTransaction(transaction.id!)}>
                        Sil
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tutar</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tür</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>
                      {transactions.length === 0 ? 'İşlem bulunmamaktadır' : 'Filtreye uygun işlem bulunamadı'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell>{formatTurkishCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      {transaction.type === 'income' ? (
                        <Chip icon={<AddIcon />} label="Gelir" color="success" size="small" />
                      ) : (
                        <Chip icon={<RemoveIcon />} label="Gider" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('tr-TR') : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => handleDeleteTransaction(transaction.id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* İşlem Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>Yeni İşlem Ekle</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            form={form as any}
            schema={cashTransactionSchema}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(handleAddTransaction)();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={form.handleSubmit(handleAddTransaction)}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CashPage;
