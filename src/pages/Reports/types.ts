export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface SalesReportData {
  fishId: string;
  fishName: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  avgUnitPrice: number;
  salesCount: number;
  saleType: 'own-production' | 'resale';
}

export interface CustomerSalesReportData {
  customerId: string;
  customerName: string;
  customerType: string;
  city?: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  salesCount: number;
  avgOrderValue: number;
  lastSaleDate: Date;
}

export interface ProfitLossReportData {
  month: string;
  year: number;
  totalRevenue: number;
  totalCost: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

export interface StockReportData {
  tankId: string;
  tankName: string;
  fishId: string;
  fishName: string;
  categoryName: string;
  size?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  estimatedPrice: number;
  estimatedValue: number;
  potentialProfit: number;
  deathCount: number;
  deathLoss: number;
}

export interface SupplierReportData {
  supplierId: string;
  supplierName: string;
  totalPurchases: number;
  totalAmount: number;
  avgPurchaseValue: number;
  purchaseCount: number;
  lastPurchaseDate: Date;
}

export interface ExpenseReportData {
  category: string;
  totalAmount: number;
  percentage: number;
  itemCount: number;
  avgAmount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CashFlowReportData {
  date: string;
  income: number;
  expense: number;
  balance: number;
  description: string;
}

export interface RegionSalesData {
  city: string;
  totalSales: number;
  totalRevenue: number;
  customerCount: number;
  avgRevenuePerCustomer: number;
}
