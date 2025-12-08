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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { cashTransactionSchema, CashTransactionFormData } from './cash.validation';
import { cashService } from '../../services/cashService';
import { userService } from '../../services/userService';
import { CashTransaction, CashBalance } from '../../types/cash';
import { User } from '../../types/user';

const CashPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [balances, setBalances] = useState<CashBalance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Kasa Yönetimi
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
          Yeni İşlem
        </Button>
      </Box>

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

      {/* İşlem Geçmişi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        İşlem Geçmişi
      </Typography>
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
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color={theme.palette.grey[600]}>Henüz işlem bulunmamaktadır</Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
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

      {/* İşlem Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
