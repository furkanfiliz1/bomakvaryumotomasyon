/**
 * Company Representative Settings Table Configuration
 * Defines table headers and structure following OperationPricing patterns
 */

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers configuration for company representative settings
 * Matches legacy CustomerManagerList table structure exactly
 */
export function getCompanyRepresentativeTableHeaders(): HeadCell[] {
  return [
    {
      id: 'CompanyIdentifier',
      label: 'Şirket VKN / Adı',
      width: 140,
      slot: true, // Custom slot for formatted display
    },
    {
      id: 'ManagerUserId',
      label: 'Müşteri Temsilcisi',
      width: 200,
      slot: true, // Editable dropdown
    },
    {
      id: 'ProductType',
      label: 'Ürün',
      width: 200,
      slot: true, // Editable dropdown
    },
    {
      id: 'FinancerCompanyId',
      label: 'Finansör',
      width: 200,
      slot: true, // Editable dropdown (conditional)
    },
    {
      id: 'StartDate',
      label: 'Başlangıç Tarihi',
      width: 150,
      slot: true, // Editable date picker
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 120,
      slot: true,
      isSortDisabled: true,
    },
  ];
}
