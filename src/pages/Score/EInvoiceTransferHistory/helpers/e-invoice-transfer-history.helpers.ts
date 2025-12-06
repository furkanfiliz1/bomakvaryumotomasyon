/**
 * E-Invoice Transfer History Helpers
 * Following OperationPricing helper patterns
 * Based on legacy EInvoiceTransferHistory.js business logic
 */

import type { HeadCell } from 'src/components/common/Table/types';
import type { EInvoiceTransferHistoryItem } from '../e-invoice-transfer-history.types';

/**
 * Get table headers for E-Invoice Transfer History
 * Following OperationPricing table configuration pattern
 */
export const getEInvoiceTransferHistoryTableHeaders = (): HeadCell[] => [
  {
    id: 'Id',
    label: 'ID',
    width: 80,
  },
  {
    id: 'Number',
    label: 'Fatura No',
    width: 150,
  },
  {
    id: 'CreatedDate',
    label: 'Fatura Tarihi',
    width: 120,
    slot: true,
  },
  {
    id: 'Date',
    label: 'Vade Tarihi',
    width: 120,
    slot: true,
  },
  {
    id: 'Status',
    label: 'Durum',
    width: 150,
    slot: true,
  },
  {
    id: 'Message',
    label: 'Mesaj',
    width: 200,
  },
];

/**
 * Format transfer invoice data for display
 * Based on legacy EInvoiceTransferHistory.js display logic
 */
export const formatEInvoiceTransferHistoryData = (items: EInvoiceTransferHistoryItem[]) => {
  return items.map((item) => ({
    ...item,
    formattedCreatedDate: new Date(item.CreatedDate).toLocaleDateString('tr-TR'),
    formattedDate: new Date(item.Date).toLocaleDateString('tr-TR'),
    isSuccess: item.Status === 0,
    isFailed: item.Status === 1,
  }));
};

/**
 * Check if all invoices are failed
 * Legacy: isAllFailed logic from EInvoiceTransferHistory.js
 */
export const checkIfAllFailed = (items: EInvoiceTransferHistoryItem[]): boolean => {
  return items.length > 0 && items.every((item) => item.Status === 1 && item.Id !== null);
};

/**
 * Format invoice status with appropriate styling
 * Based on legacy status display logic
 */
export const getStatusConfig = (status: number) => {
  if (status === 0) {
    return {
      variant: 'success' as const,
      color: 'success.main',
      icon: null,
    };
  }
  return {
    variant: 'error' as const,
    color: 'error.main',
    icon: 'fa-exclamation',
  };
};
