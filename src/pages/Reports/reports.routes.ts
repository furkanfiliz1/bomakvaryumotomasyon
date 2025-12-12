import { IRouteObject } from '../../router';
import ReportsPage from './ReportsPage';
import SalesReportPage from './SalesReport/SalesReportPage';
import CustomerSalesReportPage from './CustomerSalesReport/CustomerSalesReportPage';
import ProfitLossReportPage from './ProfitLossReport/ProfitLossReportPage';
import StockReportPage from './StockReport/StockReportPage';
import SupplierPurchasesReportPage from './SupplierPurchasesReport/SupplierPurchasesReportPage';
import ExpensesReportPage from './ExpensesReport/ExpensesReportPage';
import CashFlowReportPage from './CashFlowReport/CashFlowReportPage';
import RegionSalesReportPage from './RegionSalesReport/RegionSalesReportPage';

export const reportsRouter = [
  {
    path: '/reports',
    Component: ReportsPage,
  },
  {
    path: '/reports/sales',
    Component: SalesReportPage,
  },
  {
    path: '/reports/customer-sales',
    Component: CustomerSalesReportPage,
  },
  {
    path: '/reports/profit-loss',
    Component: ProfitLossReportPage,
  },
  {
    path: '/reports/stock',
    Component: StockReportPage,
  },
  {
    path: '/reports/supplier-purchases',
    Component: SupplierPurchasesReportPage,
  },
  {
    path: '/reports/expenses',
    Component: ExpensesReportPage,
  },
  {
    path: '/reports/cash-flow',
    Component: CashFlowReportPage,
  },
  {
    path: '/reports/region-sales',
    Component: RegionSalesReportPage,
  },
] as IRouteObject[];
