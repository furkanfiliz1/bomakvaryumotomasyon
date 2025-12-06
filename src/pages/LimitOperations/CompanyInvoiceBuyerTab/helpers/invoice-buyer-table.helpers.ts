import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Returns table headers configuration for Invoice Buyer Analysis table
 * Matches legacy system structure exactly
 */
export const getInvoiceBuyerTableHeaders = (): HeadCell[] => [
  {
    id: 'Identifier',
    label: 'ID',
    width: 150,
  },
  {
    id: 'CompanyName',
    label: 'Şirket Adı',
    width: 300,
  },
  {
    id: 'Score',
    label: 'Skor',
    width: 100,
    type: 'number',
  },
  {
    id: 'AverageInvoiceAmount',
    label: 'Ortalama Fatura Tutarı',
    width: 200,
    type: 'currency',
  },
];
