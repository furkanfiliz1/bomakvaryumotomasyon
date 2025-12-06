/**
 * Buyer Limits Table Configuration Helpers
 * Following OperationPricing table helpers pattern exactly
 */

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Table column configuration for Buyer Limits
 * Exact match with legacy ScoreCompanyBasedScore table structure and Turkish labels
 */
export const getBuyerLimitsTableHeaders = (): HeadCell[] => [
  {
    id: 'ReceiverIdentifier',
    label: 'VKN',
    width: 120,
  },
  {
    id: 'InvoiceScore',
    label: 'Fatura Skoru',
    width: 100,
    type: 'number',
  },
  {
    id: 'MaxInvoiceAmount',
    label: 'Maksimum fatura tutarı',
    width: 180,
    slot: true, // Custom slot for currency input
  },
  {
    id: 'MaxInvoiceDueDay',
    label: 'Maks Genel Vade Gün Sayısı',
    width: 200,
    slot: true, // Custom slot for number input + "Gün"
  },
  {
    id: 'IsActive',
    label: 'Aktif mi?',
    width: 100,
    slot: true, // Custom slot for switch
  },
  {
    id: 'actions',
    label: '', // Empty label for actions column
    width: 120,
    slot: true, // Custom slot for update button
    isSortDisabled: true,
  },
];

/**
 * Get table empty state message matching legacy exactly
 */
export const getEmptyStateMessage = (): string => {
  return 'Alıcı kural tanımı bulunmamaktadır.';
};

/**
 * Get table loading message
 */
export const getLoadingMessage = (): string => {
  return 'Yükleniyor...';
};

/**
 * Get table error message
 */
export const getErrorMessage = (error?: string): string => {
  return error || 'Veriler yüklenirken bir hata oluştu';
};

/**
 * Default page size matching legacy exactly
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Search form configuration
 */
export const getSearchFormConfig = () => ({
  placeholder: 'VKN',
  buttonText: 'Uygula',
});

/**
 * Calculate concentration button configuration
 */
export const getCalculateConcentrationConfig = () => ({
  text: 'Fatura Konsantrasyonu Hesapla',
  placement: 'top-right' as const,
});
