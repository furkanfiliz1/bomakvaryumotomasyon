/**
 * Company E-Invoices Table Configuration Helpers
 * Following OperationPricing pattern for table configuration
 * Matches legacy table structure exactly
 */

import type { EInvoicesTableColumn } from '../company-einvoices-tab.types';

/**
 * Get table column definitions
 * Matches legacy table headers exactly:
 * - Ay (Month)
 * - Giden Adet (Outgoing Quantity)
 * - Giden Tutar (Outgoing Amount)
 * - Giden Ortalama (Outgoing Average)
 * - Gelen Adet (Incoming Quantity)
 * - Gelen Tutar (Incoming Amount)
 * - Gelen Ortalama (Incoming Average)
 */
export const getEInvoicesTableColumns = (): EInvoicesTableColumn[] => [
  {
    key: 'dateDisplay',
    label: 'Ay',
    align: 'left',
  },
  {
    key: 'outgoingCount',
    label: 'Giden Adet',
    align: 'left',
    format: 'number',
  },
  {
    key: 'outgoingAmount',
    label: 'Giden Tutar',
    align: 'left',
    format: 'currency',
  },
  {
    key: 'outgoingAverage',
    label: 'Giden Ortalama',
    align: 'left',
    format: 'currency',
  },
  {
    key: 'incomingCount',
    label: 'Gelen Adet',
    align: 'left',
    format: 'number',
  },
  {
    key: 'incomingAmount',
    label: 'Gelen Tutar',
    align: 'left',
    format: 'currency',
  },
  {
    key: 'incomingAverage',
    label: 'Gelen Ortalama',
    align: 'left',
    format: 'currency',
  },
];

/**
 * Get table styling configuration matching legacy Bootstrap classes
 */
export const getTableStyling = () => ({
  card: {
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 1,
    boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
    marginBottom: 3,
  },
  table: {
    size: 'small' as const,
  },
  tableHead: {
    backgroundColor: '#343a40',
    '& th': {
      color: 'white',
      fontWeight: 600,
    },
  },
  tableBody: {
    '& td': {
      fontSize: '0.875rem',
    },
  },
});

/**
 * Get empty state configuration
 */
export const getEmptyStateConfig = () => ({
  message: 'Yeterli veri bulunmamaktadır',
  cardSx: {
    padding: 3,
    marginTop: 4,
    backgroundColor: 'white',
    borderRadius: 1,
    boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
    marginBottom: 3,
    textAlign: 'center' as const,
  },
});
