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
  Drawer,
  Badge,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputLabel from '../../components/common/Form/_partials/components/CustomInputLabel';
import { CustomTextInput } from '../../components/common/Form/_partials/components/CustomTextInput';
import { useNotice, Form } from '@components';
import { salesService } from '../../services/salesService';
import { customerService } from '../../services/customerService';
import { fishService } from '../../services/fishService';
import { tankService } from '../../services/tankService';
import { collectionService } from '../../services/collectionService';
import { Sale } from '../../types/sale';
import { Collection } from '../../types/collection';
import { Customer } from '../../types/customer';
import { Fish, FishCategory } from '../../types/fish';
import { Tank, TankStock } from '../../types/tank';
import { saleSchema, createSaleSchema, createSaleFilterSchema } from './sales.validation';
import { useMemo } from 'react';

const SalesPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [allTankStocks, setAllTankStocks] = useState<TankStock[]>([]);
  const [tankStocks, setTankStocks] = useState<TankStock[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Items state for multiple fish
  const [saleItems, setSaleItems] = useState<
    {
      categoryId: string;
      fishId: string;
      stockId: string; // Stok ID'si - hangi stok kaydından satıldığını belirler (size bilgisi için)
      size: 'small' | 'medium' | 'large'; // Stoktan gelen boy bilgisi
      quantity: number;
      gift: number;
      unitPrice: number;
      unitCost?: number;
      total: number;
      profit?: number;
      profitMargin?: number;
      tankId?: string;
    }[]
  >([]);
  const [currentItem, setCurrentItem] = useState({
    categoryId: '',
    fishId: '',
    quantity: 1,
    gift: 0,
    unitPrice: 0,
    tankId: '',
  });

  // State to hold input values for each fish in the stock table (stockId için)
  const [fishInputs, setFishInputs] = useState<Record<string, { quantity: number; gift: number; unitPrice: number }>>(
    {},
  );

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

  // Handle tank change for current item
  const handleTankChange = async (tankId: string) => {
    console.log('🔄 Tank changed:', tankId);
    console.log('📦 Available fishes:', fishes.length);
    console.log('🏢 Available tanks:', tanks.length);
    console.log('📦 All tank stocks:', allTankStocks.length);

    setCurrentItem({ ...currentItem, tankId, categoryId: '', fishId: '', unitPrice: 0 });

    if (tankId) {
      setLoadingStocks(true);
      try {
        // Filter stocks for selected tank from already loaded data
        const stocks = allTankStocks.filter((stock) => stock.tankId === tankId);
        console.log('✅ Filtered stocks for tank:', stocks.length, stocks);
        setTankStocks(stocks);

        // Initialize input values for each stock (stockId bazlı)
        const initialInputs: Record<string, { quantity: number; gift: number; unitPrice: number }> = {};
        stocks.forEach((stock) => {
          const fish = fishes.find((f) => f.id === stock.fishTypeId);
          console.log(`🐠 Fish for ${stock.fishTypeName}:`, fish);
          // Her stok kaydı için ayrı input (farklı boylar farklı stok kayıtları)
          initialInputs[stock.id!] = {
            quantity: 1,
            gift: 0,
            unitPrice: fish?.unitPrice || 0,
          };
        });
        console.log('💾 Initial inputs:', initialInputs);
        setFishInputs(initialInputs);
      } catch (error) {
        console.error('❌ Tank stocks filtering error:', error);
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Tank stokları yüklenirken hata oluştu',
          buttonTitle: 'Tamam',
        });
      } finally {
        setLoadingStocks(false);
      }
    } else {
      setTankStocks([]);
      setFishInputs({});
    }
  };

  // Add fish from stock table
  const handleAddFishFromTable = (stockId: string) => {
    const stockItem = tankStocks.find((stock) => stock.id === stockId);
    if (!stockItem) return;

    const inputs = fishInputs[stockId];
    if (!inputs || inputs.quantity <= 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen adet giriniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    const availableStock = Number(stockItem.quantity);
    const totalQuantityNeeded = Number(inputs.quantity) + Number(inputs.gift); // Toplam stok ihtiyacı (adet + hediye)
    const paidQuantity = Number(inputs.quantity) - Number(inputs.gift); // Hediye çıkarıldıktan sonra kalan (ödenen miktar)

    if (totalQuantityNeeded > availableStock) {
      notice({
        variant: 'error',
        title: 'Yetersiz Stok',
        message: `Mevcut stok: ${availableStock} adet. Toplam ${totalQuantityNeeded} adet (${inputs.quantity} adet + ${inputs.gift} hediye) için yeterli değil.`,
        buttonTitle: 'Tamam',
      });
      return;
    }

    const fish = fishes.find((f) => f.id === stockItem.fishTypeId);
    if (!fish) return;

    const total = paidQuantity * Number(inputs.unitPrice); // (Adet - Hediye) * Birim Fiyat
    const unitCost = Number(stockItem.unitCost) || 0; // Stoktan maliyet bilgisini al
    const soldQuantity = paidQuantity; // Satılan miktar (hediye hariç)
    const costAmount = soldQuantity * unitCost; // Toplam maliyet
    const profit = unitCost === 0 ? total : total - costAmount; // Kar (kendi üretimse toplam tutar kar)
    const profitMargin = total > 0 ? (profit / total) * 100 : 0; // Kar marjı %

    setSaleItems([
      ...saleItems,
      {
        categoryId: fish.categoryId || '',
        fishId: stockItem.fishTypeId,
        stockId: stockItem.id!, // Hangi stok kaydından satıldığı
        size: stockItem.size || 'medium', // Stoktan gelen boy bilgisi
        quantity: Number(inputs.quantity),
        gift: Number(inputs.gift),
        unitPrice: Number(inputs.unitPrice),
        unitCost: Number(unitCost),
        total: Number(total),
        profit: Number(profit),
        profitMargin: Number(profitMargin),
        tankId: currentItem.tankId,
      },
    ]);

    // Reset input values for this stock
    setFishInputs({
      ...fishInputs,
      [stockId]: {
        quantity: 1,
        gift: 0,
        unitPrice: fish.unitPrice,
      },
    });
  };

  // Remove item from sale items
  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subtotal = saleItems.reduce((sum, item) => sum + Number(item.total), 0);
  const discount = Number(watchDiscount) || 0;
  const total = subtotal - discount;

  // Customer options for select
  const customerOptions = customers.map((customer) => ({
    value: customer.id || '',
    label: `${customer.name} - ${customer.type}`,
  }));

  // Category options
  const categoryOptions = categories.map((cat) => ({
    value: cat.id || '',
    label: cat.name,
  }));

  // Fish options
  const fishOptions = fishes.map((fish) => ({
    value: fish.id || '',
    label: fish.name,
  }));

  // Create schema with customer options
  const saleSchemaWithOptions = createSaleSchema(customerOptions);

  // Create filter schema with options
  const saleFilterSchemaWithOptions = useMemo(
    () => createSaleFilterSchema(customerOptions, categoryOptions, fishOptions),
    [customerOptions, categoryOptions, fishOptions],
  );

  // Filter Form
  const filterForm = useForm({
    defaultValues: { customerId: '', categoryId: '', fishId: '', startDate: '', endDate: '' },
    resolver: yupResolver(saleFilterSchemaWithOptions),
  });

  const filterCustomerId = filterForm.watch('customerId');
  const filterCategoryId = filterForm.watch('categoryId');
  const filterFishId = filterForm.watch('fishId');
  const filterStartDate = filterForm.watch('startDate');
  const filterEndDate = filterForm.watch('endDate');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCustomerId) count++;
    if (filterCategoryId) count++;
    if (filterFishId) count++;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    return count;
  }, [filterCustomerId, filterCategoryId, filterFishId, filterStartDate, filterEndDate]);

  // Filtered sales based on form filters
  const filteredSales = useMemo(() => {
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

    return filtered;
  }, [sales, filterCustomerId, filterCategoryId, filterFishId, filterStartDate, filterEndDate, fishes]);

  const loadData = async () => {
    setLoading(true);
    console.log('Loading all data...');
    try {
      const [customersData, categoriesData, fishesData, tanksData, salesData, collectionsData, allStocksData] =
        await Promise.all([
          customerService.getAllCustomers(),
          fishService.getAllCategories(),
          fishService.getAllFishes(),
          tankService.getAllTanks(),
          salesService.getAllSales(),
          collectionService.getAllCollections(),
          tankService.getAllTankStocks(),
        ]);

      console.log('Data loaded:', {
        customers: customersData.length,
        categories: categoriesData.length,
        fishes: fishesData.length,
        tanks: tanksData.length,
        sales: salesData.length,
        collections: collectionsData.length,
        allStocks: allStocksData.length,
      });

      setCustomers(customersData);
      setCategories(categoriesData);
      setFishes(fishesData);
      setTanks(tanksData);
      setSales(salesData);
      setCollections(collectionsData);
      setAllTankStocks(allStocksData);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const handleDeleteSale = async (id: string) => {
    // Check if sale has any collections
    const saleCollections = collections.filter((c) => c.saleId === id);
    if (saleCollections.length > 0) {
      notice({
        variant: 'error',
        title: 'İşlem Yapılamaz',
        message: 'Bu satışta tahsilat bulunmaktadır. Tahsilatı olan satışlar silinemez.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);
      await salesService.deleteSale(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Satış silindi',
        buttonTitle: 'Tamam',
      });

      await loadData();
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
    setTankStocks([]);
    setFishInputs({});
    setCurrentItem({
      categoryId: '',
      fishId: '',
      quantity: 1,
      gift: 0,
      unitPrice: 0,
      tankId: '',
    });
    setOpenDialog(true);
  };

  const handleEditSale = (sale: Sale) => {
    if (!sale.id) return;

    // Check if sale has any collections
    const saleCollections = collections.filter((c) => c.saleId === sale.id);
    if (saleCollections.length > 0) {
      notice({
        variant: 'error',
        title: 'İşlem Yapılamaz',
        message: 'Bu satışta tahsilat bulunmaktadır. Tahsilatı olan satışlar düzenlenemez.',
        buttonTitle: 'Tamam',
      });
      return;
    }

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
          stockId: '', // Eski kayıtlar için boş
          size: item.size || 'medium',
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
          size: item.size,
          quantity: Number(item.quantity),
          gift: Number(item.gift),
          mortality: 0,
          soldQuantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          unitCost: Number(item.unitCost),
          total: Number(item.total),
          profit: Number(item.profit),
          profitMargin: Number(item.profitMargin),
          tankId: item.tankId,
        };
      });

      const saleData = {
        customerId: String(data.customerId) || '',
        customerName: selectedCustomer?.name || '',
        date: new Date(data.date),
        subtotal: Number(subtotal),
        discount: Number(data.discount) || 0,
        total: Number(total),
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

        // Update tank stocks for items with tankId (decrease stock)
        for (const item of saleItems) {
          if (item.tankId) {
            const tank = tanks.find((t) => t.id === item.tankId);
            const fish = fishes.find((f) => f.id === item.fishId);
            const category = categories.find((c) => c.id === fish?.categoryId);
            const totalQty = Number(item.quantity) + Number(item.gift); // Toplam miktar (adet + hediye)

            if (tank && fish && totalQty > 0) {
              try {
                // Check if enough stock exists
                const currentStock = await tankService.checkTankStock(tank.id!, fish.id!, item.size || 'medium');
                if (currentStock < totalQty) {
                  console.warn(
                    `Yetersiz stok: Tank ${tank.name} - ${fish.name}. Mevcut: ${currentStock}, İhtiyaç: ${totalQty} (${item.quantity} adet + ${item.gift} hediye)`,
                  );
                  // Continue anyway - you might want to show a warning to the user
                }

                await tankService.updateTankStock(
                  tank.id!,
                  tank.name,
                  fish.id!,
                  fish.name,
                  category?.name || '',
                  -totalQty, // Negative to decrease stock (adet + hediye)
                  0, // unitCost (satışta kullanılmaz)
                  item.size || 'medium', // Balık boyu
                );
              } catch (stockError) {
                console.error('Stok güncelleme hatası:', stockError);
                // Continue with other items even if one fails
              }
            }
          }
        }

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Satış eklendi ve stoklar güncellendi',
          buttonTitle: 'Tamam',
        });
      }

      setOpenDialog(false);
      await loadData();
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

      {/* Header with Filter and Add buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={activeFilterCount} color="primary">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              size="small">
              Filtreler
            </Button>
          </Badge>
          {activeFilterCount > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={() =>
                filterForm.reset({ customerId: '', categoryId: '', fishId: '', startDate: '', endDate: '' })
              }
              size="small">
              Temizle
            </Button>
          )}
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddSale} size="small">
            Yeni Satış Ekle
          </Button>
        </Box>
      </Box>

      {/* Filter Drawer */}
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtreler
            </Typography>
          </Box>
          <Form form={filterForm} schema={saleFilterSchemaWithOptions} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                filterForm.reset({ customerId: '', categoryId: '', fishId: '', startDate: '', endDate: '' })
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
            // Calculate collection status for this sale
            const saleCollections = collections.filter((c) => c.saleId === sale.id);
            const totalCollected = saleCollections.reduce((sum, c) => sum + Number(c.collectedAmount), 0);
            const remainingAmount = Number(sale.total) - totalCollected;
            const hasCollections = saleCollections.length > 0;
            const isFullyCollected = remainingAmount <= 0;

            return (
              <Card key={sale.id} sx={{ overflow: 'visible' }}>
                <CardContent>
                  {/* Header Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {sale.customerName}
                        </Typography>
                        {hasCollections && (
                          <Chip
                            label={isFullyCollected ? 'Tam Tahsilat' : 'Kısmi Tahsilat'}
                            size="small"
                            color={isFullyCollected ? 'success' : 'warning'}
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(sale.date)}
                      </Typography>
                      {hasCollections && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Tahsil Edilen: {totalCollected.toFixed(2)} ₺ | Kalan: {remainingAmount.toFixed(2)} ₺
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditSale(sale)}
                        disabled={hasCollections}
                        title={hasCollections ? 'Tahsilatı olan satışlar düzenlenemez' : 'Düzenle'}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => sale.id && handleDeleteSale(sale.id)}
                        disabled={hasCollections}
                        title={hasCollections ? 'Tahsilatı olan satışlar silinemez' : 'Sil'}>
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
                    sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
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
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Toplam Kar
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {(() => {
                          const totalProfit =
                            sale.items?.reduce((sum, item) => {
                              // Tüm ürünlerin karını hesapla (kendi üretim dahil)
                              return sum + (item.profit || 0);
                            }, 0) || 0;
                          return totalProfit > 0 ? `${totalProfit.toFixed(2)} ₺` : '-';
                        })()}
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
                                Boy
                              </Typography>
                              <Typography variant="body2">
                                {item.size === 'small' ? 'Small' : item.size === 'large' ? 'Large' : 'Medium'}
                              </Typography>
                            </Box>
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
                                Birim Maliyet
                              </Typography>
                              <Typography
                                variant="body2"
                                color={(item.unitCost || 0) === 0 ? 'success.main' : 'text.primary'}>
                                {(item.unitCost || 0) === 0
                                  ? 'Kendi Üretim'
                                  : `${Number(item.unitCost || 0).toFixed(2)} ₺`}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Toplam
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.total.toFixed(2)} ₺
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Kar
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                                color={(item.unitCost || 0) === 0 ? 'text.secondary' : 'success.main'}>
                                {(item.unitCost || 0) === 0
                                  ? '-'
                                  : `${(item.profit || 0).toFixed(2)} ₺ (${(item.profitMargin || 0).toFixed(1)}%)`}
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

            {/* Tank Selection */}
            <Paper sx={{ p: 2, mb: 2, backgroundColor: theme.palette.grey[50] }}>
              <Box>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                  Tank Seçiniz *
                </Typography>
                <select
                  value={currentItem.tankId}
                  onChange={(e) => handleTankChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                  }}>
                  <option value="">Tank Seçiniz</option>
                  {tanks.map((tank) => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name} ({tank.code})
                    </option>
                  ))}
                </select>
              </Box>
            </Paper>

            {/* Stock Table - Show when tank is selected */}
            {loadingStocks && (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: theme.palette.grey[50] }}>
                <CircularProgress size={30} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Stoklar yükleniyoy...
                </Typography>
              </Paper>
            )}

            {!loadingStocks && currentItem.tankId && tankStocks.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {tanks.find((t) => t.id === currentItem.tankId)?.name} - Stok Listesi
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Toplam Balık: {tankStocks.reduce((sum, s) => sum + s.quantity, 0)} adet • {tankStocks.length} tür
                  </Typography>
                </Box>

                {/* Mobile-friendly List View */}
                <Stack spacing={2}>
                  {tankStocks.map((stock) => {
                    const fish = fishes.find((f) => f.id === stock.fishTypeId);
                    const inputs = fishInputs[stock.id!] || {
                      quantity: 1,
                      gift: 0,
                      unitPrice: fish?.unitPrice || 0,
                    };

                    return (
                      <Paper
                        key={stock.id}
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.grey[50],
                          border: `1px solid ${theme.palette.grey[200]}`,
                        }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {stock.fishTypeName}
                              </Typography>
                              <Chip
                                label={stock.size === 'small' ? 'Small' : stock.size === 'large' ? 'Large' : 'Medium'}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Stok: {stock.quantity} adet
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            mb: 1,
                          }}>
                          <Box sx={{ flex: 1 }}>
                            <CustomInputLabel label="Adet" />
                            <CustomTextInput
                              type="text"
                              fullWidth
                              value={inputs.quantity === 0 ? '' : inputs.quantity}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, quantity: 0 },
                                  });
                                } else if (/^[0-9]+$/.test(value)) {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, quantity: Number(value) },
                                  });
                                }
                              }}
                              sx={{ mb: 0 }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <CustomInputLabel label="Hediye" />
                            <CustomTextInput
                              type="text"
                              fullWidth
                              value={inputs.gift === 0 ? '' : inputs.gift}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, gift: 0 },
                                  });
                                } else if (/^[0-9]+$/.test(value)) {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, gift: Number(value) },
                                  });
                                }
                              }}
                              sx={{ mb: 0 }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <CustomInputLabel label="Fiyat" />
                            <CustomTextInput
                              type="text"
                              fullWidth
                              value={inputs.unitPrice === 0 ? '' : inputs.unitPrice}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, unitPrice: 0 },
                                  });
                                } else if (/^[0-9]+(\.[0-9]*)?$/.test(value)) {
                                  setFishInputs({
                                    ...fishInputs,
                                    [stock.id!]: { ...inputs, unitPrice: Number(value) },
                                  });
                                }
                              }}
                              sx={{ mb: 0 }}
                            />
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddFishFromTable(stock.id!)}>
                          Sepete Ekle
                        </Button>
                      </Paper>
                    );
                  })}
                </Stack>
              </Paper>
            )}

            {/* Show message when tank is selected but no stock */}
            {!loadingStocks && currentItem.tankId && tankStocks.length === 0 && (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: theme.palette.grey[50] }}>
                <Typography color="text.secondary">Bu tankta henüz stok bulunmamaktadır</Typography>
              </Paper>
            )}

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
                              Boy
                            </Typography>
                            <Typography variant="body2">
                              {item.size === 'small' ? 'Small' : item.size === 'large' ? 'Large' : 'Medium'}
                            </Typography>
                          </Box>
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
                              Birim Maliyet
                            </Typography>
                            <Typography
                              variant="body2"
                              color={(item.unitCost || 0) === 0 ? 'success.main' : 'text.primary'}>
                              {(item.unitCost || 0) === 0
                                ? 'Kendi Üretim'
                                : `${Number(item.unitCost || 0).toFixed(2)} ₺`}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Toplam
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.total.toFixed(2)} ₺
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Kar
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                              color={(item.unitCost || 0) === 0 ? 'text.secondary' : 'success.main'}>
                              {(item.unitCost || 0) === 0 ? '-' : `${(item.profit || 0).toFixed(2)} ₺`}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Toplam Kar:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {(() => {
                          const totalProfit = saleItems.reduce((sum, item) => {
                            return sum + (item.profit || 0);
                          }, 0);
                          return totalProfit > 0 ? `${totalProfit.toFixed(2)} ₺` : '-';
                        })()}
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
