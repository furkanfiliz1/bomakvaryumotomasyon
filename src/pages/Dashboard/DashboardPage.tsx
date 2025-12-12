import {
  Box,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Fade,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { salesService } from '../../services/salesService';
import { purchaseService } from '../../services/purchaseService';
import { fishService } from '../../services/fishService';
import { expenseService } from '../../services/expenseService';
import { collectionService } from '../../services/collectionService';
import { cashService } from '../../services/cashService';
import { tankService } from '../../services/tankService';
import { Sale } from '../../types/sale';
import { Purchase } from '../../types/purchase';
import { Fish } from '../../types/fish';
import { Expense } from '../../types/expense';
import { Collection } from '../../types/collection';
import { CashTransaction } from '../../types/cash';
import { Tank, TankStock } from '../../types/tank';
import { formatTurkishCurrency } from '../../utils/currency';

// Analytics utilities
import {
  calculateMonthlyRevenue,
  calculateCategoryExpenses,
  calculateCustomerCollections,
  calculateProfitMargins,
  calculateDashboardStats,
  getTopProducts,
  getRecentActivities,
} from './dashboard-analytics.utils';

// Components
import { StatCard } from './components/StatCard';
import { MonthlyTrendChart } from './components/MonthlyTrendChart';
import { ExpenseCategoryChart } from './components/ExpenseCategoryChart';
import { ExpenseCategorySummary } from './components/ExpenseCategorySummary';
import { CustomerCollectionChart } from './components/CustomerCollectionChart';
import { ProfitMarginChart } from './components/ProfitMarginChart';
import { TopProductsChart } from './components/TopProductsChart';
import { RecentActivitiesList } from './components/RecentActivitiesList';
import { TankOverview } from './components/TankOverview';
import { TankStockDistribution } from './components/TankStockDistribution';
import { TopFishSalesList } from './components/TopFishSalesList';

const DashboardPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [tankStocks, setTankStocks] = useState<TankStock[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const years = [
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData, purchasesData, fishesData, expensesData, collectionsData, cashData, tanksData, tankStocksData] =
        await Promise.all([
          salesService.getAllSales(),
          purchaseService.getAllPurchases(),
          fishService.getAllFishes(),
          expenseService.getAllExpenses(),
          collectionService.getAllCollections(),
          cashService.getAllTransactions(),
          tankService.getAllTanks(),
          tankService.getAllTankStocks(),
        ]);
      setSales(salesData);
      setPurchases(purchasesData);
      setFishes(fishesData);
      setExpenses(expensesData);
      setCollections(collectionsData);
      setCashTransactions(cashData);
      setTanks(tanksData);
      setTankStocks(tankStocksData);
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

  // Hesaplamalar
  const stats = calculateDashboardStats(sales, purchases, expenses, collections, fishes, cashTransactions, tankStocks);
  const monthlyRevenue = calculateMonthlyRevenue(sales, purchases, expenses, collections, selectedYear);
  const categoryExpenses = calculateCategoryExpenses(expenses);
  const customerCollections = calculateCustomerCollections(sales, collections);
  const profitMargins = calculateProfitMargins(sales, purchases, expenses, selectedYear);
  const topProducts = getTopProducts(sales, fishes, 5);
  const topFishSales = getTopProducts(sales, fishes, 10); // En çok satılan 10 balık
  const allFishSales = getTopProducts(sales, fishes, 9999); // Tüm balıklar
  const recentActivities = getRecentActivities(sales, purchases, expenses, collections, 10);

  // Kendi üretim ve al-sat balıkları ayırma
  const ownProductionFish = allFishSales.filter((fish) => fish.saleType === 'own-production');
  const resaleFish = allFishSales.filter((fish) => fish.saleType === 'resale');

  // Kendi üretim toplamları
  const ownProductionTotalSales = ownProductionFish.reduce((sum, fish) => sum + fish.totalAmount, 0);

  // Al-sat toplamları
  const resaleTotalSales = resaleFish.reduce((sum, fish) => sum + fish.totalAmount, 0);
  const resaleTotalProfit = resaleFish.reduce((sum, fish) => sum + fish.totalProfit, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.dark?.[800] || '#000', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            İşletme performansınızı anlık olarak takip edin
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Yıl Seçin</InputLabel>
          <Select value={selectedYear} label="Yıl Seçin" onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {years.map((year) => (
              <MenuItem key={year.value} value={year.value}>
                {year.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Fade in timeout={500}>
        <Box>
          {/* Ana İstatistik Kartları */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Toplam Satış Geliri"
                value={formatTurkishCurrency(stats.totalRevenue)}
                subtitle={`${stats.salesCount} satış`}
                icon="revenue"
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Kendi Üretim Satış"
                value={formatTurkishCurrency(ownProductionTotalSales)}
                subtitle={`${ownProductionFish.length} farklı balık türü`}
                icon="revenue"
                color="success"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Al-Sat Balığı Satış"
                value={formatTurkishCurrency(resaleTotalSales)}
                subtitle={`${resaleFish.length} farklı balık türü`}
                icon="revenue"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Al-Sat Balığı Kar"
                value={formatTurkishCurrency(resaleTotalProfit)}
                subtitle={`%${resaleTotalSales > 0 ? ((resaleTotalProfit / resaleTotalSales) * 100).toFixed(1) : 0} kar marjı`}
                icon="profit"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Toplam Alış"
                value={formatTurkishCurrency(stats.totalPurchases)}
                subtitle={`${stats.purchaseCount} alış`}
                icon="expense"
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Toplam Gider"
                value={formatTurkishCurrency(stats.totalExpensesOnly)}
                subtitle={`${stats.expenseCount} gider`}
                icon="expense"
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Kasa Bakiyesi"
                value={formatTurkishCurrency(stats.totalCashBalance)}
                subtitle={`${cashTransactions.length} işlem`}
                icon="cash"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Tahsilat Oranı"
                value={`${stats.collectionCount} adet`}
                subtitle="Toplam tahsilat"
                icon="sales"
                color="success"
              />
            </Grid>
          </Grid>

          {/* İkinci Sıra İstatistikler */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Stok Değeri"
                value={formatTurkishCurrency(stats.stockValue)}
                subtitle={`${stats.stockCount} adet ürün`}
                icon="stock"
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Tahmini Satış Değeri"
                value={formatTurkishCurrency(
                  tankStocks.reduce((sum, s) => sum + s.quantity * (s.estimatedPrice || 0), 0),
                )}
                subtitle={`${tankStocks.filter((s) => (s.estimatedPrice || 0) > 0).length} fiyatlı stok`}
                icon="revenue"
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Düşük Stok"
                value={stats.lowStockCount}
                subtitle="Uyarı gerektiren ürün"
                icon="warning"
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Balık Ölümü"
                value={stats.totalFishDeaths}
                subtitle={`${formatTurkishCurrency(stats.totalDeathLoss)} zarar`}
                icon="warning"
                color="error"
              />
            </Grid>
          </Grid>

          {/* En Çok Satılan Balıklar Listesi */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TopFishSalesList data={topFishSales} />
            </Grid>
          </Grid>

          {/* Ana Chart'lar */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <MonthlyTrendChart data={monthlyRevenue} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ExpenseCategoryChart data={categoryExpenses} />
            </Grid>
          </Grid>

          {/* Gider Kategorileri Özeti */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <ExpenseCategorySummary data={categoryExpenses} />
            </Grid>
          </Grid>

          {/* İkinci Sıra Chart'lar */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={6}>
              <ProfitMarginChart data={profitMargins} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TopProductsChart data={topProducts} />
            </Grid>
          </Grid>

          {/* Üçüncü Sıra Chart'lar */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={6}>
              <CustomerCollectionChart data={customerCollections} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <RecentActivitiesList data={recentActivities} />
            </Grid>
          </Grid>

          {/* Tank Analizi */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TankOverview tanks={tanks} tankStocks={tankStocks} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TankStockDistribution tankStocks={tankStocks} />
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardPage;
