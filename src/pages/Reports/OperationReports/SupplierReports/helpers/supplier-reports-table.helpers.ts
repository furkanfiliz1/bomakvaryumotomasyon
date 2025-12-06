import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Supplier Reports Table Configuration
 * Exact match with legacy Tedarikçi Raporları - 6 columns
 */

export const getSupplierReportsTableHeaders = (): HeadCell[] => [
  {
    id: 'SenderCompanyName',
    label: 'Satıcı',
  },
  {
    id: 'ReceiverCompanyName',
    label: 'Alıcı',
  },
  {
    id: 'ActiveContract',
    label: 'Aktiflik',
    slot: true,
  },
  {
    id: 'LastProcessDate',
    label: 'Son İşlem',
    type: 'date',
  },
  {
    id: 'UsableInvoices',
    label: 'Kullanılabilir',
    type: 'currency',
  },
  {
    id: 'UsedInvoices',
    label: 'Kullanılan',
    type: 'currency',
  },
];
