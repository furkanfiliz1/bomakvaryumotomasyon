/**
 * Campaign Discount Definition Helper Functions
 * Constants and utility functions for campaign discount operations
 */

import type { CampaignTypeOption, YearOption } from '../campaign-discount-definition.types';

/**
 * Campaign types constant - matches legacy exactly
 * Only one type exists: "Tavsiye Et, Kazan!" (value: 1)
 */
export const CAMPAIGN_TYPES: CampaignTypeOption[] = [
  {
    value: 1,
    label: 'Tavsiye Et, Kazan!',
  },
];

/**
 * Years constant for dropdown - matches legacy yearsConst
 */
export const YEARS: YearOption[] = [
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
 * Default page size for campaign list
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Default sort type for campaign list
 */
export const DEFAULT_SORT_TYPE = 'Desc';

/**
 * Default campaign type (Tavsiye Et, Kazan!)
 */
export const DEFAULT_CAMPAIGN_TYPE = 1;

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
 * Format ratio for display with percentage sign
 * @param ratio - Ratio value
 * @returns Formatted ratio string with % prefix
 */
export const formatRatioDisplay = (ratio: number): string => {
  return `%${ratio}`;
};

/**
 * Format month/year for display
 * @param monthNumber - Month number (1-12)
 * @param year - Year value
 * @param months - Months array from constants
 * @returns Formatted month/year string
 */
export const formatMonthYearDisplay = (
  monthNumber: number,
  year: number,
  months: Array<{ id: number; name: string }>,
): string => {
  const monthName = getMonthName(monthNumber, months);
  return `${monthName} / ${year}`;
};

/**
 * Get campaign type label by value
 * @param value - Campaign type value
 * @returns Campaign type label
 */
export const getCampaignTypeLabel = (value: number): string => {
  const campaignType = CAMPAIGN_TYPES.find((ct) => ct.value === value);
  return campaignType?.label ?? '-';
};
