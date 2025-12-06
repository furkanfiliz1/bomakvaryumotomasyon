// Table configuration helpers for Score Invoice Transfer Reports
// Following OperationPricing table helper patterns

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers configuration for Score Invoice Transfer Reports
 * Following legacy ScoreInvoiceTransferReport.js table structure exactly
 */
export const getScoreInvoiceTransferReportsTableHeaders = (): HeadCell[] => [
  {
    id: 'CompanyName',
    label: 'Tedarikçi Adı',
    slot: true, // Show CompanyName + CompanyIdentifier
    width: 200,
  },
  {
    id: 'Name',
    label: 'Entegratör Adı',
    slot: true, // Show Name + Identifier
    width: 200,
  },
  {
    id: 'IsActive',
    label: 'Entegratör Durumu',
    slot: true, // Show Aktif/Pasif based on IsActive
    width: 150,
  },
  {
    id: 'StartTransferDate',
    label: 'Aktarım Başlangıcı',
    type: 'date',
    slot: true, // Format date from Config.StartTransferDate
    width: 160,
  },
  {
    id: 'LastTransferDate',
    label: 'Son Aktarım',
    type: 'date',
    slot: true, // Format date from Config.LastTransferDate
    width: 140,
  },
  {
    id: 'CreatedDate',
    label: 'Aktarım Oluşturma',
    type: 'date',
    slot: true, // Format date from Config.CreatedDate
    width: 160,
  },
  {
    id: 'ConfigIsActive',
    label: 'Aktarım Durumu',
    slot: true, // Show Aktif/Pasif based on Config.IsActive
    width: 140,
  },
  {
    id: 'details',
    label: 'Detay',
    slot: true, // Navigation button to history page
    width: 100,
    isSortDisabled: true,
  },
];

/**
 * Get default sorting configuration
 * No default sorting as requested by API requirements
 */
export const getDefaultSortConfig = () => ({
  sortField: undefined,
  sortDirection: undefined,
});

// Responsive configuration removed - not used in legacy implementation
