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
  Drawer,
  Badge,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotice, Form } from '@components';
import { useTheme } from '@mui/material/styles';
import { purchaseService } from '../../services/purchaseService';
import { purchasePaymentService } from '../../services/purchasePaymentService';
import { fishService } from '../../services/fishService';
import { tankService } from '../../services/tankService';
import { supplierService } from '../../services/supplierService';
import { Purchase, PurchaseItem } from '../../types/purchase';
import { PurchasePayment } from '../../types/purchasePayment';
import { Fish, FishCategory } from '../../types/fish';
import { Tank } from '../../types/tank';
import { Supplier } from '../../types/supplier';
import { Timestamp } from 'firebase/firestore';
import {
  createPurchaseFilterSchema,
  createPurchaseItemSchema,
  createPurchaseFormSchema,
  PurchaseFormData,
} from './purchases.validation';
import { useMemo } from 'react';

const PurchasesPage = () => {
  const notice = useNotice();
  const theme = useTheme();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [payments, setPayments] = useState<PurchasePayment[]>([]);
  const [purchasesWithPayments, setPurchasesWithPayments] = useState<
    Array<Purchase & { totalPaid: number; remainingAmount: number }>
  >([]);
  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  console.log('suppliers', suppliers);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [filteredFishes, setFilteredFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<
    (Purchase & { totalPaid: number; remainingAmount: number }) | null
  >(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null);
  const [expandedPurchaseId, setExpandedPurchaseId] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [fishDetailsOpen, setFishDetailsOpen] = useState(false);

  // Items state
  const [purchaseItems, setPurchaseItems] = useState<
    {
      categoryId: string;
      fishTypeId: string;
      size: 'small' | 'medium' | 'large';
      qty: number;
      unitPrice: number;
      unitCost: number; // Stok maliyeti (0 = kendi üretim)
      lineTotal: number;
      note?: string;
      tankId?: string;
    }[]
  >([]);

  // Form with proper typing
  const form = useForm<PurchaseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      supplierId: '',
      travelCost: undefined,
      notes: '',
    },
    mode: 'onChange',
  });

  // Item Form - initialize with basic defaults, resolver will be set dynamically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemForm = useForm<any>({
    defaultValues: {
      categoryId: '',
      fishTypeId: '',
      size: 'medium',
      qty: 1,
      unitPrice: 0,
      note: '',
      tankId: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const watchTravelCost = form.watch('travelCost');
  const watchSupplierId = form.watch('supplierId');

  // Category and Fish options for filter
  const categoryOptions = categories.map((cat) => ({
    value: cat.id || '',
    label: cat.name,
  }));

  const fishOptions = fishes.map((fish) => ({
    value: fish.id || '',
    label: fish.name,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id || '',
    label: supplier.name,
  }));

  const tankOptions = tanks.map((tank) => ({
    value: tank.id || '',
    label: `${tank.name} (${tank.code})`,
  }));

  // Watch item form fields
  const watchItemCategory = itemForm.watch('categoryId');
  const watchItemFish = itemForm.watch('fishTypeId');

  // Filter categories based on selected supplier's fish
  const filteredCategories = useMemo(() => {
    if (!watchSupplierId) {
      return categories; // Show all if no supplier selected
    }
    const selectedSupplier = suppliers.find((s) => s.id === watchSupplierId);
    if (!selectedSupplier) {
      return categories;
    }
    // Get unique category IDs from supplier's fish
    const supplierFish = fishes.filter((fish) => selectedSupplier.fishIds.includes(fish.id || ''));
    const uniqueCategoryIds = [...new Set(supplierFish.map((fish) => fish.categoryId))];
    return categories.filter((cat) => uniqueCategoryIds.includes(cat.id || ''));
  }, [watchSupplierId, suppliers, categories, fishes]);

  const filteredCategoryOptions = useMemo(
    () => filteredCategories.map((cat) => ({ value: cat.id || '', label: cat.name })),
    [filteredCategories],
  );

  // Purchase form schema with options
  const purchaseFormSchemaWithOptions = useMemo(() => createPurchaseFormSchema(supplierOptions), [supplierOptions]);

  // Item form schema with options - use filtered categories
  const itemSchemaWithOptions = useMemo(
    () =>
      createPurchaseItemSchema(
        filteredCategoryOptions,
        filteredFishes.map((f) => ({ value: f.id || '', label: f.name })),
        tankOptions,
      ),
    [filteredCategoryOptions, filteredFishes, tankOptions],
  );

  // Create filter schema with options
  const purchaseFilterSchemaWithOptions = useMemo(
    () => createPurchaseFilterSchema(categoryOptions, fishOptions, supplierOptions),
    [categoryOptions, fishOptions, supplierOptions],
  );

  // Filter Form
  const filterForm = useForm({
    defaultValues: { supplierId: '', categoryId: '', fishTypeId: '', startDate: '', endDate: '' },
    resolver: yupResolver(purchaseFilterSchemaWithOptions),
  });

  const filterSupplierId = filterForm.watch('supplierId');
  const filterCategoryId = filterForm.watch('categoryId');
  const filterFishTypeId = filterForm.watch('fishTypeId');
  const filterStartDate = filterForm.watch('startDate');
  const filterEndDate = filterForm.watch('endDate');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterSupplierId) count++;
    if (filterCategoryId) count++;
    if (filterFishTypeId) count++;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    return count;
  }, [filterSupplierId, filterCategoryId, filterFishTypeId, filterStartDate, filterEndDate]);

  // Filtered purchases based on form filters
  const filteredPurchases = useMemo(() => {
    let filtered = [...purchasesWithPayments];

    // Filter by supplier
    if (filterSupplierId) {
      filtered = filtered.filter((purchase) => purchase.supplierId === filterSupplierId);
    }

    // Filter by category
    if (filterCategoryId) {
      filtered = filtered.filter((purchase) =>
        purchase.items?.some((item) => {
          const fish = fishes.find((f) => f.id === item.fishTypeId);
          return fish?.categoryId === filterCategoryId;
        }),
      );
    }

    // Filter by fish type
    if (filterFishTypeId) {
      filtered = filtered.filter((purchase) => purchase.items?.some((item) => item.fishTypeId === filterFishTypeId));
    }

    // Filter by start date
    if (filterStartDate) {
      filtered = filtered.filter((purchase) => {
        const purchaseDate =
          purchase.date instanceof Timestamp ? purchase.date.toDate() : new Date(purchase.date as unknown as string);
        return purchaseDate >= new Date(filterStartDate);
      });
    }

    // Filter by end date
    if (filterEndDate) {
      filtered = filtered.filter((purchase) => {
        const purchaseDate =
          purchase.date instanceof Timestamp ? purchase.date.toDate() : new Date(purchase.date as unknown as string);
        return purchaseDate <= new Date(filterEndDate);
      });
    }

    return filtered;
  }, [
    purchasesWithPayments,
    filterSupplierId,
    filterCategoryId,
    filterFishTypeId,
    filterStartDate,
    filterEndDate,
    fishes,
  ]);

  // Calculate statistics
  const statistics = useMemo(() => {
    // Group by fish type
    const fishTypeStats: Record<
      string,
      {
        fishName: string;
        totalQty: number;
        totalAmount: number;
      }
    > = {};

    filteredPurchases.forEach((purchase) => {
      purchase.items?.forEach((item) => {
        const fishId = item.fishTypeId;
        if (!fishTypeStats[fishId]) {
          const fish = fishes.find((f) => f.id === fishId);
          fishTypeStats[fishId] = {
            fishName: fish?.name || 'Bilinmeyen',
            totalQty: 0,
            totalAmount: 0,
          };
        }
        fishTypeStats[fishId].totalQty += item.qty;
        fishTypeStats[fishId].totalAmount += item.lineTotal;
      });
    });

    // Convert to array and sort by totalAmount descending
    const fishTypeArray = Object.entries(fishTypeStats)
      .map(([fishId, stats]) => ({
        fishId,
        ...stats,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    // Calculate totals
    const totalFishTypes = fishTypeArray.length;
    const totalQuantity = fishTypeArray.reduce((sum, item) => sum + item.totalQty, 0);
    const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCostWithShipping, 0);
    const totalPaid = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalPaid, 0);
    const totalPayable = filteredPurchases.reduce((sum, purchase) => sum + purchase.remainingAmount, 0);

    return {
      fishTypeArray,
      totalFishTypes,
      totalQuantity,
      totalAmount,
      totalPaid,
      totalPayable,
    };
  }, [filteredPurchases, fishes]);

  // Load data
  useEffect(() => {
    loadData();
    loadCategories();
    loadFishes();
    loadSuppliers();
    loadTanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purchasesData, paymentsData] = await Promise.all([
        purchaseService.getAllPurchases(),
        purchasePaymentService.getAllPayments(),
      ]);

      setPurchases(purchasesData);
      setPayments(paymentsData);

      // Satın alımları ödemelerle birleştir
      const purchasesWithPaymentsData = purchasesData.map((purchase) => {
        const purchasePayments = paymentsData.filter((p) => p.purchaseId === purchase.id);
        const totalPaid = purchasePayments.reduce((sum, p) => sum + p.paidAmount, 0);
        const remainingAmount = purchase.totalCostWithShipping - totalPaid;

        return {
          ...purchase,
          totalPaid,
          remainingAmount,
        };
      });

      setPurchasesWithPayments(purchasesWithPaymentsData);
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

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const loadTanks = async () => {
    try {
      const data = await tankService.getAllTanks();
      setTanks(data);
    } catch (error) {
      console.error('Error loading tanks:', error);
    }
  };

  // Watch category change to filter fishes
  useEffect(() => {
    if (watchItemCategory) {
      let filtered = fishes.filter((fish) => fish.categoryId === watchItemCategory);

      // If supplier is selected, only show fish from that supplier
      if (watchSupplierId) {
        const selectedSupplier = suppliers.find((s) => s.id === watchSupplierId);
        if (selectedSupplier) {
          filtered = filtered.filter((fish) => selectedSupplier.fishIds.includes(fish.id || ''));
        }
      }

      setFilteredFishes(filtered);
      itemForm.setValue('fishTypeId', ''); // Reset fish selection
    } else {
      setFilteredFishes([]);
    }
  }, [watchItemCategory, fishes, itemForm, watchSupplierId, suppliers]);

  // Reset category selection when supplier changes
  useEffect(() => {
    itemForm.setValue('categoryId', '');
    itemForm.setValue('fishTypeId', '');
  }, [watchSupplierId, itemForm]);

  // Watch fish change to set unit price
  useEffect(() => {
    if (watchItemFish) {
      const selectedFish = fishes.find((fish) => fish.id === watchItemFish);
      if (selectedFish && selectedFish.unitPrice) {
        itemForm.setValue('unitPrice', selectedFish.unitPrice);
      }
    }
  }, [watchItemFish, fishes, itemForm]);

  // Add item to purchase
  const handleAddItem = itemForm.handleSubmit((data) => {
    const qty = Number(data.qty);
    const unitPrice = Number(data.unitPrice);
    const lineTotal = qty * unitPrice;
    setPurchaseItems([
      ...purchaseItems,
      {
        categoryId: data.categoryId,
        fishTypeId: data.fishTypeId,
        size: data.size || 'medium',
        qty,
        unitPrice,
        unitCost: unitPrice,
        lineTotal,
        note: data.note,
        tankId: data.tankId,
      },
    ]);

    // Reset form
    itemForm.reset({
      categoryId: '',
      fishTypeId: '',
      size: 'medium',
      qty: 1,
      unitPrice: 0,
      note: '',
      tankId: '',
    });
    setFilteredFishes([]);
  });

  // Remove item
  const handleRemoveItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const grossTotal = purchaseItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const travelCost = Number(watchTravelCost) || 0;
  const totalCostWithShipping = grossTotal + travelCost;

  // Handle add purchase
  const handleAddPurchase = async (data: PurchaseFormData) => {
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
        size: item.size,
        qty: Number(item.qty),
        unitPrice: Number(item.unitPrice),
        unitCost: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
        note: item.note,
        tankId: item.tankId,
      }));

      const purchaseData: Omit<Purchase, 'id' | 'createdAt'> = {
        date: Timestamp.fromDate(purchaseDate),
        monthKey,
        year,
        items,
        grossTotal: Number(grossTotal),
        totalCostWithShipping: Number(totalCostWithShipping),
        createdBy: '',
      };

      // Only add optional fields if they have values
      if (data.supplierId) {
        purchaseData.supplierId = data.supplierId;
      }
      if (data.travelCost && data.travelCost > 0) {
        purchaseData.travelCost = Number(data.travelCost);
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

        // Update tank stocks for items with tankId
        for (const item of purchaseItems) {
          if (item.tankId) {
            const tank = tanks.find((t) => t.id === item.tankId);
            const fish = fishes.find((f) => f.id === item.fishTypeId);
            const category = categories.find((c) => c.id === fish?.categoryId);

            if (tank && fish) {
              try {
                await tankService.updateTankStock(
                  tank.id!,
                  tank.name,
                  fish.id!,
                  fish.name,
                  category?.name || '',
                  Number(item.qty),
                  Number(item.unitPrice), // Stok maliyeti
                  item.size || 'medium', // Balık boyu
                );
              } catch (stockError) {
                console.error('Error updating tank stock:', stockError);
                // Continue with other items even if one fails
              }
            }
          }
        }

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Alış eklendi ve stoklar güncellendi',
          buttonTitle: 'Tamam',
        });
      }

      handleCloseDialog();
      await loadData();
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
      await loadData();
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

  // Handle open partial payment
  const handleOpenPartialPayment = (purchase: Purchase & { totalPaid: number; remainingAmount: number }) => {
    setSelectedPurchase(purchase);
    setPaymentAmount(0);
    setPaymentNotes('');
    setOpenPaymentDialog(true);
  };

  // Handle open full payment
  const handleOpenFullPayment = (purchase: Purchase & { totalPaid: number; remainingAmount: number }) => {
    setSelectedPurchase(purchase);
    setPaymentAmount(purchase.remainingAmount);
    setPaymentNotes('Tam Ödeme');
    setOpenPaymentDialog(true);
  };

  // Handle add payment
  const handleAddPayment = async () => {
    if (!selectedPurchase || paymentAmount <= 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen geçerli bir tutar giriniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    if (paymentAmount > selectedPurchase.remainingAmount) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Ödeme tutarı kalan tutardan fazla olamaz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);
      const supplier = suppliers.find((s) => s.id === selectedPurchase.supplierId);

      await purchasePaymentService.addPayment({
        purchaseId: selectedPurchase.id || '',
        supplierId: selectedPurchase.supplierId,
        supplierName: supplier?.name || 'Bilinmeyen Tedarikçi',
        purchaseTotal: selectedPurchase.totalCostWithShipping,
        paidAmount: paymentAmount,
        date: new Date(),
        notes: paymentNotes,
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Ödeme başarıyla kaydedildi ve kasadan düşüldü',
        buttonTitle: 'Tamam',
      });

      setOpenPaymentDialog(false);
      setSelectedPurchase(null);
      await loadData();
    } catch (error) {
      console.error('❌ Payment add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Ödeme eklenirken hata oluştu',
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
      travelCost: 0,
      notes: '',
    });
    // Reload categories and fishes to get latest data
    loadCategories();
    loadFishes();
    loadTanks();
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPurchaseId(null);
    setPurchaseItems([]);
    form.reset();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                filterForm.reset({ supplierId: '', categoryId: '', fishTypeId: '', startDate: '', endDate: '' })
              }
              size="small">
              Temizle
            </Button>
          )}
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog} size="small">
            Yeni Alış Ekle
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
            }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Balık Türü
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statistics.totalFishTypes}
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
              color: 'white',
            }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Toplam Adet
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {statistics.totalQuantity}
                  </Typography>
                </Box>
                <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
              color: 'white',
            }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Toplam Tutar
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₺{statistics.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <PaidIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: theme.palette.success.light }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Toplam Ödenen
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₺{statistics.totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: theme.palette.error.light, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Toplam Ödenecek
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₺{statistics.totalPayable.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <PaymentIcon sx={{ fontSize: 48, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fish Type Details */}
      {statistics.fishTypeArray.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, cursor: 'pointer' }}
            onClick={() => setFishDetailsOpen(!fishDetailsOpen)}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Balık Türlerine Göre Detaylar
            </Typography>
            <IconButton size="small">{fishDetailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Collapse in={fishDetailsOpen} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
              {statistics.fishTypeArray.map((fishType) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={fishType.fishId}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {fishType.fishName}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Miktar:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {fishType.totalQty} adet
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Tutar:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                          ₺{fishType.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Paper>
      )}

      {/* Filter Drawer */}
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtreler
            </Typography>
          </Box>
          <Form form={filterForm} schema={purchaseFilterSchemaWithOptions} onSubmit={(e) => e.preventDefault()} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                filterForm.reset({ supplierId: '', categoryId: '', fishTypeId: '', startDate: '', endDate: '' })
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Alışlar" />
          <Tab
            label={
              <Badge badgeContent={purchasesWithPayments.filter((p) => p.remainingAmount > 0).length} color="error">
                Ödenecekler
              </Badge>
            }
          />
        </Tabs>
      </Box>

      {/* Alışlar Tab */}
      {currentTab === 0 && (
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredPurchases.length === 0 ? (
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary">
                {purchases.length === 0
                  ? 'Henüz alış kaydı bulunmuyor. Yeni alış eklemek için yukarıdaki butonu kullanın.'
                  : 'Filtreye uygun alış bulunamadı'}
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {filteredPurchases.map((purchase) => {
                const isExpanded = expandedPurchaseId === purchase.id;

                return (
                  <Paper key={purchase.id} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6">
                            Tarih: {purchase.date?.toDate?.()?.toLocaleDateString('tr-TR') || '-'}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedPurchaseId(isExpanded ? null : purchase.id!)}>
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>

                        {purchase.supplierId && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Tedarikçi:{' '}
                            {suppliers.find((s) => s.id === purchase.supplierId)?.name || purchase.supplierId}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Ürün Sayısı: {purchase.items?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ara Toplam: ₺{purchase.grossTotal?.toFixed(2) || '0.00'}
                        </Typography>
                        {purchase.travelCost && purchase.travelCost > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Yol Parası: ₺{Number(purchase.travelCost).toFixed(2)}
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
                                const tank = tanks.find((t) => t.id === item.tankId);

                                return (
                                  <Paper key={index} sx={{ p: 1.5, backgroundColor: 'grey.50' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {fish?.name || 'Bilinmeyen Balık'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      Canlı Doğuran: {category?.name || '-'} | Boy:{' '}
                                      {item.size
                                        ? item.size === 'small'
                                          ? 'Small'
                                          : item.size === 'medium'
                                            ? 'Medium'
                                            : 'Large'
                                        : 'Medium'}{' '}
                                      | Miktar: {item.qty} | Birim: ₺{Number(item.unitPrice || 0).toFixed(2)} | Toplam:
                                      ₺{Number(item.lineTotal || 0).toFixed(2)}
                                    </Typography>
                                    {tank && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{ mt: 0.5 }}>
                                        Tank: {tank.name} ({tank.code})
                                      </Typography>
                                    )}
                                    {item.note && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{ mt: 0.5 }}>
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
        </>
      )}

      {/* Ödenecekler Tab */}
      {currentTab === 1 && (
        <>
          {purchasesWithPayments.filter((p) => p.remainingAmount > 0).length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
              <Typography color={theme.palette.grey[600]}>Ödenecek alış bulunmamaktadır</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {purchasesWithPayments
                .filter((p) => p.remainingAmount > 0)
                .map((purchase) => {
                  const supplier = suppliers.find((s) => s.id === purchase.supplierId);
                  return (
                    <Paper
                      key={purchase.id}
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.grey[200]}`,
                      }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {supplier?.name || 'Bilinmeyen Tedarikçi'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Alış Tarihi: {purchase.date?.toDate?.()?.toLocaleDateString('tr-TR') || '-'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                          gap: 2,
                          mb: 2,
                        }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Toplam Tutar
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            ₺{purchase.totalCostWithShipping.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Ödenen
                          </Typography>
                          <Chip label={`₺${purchase.totalPaid.toFixed(2)}`} color="info" size="small" />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Kalan
                          </Typography>
                          <Chip label={`₺${purchase.remainingAmount.toFixed(2)}`} color="warning" size="small" />
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenPartialPayment(purchase)}
                          sx={{ py: 1 }}>
                          Kısmi Ödeme
                        </Button>
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenFullPayment(purchase)}
                          sx={{ py: 1 }}>
                          Tümünü Öde
                        </Button>
                      </Box>
                    </Paper>
                  );
                })}
            </Box>
          )}

          {/* Ödeme Geçmişi */}
          <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Ödeme Geçmişi
          </Typography>

          {payments.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
              <Typography color={theme.palette.grey[600]}>Henüz ödeme kaydı bulunmamaktadır</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {payments.map((payment) => (
                <Paper
                  key={payment.id}
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.grey[200]}`,
                  }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {payment.supplierName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.date
                          ? typeof payment.date === 'string'
                            ? new Date(payment.date).toLocaleDateString('tr-TR')
                            : payment.date instanceof Date
                              ? payment.date.toLocaleDateString('tr-TR')
                              : (payment.date as Timestamp).toDate?.()?.toLocaleDateString('tr-TR') || '-'
                          : '-'}
                      </Typography>
                    </Box>
                    <Chip label={`₺${payment.paidAmount.toFixed(2)}`} color="success" size="small" />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Alış Toplamı
                      </Typography>
                      <Typography variant="body2">₺{payment.purchaseTotal.toFixed(2)}</Typography>
                    </Box>
                    {payment.notes && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Not
                        </Typography>
                        <Typography variant="body2">{payment.notes}</Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Ödeme Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Ödeme Ekle - {selectedPurchase && suppliers.find((s) => s.id === selectedPurchase.supplierId)?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Alış Toplamı: ₺{selectedPurchase?.totalCostWithShipping.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ödenen: ₺{selectedPurchase?.totalPaid.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
              Kalan Tutar: ₺{selectedPurchase?.remainingAmount.toFixed(2)}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Ödeme Tutarı"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, max: selectedPurchase?.remainingAmount, step: 0.01 }}
          />

          <TextField
            fullWidth
            label="Not"
            multiline
            rows={3}
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenPaymentDialog(false);
              setSelectedPurchase(null);
            }}
            color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleAddPayment}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Ödeme Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPurchaseId ? 'Alışı Düzenle' : 'Yeni Alış Ekle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Purchase Form with validation */}
            <Form form={form} schema={purchaseFormSchemaWithOptions} onSubmit={() => {}} />

            {/* Items Section */}
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Ürün Ekle
              </Typography>

              <Form form={itemForm} schema={itemSchemaWithOptions} onSubmit={handleAddItem} />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={async () => {
                  try {
                    // Validate manually using yup schema
                    await itemSchemaWithOptions.validate(itemForm.getValues(), { abortEarly: false });
                    // If validation passes, submit
                    handleAddItem();
                  } catch (error) {
                    // Set validation errors manually
                    const validationError = error as { inner?: Array<{ path: string; message: string }> };
                    if (validationError.inner) {
                      validationError.inner.forEach((err) => {
                        itemForm.setError(err.path, {
                          type: 'manual',
                          message: err.message,
                        });
                      });
                    }
                  }
                }}>
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
                    const tank = tanks.find((t) => t.id === item.tankId);
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
                              {category?.name || '-'} | Boy:{' '}
                              {item.size === 'small' ? 'Small' : item.size === 'medium' ? 'Medium' : 'Large'} | Miktar:{' '}
                              {item.qty} | Birim: ₺{Number(item.unitPrice).toFixed(2)} | Toplam: ₺
                              {Number(item.lineTotal).toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Stok Maliyeti:{' '}
                              {item.unitCost === 0 ? 'Kendi Üretim' : `₺${Number(item.unitCost).toFixed(2)}`}
                            </Typography>
                            {tank && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                Tank: {tank.name} ({tank.code})
                              </Typography>
                            )}
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
                <Typography variant="body2">Ara Toplam: ₺{grossTotal.toFixed(2)}</Typography>
                {travelCost > 0 && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Yol Parası: ₺{travelCost.toFixed(2)}
                  </Typography>
                )}
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
