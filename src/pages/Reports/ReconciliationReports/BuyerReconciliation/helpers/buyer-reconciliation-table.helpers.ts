import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table column configuration for Buyer Reconciliation Report
 * Matches actual API response structure and legacy display layout
 * Uses built-in currency formatting and custom slots only where needed
 */
export const getBuyerReconciliationTableColumns = (): HeadCell[] => [
  {
    id: 'SenderName',
    label: 'Satıcı',
    width: 120,
  },
  {
    id: 'allowanceInfo',
    label: 'İskonto No',
    width: 140,
    slot: true,
  },
  {
    id: 'allowanceDue',
    label: 'İskonto Vade Tarih/Gün',
    width: 160,
    slot: true,
  },
  {
    id: 'FinancerName',
    label: 'Finansör',
    width: 120,
  },
  {
    id: 'TotalPayableAmount',
    label: 'Ödeme Tutarı',
    width: 130,
    type: 'currency',
  },
  {
    id: 'TotalPaidAmount',
    label: 'Ödenmiş Tutar',
    width: 130,
    type: 'currency',
  },
  {
    id: 'TotalInvoiceCount',
    label: 'Fatura Adedi',
    width: 110,
  },
  {
    id: 'ReceiverCredit',
    label: 'Alıcı Kredisi',
    width: 120,
    type: 'currency',
  },
  {
    id: 'Rebate',
    label: 'Rabate',
    width: 100,
    type: 'currency',
  },
];

/**
 * Get table configuration options
 * Matches legacy pagination and export settings
 */
export const getBuyerReconciliationTableConfig = () => ({
  pagination: {
    enabled: true,
    pageSize: 25, // Matches legacy pageSize
    showSizeChanger: false, // Legacy used fixed page size
  },
  export: {
    enabled: true,
    formats: ['excel'] as const,
  },
  selection: {
    enabled: false, // Legacy had no row selection
  },
  sorting: {
    enabled: false, // Legacy had no column sorting
  },
  filtering: {
    enabled: false, // Legacy used separate filter form
  },
});

/**
 * Get responsive breakpoints for mobile display
 * Matches legacy responsive card layout behavior
 */
export const getBuyerReconciliationResponsiveConfig = () => ({
  // Hide column headers on mobile (legacy behavior)
  hideHeadersOnMobile: true,
  // Show as cards on small screens
  cardViewBreakpoint: 'md' as const,
  // Mobile column priority (most important columns shown first)
  mobileColumnPriority: ['senderName', 'allowanceInfo', 'allowanceDue', 'totalPayableAmount', 'totalPaidAmount'],
});
