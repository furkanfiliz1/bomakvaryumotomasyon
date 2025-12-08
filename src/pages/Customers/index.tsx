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
import { customerSchema, customerFilterSchema, CustomerFormData, CustomerFilterFormData } from './customers.validation';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types/customer';
import { useMemo } from 'react';

const CustomersPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // Customer Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  // Filter Form
  const filterForm = useForm<CustomerFilterFormData>({
    defaultValues: { name: '', type: '', city: '' },
    resolver: yupResolver(customerFilterSchema),
  });

  const watchFilters = filterForm.watch();

  // Filtered customers based on form filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const nameMatch = !watchFilters.name || customer.name.toLowerCase().includes(watchFilters.name.toLowerCase());
      const typeMatch = !watchFilters.type || customer.type === watchFilters.type;
      const cityMatch = !watchFilters.city || customer.city?.toLowerCase().includes(watchFilters.city.toLowerCase());
      return nameMatch && typeMatch && cityMatch;
    });
  }, [customers, watchFilters]);

  // Add Customer Form
  const addForm = useForm<CustomerFormData>({
    defaultValues: { name: '', type: 'bireysel', phone: '', city: '', notes: '' },
    resolver: yupResolver(customerSchema),
  });

  // Edit Customer Form
  const editForm = useForm<CustomerFormData>({
    defaultValues: { name: '', type: 'bireysel', phone: '', city: '', notes: '' },
    resolver: yupResolver(customerSchema),
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('❌ Customers loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Müşteriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCustomer = async (values: CustomerFormData) => {
    try {
      setLoading(true);
      await customerService.addCustomer(values);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Müşteri başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addForm.reset();
      setOpenDialog(false);
      await loadCustomers();
    } catch (error) {
      console.error('❌ Customer add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Müşteri eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      await customerService.deleteCustomer(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Müşteri silindi',
        buttonTitle: 'Tamam',
      });

      await loadCustomers();
    } catch (error) {
      console.error('❌ Customer delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Müşteri silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id || null);
    editForm.reset({
      name: customer.name,
      type: customer.type,
      phone: customer.phone || '',
      city: customer.city || '',
      notes: customer.notes || '',
    });
    setOpenDialog(true);
  };

  const handleUpdateCustomer = async (values: CustomerFormData) => {
    if (!editingCustomerId) return;

    try {
      setLoading(true);
      await customerService.updateCustomer(editingCustomerId, values);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Müşteri başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingCustomerId(null);
      editForm.reset();
      setOpenDialog(false);
      await loadCustomers();
    } catch (error) {
      console.error('❌ Customer update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Müşteri güncellenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      arabacı: 'Arabacı',
      petshop: 'Petshop',
      bireysel: 'Bireysel',
    };
    return labels[type] || type;
  };

  const getCustomerTypeColor = (type: string) => {
    const colors: { [key: string]: 'primary' | 'success' | 'info' } = {
      arabacı: 'primary',
      petshop: 'success',
      bireysel: 'info',
    };
    return colors[type] || 'info';
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box>
        {/* Filter Form */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Form form={filterForm} schema={customerFilterSchema} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button variant="outlined" onClick={() => filterForm.reset({ name: '', type: '', city: '' })}>
              Temizle
            </Button>

            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
              Yeni Müşteri Ekle
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Müşteri Adı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tip</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Şehir</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Notlar</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>
                      {customers.length === 0 ? 'Henüz müşteri eklenmemiştir' : 'Filtreye uygun müşteri bulunamadı'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCustomerTypeLabel(customer.type)}
                        color={getCustomerTypeColor(customer.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.city || '-'}</TableCell>
                    <TableCell>{customer.notes || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCustomer(customer)}
                        sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => customer.id && handleDeleteCustomer(customer.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingCustomerId(null);
          addForm.reset();
          editForm.reset();
        }}
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          {editingCustomerId ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            form={editingCustomerId ? editForm : addForm}
            schema={customerSchema}
            onSubmit={(e) => {
              e.preventDefault();
              if (editingCustomerId) {
                editForm.handleSubmit(handleUpdateCustomer)();
              } else {
                addForm.handleSubmit(handleAddCustomer)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingCustomerId(null);
              addForm.reset();
              editForm.reset();
            }}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (editingCustomerId) {
                editForm.handleSubmit(handleUpdateCustomer)();
              } else {
                addForm.handleSubmit(handleAddCustomer)();
              }
            }}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            {editingCustomerId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersPage;
