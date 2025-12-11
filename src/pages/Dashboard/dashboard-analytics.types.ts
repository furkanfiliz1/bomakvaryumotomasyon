export interface MonthlyRevenue {
  month: string;
  sales: number;
  purchases: number;
  expenses: number;
  collections: number;
  profit: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashFlowData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CustomerCollectionSummary {
  customerId: string;
  customerName: string;
  totalSales: number;
  totalCollected: number;
  remaining: number;
  collectionRate: number;
}

export interface ProfitMargin {
  period: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalPurchases: number; // Sadece alışlar
  totalExpensesOnly: number; // Sadece giderler
  totalExpenses: number; // Alış + Gider toplamı
  salesProfit: number; // Satışlardan elde edilen brüt kar (maliyet - satış)
  salesProfitMargin: number; // Satış kar marjı %
  totalProfit: number; // Net kar (satış - alış - gider)
  totalCashBalance: number;
  salesCount: number;
  purchaseCount: number;
  expenseCount: number;
  collectionCount: number;
  stockValue: number;
  stockCount: number;
  lowStockCount: number;
  averageOrderValue: number;
  profitMargin: number;
  totalFishDeaths: number; // Toplam balık ölümü
  totalDeathLoss: number; // Toplam ölüm zararı
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  averagePrice: number;
  totalAmount: number;
}

export interface RecentActivity {
  id: string;
  type: 'sale' | 'purchase' | 'expense' | 'collection';
  date: Date;
  amount: number;
  description: string;
}
