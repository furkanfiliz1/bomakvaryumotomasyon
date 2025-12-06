import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers configuration for customer request branch list
 * Matches legacy RequestTable.js column structure exactly
 */
export function getCustomerRequestBranchListHeaders(): HeadCell[] {
  return [
    {
      id: 'TargetCompanyIdentifier',
      label: 'VKN',
      width: 90,
    },
    {
      id: 'TargetCompanyTitle',
      label: 'Ünvan',
      width: 180,
    },
    {
      id: 'RequestDate',
      label: 'Talep Tarihi',
      width: 100,
      slot: true,
    },
    {
      id: 'Status',
      label: 'Durum',
      width: 130,
      slot: true,
    },
    {
      id: 'ContactPerson',
      label: 'Yetkili İsim',
      width: 140,
    },
    {
      id: 'Phone',
      label: 'Telefon',
      width: 120,
    },
    {
      id: 'MailAddress',
      label: 'Email',
      width: 180,
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 140,
      slot: true,
      isSortDisabled: true,
    },
  ];
}

/**
 * Default pagination configuration
 */
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT = 'Id';
export const DEFAULT_SORT_TYPE = 'Desc' as const;
