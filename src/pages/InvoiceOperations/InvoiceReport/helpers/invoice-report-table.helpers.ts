import type { HeadCell } from 'src/components/common/Table/types';
import type { InvoiceItem } from '../invoice-report.types';

/**
 * Table configuration helpers for InvoiceReport
 * Following OperationPricing table helpers pattern exactly
 */

// Define table headers following table.instructions.md patterns
export const getInvoiceReportTableHeaders = (): HeadCell[] => [
  {
    id: 'InvoiceNumber',
    label: 'Fatura No',
    isSortDisabled: false,
    width: 150,
  },
  {
    id: 'SenderName',
    label: 'Satıcı',
    isSortDisabled: false,
    width: 200,
  },
  {
    id: 'ReceiverName',
    label: 'Alıcı',
    isSortDisabled: false,
    width: 200,
  },
  {
    id: 'InsertedDate',
    label: 'Yükleme Tarihi',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'IssueDate',
    label: 'Düzenleme Tarihi',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'PaymentDueDate',
    label: 'Vade Tarihi',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'PayableAmount',
    label: 'Tutar',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'RemainingAmount',
    label: 'Kalan Tutar',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'Type',
    label: 'Fatura Türü',
    isSortDisabled: false,
    width: 120,
    slot: true,
  },
  {
    id: 'ProfileId',
    label: 'Profil',
    isSortDisabled: true,
    width: 120,
    slot: true,
  },
  {
    id: 'Status',
    label: 'Durum',
    isSortDisabled: false,
    width: 100,
    slot: true,
  },
  {
    id: 'UsageStatus',
    label: 'Kullanım Durumu',
    isSortDisabled: true,
    width: 130,
    slot: true,
  },
  {
    id: 'actions',
    label: 'İşlemler',
    isSortDisabled: true,
    width: 120,
    slot: true,
  },
];

// Table configuration for server-side operations
export const invoiceReportTableConfig = {
  defaultPageSize: 50,
  defaultSort: 'InsertDatetime',
  defaultSortType: 'Asc' as const,
  rowId: 'Id' as keyof InvoiceItem,
  enableSelection: true,
  enableBulkActions: true,
};

// Column visibility configuration - can be used for responsive design
export const getColumnVisibility = (screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const baseColumns = ['InvoiceNumber', 'SenderName', 'PayableAmount', 'Status', 'actions'];

  switch (screenSize) {
    case 'xs':
      return baseColumns;
    case 'sm':
      return [...baseColumns, 'InsertedDate', 'Type'];
    case 'md':
      return [...baseColumns, 'InsertedDate', 'Type', 'ReceiverName', 'IssueDate'];
    case 'lg':
    case 'xl':
    default:
      return undefined; // Show all columns
  }
};
