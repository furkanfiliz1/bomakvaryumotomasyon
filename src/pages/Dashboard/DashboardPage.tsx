import {
  Box,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { salesService } from '../../services/salesService';
import { purchaseService } from '../../services/purchaseService';
import { fishService } from '../../services/fishService';
import { Sale } from '../../types/sale';
import { Purchase } from '../../types/purchase';
import { Fish } from '../../types/fish';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';

const DashboardPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);

  // Tarih filtreleri - Başlangıçta null (Tümü)
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const months = [
    { value: 0, label: 'Tümü' },
    { value: 1, label: 'Ocak' },
    { value: 2, label: 'Şubat' },
    { value: 3, label: 'Mart' },
    { value: 4, label: 'Nisan' },
    { value: 5, label: 'Mayıs' },
    { value: 6, label: 'Haziran' },
    { value: 7, label: 'Temmuz' },
    { value: 8, label: 'Ağustos' },
    { value: 9, label: 'Eylül' },
    { value: 10, label: 'Ekim' },
    { value: 11, label: 'Kasım' },
    { value: 12, label: 'Aralık' },
  ];

  const years = [
    { value: 0, label: 'Tümü' },
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, purchasesData, fishesData] = await Promise.all([
        salesService.getAllSales(),
        purchaseService.getAllPurchases(),
        fishService.getAllFishes(),
      ]);
      setSales(salesData);
      setPurchases(purchasesData);
      setFishes(fishesData);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Dashboard verileri yüklenirken hata oluştu',
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

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hesaplamalar
  // Seçilen aya göre filtrele (null veya 0 ise tümünü göster)
  const filteredSales =
    selectedMonth === null || selectedMonth === 0 || selectedYear === null || selectedYear === 0
      ? sales
      : sales.filter((sale) => {
          const saleDate = sale.date?.toDate?.();
          return saleDate && saleDate.getMonth() + 1 === selectedMonth && saleDate.getFullYear() === selectedYear;
        });

  const filteredPurchases =
    selectedMonth === null || selectedMonth === 0 || selectedYear === null || selectedYear === 0
      ? purchases
      : purchases.filter((purchase) => {
          const purchaseDate = purchase.date?.toDate?.();
          return (
            purchaseDate && purchaseDate.getMonth() + 1 === selectedMonth && purchaseDate.getFullYear() === selectedYear
          );
        });

  // Yıllık veriler (null veya 0 ise tümünü göster)
  const yearSales =
    selectedYear === null || selectedYear === 0
      ? sales
      : sales.filter((sale) => {
          const saleDate = sale.date?.toDate?.();
          return saleDate && saleDate.getFullYear() === selectedYear;
        });

  const yearPurchases =
    selectedYear === null || selectedYear === 0
      ? purchases
      : purchases.filter((purchase) => {
          const purchaseDate = purchase.date?.toDate?.();
          return purchaseDate && purchaseDate.getFullYear() === selectedYear;
        });

  // Aylık toplam satış
  const monthSalesRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  // Aylık toplam alış maliyeti
  const monthPurchaseCost = filteredPurchases.reduce((sum, purchase) => sum + (purchase.totalCostWithShipping || 0), 0);

  // Aylık kar/zarar
  const monthProfitLoss = monthSalesRevenue - monthPurchaseCost;

  // Yıllık toplam satış
  const yearSalesRevenue = yearSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  // Yıllık toplam alış maliyeti
  const yearPurchaseCost = yearPurchases.reduce((sum, purchase) => sum + (purchase.totalCostWithShipping || 0), 0);

  // Yıllık kar/zarar
  const yearProfitLoss = yearSalesRevenue - yearPurchaseCost;

  // Toplam stok değeri
  const totalStockValue = fishes.reduce((sum, fish) => sum + (fish.stock || 0) * (fish.unitPrice || 0), 0);

  // Toplam stok adedi
  const totalStockCount = fishes.reduce((sum, fish) => sum + (fish.stock || 0), 0);

  // Düşük stok uyarısı
  const lowStockFishes = fishes.filter((fish) => (fish.stock || 0) < 10);

  // En çok satan balıklar (Aylık)
  const fishSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  filteredSales.forEach((sale) => {
    sale.items?.forEach((item) => {
      const existing = fishSalesMap.get(item.fishId) || { name: '', quantity: 0, revenue: 0 };
      const fish = fishes.find((f) => f.id === item.fishId);
      fishSalesMap.set(item.fishId, {
        name: fish?.name || item.fishName || 'Bilinmeyen',
        quantity: existing.quantity + item.soldQuantity,
        revenue: existing.revenue + item.total,
      });
    });
  });

  const topSellingFishes = Array.from(fishSalesMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Dashboard
        </Typography>

        {/* Tarih Filtreleri */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Yıl</InputLabel>
            <Select
              value={selectedYear ?? 0}
              label="Yıl"
              onChange={(e) => setSelectedYear(e.target.value === 0 ? null : Number(e.target.value))}>
              {years.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Ay</InputLabel>
            <Select
              value={selectedMonth ?? 0}
              label="Ay"
              onChange={(e) => setSelectedMonth(e.target.value === 0 ? null : Number(e.target.value))}>
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Aylık Özet Kartlar */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {selectedMonth === null || selectedMonth === 0
          ? 'Genel Özet'
          : `${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear || ''} - Aylık Özet`}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Aylık Satış */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Satış</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                ₺{monthSalesRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {filteredSales.length} işlem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Aylık Alış */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDownIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Alış</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                ₺{monthPurchaseCost.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {filteredPurchases.length} işlem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Aylık Kar/Zarar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: monthProfitLoss >= 0 ? 'info.main' : 'warning.main' }} />
                <Typography variant="h6">Kar/Zarar</Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: monthProfitLoss >= 0 ? 'info.main' : 'warning.main' }}>
                ₺{monthProfitLoss.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {monthProfitLoss >= 0 ? '✓ Kar' : '✗ Zarar'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stok Değeri */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Stok Değeri</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ₺{totalStockValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {totalStockCount} adet
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Yıllık Özet Kartlar */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {selectedYear === null || selectedYear === 0 ? 'Tüm Zamanlar - Özet' : `${selectedYear} - Yıllık Özet`}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Yıllık Satış */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'success.50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Toplam Satış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                ₺{yearSalesRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {yearSales.length} işlem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Yıllık Alış */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'error.50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Toplam Alış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                ₺{yearPurchaseCost.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {yearPurchases.length} işlem
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Yıllık Kar/Zarar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: yearProfitLoss >= 0 ? 'info.50' : 'warning.50' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Net Kar/Zarar
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: yearProfitLoss >= 0 ? 'info.main' : 'warning.main' }}>
                ₺{yearProfitLoss.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {yearProfitLoss >= 0 ? '✓ Kar' : '✗ Zarar'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* En Çok Satan Balıklar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              En Çok Satan Balıklar
              {selectedMonth !== null && selectedMonth !== 0 ? ' (Aylık)' : ''}
            </Typography>
            {topSellingFishes.length === 0 ? (
              <Typography color="text.secondary">Henüz satış bulunmuyor</Typography>
            ) : (
              topSellingFishes.map((fish, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < topSellingFishes.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {index + 1}. {fish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fish.quantity} adet satıldı
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ₺{fish.revenue.toFixed(2)}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Düşük Stok Uyarıları */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Düşük Stok Uyarıları
              </Typography>
            </Box>
            {lowStockFishes.length === 0 ? (
              <Typography color="text.secondary">Tüm ürünler yeterli stokta ✓</Typography>
            ) : (
              lowStockFishes.slice(0, 10).map((fish) => (
                <Box
                  key={fish.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}>
                  <Typography variant="body1">{fish.name}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: (fish.stock || 0) < 5 ? 'error.main' : 'warning.main',
                      fontWeight: 600,
                      bgcolor: (fish.stock || 0) < 5 ? 'error.50' : 'warning.50',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                    }}>
                    {fish.stock || 0} adet
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Son Satışlar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Son Satışlar
            </Typography>
            {filteredSales.length === 0 ? (
              <Typography color="text.secondary">Satış bulunmuyor</Typography>
            ) : (
              filteredSales.slice(0, 5).map((sale) => (
                <Box
                  key={sale.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {sale.date?.toDate?.()?.toLocaleDateString('tr-TR') || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sale.items?.length || 0} ürün • {sale.customerName || 'Müşteri'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                    ₺{sale.total?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* Son Alışlar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Son Alışlar
            </Typography>
            {filteredPurchases.length === 0 ? (
              <Typography color="text.secondary">Alış bulunmuyor</Typography>
            ) : (
              filteredPurchases.slice(0, 5).map((purchase) => (
                <Box
                  key={purchase.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {purchase.date?.toDate?.()?.toLocaleDateString('tr-TR') || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {purchase.items?.length || 0} ürün • {purchase.supplierId || 'Tedarikçi'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                    ₺{purchase.totalCostWithShipping?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
