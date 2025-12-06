import type { HeadCell } from 'src/components/common/Table/types';
import { formatDateTime } from './invoice-transaction.helpers';

/**
 * Table column configuration for Invoice Transaction
 * Based on legacy IssuedInvoices table structure with proper Turkish labels
 */
export const getInvoiceTransactionTableHeaders = (): HeadCell[] => [
  {
    id: 'InvoiceNumber',
    label: 'Fatura No',
  },
  {
    id: 'ReceiverCompanyName',
    label: 'Fatura Alıcısı',
    slot: true,
  },
  {
    id: 'IssuedDate',
    label: 'Fatura Tarihi',
    type: 'date',
  },
  {
    id: 'TotalAmount',
    label: 'Tutar',
    type: 'currency',
  },
  {
    id: 'TotalTaxAmount',
    label: 'Vergi Tutarı',
    type: 'currency',
  },
  {
    id: 'Status',
    label: 'İade Durumu',
    slot: true,
    width: 150,
  },
  {
    id: 'TransferStatus',
    label: 'Gönderim Durumu',
    isSortDisabled: true,
    slot: true,
    width: 150,
  },
];

/**
 * Format issued date for display using project standards
 * Used in table date column display
 */
export const formatIssuedDate = (dateString: string): string => {
  return formatDateTime(dateString, 'DD.MM.YYYY');
};
