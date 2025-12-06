import dayjs from 'dayjs';
import type { BuyerReconciliationQueryParams, MonthOption, YearOption } from '../buyer-reconciliation.types';

/**
 * Remove empty or null values from query object
 * Matches OperationPricing removeEmptyQueryParams helper pattern
 */
export const removeEmptyQueryParams = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '' && value !== 0) {
      if (Array.isArray(value) && value.length > 0) {
        result[key] = value;
      } else if (!Array.isArray(value)) {
        result[key] = value;
      }
    }
  });

  return result;
};

/**
 * Transform filter object to API query parameters
 * Handles legacy API parameter conversion exactly as in ReceiverInvoiceReconciliation
 */
export const transformFiltersToQueryParams = (
  filters: Partial<BuyerReconciliationQueryParams>,
): Record<string, unknown> => {
  const queryParams = {
    ...filters,
    // Keep identifier as string for VKN search (matching legacy)
    identifier: filters.identifier || '',
    // Ensure month and year have defaults
    month: filters.month || 1,
    year: filters.year || new Date().getFullYear(),
    // useServerSideQuery will add pagination parameters automatically
  };

  return removeEmptyQueryParams(queryParams);
};

/**
 * Generate month options for dropdown - matches legacy month selector exactly
 * Returns Turkish month names in same order as legacy system
 */
export const getMonthOptions = (): MonthOption[] => [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' },
];

/**
 * Generate year options for dropdown - matches BankInvoiceReconciliation pattern exactly
 * Current year ±5 years range (same as legacy implementation)
 */
export const getYearOptions = (): YearOption[] => {
  const currentYear = new Date().getFullYear();
  const options: YearOption[] = [];

  // Generate years from -5 to +4 (matching legacy for loop: i = -5; i < 5)
  for (let i = -5; i < 5; i++) {
    const year = currentYear + i;
    options.push({
      value: year,
      label: year.toString(),
    });
  }

  return options;
};

/**
 * Generate Excel filename - matches legacy naming convention exactly
 * Format: {identifier}-{month}-{year}_alici_bazli_fatura_raporlari_{date}.xls
 */
export const generateExcelFilename = (identifier: string, month: number, year: number): string => {
  const fileDate = dayjs().format('YYYY-MM-DD');
  const identifierPart = identifier || 'all';

  return `${identifierPart}-${month}-${year}_alici_bazli_fatura_raporlari_${fileDate}.xls`;
};

/**
 * Format allowance due display - combines date and day count
 * Matches legacy display: "2024-01-15 - 30" format
 */
export const formatAllowanceDue = (date: string, dayCount: number): string => {
  if (!date || dayCount === null || dayCount === undefined) {
    return '-';
  }
  return `${date} - ${dayCount}`;
};
