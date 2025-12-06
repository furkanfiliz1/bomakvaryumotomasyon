import type { HeadCell } from 'src/components/common/Table/types';
import { formatDateTime } from './operation-pricing.helpers';

/**
 * Table column configuration for Operation Pricing
 * Exact match with legacy table structure and Turkish labels from operationChargeReport
 */
export const getOperationPricingTableHeaders = (): HeadCell[] => [
  {
    id: 'PaymentDate',
    label: 'Ödeme Tarihi', // legacy: paymentDate
    type: 'date',
    slot: true,
  },
  {
    id: 'CompanyName',
    label: 'Şirket İsmi', // legacy: companyName
  },
  {
    id: 'Amount',
    label: 'İşlem Ücreti', // legacy: processingFee
    type: 'currency',
  },
  {
    id: 'OrderNumber',
    label: 'Sipariş Numarası', // legacy: orderNumber
  },
  {
    id: 'NetAmount',
    label: 'Net Ödenen', // legacy: netPaid
    type: 'currency',
  },
  {
    id: 'ReturnAmount',
    label: 'İade Edilen', // legacy: returned
    type: 'currency',
  },
  {
    id: 'TotalDiscountAmount',
    label: 'İndirim', // legacy: discountingFee (but shows as "İndirim" not "İndirim Tutarı")
    type: 'currency',
  },
  {
    id: 'Status',
    label: 'Statü', // legacy: status
    slot: true,
  },
];

/**
 * Format payment date for display using project standards
 * Uses standardized formatDateTime function for consistency
 */
export const formatPaymentDate = formatDateTime;

/**
 * Get table empty state message
 */
export const getEmptyStateMessage = (): string => {
  return 'Ödeme kaydı bulunamadı';
};

/**
 * Get table loading message
 */
export const getLoadingMessage = (): string => {
  return 'Yükleniyor...';
};

/**
 * Get table error message
 */
export const getErrorMessage = (error?: string): string => {
  return error || 'Veriler yüklenirken bir hata oluştu';
};
