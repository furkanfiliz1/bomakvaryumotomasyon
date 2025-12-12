import { Sale } from '../../../types/sale';
import { Purchase } from '../../../types/purchase';
import { Expense } from '../../../types/expense';
import { Customer } from '../../../types/customer';
import { Supplier } from '../../../types/supplier';
import { Fish } from '../../../types/fish';
import { TankStock } from '../../../types/tank';
import {
  SalesReportData,
  CustomerSalesReportData,
  ProfitLossReportData,
  StockReportData,
  SupplierReportData,
  ExpenseReportData,
  RegionSalesData,
} from '../types';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export const calculateFishSalesReport = (
  sales: Sale[],
  _fishes: Fish[],
  startDate?: Date,
  endDate?: Date
): SalesReportData[] => {
  const fishMap: { [key: string]: SalesReportData } = {};

  // Tarih filtresi uygula
  const filteredSales = sales.filter((sale) => {
    const saleDate = sale.date?.toDate?.();
    if (!saleDate) return false;
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const key = `${item.fishId}-${item.size || 'no-size'}`;
      
      if (!fishMap[key]) {
        const saleType = (item.unitCost || 0) === 0 ? 'own-production' : 'resale';
        fishMap[key] = {
          fishId: item.fishId,
          fishName: item.fishName + (item.size ? ` (${item.size})` : ''),
          categoryName: item.categoryName,
          totalQuantity: 0,
          totalRevenue: 0,
          totalProfit: 0,
          profitMargin: 0,
          avgUnitPrice: 0,
          salesCount: 0,
          saleType,
        };
      }

      fishMap[key].totalQuantity += item.soldQuantity;
      fishMap[key].totalRevenue += item.total;
      fishMap[key].totalProfit += item.profit || 0;
      fishMap[key].salesCount += 1;
    });
  });

  // Ortalama ve yüzde hesapla
  Object.values(fishMap).forEach((data) => {
    data.avgUnitPrice = data.totalRevenue / data.totalQuantity;
    data.profitMargin = data.totalRevenue > 0 ? (data.totalProfit / data.totalRevenue) * 100 : 0;
  });

  return Object.values(fishMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const calculateCustomerSalesReport = (
  sales: Sale[],
  customers: Customer[],
  startDate?: Date,
  endDate?: Date
): CustomerSalesReportData[] => {
  const customerMap: { [key: string]: CustomerSalesReportData } = {};

  // Müşteri bilgilerini map'e dönüştür
  const customerInfoMap = new Map(customers.map((c) => [c.id!, c]));

  // Tarih filtresi uygula
  const filteredSales = sales.filter((sale) => {
    const saleDate = sale.date?.toDate?.();
    if (!saleDate) return false;
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  filteredSales.forEach((sale) => {
    const customerId = sale.customerId;
    const customerInfo = customerInfoMap.get(customerId);
    const saleDate = sale.date?.toDate?.();

    if (!customerMap[customerId]) {
      customerMap[customerId] = {
        customerId,
        customerName: sale.customerName,
        customerType: customerInfo?.type || 'bireysel',
        city: customerInfo?.city,
        totalSales: 0,
        totalRevenue: 0,
        totalProfit: 0,
        salesCount: 0,
        avgOrderValue: 0,
        lastSaleDate: saleDate || new Date(),
      };
    }

    const totalProfit = sale.items.reduce((sum, item) => sum + (item.profit || 0), 0);

    customerMap[customerId].totalSales += sale.items.reduce((sum, item) => sum + item.soldQuantity, 0);
    customerMap[customerId].totalRevenue += sale.total;
    customerMap[customerId].totalProfit += totalProfit;
    customerMap[customerId].salesCount += 1;

    // En son satış tarihini güncelle
    if (saleDate && saleDate > customerMap[customerId].lastSaleDate) {
      customerMap[customerId].lastSaleDate = saleDate;
    }
  });

  // Ortalama hesapla
  Object.values(customerMap).forEach((data) => {
    data.avgOrderValue = data.totalRevenue / data.salesCount;
  });

  return Object.values(customerMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const calculateProfitLossReport = (
  sales: Sale[],
  purchases: Purchase[],
  expenses: Expense[],
  year: number
): ProfitLossReportData[] => {
  const monthlyData: { [key: string]: ProfitLossReportData } = {};

  // 12 ayı hazırla
  for (let i = 0; i < 12; i++) {
    const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = {
      month: MONTHS[i],
      year,
      totalRevenue: 0,
      totalCost: 0,
      totalExpenses: 0,
      grossProfit: 0,
      netProfit: 0,
      profitMargin: 0,
    };
  }

  // Satışları hesapla (gelir ve maliyet)
  sales.forEach((sale) => {
    const date = sale.date?.toDate?.();
    if (date && date.getFullYear() === year) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].totalRevenue += sale.total;
        const cost = sale.items.reduce(
          (sum, item) => sum + item.soldQuantity * (item.unitCost || 0),
          0
        );
        monthlyData[monthKey].totalCost += cost;
      }
    }
  });

  // Alışları maliyete ekle
  purchases.forEach((purchase) => {
    const date = purchase.date?.toDate?.();
    if (date && date.getFullYear() === year) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].totalCost += purchase.totalCostWithShipping;
      }
    }
  });

  // Giderleri hesapla
  expenses.forEach((expense) => {
    const date = expense.date?.toDate?.();
    if (date && date.getFullYear() === year) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].totalExpenses += expense.amount;
      }
    }
  });

  // Kar hesapla
  Object.values(monthlyData).forEach((data) => {
    data.grossProfit = data.totalRevenue - data.totalCost;
    data.netProfit = data.grossProfit - data.totalExpenses;
    data.profitMargin = data.totalRevenue > 0 ? (data.netProfit / data.totalRevenue) * 100 : 0;
  });

  return Object.values(monthlyData);
};

export const calculateStockReport = (tankStocks: TankStock[]): StockReportData[] => {
  return tankStocks.map((stock) => {
    const totalCost = stock.quantity * (stock.unitCost || 0);
    const estimatedValue = stock.quantity * (stock.estimatedPrice || 0);
    const potentialProfit = estimatedValue - totalCost;
    const deathLoss = (stock.deathCount || 0) * (stock.unitCost || 0);

    return {
      tankId: stock.tankId,
      tankName: stock.tankName || '',
      fishId: stock.fishTypeId,
      fishName: stock.fishTypeName || '',
      categoryName: stock.categoryName || '',
      size: stock.size,
      quantity: stock.quantity,
      unitCost: stock.unitCost || 0,
      totalCost,
      estimatedPrice: stock.estimatedPrice || 0,
      estimatedValue,
      potentialProfit,
      deathCount: stock.deathCount || 0,
      deathLoss,
    };
  });
};

export const calculateSupplierReport = (
  purchases: Purchase[],
  suppliers: Supplier[],
  startDate?: Date,
  endDate?: Date
): SupplierReportData[] => {
  const supplierMap: { [key: string]: SupplierReportData } = {};
  const supplierInfoMap = new Map(suppliers.map((s) => [s.id!, s]));

  // Tarih filtresi uygula
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = purchase.date?.toDate?.();
    if (!purchaseDate) return false;
    if (startDate && purchaseDate < startDate) return false;
    if (endDate && purchaseDate > endDate) return false;
    return true;
  });

  filteredPurchases.forEach((purchase) => {
    const supplierId = purchase.supplierId || 'unknown';
    const supplierInfo = supplierInfoMap.get(supplierId);
    const purchaseDate = purchase.date?.toDate?.();

    if (!supplierMap[supplierId]) {
      supplierMap[supplierId] = {
        supplierId,
        supplierName: supplierInfo?.name || 'Bilinmeyen Tedarikçi',
        totalPurchases: 0,
        totalAmount: 0,
        avgPurchaseValue: 0,
        purchaseCount: 0,
        lastPurchaseDate: purchaseDate || new Date(),
      };
    }

    const totalQty = purchase.items.reduce((sum, item) => sum + item.qty, 0);

    supplierMap[supplierId].totalPurchases += totalQty;
    supplierMap[supplierId].totalAmount += purchase.totalCostWithShipping;
    supplierMap[supplierId].purchaseCount += 1;

    if (purchaseDate && purchaseDate > supplierMap[supplierId].lastPurchaseDate) {
      supplierMap[supplierId].lastPurchaseDate = purchaseDate;
    }
  });

  // Ortalama hesapla
  Object.values(supplierMap).forEach((data) => {
    data.avgPurchaseValue = data.totalAmount / data.purchaseCount;
  });

  return Object.values(supplierMap).sort((a, b) => b.totalAmount - a.totalAmount);
};

export const calculateExpenseReport = (
  expenses: Expense[],
  startDate?: Date,
  endDate?: Date
): ExpenseReportData[] => {
  const categoryMap: { [key: string]: ExpenseReportData } = {};
  let total = 0;

  // Tarih filtresi uygula
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = expense.date?.toDate?.();
    if (!expenseDate) return false;
    if (startDate && expenseDate < startDate) return false;
    if (endDate && expenseDate > endDate) return false;
    return true;
  });

  filteredExpenses.forEach((expense) => {
    const category = expense.category || 'diğer';

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category: getCategoryLabel(category),
        totalAmount: 0,
        percentage: 0,
        itemCount: 0,
        avgAmount: 0,
        trend: 'stable',
      };
    }

    categoryMap[category].totalAmount += expense.amount;
    categoryMap[category].itemCount += 1;
    total += expense.amount;
  });

  // Ortalama ve yüzde hesapla
  Object.values(categoryMap).forEach((data) => {
    data.avgAmount = data.totalAmount / data.itemCount;
    data.percentage = total > 0 ? (data.totalAmount / total) * 100 : 0;
  });

  return Object.values(categoryMap).sort((a, b) => b.totalAmount - a.totalAmount);
};

export const calculateRegionSalesReport = (
  sales: Sale[],
  customers: Customer[],
  startDate?: Date,
  endDate?: Date
): RegionSalesData[] => {
  const regionMap: { [key: string]: RegionSalesData } = {};
  const customerInfoMap = new Map(customers.map((c) => [c.id!, c]));

  // Tarih filtresi uygula
  const filteredSales = sales.filter((sale) => {
    const saleDate = sale.date?.toDate?.();
    if (!saleDate) return false;
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    return true;
  });

  filteredSales.forEach((sale) => {
    const customerInfo = customerInfoMap.get(sale.customerId);
    const city = customerInfo?.city || 'Belirtilmemiş';

    if (!regionMap[city]) {
      regionMap[city] = {
        city,
        totalSales: 0,
        totalRevenue: 0,
        customerCount: 0,
        avgRevenuePerCustomer: 0,
      };
    }

    regionMap[city].totalSales += sale.items.reduce((sum, item) => sum + item.soldQuantity, 0);
    regionMap[city].totalRevenue += sale.total;
  });

  // Müşteri sayısını hesapla
  customers.forEach((customer) => {
    const city = customer.city || 'Belirtilmemiş';
    if (regionMap[city]) {
      regionMap[city].customerCount += 1;
    }
  });

  // Ortalama hesapla
  Object.values(regionMap).forEach((data) => {
    if (data.customerCount > 0) {
      data.avgRevenuePerCustomer = data.totalRevenue / data.customerCount;
    }
  });

  return Object.values(regionMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
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
