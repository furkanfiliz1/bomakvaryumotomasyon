/**
 * Sector Ratios Table Helpers
 * Table configuration and utility functions
 */

import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Table column configuration for Sector Ratios
 * Matches legacy table structure exactly:
 * - Rasyo Adı (Ratio Name)
 * - Puan (Point)
 * - Min
 * - Max
 * - İşlemler (Actions) - handled by rowActions
 */
export const getSectorRatiosTableHeaders = (): HeadCell[] => [
  {
    id: 'ratio',
    label: 'Rasyo Adı',
  },
  {
    id: 'point',
    label: 'Puan',
    type: 'number',
  },
  {
    id: 'min',
    label: 'Min',
    type: 'number',
  },
  {
    id: 'max',
    label: 'Max',
    type: 'number',
  },
];

/**
 * Get table empty state message
 * Matches legacy: "Listede sektör kaydı yok"
 */
export const getEmptyStateMessage = (): string => {
  return 'Listede sektör kaydı yok';
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
