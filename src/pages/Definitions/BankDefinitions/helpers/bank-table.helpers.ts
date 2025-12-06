import { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers configuration for banks list
 * Matches legacy table columns exactly
 */
export function getBankTableHeaders(): HeadCell[] {
  return [
    {
      id: 'Id',
      label: 'Banka ID',
      width: 100,
      type: 'number',
    },
    {
      id: 'Name',
      label: 'Banka Adı',
      width: 400,
    },
    {
      id: 'Code',
      label: 'Banka Kodu',
      width: 200,
    },
    {
      id: 'actions',
      label: '',
      width: 100,
      slot: true,
    },
  ];
}

/**
 * Get table headers configuration for bank branches list
 * Matches legacy table columns exactly
 */
export function getBankBranchTableHeaders(): HeadCell[] {
  return [
    {
      id: 'Id',
      label: 'ID',
      width: 100,
      type: 'number',
    },
    {
      id: 'Bank',
      label: 'Banka Adı',
      width: 300,
    },
    {
      id: 'Name',
      label: 'Şube Adı',
      width: 300,
    },
    {
      id: 'Code',
      label: 'Şube Kodu',
      width: 200,
    },
    {
      id: 'actions',
      label: '',
      width: 100,
      slot: true,
    },
  ];
}
