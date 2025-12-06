import { IRouteObject } from 'src/router';
import PricingPage from './PricingPage';
import {
  OperationChargeListPage,
  OperationChargeCreatePage,
  OperationChargeEditPage,
} from './OperationCharge/components';
import {
  TransactionFeeDiscountListPage,
  TransactionFeeDiscountCreatePage,
  TransactionFeeDiscountEditPage,
} from './TransactionFeeDiscount/components';
import {
  TransactionFeeScalesListPage,
  TransactionFeeScalesCreatePage,
  TransactionFeeScalesEditPage,
} from './TransactionFeeScales/components';
import { OperationPricingListPage } from './OperationPricing/components';
import {
  ManualTransactionFeeTrackingListPage,
  ManualTransactionFeeEditPage,
} from './ManualTransactionFeeTracking/components';

export const pricingRouter = [
  {
    path: 'pricing/operation-charge-list',
    Component: OperationChargeListPage,
  },
  // İşlem Başı Ücretlendirme routes - matching legacy structure
  {
    path: 'pricing/islem-basi-ucretlendirme',
    Component: OperationChargeListPage, // List page for operation charges
  },
  {
    path: 'pricing/islem-basi-ucretlendirme/yeni',
    Component: OperationChargeCreatePage,
  },
  {
    path: 'pricing/islem-basi-ucretlendirme/duzenle/:id',
    Component: OperationChargeEditPage,
  },
  {
    path: 'pricing/indirim-tanimlama',
    Component: TransactionFeeDiscountListPage,
  },
  {
    path: 'pricing/indirim-tanimlama/yeni',
    Component: TransactionFeeDiscountCreatePage,
  },
  {
    path: 'pricing/indirim-tanimlama/:id/duzenle',
    Component: TransactionFeeDiscountEditPage,
  },
  // Transaction Fee Scales routes - updated to pricing namespace
  {
    path: 'pricing/islem-ucreti-baremleri',
    Component: TransactionFeeScalesListPage,
  },
  {
    path: 'pricing/islem-ucreti-baremleri/yeni',
    Component: TransactionFeeScalesCreatePage,
  },
  {
    path: 'pricing/islem-ucreti-baremleri/:id/duzenle',
    Component: TransactionFeeScalesEditPage,
  },
  // Operation Pricing route - updated to pricing namespace
  {
    path: 'pricing/operasyon-ucretlendirme',
    Component: OperationPricingListPage,
  },
  // Manual Transaction Fee Tracking routes
  {
    path: 'pricing/manual-transaction-fee-tracking',
    Component: ManualTransactionFeeTrackingListPage,
  },
  {
    path: 'pricing/manual-transaction-fee-tracking/:id/edit',
    Component: ManualTransactionFeeEditPage,
  },
  {
    path: 'pricing',
    Component: PricingPage,
  },
] as IRouteObject[];
