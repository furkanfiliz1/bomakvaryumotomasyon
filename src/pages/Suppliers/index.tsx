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
import { useState, useEffect, useMemo } from 'react';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { supplierSchema, supplierFilterSchema, SupplierFormData, SupplierFilterFormData } from './suppliers.validation';
import { supplierService } from '../../services/supplierService';
import { fishService } from '../../services/fishService';
import { Supplier } from '../../types/supplier';
import { Fish } from '../../types/fish';
import useResponsive from '../../hooks/useResponsive';

const SuppliersPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Supplier Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  // Fish options for form
  const fishOptions = useMemo(() => fishes.map((fish) => ({ value: fish.id || '', label: fish.name })), [fishes]);

  // Filter Form
  const filterForm = useForm<SupplierFilterFormData>({
    defaultValues: { name: '', fishId: '' },
    resolver: yupResolver(supplierFilterSchema(fishOptions)),
  });

  const watchFilters = filterForm.watch();

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (watchFilters.name) count++;
    if (watchFilters.fishId) count++;
    return count;
  }, [watchFilters]);

  // Filtered suppliers based on form filters
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const nameMatch = !watchFilters.name || supplier.name.toLowerCase().includes(watchFilters.name.toLowerCase());
      const fishMatch = !watchFilters.fishId || supplier.fishIds.includes(String(watchFilters.fishId));
      return nameMatch && fishMatch;
    });
  }, [suppliers, watchFilters]);

  // Add Supplier Form
  const addForm = useForm<SupplierFormData>({
    defaultValues: { name: '', fishIds: [], phone: '', address: '', notes: '' },
    resolver: yupResolver(supplierSchema(fishOptions)),
  });

  // Edit Supplier Form
  const editForm = useForm<SupplierFormData>({
    defaultValues: { name: '', fishIds: [], phone: '', address: '', notes: '' },
    resolver: yupResolver(supplierSchema(fishOptions)),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [suppliersData, fishesData] = await Promise.all([
        supplierService.getAllSuppliers(),
        fishService.getAllFishes(),
      ]);
      setSuppliers(suppliersData);
      setFishes(fishesData);
    } catch (error) {
      console.error('❌ Data loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Veriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setSuppliers([]);
      setFishes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSupplier = async (values: SupplierFormData) => {
    try {
      setLoading(true);
      await supplierService.addSupplier({
        name: values.name,
        fishIds: values.fishIds.map(String),
        phone: values.phone,
        address: values.address,
        notes: values.notes,
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tedarikçi başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addForm.reset();
      setOpenDialog(false);
      await loadData();
    } catch (error) {
      console.error('❌ Supplier add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tedarikçi eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      setLoading(true);
      await supplierService.deleteSupplier(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tedarikçi silindi',
        buttonTitle: 'Tamam',
      });

      await loadData();
    } catch (error) {
      console.error('❌ Supplier delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tedarikçi silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplierId(supplier.id || null);
    editForm.reset({
      name: supplier.name,
      fishIds: supplier.fishIds,
      phone: supplier.phone || '',
      address: supplier.address || '',
      notes: supplier.notes || '',
    });
    setOpenDialog(true);
  };

  const handleUpdateSupplier = async (values: SupplierFormData) => {
    if (!editingSupplierId) return;

    try {
      setLoading(true);
      await supplierService.updateSupplier(editingSupplierId, {
        name: values.name,
        fishIds: values.fishIds.map(String),
        phone: values.phone,
        address: values.address,
        notes: values.notes,
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tedarikçi başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingSupplierId(null);
      editForm.reset();
      setOpenDialog(false);
      await loadData();
    } catch (error) {
      console.error('❌ Supplier update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tedarikçi güncellenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
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
          Tedarikçiler
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
              onClick={() => filterForm.reset({ name: '', fishId: '' })}
              size="small"
              fullWidth={isMobile}>
              Temizle
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setEditingSupplierId(null);
              addForm.reset();
              setOpenDialog(true);
            }}
            size="small"
            fullWidth={isMobile}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni Tedarikçi Ekle
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
          <Form form={filterForm} schema={supplierFilterSchema(fishOptions)} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => filterForm.reset({ name: '', fishId: '' })} fullWidth>
              Temizle
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)} fullWidth>
              Uygula
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Supplier List */}
      <Box>
        {isMobile ? (
          <Stack spacing={2}>
            {filteredSuppliers.length === 0 ? (
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary" align="center">
                  {suppliers.length === 0 ? 'Henüz tedarikçi eklenmemiştir' : 'Filtreye uygun tedarikçi bulunamadı'}
                </Typography>
              </Paper>
            ) : (
              filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Tedarikçi Adı
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {supplier.name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Balık Türleri
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                              justifyContent: 'flex-end',
                              maxWidth: '60%',
                            }}>
                            {supplier.fishIds.map((fishId) => {
                              const fish = fishes.find((f) => f.id === fishId);
                              return fish ? <Chip key={fishId} label={fish.name} size="small" color="primary" /> : null;
                            })}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Telefon
                          </Typography>
                          <Typography variant="body2">{supplier.phone || '-'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Adres
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                            {supplier.address || '-'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Notlar
                          </Typography>
                          <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                            {supplier.notes || '-'}
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
                            onClick={() => handleEditSupplier(supplier)}>
                            Düzenle
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => supplier.id && handleDeleteSupplier(supplier.id)}>
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
                  <TableCell sx={{ fontWeight: 600 }}>Tedarikçi Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ürettiği Balık Türleri</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Adres</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Notlar</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        {suppliers.length === 0
                          ? 'Henüz tedarikçi eklenmemiştir'
                          : 'Filtreye uygun tedarikçi bulunamadı'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {supplier.fishIds.map((fishId) => {
                            const fish = fishes.find((f) => f.id === fishId);
                            return fish ? <Chip key={fishId} label={fish.name} size="small" color="primary" /> : null;
                          })}
                        </Box>
                      </TableCell>
                      <TableCell>{supplier.phone || '-'}</TableCell>
                      <TableCell>{supplier.address || '-'}</TableCell>
                      <TableCell>{supplier.notes || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton color="primary" size="small" onClick={() => handleEditSupplier(supplier)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => supplier.id && handleDeleteSupplier(supplier.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Add/Edit Supplier Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingSupplierId(null);
          addForm.reset();
          editForm.reset();
        }}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}>
        <DialogTitle>{editingSupplierId ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi Ekle'}</DialogTitle>
        <DialogContent dividers>
          <Form form={editingSupplierId ? editForm : addForm} schema={supplierSchema(fishOptions)} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingSupplierId(null);
              addForm.reset();
              editForm.reset();
            }}
            disabled={loading}>
            İptal
          </Button>
          <Button
            onClick={
              editingSupplierId ? editForm.handleSubmit(handleUpdateSupplier) : addForm.handleSubmit(handleAddSupplier)
            }
            variant="contained"
            disabled={loading}>
            {loading ? <CircularProgress size={24} /> : editingSupplierId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage;
