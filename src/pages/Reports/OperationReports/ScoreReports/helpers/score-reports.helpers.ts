import dayjs from 'dayjs';
import type { ScoreReportCompany } from '../score-reports.types';

/**
 * Business logic helpers for Score Reports
 * Based on legacy implementation patterns
 */

/**
 * Format date for display (DD.MM.YYYY format as in legacy)
 */
export const formatScoreReportsDate = (dateString: string): string => {
  return dayjs(dateString).format('DD.MM.YYYY');
};

/**
 * Generate Excel filename based on legacy pattern
 */
export const generateScoreReportsExcelFileName = (identifier?: string): string => {
  const identifierPart = identifier ?? 'Tüm_tedarikciler';
  const fileInitial = 'figoskor_entegrator_fatura_cekim_raporu';
  const fileDate = dayjs(new Date()).format('YYYY-MM-DD');
  return `${identifierPart}_${fileInitial}_${fileDate}.xls`;
};

/**
 * Sort companies by LastTransferDate as in legacy
 */
export const sortCompaniesByLastTransferDate = (companies: ScoreReportCompany[]): ScoreReportCompany[] => {
  return companies.sort((a, b) => {
    const dateA = dayjs(a.Config.LastTransferDate);
    const dateB = dayjs(b.Config.LastTransferDate);
    return dateB.diff(dateA); // Most recent first
  });
};

/**
 * Get active status text
 */
export const getActiveStatusText = (): string => {
  return 'Aktif';
};

/**
 * Get inactive status text
 */
export const getInactiveStatusText = (): string => {
  return 'Pasif';
};

/**
 * Get status text with proper casing (deprecated - use specific methods)
 * @deprecated Use getActiveStatusText() or getInactiveStatusText() instead
 */
export const getStatusText = (isActive: boolean): string => {
  return isActive ? getActiveStatusText() : getInactiveStatusText();
};
