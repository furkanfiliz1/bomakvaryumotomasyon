import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  useTheme,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Divider,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { tankService } from '../../services/tankService';
import { fishService } from '../../services/fishService';
import { Tank, TankStock } from '../../types/tank';
import { Fish, FishCategory } from '../../types/fish';
import { useNotice, Form } from '@components';
import { clearCollection } from '../../utils/clearCollections';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createTankStockSchema, TankStockFormData } from './tank-stock.validation';
import useResponsive from '../../hooks/useResponsive';

const TankStocksPage = () => {
  const theme = useTheme();
  const notice = useNotice();
  const isMobile = useResponsive('down', 'sm') ?? false;

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankStocks, setTankStocks] = useState<TankStock[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState<string>('');

  // Form state for editing stock
  const [editingStock, setEditingStock] = useState<{
    tankId: string;
    tankName: string;
    fishTypeId: string;
    fishTypeName: string;
    categoryName: string;
    currentQuantity: number;
    newQuantity: number;
    unitCost: number;
    deathCount: number;
    newDeathCount: number;
    size: 'small' | 'medium' | 'large';
  } | null>(null);

  // Create dynamic options for form selects
  const tankOptions = useMemo(
    () => tanks.map((tank) => ({ id: tank.id!, name: `${tank.name} (${tank.code})` })),
    [tanks],
  );

  const categoryOptions = useMemo(() => categories.map((cat) => ({ id: cat.id!, name: cat.name })), [categories]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const fishOptions = useMemo(
    () =>
      fishes
        .filter((fish) => !selectedCategoryId || fish.categoryId === selectedCategoryId)
        .map((fish) => ({ id: fish.id!, name: fish.name })),
    [fishes, selectedCategoryId],
  );

  // Log options for debugging
  useEffect(() => {
    console.log('📊 Options updated:', {
      tanks: tankOptions.length,
      categories: categoryOptions.length,
      fishes: fishOptions.length,
    });
  }, [tankOptions, categoryOptions, fishOptions]);

  // Create schema with current options
  const tankStockSchema = useMemo(
    () => createTankStockSchema(tankOptions, categoryOptions, fishOptions, !selectedCategoryId),
    [tankOptions, categoryOptions, fishOptions, selectedCategoryId],
  );

  // Form for adding new stock - recreate when schema changes
  const addStockForm = useForm<TankStockFormData>({
    resolver: yupResolver(tankStockSchema),
    defaultValues: {
      tankId: '',
      categoryId: '',
      fishId: '',
      size: 'medium',
      quantity: 0,
    },
  });

  // Reset resolver when schema changes
  useEffect(() => {
    const subscription = addStockForm.watch(() => {});
    return () => subscription.unsubscribe();
  }, [addStockForm, tankStockSchema]);

  // Watch categoryId changes to filter fish options
  const watchedCategoryId = addStockForm.watch('categoryId');

  useEffect(() => {
    const categoryId = String(watchedCategoryId || '');
    if (categoryId !== selectedCategoryId) {
      setSelectedCategoryId(categoryId);
      if (categoryId) {
        addStockForm.setValue('fishId', '');
      }
    }
  }, [watchedCategoryId, selectedCategoryId, addStockForm]);

  // Update resolver when schema changes
  useEffect(() => {
    addStockForm.clearErrors();
  }, [tankStockSchema, addStockForm]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    console.log('geldi');
    try {
      const fishesData = await fishService.getAllFishes();
      const categoriesData = await fishService.getAllCategories();
      const tanksData = await tankService.getAllTanks();
      const stocksData = await tankService.getAllTankStocks();
      console.log('tanksData', tanksData);
      console.log('fishesData', fishesData);
      console.log('categoriesData', categoriesData);

      console.log('tanksData', tanksData);
      console.log('fishesData', fishesData);
      console.log('categoriesData', categoriesData);
      setTanks(tanksData);
      setTankStocks(stocksData);
      setFishes(fishesData);
      setCategories(categoriesData);
    } catch (error) {
      console.log('Error loading data:', error);
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

  const handleOpenEditDialog = (stock: TankStock) => {
    setEditingStock({
      tankId: stock.tankId,
      tankName: stock.tankName || '',
      fishTypeId: stock.fishTypeId,
      fishTypeName: stock.fishTypeName || '',
      categoryName: stock.categoryName || '',
      currentQuantity: stock.quantity,
      newQuantity: stock.quantity,
      unitCost: stock.unitCost || 0,
      deathCount: stock.deathCount || 0,
      newDeathCount: 0,
      size: stock.size || 'medium',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStock(null);
  };

  const handleOpenAddDialog = () => {
    setSelectedCategoryId('');
    addStockForm.reset({
      tankId: '',
      categoryId: '',
      fishId: '',
      quantity: 0,
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedCategoryId('');
    addStockForm.reset();
  };

  const handleAddNewStock = async (data: TankStockFormData) => {
    setLoading(true);
    try {
      const tank = tanks.find((t) => t.id === data.tankId);
      const fish = fishes.find((f) => f.id === data.fishId);
      const category = categories.find((c) => c.id === fish?.categoryId);

      if (!tank || !fish) {
        throw new Error('Tank veya balık bulunamadı');
      }

      await tankService.setTankStock(
        tank.id!,
        tank.name,
        fish.id!,
        fish.name,
        category?.name || '',
        data.quantity,
        0,
        0,
        data.size as 'small' | 'medium' | 'large',
      );

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Stok eklendi',
        buttonTitle: 'Tamam',
      });

      handleCloseAddDialog();
      loadData();
    } catch (error) {
      console.error('Error adding stock:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: error instanceof Error ? error.message : 'Stok eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStock = async () => {
    if (!editingStock) return;

    // Calculate final values
    const totalDeaths = editingStock.deathCount + editingStock.newDeathCount;
    const finalQuantity = editingStock.newQuantity - editingStock.newDeathCount;

    if (finalQuantity < 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Ölüm sayısı miktardan fazla olamaz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    setLoading(true);
    try {
      await tankService.setTankStock(
        editingStock.tankId,
        editingStock.tankName,
        editingStock.fishTypeId,
        editingStock.fishTypeName,
        editingStock.categoryName,
        finalQuantity,
        editingStock.unitCost,
        totalDeaths,
        editingStock.size,
      );

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Stok güncellendi',
        buttonTitle: 'Tamam',
      });

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Error updating stock:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: error instanceof Error ? error.message : 'Stok güncellenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllStocks = async () => {
    if (!window.confirm('TÜM STOK KAYITLARINI silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      return;
    }

    try {
      setLoading(true);
      const result = await clearCollection('tankStocks');

      if (result.success) {
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: `${result.count} stok kaydı silindi`,
          buttonTitle: 'Tamam',
        });
        await loadData();
      } else {
        throw new Error('Temizleme başarısız');
      }
    } catch (error) {
      console.error('Error clearing stocks:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Stoklar temizlenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = selectedTankId ? tankStocks.filter((s) => s.tankId === selectedTankId) : tankStocks;

  // Group stocks by tank
  const stocksByTank = filteredStocks.reduce(
    (acc, stock) => {
      if (!acc[stock.tankId]) {
        acc[stock.tankId] = [];
      }
      acc[stock.tankId].push(stock);
      return acc;
    },
    {} as Record<string, TankStock[]>,
  );

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
          Stok Yönetimi
        </Typography>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outlined"
              color="error"
              sx={{ display: 'none' }}
              onClick={handleClearAllStocks}
              disabled={loading}
              fullWidth={isMobile}>
              Tüm Stokları Temizle
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => handleOpenAddDialog()}
            fullWidth={isMobile}
            sx={{ background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }}>
            Yeni Stok Ekle
          </Button>
        </Stack>
      </Box>

      {/* Filter by Tank */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel>Tank Seç</InputLabel>
          <Select value={selectedTankId} onChange={(e) => setSelectedTankId(e.target.value)} label="Tank Seç">
            <MenuItem value="">
              <em>Tüm Tanklar</em>
            </MenuItem>
            {tanks.map((tank) => (
              <MenuItem key={tank.id} value={tank.id}>
                {tank.name} ({tank.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Stock Summary Cards */}
      <Stack spacing={2}>
        {Object.entries(stocksByTank).map(([tankId, stocks]) => {
          const tank = tanks.find((t) => t.id === tankId);
          const totalFish = stocks.reduce((sum, s) => sum + s.quantity, 0);

          return (
            <Paper key={tankId} sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {tank?.name || 'Bilinmeyen Tank'} ({tank?.code})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Toplam Balık: {totalFish} adet • {stocks.length} tür
                </Typography>
              </Box>

              {isMobile ? (
                // Mobile Card View
                <Stack spacing={2}>
                  {stocks.map((stock) => (
                    <Card key={stock.id} variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Kategori
                              </Typography>
                              <Chip label={stock.categoryName} size="small" />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Balık Türü
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {stock.fishTypeName}
                                </Typography>
                                <Chip
                                  label={stock.size === 'small' ? 'Small' : stock.size === 'large' ? 'Large' : 'Medium'}
                                  size="small"
                                  color={
                                    stock.size === 'large'
                                      ? 'primary'
                                      : stock.size === 'medium'
                                        ? 'default'
                                        : 'secondary'
                                  }
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Miktar
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {stock.quantity}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Birim Maliyet
                              </Typography>
                              <Typography
                                variant="body2"
                                color={stock.unitCost === 0 ? 'success.main' : 'text.primary'}>
                                {stock.unitCost === 0 ? 'Kendi Üretim' : `₺${Number(stock.unitCost || 0).toFixed(2)}`}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Toplam Maliyet
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {stock.totalCost === 0 ? '-' : `₺${Number(stock.totalCost || 0).toFixed(2)}`}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Ölüm Sayısı
                              </Typography>
                              <Typography
                                variant="body2"
                                color={(stock.deathCount || 0) > 0 ? 'error.main' : 'text.secondary'}>
                                {stock.deathCount || 0}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Ölüm Zararı
                              </Typography>
                              <Typography
                                variant="body2"
                                color={(stock.totalDeathLoss || 0) > 0 ? 'error.main' : 'text.secondary'}>
                                {(stock.totalDeathLoss || 0) > 0
                                  ? `₺${Number(stock.totalDeathLoss || 0).toFixed(2)}`
                                  : '-'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenEditDialog(stock)}>
                              Düzenle
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                // Desktop Table View
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                        <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Balık Türü</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Miktar
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Birim Maliyet
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Toplam Maliyet
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Ölüm Sayısı
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          Ölüm Zararı
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stocks.map((stock) => (
                        <TableRow key={stock.id} hover>
                          <TableCell>
                            <Chip label={stock.categoryName} size="small" />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {stock.fishTypeName}
                              <Chip
                                label={stock.size === 'small' ? 'Small' : stock.size === 'large' ? 'Large' : 'Medium'}
                                size="small"
                                color={
                                  stock.size === 'large' ? 'primary' : stock.size === 'medium' ? 'default' : 'secondary'
                                }
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {stock.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color={stock.unitCost === 0 ? 'success.main' : 'text.primary'}>
                              {stock.unitCost === 0 ? 'Kendi Üretim' : `₺${Number(stock.unitCost || 0).toFixed(2)}`}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {stock.totalCost === 0 ? '-' : `₺${Number(stock.totalCost || 0).toFixed(2)}`}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={(stock.deathCount || 0) > 0 ? 'error.main' : 'text.secondary'}>
                              {stock.deathCount || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={(stock.totalDeathLoss || 0) > 0 ? 'error.main' : 'text.secondary'}>
                              {(stock.totalDeathLoss || 0) > 0
                                ? `₺${Number(stock.totalDeathLoss || 0).toFixed(2)}`
                                : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(stock)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          );
        })}

        {filteredStocks.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary" align="center">
              {selectedTankId ? 'Bu tankta stok bulunmuyor' : 'Henüz stok eklenmedi'}
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Edit Stock Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>Stok Düzenle</DialogTitle>
        <DialogContent>
          {editingStock && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Tank" value={editingStock.tankName} disabled fullWidth />
              <TextField label="Balık Türü" value={editingStock.fishTypeName} disabled fullWidth />
              <TextField label="Kategori" value={editingStock.categoryName} disabled fullWidth />
              <TextField label="Mevcut Miktar" value={editingStock.currentQuantity} disabled fullWidth />
              <TextField
                label="Yeni Miktar"
                type="number"
                value={editingStock.newQuantity}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    newQuantity: Number(e.target.value),
                  })
                }
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Yeni Ölüm Sayısı"
                type="number"
                value={editingStock.newDeathCount}
                onChange={(e) =>
                  setEditingStock({
                    ...editingStock,
                    newDeathCount: Number(e.target.value),
                  })
                }
                fullWidth
                inputProps={{ min: 0 }}
                helperText={
                  `Önceki Toplam Ölüm: ${editingStock.deathCount} | ` +
                  `Yeni Toplam: ${editingStock.deathCount + editingStock.newDeathCount} | ` +
                  `Ölüm Zararı: ₺${(editingStock.newDeathCount * editingStock.unitCost).toFixed(2)}`
                }
              />
              <Grid container spacing={1}>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RemoveIcon />}
                    onClick={() =>
                      setEditingStock({
                        ...editingStock,
                        newQuantity: Math.max(0, editingStock.newQuantity - 10),
                      })
                    }>
                    -10
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RemoveIcon />}
                    onClick={() =>
                      setEditingStock({
                        ...editingStock,
                        newQuantity: Math.max(0, editingStock.newQuantity - 1),
                      })
                    }>
                    -1
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setEditingStock({
                        ...editingStock,
                        newQuantity: editingStock.newQuantity + 1,
                      })
                    }>
                    +1
                  </Button>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      setEditingStock({
                        ...editingStock,
                        newQuantity: editingStock.newQuantity + 10,
                      })
                    }>
                    +10
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSaveStock} variant="contained" disabled={loading}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Stock Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>Yeni Stok Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Form form={addStockForm} schema={tankStockSchema}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button onClick={handleCloseAddDialog}>İptal</Button>
                <Button onClick={addStockForm.handleSubmit(handleAddNewStock)} variant="contained" disabled={loading}>
                  Ekle
                </Button>
              </Stack>
            </Form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TankStocksPage;
