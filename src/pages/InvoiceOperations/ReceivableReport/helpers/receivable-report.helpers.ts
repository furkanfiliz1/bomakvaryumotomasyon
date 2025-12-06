import dayjs from 'dayjs';

/**
 * Generate Excel export filename for receivable reports
 * Following OperationPricing pattern for file naming conventions
 */
export const generateReceivableReportExportFilename = (): string => {
  const languageCode = localStorage.getItem('language') || 'tr';
  const fileInitial = languageCode === 'tr' ? 'alacak_raporlari' : 'receivable_reports';
  const fileDate = dayjs().format('YYYY-MM-DD');
  return `${fileInitial}_${fileDate}`;
};

/**
 * Transform null or undefined values to null for API consistency
 * Following OperationPricing pattern for data transformation
 */
export const transformFiltersForAPI = <T extends Record<string, unknown>>(filters: T): T => {
  const result = { ...filters } as Record<string, unknown>;
  
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (value === '' || (typeof value === 'string' && value.trim() === '')) {
      result[key] = null;
    }
  });

  return result as T;
};