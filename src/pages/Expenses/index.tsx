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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { expenseSchema, ExpenseFormData } from './expenses.validation';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';

const ExpensesPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Add Form
  const addForm = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      paymentType: '',
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
      description: '',
    },
    resolver: yupResolver(expenseSchema),
  });

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
      await expenseService.addExpense({
        date: new Date(values.date),
        category: values.category,
        amount: Number(values.amount),
        description: values.description || '',
        paymentType: values.paymentType || '',
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
      description: expense.description || '',
    });
    setOpenDialog(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateExpense = async (values: any) => {
    if (!editingExpenseId) return;

    try {
      setLoading(true);
      await expenseService.updateExpense(editingExpenseId, {
        date: new Date(values.date),
        category: values.category,
        amount: Number(values.amount),
        description: values.description || '',
        paymentType: values.paymentType || '',
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
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Giderler
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
          Yeni Gider Ekle
        </Button>
      </Box>

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
              <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                İşlemler
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color={theme.palette.grey[600]}>Henüz gider kaydı bulunmamaktadır</Typography>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
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
                  <TableCell>{expense.description || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleEditExpense(expense)} sx={{ mr: 1 }}>
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
        fullWidth>
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
