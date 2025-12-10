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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState, useEffect, useMemo } from 'react';
import { useNotice } from '@components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cashTransactionSchema, CashTransactionFormData } from './cash.validation';
import { cashService } from '../../services/cashService';
import { userService } from '../../services/userService';
import { CashTransaction, CashBalance } from '../../types/cash';
import { User } from '../../types/user';
import useResponsive from '../../hooks/useResponsive';

const CashPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [balances, setBalances] = useState<CashBalance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const form = useForm<CashTransactionFormData>({
    defaultValues: { userId: '', amount: 0, type: 'income', description: '' },
    resolver: yupResolver(cashTransactionSchema),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, usersData] = await Promise.all([
        cashService.getAllTransactions(),
        userService.getAllUsers(),
      ]);

      setTransactions(transactionsData);
      setUsers(usersData);

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
        ...values,
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

  const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);

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
                ₺{totalBalance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Kullanıcı Bakiyeleri */}
      {isMobile ? (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {balances.map((balance) => (
            <Card key={balance.userId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {balance.username}
                  </Typography>
                  <Chip
                    label={`₺${balance.balance.toFixed(2)}`}
                    color={balance.balance >= 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Bakiye
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balances.map((balance) => (
                <TableRow key={balance.userId}>
                  <TableCell>{balance.username}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`₺${balance.balance.toFixed(2)}`}
                      color={balance.balance >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
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
                          ₺{transaction.amount.toFixed(2)}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>
                      {transactions.length === 0 ? 'İşlem bulunmamaktadır' : 'Filtreye uygun işlem bulunamadı'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell>₺{transaction.amount.toFixed(2)}</TableCell>
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
          <Box component="form" onSubmit={form.handleSubmit(handleAddTransaction)}>
            <Controller
              name="userId"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Kullanıcı"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="İşlem Türü"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}>
                  <MenuItem value="income">Gelir</MenuItem>
                  <MenuItem value="expense">Gider</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tutar"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Açıklama"
                  multiline
                  rows={3}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
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
