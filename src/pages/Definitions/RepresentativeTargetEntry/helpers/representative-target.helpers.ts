import { MonthOption, YearOption } from '../representative-target-entry.types';

/**
 * Get month options for dropdown
 * Matches legacy month list exactly
 */
export function getMonthOptions(): MonthOption[] {
  return [
    { value: '1', label: 'Ocak' },
    { value: '2', label: 'Şubat' },
    { value: '3', label: 'Mart' },
    { value: '4', label: 'Nisan' },
    { value: '5', label: 'Mayıs' },
    { value: '6', label: 'Haziran' },
    { value: '7', label: 'Temmuz' },
    { value: '8', label: 'Ağustos' },
    { value: '9', label: 'Eylül' },
    { value: '10', label: 'Ekim' },
    { value: '11', label: 'Kasım' },
    { value: '12', label: 'Aralık' },
  ];
}

/**
 * Get year options for dropdown
 * Matches legacy year list exactly (2022-2026)
 */
export function getYearOptions(): YearOption[] {
  return [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ];
}

/**
 * Format month and year for display
 * @param month - Month number (1-12)
 * @param year - Year number
 * @returns Formatted string "MM / YYYY"
 */
export function formatMonthYear(month: number, year: number): string {
  return `${month} / ${year}`;
}

/**
 * Get month name by value
 * @param monthValue - Month value as string (1-12)
 * @returns Month label
 */
export function getMonthLabel(monthValue: string): string {
  const month = getMonthOptions().find((m) => m.value === monthValue);
  return month?.label || monthValue;
}
