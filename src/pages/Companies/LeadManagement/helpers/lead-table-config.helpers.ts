/**
 * Lead Table Configuration Helpers
 * Following OperationPricing pattern for table configuration
 */

import { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for Lead List
 * Using BE field names (PascalCase) directly
 */
export function getLeadTableHeaders(): HeadCell[] {
  return [
    {
      id: 'CompanyName',
      label: 'Ünvan',
      width: 200,
    },
    {
      id: 'TaxNumber',
      label: 'VKN',
      width: 120,
    },
    {
      id: 'CustomerManagerName',
      label: 'Müşteri Temsilcisi',
      width: 150,
    },
    {
      id: 'CreatedAt',
      label: 'Kayıt Tarihi',
      width: 140,
      type: 'date',
    },
    {
      id: 'ChannelCode',
      label: 'Geliş Kanalı',
      width: 130,
    },
    {
      id: 'ProductType',
      label: 'İlgilendiği Ürün',
      width: 180,
      slot: true, // Custom rendering for product type
    },
    {
      id: 'LastCallResult',
      label: 'Arama Sonucu',
      width: 140,
      slot: true, // Custom rendering with chip
    },
    {
      id: 'MembershipCompleted',
      label: 'Üyelik Durumu',
      width: 150,
      slot: true, // Custom rendering with chip
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 120,
      slot: true, // Custom rendering with button
    },
  ];
}
