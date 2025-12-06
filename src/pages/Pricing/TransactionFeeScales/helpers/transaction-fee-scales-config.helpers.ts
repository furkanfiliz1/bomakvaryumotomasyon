import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table configuration for Transaction Fee Scales
 * Matches legacy TransactionScales.js table headers exactly
 */
export const getTransactionFeeScalesTableHeaders = (): HeadCell[] => [
  {
    id: 'MinAmount',
    label: 'Minimum Tutar',
    type: 'currency',
  },
  {
    id: 'MaxAmount',
    label: 'Maximum Tutar',
    type: 'currency',
  },
  {
    id: 'TransactionFee',
    label: 'İşlem Ücreti(Birim)',
    type: 'currency',
  },
  {
    id: 'PercentFee',
    label: 'İşlem Ücreti(Yüzde)',
    type: 'number',
  },
  {
    id: 'SysLastUpdate',
    label: 'Kayıt Tarihi',
    type: 'date',
  },
];
