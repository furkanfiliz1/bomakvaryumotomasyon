import type { HeadCell } from 'src/components/common/Table/types';
import type { BankInvoiceReconciliationItem } from '../bank-invoice-reconciliation.types';

/**
 * Table configuration helpers for Bank Invoice Reconciliation
 * Following OperationPricing pattern for table setup
 */

/**
 * Table header configuration matching legacy column structure exactly
 */
export const getBankInvoiceReconciliationTableHeaders = (): HeadCell[] => [
  {
    id: 'SenderCode',
    label: 'Satıcı Kodu',
    isSortDisabled: true,
    width: 100,
  },
  {
    id: 'AllowanceId',
    label: 'İskonto No',
    isSortDisabled: true,
    width: 120,
  },
  {
    id: 'InvoiceNumber',
    label: 'Fatura No',
    isSortDisabled: true,
    width: 150,
  },
  {
    id: 'InvoicePayableAmount',
    label: 'Fatura Tutarı',
    isSortDisabled: true,
    width: 140,
    type: 'currency',
    props: { align: 'right' },
  },
  {
    id: 'PaymentDate',
    label: 'Vade Tarihi',
    isSortDisabled: true,
    width: 120,
    type: 'date',
    props: { align: 'center' },
  },
  {
    id: 'ApprovedPaymentDueDate',
    label: 'Onaylanan Vade Tarihi',
    isSortDisabled: true,
    width: 160,
    type: 'date',
    props: { align: 'center' },
  },
  {
    id: 'AllowanceDueDate',
    label: 'Talep Tarihi',
    isSortDisabled: true,
    width: 120,
    type: 'date',
    props: { align: 'center' },
  },
  {
    id: 'DueDayCount',
    label: 'Vadeye Kalan Gün',
    isSortDisabled: true,
    width: 120,
    props: { align: 'center' },
  },
  {
    id: 'CommissionAmount',
    label: 'Komisyon Tutarı',
    isSortDisabled: true,
    width: 140,
    type: 'currency',
  },
];

/**
 * Get row ID for table component
 * @param item - Table row item
 * @returns Unique row identifier
 */
export const getBankInvoiceReconciliationRowId = (item: BankInvoiceReconciliationItem): string => {
  return `${item.AllowanceId}-${item.InvoiceNumber}`;
};

/**
 * Empty state configuration for table
 */
export const getBankInvoiceReconciliationEmptyState = () => ({
  title: 'Sonuç Bulunamadı',
  description: 'Seçilen kriterlere uygun kayıt bulunmamaktadır.',
});

/**
 * Table configuration object following OperationPricing pattern
 */
export const getBankInvoiceReconciliationTableConfig = () => ({
  headers: getBankInvoiceReconciliationTableHeaders(),
  rowId: 'AllowanceId' as keyof BankInvoiceReconciliationItem,
  getRowId: getBankInvoiceReconciliationRowId,
  emptyState: getBankInvoiceReconciliationEmptyState(),
  // Table settings matching legacy
  size: 'medium' as const,
  striped: false,
  maxHeight: 'calc(100vh - 400px)', // Responsive height
  // Pagination settings matching legacy (25 items per page)
  pageSize: 25,
});
