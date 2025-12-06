import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Table column configuration for Score Reports
 * Exact match with legacy ScoreInvoiceTransferReport table structure
 * Legacy columns: Tedarikçi, Entegratör Adı, Entegratör Durumu, Transfer Başlangıç, Son Transfer, Oluşturulma, Transfer Durumu, Detay
 */
export const getScoreReportsTableHeaders = (): HeadCell[] => [
  {
    id: 'CompanyName',
    label: 'Tedarikçi Adı', // legacy: supplier name
  },
  {
    id: 'Name',
    label: 'Entegratör Adı', // legacy: integrator name
  },
  {
    id: 'IntegratorStatus',
    label: 'Entegratör Durumu', // legacy: integrator status (IsActive)
    slot: true,
  },
  {
    id: 'Config.StartTransferDate',
    label: 'Transfer Başlangıç', // legacy: transfer start date
    type: 'date',
  },
  {
    id: 'Config.LastTransferDate',
    label: 'Son Transfer', // legacy: last transfer date
    type: 'date',
  },
  {
    id: 'Config.CreatedDate',
    label: 'Oluşturulma Tarihi', // legacy: creation date
    type: 'date',
  },
  {
    id: 'Status',
    label: 'Transfer Durumu', // legacy: transfer status (Config.IsActive)
    slot: true,
  },
  {
    id: 'actions',
    label: 'Detay', // legacy: history/details action
    slot: true,
    isSortDisabled: true,
  },
];
