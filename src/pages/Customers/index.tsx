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
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState, useEffect } from 'react';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerSchema, customerFilterSchema, CustomerFormData, CustomerFilterFormData } from './customers.validation';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types/customer';
import useResponsive from '../../hooks/useResponsive';
import { useMemo } from 'react';

const CustomersPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Customer Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);

  // Filter Form
  const filterForm = useForm<CustomerFilterFormData>({
    defaultValues: { name: '', type: '', city: '' },
    resolver: yupResolver(customerFilterSchema),
  });

  const watchFilters = filterForm.watch();

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (watchFilters.name) count++;
    if (watchFilters.type) count++;
    if (watchFilters.city) count++;
    return count;
  }, [watchFilters]);

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
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600 }}>
          Müşteriler
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
              onClick={() => filterForm.reset({ name: '', type: '', city: '' })}
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
            Yeni Müşteri Ekle
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
          <Form form={filterForm} schema={customerFilterSchema} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => filterForm.reset({ name: '', type: '', city: '' })} fullWidth>
              Temizle
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)} fullWidth>
              Uygula
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box>
        {isMobile ? (
          <Stack spacing={2}>
            {filteredCustomers.length === 0 ? (
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary" align="center">
                  {customers.length === 0 ? 'Henüz müşteri eklenmemiştir' : 'Filtreye uygun müşteri bulunamadı'}
                </Typography>
              </Paper>
            ) : (
              filteredCustomers.map((customer) => (
                <Card key={customer.id} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Müşteri Adı
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {customer.name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Tip
                          </Typography>
                          <Chip
                            label={getCustomerTypeLabel(customer.type)}
                            color={getCustomerTypeColor(customer.type)}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Telefon
                          </Typography>
                          <Typography variant="body2">{customer.phone || '-'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Şehir
                          </Typography>
                          <Typography variant="body2">{customer.city || '-'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Notlar
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                            {customer.notes || '-'}
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
                            onClick={() => handleEditCustomer(customer)}>
                            Düzenle
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => customer.id && handleDeleteCustomer(customer.id)}>
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
        )}
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
        fullWidth
        fullScreen={isMobile}>
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
