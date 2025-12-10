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
  IconButton,
  Chip,
  Drawer,
  Badge,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState, useEffect, useMemo } from 'react';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createExpenseSchema, createExpenseFilterSchema, ExpenseFormData } from './expenses.validation';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';
import { userService } from '../../services/userService';
import { User } from '../../types/user';
import useResponsive from '../../hooks/useResponsive';

const ExpensesPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        console.log('✅ Loaded users:', data);
        setUsers(data);
      } catch (error) {
        console.error('❌ Users loading error:', error);
      }
    };
    loadUsers();
  }, []);

  // Create dynamic schema with user options
  const expenseSchema = useMemo(() => {
    const userOptions = users.map((user) => ({ id: user.id, name: user.username }));
    console.log('📝 User options for schema:', userOptions);
    return createExpenseSchema(userOptions);
  }, [users]);

  // Create filter schema with user options
  const expenseFilterSchema = useMemo(() => {
    const userOptions = users.map((user) => ({ id: user.id, name: user.username }));
    return createExpenseFilterSchema(userOptions);
  }, [users]);

  // Filter Form
  const filterForm = useForm({
    defaultValues: { category: '', paymentType: '', userId: '', startDate: '', endDate: '' },
    resolver: yupResolver(expenseFilterSchema),
  });

  const filterCategory = filterForm.watch('category');
  const filterPaymentType = filterForm.watch('paymentType');
  const filterUserId = filterForm.watch('userId');
  const filterStartDate = filterForm.watch('startDate');
  const filterEndDate = filterForm.watch('endDate');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCategory) count++;
    if (filterPaymentType) count++;
    if (filterUserId) count++;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    return count;
  }, [filterCategory, filterPaymentType, filterUserId, filterStartDate, filterEndDate]);

  // Filtered expenses based on form filters
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter((expense) => expense.category === filterCategory);
    }

    // Filter by payment type
    if (filterPaymentType) {
      filtered = filtered.filter((expense) => expense.paymentType === filterPaymentType);
    }

    // Filter by user
    if (filterUserId) {
      filtered = filtered.filter((expense) => expense.userId === filterUserId);
    }

    // Filter by start date
    if (filterStartDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate =
          expense.date && typeof expense.date === 'object' && 'toDate' in expense.date
            ? (expense.date as { toDate: () => Date }).toDate()
            : new Date(expense.date as unknown as string);
        return expenseDate >= new Date(filterStartDate);
      });
    }

    // Filter by end date
    if (filterEndDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate =
          expense.date && typeof expense.date === 'object' && 'toDate' in expense.date
            ? (expense.date as { toDate: () => Date }).toDate()
            : new Date(expense.date as unknown as string);
        return expenseDate <= new Date(filterEndDate);
      });
    }

    return filtered;
  }, [expenses, filterCategory, filterPaymentType, filterUserId, filterStartDate, filterEndDate]);

  // Add Form
  const addForm = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      paymentType: '',
      userId: '',
      description: '',
    },
    resolver: yupResolver(expenseSchema),
  });

  // Edit Form
  const editForm = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      paymentType: '',
      userId: '',
      description: '',
    },
    resolver: yupResolver(expenseSchema),
  });

  // Update form resolver when schema changes
  useEffect(() => {
    addForm.clearErrors();
    editForm.clearErrors();
  }, [expenseSchema, addForm, editForm]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('❌ Expenses loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Giderler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await expenseService.deleteExpense(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Gider silindi',
        buttonTitle: 'Tamam',
      });

      await loadExpenses();
    } catch (error) {
      console.error('❌ Expense delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Gider silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddExpense = async (values: any) => {
    try {
      setLoading(true);
      const selectedUser = users.find((u) => u.id === values.userId);
      await expenseService.addExpense({
        date: new Date(values.date),
        category: values.category,
        amount: Number(values.amount),
        description: values.description || '',
        paymentType: values.paymentType || '',
        userId: values.userId,
        userName: selectedUser?.username || '',
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Gider başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addForm.reset();
      setOpenDialog(false);
      await loadExpenses();
    } catch (error) {
      console.error('❌ Expense add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Gider eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id || null);
    const date = expense.date?.toDate ? expense.date.toDate() : new Date();
    editForm.reset({
      date: date.toISOString().split('T')[0],
      category: expense.category,
      amount: expense.amount,
      paymentType: expense.paymentType || '',
      userId: expense.userId || '',
      description: expense.description || '',
    });
    setOpenDialog(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateExpense = async (values: any) => {
    if (!editingExpenseId) return;

    try {
      setLoading(true);
      const selectedUser = users.find((u) => u.id === values.userId);
      await expenseService.updateExpense(editingExpenseId, {
        date: new Date(values.date),
        category: values.category,
        amount: Number(values.amount),
        description: values.description || '',
        paymentType: values.paymentType || '',
        userId: values.userId,
        userName: selectedUser?.username || '',
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Gider başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingExpenseId(null);
      editForm.reset();
      setOpenDialog(false);
      await loadExpenses();
    } catch (error) {
      console.error('❌ Expense update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Gider güncellenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '-';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp as any);
    return date.toLocaleDateString('tr-TR');
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      kira: 'Kira',
      elektrik: 'Elektrik',
      yem: 'Yem',
      malzeme: 'Malzeme',
      kargo: 'Kargo',
      diğer: 'Diğer',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'default' } = {
      kira: 'error',
      elektrik: 'warning',
      yem: 'success',
      malzeme: 'info',
      kargo: 'primary',
      diğer: 'default',
    };
    return colors[category] || 'default';
  };

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
          mb: 2,
        }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Giderler
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
              onClick={() =>
                filterForm.reset({ category: '', paymentType: '', userId: '', startDate: '', endDate: '' })
              }
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
            Yeni Gider Ekle
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
          <Form form={filterForm} schema={expenseFilterSchema} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                filterForm.reset({ category: '', paymentType: '', userId: '', startDate: '', endDate: '' })
              }
              fullWidth>
              Temizle
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)} fullWidth>
              Uygula
            </Button>
          </Box>
        </Box>
      </Drawer>

      {isMobile ? (
        <Stack spacing={2}>
          {filteredExpenses.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary" align="center">
                {expenses.length === 0 ? 'Henüz gider kaydı bulunmamaktadır' : 'Filtreye uygun gider bulunamadı'}
              </Typography>
            </Paper>
          ) : (
            filteredExpenses.map((expense) => (
              <Card key={expense.id} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tarih
                        </Typography>
                        <Typography variant="caption">{formatDate(expense.date)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Kategori
                        </Typography>
                        <Chip
                          label={getCategoryLabel(expense.category)}
                          color={getCategoryColor(expense.category)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Tutar
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {expense.amount?.toFixed(2)} ₺
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ödeme Tipi
                        </Typography>
                        <Typography variant="body2">{expense.paymentType || '-'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Kullanıcı
                        </Typography>
                        <Typography variant="body2">{expense.userName || '-'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Açıklama
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                          {expense.description || '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditExpense(expense)}>
                          Düzenle
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => expense.id && handleDeleteExpense(expense.id)}>
                          Sil
                        </Button>
                      </Stack>
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
                <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Tutar
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ödeme Tipi</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>
                      {expenses.length === 0 ? 'Henüz gider kaydı bulunmamaktadır' : 'Filtreye uygun gider bulunamadı'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(expense.category)}
                        color={getCategoryColor(expense.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {expense.amount?.toFixed(2)} ₺
                    </TableCell>
                    <TableCell>{expense.paymentType || '-'}</TableCell>
                    <TableCell>{expense.userName || '-'}</TableCell>
                    <TableCell>{expense.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditExpense(expense)}
                        sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => expense.id && handleDeleteExpense(expense.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingExpenseId(null);
          addForm.reset();
          editForm.reset();
        }}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          {editingExpenseId ? 'Gider Güncelle' : 'Yeni Gider Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            form={editingExpenseId ? editForm : addForm}
            schema={expenseSchema}
            onSubmit={(e) => {
              e.preventDefault();
              if (editingExpenseId) {
                editForm.handleSubmit(handleUpdateExpense)();
              } else {
                addForm.handleSubmit(handleAddExpense)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingExpenseId(null);
              addForm.reset();
              editForm.reset();
            }}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (editingExpenseId) {
                editForm.handleSubmit(handleUpdateExpense)();
              } else {
                addForm.handleSubmit(handleAddExpense)();
              }
            }}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            {editingExpenseId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesPage;
