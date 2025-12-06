import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Headers list for compensation transactions export
 */
export const headersList = [
  'vkn',
  'financerName',
  'customerName',
  'operationType',
  'collectionAmount',
  'collectionDate',
  'costAmount',
  'costDate',
];

/**
 * Table headers configuration for compensation transactions
 * Following the OperationPricing pattern
 */
export const getCompensationTransactionsTableHeaders = (): HeadCell[] => [
  {
    id: 'Identifier',
    label: 'VKN',
    isSortDisabled: true,
  },
  {
    id: 'FinancerName',
    label: 'Finansör',
    isSortDisabled: true,
  },
  {
    id: 'CompanyName',
    label: 'Ünvan',
    isSortDisabled: true,
  },
  {
    id: 'TypeDescription',
    label: 'İşlem Tipi',
    isSortDisabled: true,
  },
  {
    id: 'CollectionAmount',
    label: 'Tahsilat Tutarı',
    type: 'currency',
    isSortDisabled: true,
  },
  {
    id: 'CollectionDate',
    label: 'Tahsilat Tarihi',
    type: 'date',
    isSortDisabled: true,
  },
  {
    id: 'ExpenseAmount',
    label: 'Masraf Tutarı',
    type: 'currency',
    isSortDisabled: true,
  },
  {
    id: 'ExpenseDate',
    label: 'Masraf Tarihi',
    type: 'date',
    isSortDisabled: true,
  },
  {
    id: 'actions',
    label: 'İşlemler',
    isSortDisabled: true,
    width: 100,
    slot: true,
  },
];
