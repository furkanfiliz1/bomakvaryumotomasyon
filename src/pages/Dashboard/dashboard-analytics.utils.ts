import { Sale } from '../../types/sale';
import { Purchase } from '../../types/purchase';
import { Expense } from '../../types/expense';
import { Collection } from '../../types/collection';
import { Fish } from '../../types/fish';
import { CashTransaction } from '../../types/cash';
import {
  MonthlyRevenue,
  CategoryExpense,
  CashFlowData,
  CustomerCollectionSummary,
  ProfitMargin,
  DashboardStats,
  TopProduct,
  RecentActivity,
} from './dashboard-analytics.types';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export const calculateMonthlyRevenue = (
  sales: Sale[],
  purchases: Purchase[],
  expenses: Expense[],
  collections: Collection[],
  year?: number
): MonthlyRevenue[] => {
  const monthlyData: { [key: string]: MonthlyRevenue } = {};

  // Son 12 ayı hazırla
  const now = new Date();
  const currentYear = year || now.getFullYear();

  for (let i = 0; i < 12; i++) {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = {
      month: MONTHS[i],
      sales: 0,
      purchases: 0,
      expenses: 0,
      collections: 0,
      profit: 0,
    };
  }

  // Satışları hesapla
  sales.forEach((sale) => {
    const date = sale.date?.toDate?.();
    if (date && date.getFullYear() === currentYear) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].sales += sale.total || 0;
      }
    }
  });

  // Alışları hesapla
  purchases.forEach((purchase) => {
    const date = purchase.date?.toDate?.();
    if (date && date.getFullYear() === currentYear) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].purchases += purchase.totalCostWithShipping || 0;
      }
    }
  });

  // Giderleri hesapla
  expenses.forEach((expense) => {
    const date = expense.date?.toDate?.();
    if (date && date.getFullYear() === currentYear) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += expense.amount || 0;
      }
    }
  });

  // Tahsilatları hesapla
  collections.forEach((collection) => {
    const date = new Date(collection.date);
    if (date.getFullYear() === currentYear) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].collections += collection.collectedAmount || 0;
      }
    }
  });

  // Kar hesapla
  Object.values(monthlyData).forEach((data) => {
    data.profit = data.sales - data.purchases - data.expenses;
  });

  return Object.values(monthlyData);
};

export const calculateCategoryExpenses = (expenses: Expense[]): CategoryExpense[] => {
  const categoryMap: { [key: string]: number } = {};
  let total = 0;

  expenses.forEach((expense) => {
    const category = expense.category || 'diğer';
    categoryMap[category] = (categoryMap[category] || 0) + (expense.amount || 0);
    total += expense.amount || 0;
  });

  return Object.entries(categoryMap).map(([category, amount]) => ({
    category: getCategoryLabel(category),
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
  }));
};

export const calculateCashFlow = (
  cashTransactions: CashTransaction[],
  limit: number = 30
): CashFlowData[] => {
  const flowMap: { [key: string]: CashFlowData } = {};
  let balance = 0;

  // Tarihe göre sırala
  const sortedTransactions = [...cashTransactions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateA.getTime() - dateB.getTime();
  });

  sortedTransactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt || 0);
    const dateKey = date.toISOString().split('T')[0];

    if (!flowMap[dateKey]) {
      flowMap[dateKey] = {
        date: dateKey,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    if (transaction.type === 'income') {
      flowMap[dateKey].income += transaction.amount;
      balance += transaction.amount;
    } else {
      flowMap[dateKey].expense += transaction.amount;
      balance -= transaction.amount;
    }

    flowMap[dateKey].balance = balance;
  });

  return Object.values(flowMap).slice(-limit);
};

export const calculateCustomerCollections = (
  sales: Sale[],
  collections: Collection[]
): CustomerCollectionSummary[] => {
  const customerMap: { [key: string]: CustomerCollectionSummary } = {};

  // Satışları topla
  sales.forEach((sale) => {
    const customerId = sale.customerId || 'unknown';
    if (!customerMap[customerId]) {
      customerMap[customerId] = {
        customerId,
        customerName: sale.customerName || 'Bilinmeyen Müşteri',
        totalSales: 0,
        totalCollected: 0,
        remaining: 0,
        collectionRate: 0,
      };
    }
    customerMap[customerId].totalSales += sale.total || 0;
  });

  // Tahsilatları topla
  collections.forEach((collection) => {
    const customerId = collection.customerId || 'unknown';
    if (customerMap[customerId]) {
      customerMap[customerId].totalCollected += collection.collectedAmount || 0;
    }
  });

  // Kalan ve oranı hesapla
  Object.values(customerMap).forEach((customer) => {
    customer.remaining = customer.totalSales - customer.totalCollected;
    customer.collectionRate =
      customer.totalSales > 0 ? (customer.totalCollected / customer.totalSales) * 100 : 0;
  });

  return Object.values(customerMap).sort((a, b) => b.totalSales - a.totalSales);
};

export const calculateProfitMargins = (
  sales: Sale[],
  purchases: Purchase[],
  expenses: Expense[],
  year?: number
): ProfitMargin[] => {
  const currentYear = year || new Date().getFullYear();
  const margins: ProfitMargin[] = [];

  for (let i = 0; i < 12; i++) {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;

    let revenue = 0;
    let cost = 0;

    sales.forEach((sale) => {
      const date = sale.date?.toDate?.();
      if (date) {
        const saleMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (saleMonthKey === monthKey) {
          revenue += sale.total || 0;
        }
      }
    });

    purchases.forEach((purchase) => {
      const date = purchase.date?.toDate?.();
      if (date) {
        const purchaseMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (purchaseMonthKey === monthKey) {
          cost += purchase.totalCostWithShipping || 0;
        }
      }
    });

    expenses.forEach((expense) => {
      const date = expense.date?.toDate?.();
      if (date) {
        const expenseMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (expenseMonthKey === monthKey) {
          cost += expense.amount || 0;
        }
      }
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    margins.push({
      period: MONTHS[i],
      revenue,
      cost,
      profit,
      margin,
    });
  }

  return margins;
};

export const calculateDashboardStats = (
  sales: Sale[],
  purchases: Purchase[],
  expenses: Expense[],
  collections: Collection[],
  fishes: Fish[],
  cashTransactions: CashTransaction[]
): DashboardStats => {
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + (purchase.totalCostWithShipping || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalProfit = totalRevenue - totalPurchases - totalExpenses;

  const totalCashBalance = cashTransactions.reduce((sum, transaction) => {
    return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);

  const stockValue = fishes.reduce((sum, fish) => sum + (fish.stock || 0) * (fish.unitPrice || 0), 0);
  const stockCount = fishes.reduce((sum, fish) => sum + (fish.stock || 0), 0);
  const lowStockCount = fishes.filter((fish) => (fish.stock || 0) < 10).length;

  const averageOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses: totalPurchases + totalExpenses,
    totalProfit,
    totalCashBalance,
    salesCount: sales.length,
    purchaseCount: purchases.length,
    expenseCount: expenses.length,
    collectionCount: collections.length,
    stockValue,
    stockCount,
    lowStockCount,
    averageOrderValue,
    profitMargin,
  };
};

export const getTopProducts = (sales: Sale[], fishes: Fish[], limit: number = 5): TopProduct[] => {
  const productMap: { [key: string]: TopProduct } = {};

  sales.forEach((sale) => {
    sale.items?.forEach((item) => {
      if (!productMap[item.fishId]) {
        const fish = fishes.find((f) => f.id === item.fishId);
        productMap[item.fishId] = {
          id: item.fishId,
          name: fish?.name || item.fishName || 'Bilinmeyen',
          quantity: 0,
          revenue: 0,
        };
      }
      productMap[item.fishId].quantity += item.soldQuantity;
      productMap[item.fishId].revenue += item.total;
    });
  });

  return Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

export const getRecentActivities = (
  sales: Sale[],
  purchases: Purchase[],
  expenses: Expense[],
  collections: Collection[],
  limit: number = 10
): RecentActivity[] => {
  const activities: RecentActivity[] = [];

  sales.forEach((sale) => {
    const date = sale.date?.toDate?.();
    if (date) {
      activities.push({
        id: sale.id || '',
        type: 'sale',
        date,
        amount: sale.total || 0,
        description: `${sale.customerName || 'Müşteri'} - ${sale.items?.length || 0} ürün satışı`,
      });
    }
  });

  purchases.forEach((purchase) => {
    const date = purchase.date?.toDate?.();
    if (date) {
      activities.push({
        id: purchase.id || '',
        type: 'purchase',
        date,
        amount: purchase.totalCostWithShipping || 0,
        description: `${purchase.items?.length || 0} ürün alışı`,
      });
    }
  });

  expenses.forEach((expense) => {
    const date = expense.date?.toDate?.();
    if (date) {
      activities.push({
        id: expense.id || '',
        type: 'expense',
        date,
        amount: expense.amount || 0,
        description: `${getCategoryLabel(expense.category)} - ${expense.description || 'Gider'}`,
      });
    }
  });

  collections.forEach((collection) => {
    const date = new Date(collection.date);
    activities.push({
      id: collection.id || '',
      type: 'collection',
      date,
      amount: collection.collectedAmount || 0,
      description: `${collection.customerName} - Tahsilat`,
    });
  });

  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
};

const getCategoryLabel = (category: string): string => {
  const labels: { [key: string]: string } = {
    kira: 'Kira',
    elektrik: 'Elektrik',
    yem: 'Yem',
    malzeme: 'Malzeme',
    kargo: 'Kargo',
    diğer: 'Diğer',
  };
  return labels[category] || category;
};
