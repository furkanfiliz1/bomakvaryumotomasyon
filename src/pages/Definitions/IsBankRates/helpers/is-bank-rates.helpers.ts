/**
 * İş Bankası Oranları (Is Bank Rates) Helper Functions
 * Constants and utility functions for İş Bankası rate operations
 */

import type { YearOption } from '../is-bank-rates.types';

/**
 * Default Currency ID for İş Bankası rates (matches legacy: CurrencyId: 2)
 */
export const DEFAULT_CURRENCY_ID = 2;

/**
 * Years constant for dropdown - matches legacy pattern
 */
export const YEARS: YearOption[] = [
  { value: '2020', label: '2020' },
  { value: '2021', label: '2021' },
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
  { value: '2030', label: '2030' },
];

/**
 * Minimum valid year for İş Bankası rate entry
 */
export const MIN_VALID_YEAR = 1900;

/**
 * Maximum valid year for İş Bankası rate entry
 */
export const MAX_VALID_YEAR = 2030;

/**
 * Validate year is within valid range - matches legacy validation
 * @param year - Year value to validate
 * @returns true if valid, false otherwise
 */
export const isValidYear = (year: number): boolean => {
  return year > MIN_VALID_YEAR && year < MAX_VALID_YEAR;
};

/**
 * Get month name by month number
 * @param monthNumber - Month number (1-12)
 * @param months - Months array from constants
 * @returns Month name or empty string
 */
export const getMonthName = (monthNumber: number, months: Array<{ id: number; name: string }>): string => {
  const month = months.find((m) => m.id === monthNumber);
  return month?.name ?? '';
};

/**
 * Format buying rate for display
 * @param rate - Rate value
 * @returns Formatted rate string
 */
export const formatBuyingRate = (rate: number): string => {
  return rate.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
};
