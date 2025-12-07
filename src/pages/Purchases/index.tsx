import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Stack,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotice } from '@components';
import { purchaseService } from '../../services/purchaseService';
import { fishService } from '../../services/fishService';
import { Purchase, PurchaseItem } from '../../types/purchase';
import { Fish, FishCategory } from '../../types/fish';
import { Timestamp } from 'firebase/firestore';
import * as yup from 'yup';

// Validation schema
const purchaseSchema = yup.object().shape({
  date: yup.string().required('Tarih zorunludur'),
  supplierId: yup.string(),
  discountAmount: yup.number().min(0, 'İndirim 0 veya daha büyük olmalı').required('İndirim zorunludur'),
  shippingCost: yup.number().min(0, 'Kargo ücreti 0 veya daha büyük olmalı'),
  notes: yup.string(),
});

const PurchasesPage = () => {
  const notice = useNotice();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [filteredFishes, setFilteredFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null);
  const [expandedPurchaseId, setExpandedPurchaseId] = useState<string | null>(null);

  // Items state
  const [purchaseItems, setPurchaseItems] = useState<
    {
      categoryId: string;
      fishTypeId: string;
      qty: number;
      unitPrice: number;
      lineTotal: number;
      note?: string;
    }[]
  >([]);

  const [currentItem, setCurrentItem] = useState({
    categoryId: '',
    fishTypeId: '',
    qty: 1,
    unitPrice: 0,
    note: '',
  });

  // Form
  const form = useForm({
    resolver: yupResolver(purchaseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      supplierId: '',
      discountAmount: 0,
      shippingCost: 0,
      notes: '',
    },
  });

  const watchDiscount = form.watch('discountAmount');
  const watchShipping = form.watch('shippingCost');

  // Load data
  useEffect(() => {
    loadPurchases();
    loadCategories();
    loadFishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getAllPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Alışlar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fishService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadFishes = async () => {
    try {
      const data = await fishService.getAllFishes();
      setFishes(data);
    } catch (error) {
      console.error('Error loading fishes:', error);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setCurrentItem({ ...currentItem, categoryId, fishTypeId: '', unitPrice: 0 });
    const filtered = fishes.filter((fish) => fish.categoryId === categoryId);
    setFilteredFishes(filtered);
  };

  // Handle fish change
  const handleFishChange = (fishId: string) => {
    const selectedFish = fishes.find((fish) => fish.id === fishId);
    if (selectedFish) {
      setCurrentItem({
        ...currentItem,
        fishTypeId: fishId,
        unitPrice: selectedFish.unitPrice || 0,
      });
    }
  };

  // Add item to purchase
  const handleAddItem = () => {
    if (!currentItem.categoryId || !currentItem.fishTypeId || currentItem.qty <= 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen kategori, balık türü ve miktar bilgilerini doldurun',
        buttonTitle: 'Tamam',
      });
      return;
    }

    const lineTotal = currentItem.qty * currentItem.unitPrice;
    setPurchaseItems([
      ...purchaseItems,
      {
        categoryId: currentItem.categoryId,
        fishTypeId: currentItem.fishTypeId,
        qty: currentItem.qty,
        unitPrice: currentItem.unitPrice,
        lineTotal,
        note: currentItem.note,
      },
    ]);

    setCurrentItem({
      categoryId: '',
      fishTypeId: '',
      qty: 1,
      unitPrice: 0,
      note: '',
    });
    setFilteredFishes([]);
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const grossTotal = purchaseItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = Number(watchDiscount) || 0;
  const netTotal = grossTotal - discountAmount;
  const shippingCost = Number(watchShipping) || 0;
  const totalCostWithShipping = netTotal + shippingCost;

  // Handle add purchase
  const handleAddPurchase = async (data: {
    date: string;
    supplierId?: string;
    discountAmount: number;
    shippingCost?: number;
    notes?: string;
  }) => {
    if (purchaseItems.length === 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'En az bir ürün eklemelisiniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);

      const purchaseDate = new Date(data.date);
      const year = purchaseDate.getFullYear();
      const month = String(purchaseDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;

      const items: PurchaseItem[] = purchaseItems.map((item) => ({
        fishTypeId: item.fishTypeId,
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        note: item.note,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const purchaseData: any = {
        date: Timestamp.fromDate(purchaseDate),
        monthKey,
        year,
        items,
        grossTotal,
        discountAmount,
        netTotal,
        totalCostWithShipping,
      };

      // Only add optional fields if they have values
      if (data.supplierId) {
        purchaseData.supplierId = data.supplierId;
      }
      if (data.shippingCost && data.shippingCost > 0) {
        purchaseData.shippingCost = data.shippingCost;
      }
      if (data.notes) {
        purchaseData.notes = data.notes;
      }

      if (editingPurchaseId) {
        await purchaseService.updatePurchase(editingPurchaseId, purchaseData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Alış güncellendi',
          buttonTitle: 'Tamam',
        });
      } else {
        await purchaseService.addPurchase(purchaseData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Alış eklendi',
          buttonTitle: 'Tamam',
        });
      }

      handleCloseDialog();
      loadPurchases();
    } catch (error) {
      console.error('Error saving purchase:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Alış kaydedilirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete purchase
  const handleDeletePurchase = async (id: string) => {
    if (!window.confirm('Bu alışı silmek istediğinize emin misiniz?')) return;

    try {
      setLoading(true);
      await purchaseService.deletePurchase(id);
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Alış silindi',
        buttonTitle: 'Tamam',
      });
      loadPurchases();
    } catch (error) {
      console.error('Error deleting purchase:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Alış silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle open dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setEditingPurchaseId(null);
    setPurchaseItems([]);
    form.reset({
      date: new Date().toISOString().split('T')[0],
      supplierId: '',
      discountAmount: 0,
      shippingCost: 0,
      notes: '',
    });
    // Reload categories and fishes to get latest data
    loadCategories();
    loadFishes();
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPurchaseId(null);
    setPurchaseItems([]);
    form.reset();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Alışlar
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Yeni Alış Ekle
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : purchases.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Henüz alış kaydı bulunmuyor. Yeni alış eklemek için yukarıdaki butonu kullanın.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {purchases.map((purchase) => {
            const isExpanded = expandedPurchaseId === purchase.id;

            return (
              <Paper key={purchase.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6">
                        Tarih: {purchase.date?.toDate?.()?.toLocaleDateString('tr-TR') || '-'}
                      </Typography>
                      <IconButton size="small" onClick={() => setExpandedPurchaseId(isExpanded ? null : purchase.id!)}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    {purchase.supplierId && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Tedarikçi: {purchase.supplierId}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Ürün Sayısı: {purchase.items?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Brüt Toplam: ₺{purchase.grossTotal?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      İndirim: ₺{purchase.discountAmount?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Toplam: ₺{purchase.netTotal?.toFixed(2) || '0.00'}
                    </Typography>
                    {purchase.shippingCost && purchase.shippingCost > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Kargo: ₺{purchase.shippingCost.toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                      Toplam Maliyet: ₺{purchase.totalCostWithShipping?.toFixed(2) || '0.00'}
                    </Typography>

                    {/* Collapsible Items Section */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Alınan Balıklar:
                        </Typography>
                        <Stack spacing={1}>
                          {purchase.items?.map((item, index) => {
                            const fish = fishes.find((f) => f.id === item.fishTypeId);
                            const category = categories.find((c) => c.id === fish?.categoryId);

                            return (
                              <Paper key={index} sx={{ p: 1.5, backgroundColor: 'grey.50' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {fish?.name || 'Bilinmeyen Balık'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Canlı Doğuran: {category?.name || '-'} | Miktar: {item.qty} | Birim: ₺
                                  {item.unitPrice?.toFixed(2) || '0.00'} | Toplam: ₺
                                  {item.lineTotal?.toFixed(2) || '0.00'}
                                </Typography>
                                {item.note && (
                                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                    Not: {item.note}
                                  </Typography>
                                )}
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Box>
                    </Collapse>

                    {purchase.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Not: {purchase.notes}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton size="small" color="error" onClick={() => handleDeletePurchase(purchase.id!)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPurchaseId ? 'Alışı Düzenle' : 'Yeni Alış Ekle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Date Input */}
            <input
              type="date"
              {...form.register('date')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '16px',
                fontSize: '16px',
              }}
            />

            {/* Supplier Input */}
            <input
              type="text"
              placeholder="Tedarikçi Adı (Opsiyonel)"
              {...form.register('supplierId')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '16px',
                fontSize: '16px',
              }}
            />

            {/* Items Section */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Ürün Ekle
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                {/* Category */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Fish */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Balık Türü
                  </Typography>
                  <select
                    value={currentItem.fishTypeId}
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
                        {fish.name}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Quantity */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Miktar
                  </Typography>
                  <input
                    type="number"
                    value={currentItem.qty}
                    onChange={(e) => setCurrentItem({ ...currentItem, qty: Number(e.target.value) })}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>

                {/* Unit Price */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Birim Fiyat (₺)
                  </Typography>
                  <input
                    type="number"
                    value={currentItem.unitPrice}
                    onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: Number(e.target.value) })}
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

                {/* Note */}
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Not (Opsiyonel)
                  </Typography>
                  <input
                    type="text"
                    value={currentItem.note}
                    onChange={(e) => setCurrentItem({ ...currentItem, note: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  />
                </Box>
              </Box>

              <Button variant="contained" onClick={handleAddItem} fullWidth>
                Ürün Ekle
              </Button>
            </Paper>

            {/* Items List */}
            {purchaseItems.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Eklenen Ürünler
                </Typography>
                <Stack spacing={1}>
                  {purchaseItems.map((item, index) => {
                    const fish = fishes.find((f) => f.id === item.fishTypeId);
                    const category = categories.find((c) => c.id === item.categoryId);
                    return (
                      <Paper key={index} sx={{ p: 1.5, backgroundColor: 'grey.100' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {fish?.name || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {category?.name || '-'} | Miktar: {item.qty} | Birim: ₺{item.unitPrice.toFixed(2)} |
                              Toplam: ₺{item.lineTotal.toFixed(2)}
                            </Typography>
                            {item.note && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Not: {item.note}
                              </Typography>
                            )}
                          </Box>
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Financial Summary */}
            {purchaseItems.length > 0 && (
              <Paper sx={{ p: 2, mt: 2, backgroundColor: 'primary.50' }}>
                <Typography variant="body2">Brüt Toplam: ₺{grossTotal.toFixed(2)}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Net Toplam: ₺{netTotal.toFixed(2)}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  Toplam Maliyet: ₺{totalCostWithShipping.toFixed(2)}
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button
            onClick={form.handleSubmit(handleAddPurchase)}
            variant="contained"
            disabled={loading || purchaseItems.length === 0}>
            {loading ? <CircularProgress size={24} /> : editingPurchaseId ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchasesPage;
