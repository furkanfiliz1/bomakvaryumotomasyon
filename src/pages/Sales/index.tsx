import {
  Box,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotice, Form } from '@components';
import { salesService } from '../../services/salesService';
import { customerService } from '../../services/customerService';
import { fishService } from '../../services/fishService';
import { Sale } from '../../types/sale';
import { Customer } from '../../types/customer';
import { Fish, FishCategory } from '../../types/fish';
import { saleSchema, createSaleSchema } from './sales.validation';

const SalesPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [filteredFishes, setFilteredFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter state
  const [filterCustomerId, setFilterCustomerId] = useState<string>('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');
  const [filterFishId, setFilterFishId] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  // Items state for multiple fish
  const [saleItems, setSaleItems] = useState<
    {
      categoryId: string;
      fishId: string;
      quantity: number;
      gift: number;
      unitPrice: number;
      total: number;
    }[]
  >([]);
  const [currentItem, setCurrentItem] = useState({
    categoryId: '',
    fishId: '',
    quantity: 1,
    gift: 0,
    unitPrice: 0,
  });

  // Add Form
  const addForm = useForm({
    resolver: yupResolver(saleSchema),
    defaultValues: {
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      discount: 0,
      notes: '',
    },
  });

  // Edit Form
  const editForm = useForm({
    resolver: yupResolver(saleSchema),
  });

  // Watch discount for auto-calculation
  const watchDiscount = addForm.watch('discount');

  // Handle category change for current item
  const handleCategoryChange = (categoryId: string) => {
    setCurrentItem({ ...currentItem, categoryId, fishId: '', unitPrice: 0 });
    const filtered = fishes.filter((fish) => fish.categoryId === categoryId);
    setFilteredFishes(filtered);
  };

  // Handle fish change for current item
  const handleFishChange = (fishId: string) => {
    const selectedFish = fishes.find((fish) => fish.id === fishId);
    if (selectedFish) {
      setCurrentItem({
        ...currentItem,
        fishId,
        unitPrice: selectedFish.unitPrice,
      });
    }
  };

  // Handle quantity change for current item
  const handleQuantityChange = (quantity: number) => {
    setCurrentItem({ ...currentItem, quantity });
  };

  // Handle gift change for current item
  const handleGiftChange = (gift: number) => {
    setCurrentItem({ ...currentItem, gift });
  };

  // Handle unit price change for current item
  const handleUnitPriceChange = (unitPrice: number) => {
    setCurrentItem({ ...currentItem, unitPrice });
  };

  // Add current item to sale items
  const handleAddItem = () => {
    if (!currentItem.categoryId || !currentItem.fishId || currentItem.quantity <= 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen kategori, balık ve adet bilgilerini doldurun',
        buttonTitle: 'Tamam',
      });
      return;
    }

    // Calculate total: (quantity - gift) * unitPrice
    const total = (currentItem.quantity - currentItem.gift) * currentItem.unitPrice;
    setSaleItems([...saleItems, { ...currentItem, total }]);
    setCurrentItem({
      categoryId: '',
      fishId: '',
      quantity: 1,
      gift: 0,
      unitPrice: 0,
    });
    setFilteredFishes([]);
  };

  // Remove item from sale items
  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(watchDiscount) || 0;
  const total = subtotal - discount;

  // Customer options for select
  const customerOptions = customers.map((customer) => ({
    value: customer.id || '',
    label: `${customer.name} - ${customer.type}`,
  }));

  // Create schema with customer options
  const saleSchemaWithOptions = createSaleSchema(customerOptions);

  const loadCustomers = async () => {
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
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fishService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('❌ Categories loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategoriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const loadFishes = async () => {
    try {
      const data = await fishService.getAllFishes();
      setFishes(data);
    } catch (error) {
      console.error('❌ Fishes loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balıklar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await salesService.getAllSales();
      setSales(data);
    } catch (error) {
      console.error('❌ Sales loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Satışlar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadCategories();
    loadFishes();
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...sales];

    // Filter by customer
    if (filterCustomerId) {
      filtered = filtered.filter((sale) => sale.customerId === filterCustomerId);
    }

    // Filter by category
    if (filterCategoryId) {
      filtered = filtered.filter((sale) =>
        sale.items?.some((item) => {
          const fish = fishes.find((f) => f.id === item.fishId);
          return fish?.categoryId === filterCategoryId;
        }),
      );
    }

    // Filter by fish
    if (filterFishId) {
      filtered = filtered.filter((sale) => sale.items?.some((item) => item.fishId === filterFishId));
    }

    // Filter by start date
    if (filterStartDate) {
      filtered = filtered.filter((sale) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const saleDate = (sale.date as any)?.toDate ? (sale.date as any).toDate() : new Date(sale.date as any);
        return saleDate >= new Date(filterStartDate);
      });
    }

    // Filter by end date
    if (filterEndDate) {
      filtered = filtered.filter((sale) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const saleDate = (sale.date as any)?.toDate ? (sale.date as any).toDate() : new Date(sale.date as any);
        return saleDate <= new Date(filterEndDate);
      });
    }

    setFilteredSales(filtered);
  }, [sales, filterCustomerId, filterCategoryId, filterFishId, filterStartDate, filterEndDate, fishes]);

  const handleClearFilters = () => {
    setFilterCustomerId('');
    setFilterCategoryId('');
    setFilterFishId('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  const handleDeleteSale = async (id: string) => {
    try {
      setLoading(true);
      await salesService.deleteSale(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Satış silindi',
        buttonTitle: 'Tamam',
      });

      await loadSales();
    } catch (error) {
      console.error('❌ Sale delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Satış silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = () => {
    setEditingSaleId(null);
    addForm.reset({
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      discount: 0,
      notes: '',
    });
    setSaleItems([]);
    setCurrentItem({
      categoryId: '',
      fishId: '',
      quantity: 1,
      gift: 0,
      unitPrice: 0,
    });
    setFilteredFishes([]);
    setOpenDialog(true);
  };

  const handleEditSale = (sale: Sale) => {
    if (!sale.id) return;

    // Set editing ID first
    setEditingSaleId(sale.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date = (sale.date as any)?.toDate ? (sale.date as any).toDate() : new Date(sale.date as any);

    // Load items
    const items =
      sale.items?.map((item) => {
        const fish = fishes.find((f) => f.id === item.fishId);
        return {
          categoryId: fish?.categoryId || '',
          fishId: item.fishId,
          quantity: item.quantity,
          gift: item.gift || 0,
          unitPrice: item.unitPrice,
          total: item.total,
        };
      }) || [];

    setSaleItems(items);

    // Reset form with general info
    editForm.reset({
      customerId: sale.customerId || '',
      date: date.toISOString().split('T')[0],
      discount: sale.discount || 0,
      notes: sale.notes || '',
    });

    setOpenDialog(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveSale = async (data: any) => {
    try {
      setLoading(true);

      // Validate items
      if (saleItems.length === 0) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'En az bir ürün eklemelisiniz',
          buttonTitle: 'Tamam',
        });
        setLoading(false);
        return;
      }

      // Find customer name
      const selectedCustomer = customers.find((c) => c.id === String(data.customerId));

      // Prepare items with fish and category names
      const itemsWithNames = saleItems.map((item) => {
        const fish = fishes.find((f) => f.id === item.fishId);
        const category = categories.find((c) => c.id === item.categoryId);

        return {
          fishId: item.fishId,
          fishName: fish?.name || '',
          categoryName: category?.name || '',
          quantity: item.quantity,
          gift: item.gift,
          mortality: 0,
          soldQuantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        };
      });

      const saleData = {
        customerId: String(data.customerId) || '',
        customerName: selectedCustomer?.name || '',
        date: new Date(data.date),
        subtotal: subtotal,
        discount: Number(data.discount) || 0,
        total: total,
        notes: data.notes || '',
        items: itemsWithNames,
      };

      if (editingSaleId) {
        await salesService.updateSale(editingSaleId, saleData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Satış güncellendi',
          buttonTitle: 'Tamam',
        });
      } else {
        await salesService.addSale(saleData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Satış eklendi',
          buttonTitle: 'Tamam',
        });
      }

      setOpenDialog(false);
      await loadSales();
    } catch (error) {
      console.error('❌ Sale save error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Satış kaydedilirken hata oluştu',
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

  const toggleRow = (saleId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedRows(newExpanded);
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
          Satışlar
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddSale}>
          Yeni Satış Ekle
        </Button>
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Filtreleme
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {/* Customer Filter */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Müşteri
            </Typography>
            <select
              value={filterCustomerId}
              onChange={(e) => setFilterCustomerId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}>
              <option value="">Tümü</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </Box>

          {/* Category Filter */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Balık Kategorisi
            </Typography>
            <select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}>
              <option value="">Tümü</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Box>

          {/* Fish Filter */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Balık
            </Typography>
            <select
              value={filterFishId}
              onChange={(e) => setFilterFishId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}>
              <option value="">Tümü</option>
              {fishes.map((fish) => (
                <option key={fish.id} value={fish.id}>
                  {fish.name}
                </option>
              ))}
            </select>
          </Box>

          {/* Start Date Filter */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Başlangıç Tarihi
            </Typography>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </Box>

          {/* End Date Filter */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Bitiş Tarihi
            </Typography>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </Box>

          {/* Clear Filters Button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClearFilters} fullWidth>
              Filtreleri Temizle
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Sales List - Card Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredSales.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color={theme.palette.grey[600]}>
              {sales.length === 0 ? 'Henüz satış kaydı bulunmamaktadır' : 'Filtreye uygun satış bulunamadı'}
            </Typography>
          </Paper>
        ) : (
          filteredSales.map((sale) => {
            const isExpanded = expandedRows.has(sale.id || '');
            return (
              <Card key={sale.id} sx={{ overflow: 'visible' }}>
                <CardContent>
                  {/* Header Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {sale.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(sale.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <IconButton size="small" color="primary" onClick={() => handleEditSale(sale)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => sale.id && handleDeleteSale(sale.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(sale.id || '')}
                        disabled={!sale.items || sale.items.length === 0}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Summary Info */}
                  <Box
                    sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Ara Toplam
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {sale.subtotal?.toFixed(2)} ₺
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        İndirim
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'error.main' }}>
                        {sale.discount?.toFixed(2)} ₺
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Toplam
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {sale.total?.toFixed(2)} ₺
                      </Typography>
                    </Box>
                  </Box>

                  {/* Notes */}
                  {sale.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Notlar
                      </Typography>
                      <Typography variant="body2">{sale.notes}</Typography>
                    </Box>
                  )}

                  {/* Expandable Items Section */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                      Balıklar ({sale.items?.length || 0} ürün)
                    </Typography>
                    <Stack spacing={1.5}>
                      {sale.items?.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {item.fishName}
                            </Typography>
                            <Chip label={item.categoryName} size="small" sx={{ fontWeight: 500 }} />
                          </Box>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Adet
                              </Typography>
                              <Typography variant="body2">{item.quantity}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Hediye
                              </Typography>
                              <Typography variant="body2">{item.gift || 0}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Birim Fiyat
                              </Typography>
                              <Typography variant="body2">{item.unitPrice.toFixed(2)} ₺</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Toplam
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.total.toFixed(2)} ₺
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingSaleId ? 'Satış Güncelle' : 'Yeni Satış Ekle'}</DialogTitle>
        <DialogContent>
          {/* Main Form */}
          <Form form={editingSaleId ? editForm : addForm} onSubmit={handleSaveSale} schema={saleSchemaWithOptions} />

          {/* Items Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Ürünler
            </Typography>

            {/* Add Item Form */}
            <Paper sx={{ p: 2, mb: 2, backgroundColor: theme.palette.grey[50] }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 2 }}>
                {/* Category Select */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Kategori
                  </Typography>
                  <select
                    value={currentItem.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}>
                    <option value="">Seçiniz</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Fish Select */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Balık
                  </Typography>
                  <select
                    value={currentItem.fishId}
                    onChange={(e) => handleFishChange(e.target.value)}
                    disabled={!currentItem.categoryId}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}>
                    <option value="">Seçiniz</option>
                    {filteredFishes.map((fish) => (
                      <option key={fish.id} value={fish.id}>
                        {fish.name} - {fish.unitPrice.toFixed(2)} ₺
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Quantity Input */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Adet
                  </Typography>
                  <input
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>

                {/* Gift Input */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Hediye
                  </Typography>
                  <input
                    type="number"
                    value={currentItem.gift}
                    onChange={(e) => handleGiftChange(Number(e.target.value))}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>

                {/* Unit Price (editable) */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Birim Fiyat
                  </Typography>
                  <input
                    type="number"
                    value={currentItem.unitPrice}
                    onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>

                {/* Add Button */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth>
                    Ekle
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Items List - Card Layout */}
            {saleItems.length > 0 && (
              <Box>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {saleItems.map((item, index) => {
                    const fish = fishes.find((f) => f.id === item.fishId);
                    const category = categories.find((c) => c.id === item.categoryId);
                    return (
                      <Paper key={index} sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {fish?.name || '-'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={category?.name || '-'} size="small" sx={{ fontWeight: 500 }} />
                            <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Adet
                            </Typography>
                            <Typography variant="body2">{item.quantity}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Hediye
                            </Typography>
                            <Typography variant="body2">{item.gift}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Birim Fiyat
                            </Typography>
                            <Typography variant="body2">{item.unitPrice.toFixed(2)} ₺</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Toplam
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.total.toFixed(2)} ₺
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>

                {/* Summary Section */}
                <Paper sx={{ p: 2, backgroundColor: theme.palette.primary.light + '10' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Ara Toplam:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {subtotal.toFixed(2)} ₺
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                        İndirim:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                        {discount.toFixed(2)} ₺
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Genel Toplam:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {total.toFixed(2)} ₺
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={editingSaleId ? editForm.handleSubmit(handleSaveSale) : addForm.handleSubmit(handleSaveSale)}>
            {editingSaleId ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesPage;
