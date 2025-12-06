import { HeadCell } from 'src/components/common/Table/types';
import { LegalProceedingsItem } from '../limit-operations.types';

/**
 * Table headers configuration for Legal Proceedings
 */
export const legalProceedingsTableHeaders: HeadCell[] = [
  {
    id: 'Id',
    label: 'Tazmin ID',
    width: 120,
  },
  {
    id: 'Identifier',
    label: 'Vkn',
  },
  {
    id: 'CustomerName',
    label: 'Ünvan',
  },
  {
    id: 'CustomerManager',
    label: 'Müşteri Temisilcisi',
  },

  {
    id: 'TotalRisk',
    label: 'Toplam Risk',
    width: 140,
    type: 'currency',
  },
  {
    id: 'CompensationDate',
    label: 'Tazmin Tarihi',
    width: 120,
    type: 'date',
  },
  {
    id: 'Amount',
    label: 'Tazmin Tutarı',
    width: 140,
    type: 'currency',
  },
  {
    id: 'TotalCollectionAmount',
    label: 'Tazmin Sonrası Tahsilat Tutarı',
    width: 140,
    type: 'currency',
  },
  {
    id: 'RemainingCompensationAmount',
    label: 'Kalan Tazmin Tutarı',
    width: 140,
    type: 'currency',
  },

  {
    id: 'InterestAmount',
    label: 'Faiz Tutarı',
    width: 100,
    type: 'currency',
  },
  {
    id: 'InterestRate',
    label: 'Faiz Oranı',
    width: 100,
    type: 'percentage',
  },
  {
    id: 'RiskyFinancialSituations',
    label: 'Şirket Durumu',
    slot: true,
  },
];

/**
 * Default sorting configuration
 */
export const defaultSortConfig = {
  field: 'Id',
  direction: 'asc' as const,
};

/**
 * Default pagination configuration
 */
export const defaultPaginationConfig = {
  page: 1,
  pageSize: 50,
  pageSizeOptions: [25, 50, 100],
};

/**
 * Table action handlers mapping
 */
export const tableActionHandlers = {
  openLawFirmModal: 'LawFirm',
  openEarliestDefaultDateModal: 'EarliestDefaultDate',
  openTotalRiskModal: 'TotalRisk',
} as const;

/**
 * Check if pagination should be shown
 */
export const shouldShowPagination = (totalCount: number): boolean => {
  return totalCount > 25;
};

/**
 * Generate table row key
 */
export const generateRowKey = (item: LegalProceedingsItem): string => {
  return `legal-proceeding-${item.Id}`;
};

/**
 * Get empty state message
 */
export const getEmptyStateMessage = (): string => {
  return 'Arama kriterlerinize uygun kanuni takip kaydı bulunamadı.';
};

/**
 * Get loading state message
 */
export const getLoadingStateMessage = (): string => {
  return 'Kanuni takip kayıtları yükleniyor...';
};
