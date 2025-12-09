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
  totalExpenses: number;
  totalProfit: number;
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
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'sale' | 'purchase' | 'expense' | 'collection';
  date: Date;
  amount: number;
  description: string;
}
