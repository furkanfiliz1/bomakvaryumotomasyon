import { LegalProceedingsItem } from '../limit-operations.types';

/**
 * Calculate remaining compensation amount
 */
export const calculateRemainingAmount = (amount: number, totalCollectionAmount: number): number => {
  return amount - totalCollectionAmount;
};

/**
 * Sum amounts for legal proceedings items
 */
export const sumLegalProceedingsAmount = (items: LegalProceedingsItem[], field: keyof LegalProceedingsItem): number => {
  return items.reduce((sum, item) => {
    const value = item[field];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
};

/**
 * Calculate per-page totals for legal proceedings
 */
export const calculatePageTotals = (items: LegalProceedingsItem[]) => {
  return {
    perPageCompensationAmount: sumLegalProceedingsAmount(items, 'Amount'),
    perPageCollectionAmount: sumLegalProceedingsAmount(items, 'TotalCollectionAmount'),
    perPageRemainingCompensationAmount: sumLegalProceedingsAmount(items, 'RemainingCompensationAmount'),
  };
};

/**
 * Generate Excel filename based on language and current date
 */
export const generateExcelFileName = (language: string = 'tr'): string => {
  const fileInitial = language === 'tr' ? 'kanuni_takip_islemleri' : 'compensations';
  const fileDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${fileInitial}_${fileDate}.xls`;
};

/**
 * Check if product type requires warning before opening modal
 */
export const shouldShowProductTypeWarning = (productType?: number): boolean => {
  return productType === 0;
};

/**
 * Parse currency input from formatted string to number
 */
export const parseCurrencyInput = (formattedValue: string): number => {
  // Remove currency symbols and thousand separators, keep decimal
  const cleanedValue = formattedValue.replace(/[₺\s]/g, '').replace(/\./g, '').replace(',', '.');
  const numericValue = parseFloat(cleanedValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Transform risky financial situations for API calls
 */
export const transformRiskyFinancialSituations = (riskyFinancialSituations: unknown): number[] | undefined => {
  if (Array.isArray(riskyFinancialSituations)) {
    return riskyFinancialSituations
      .map((e: { value?: number } | number) => (typeof e === 'object' && e !== null && 'value' in e ? e.value : e))
      .filter((v): v is number => typeof v === 'number');
  } else if (riskyFinancialSituations && typeof riskyFinancialSituations === 'string') {
    return riskyFinancialSituations.split(',').map(Number).filter(Boolean);
  }
  return undefined;
};

/**
 * Clean empty values and set to null for API calls
 */
export const setEmptyToNull = <T extends Record<string, unknown>>(obj: T): T => {
  const cleaned = {} as T;

  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T];
    if (value === '' || value === undefined) {
      cleaned[key as keyof T] = null as T[keyof T];
    } else {
      cleaned[key as keyof T] = value;
    }
  });

  return cleaned;
};

/**
 * Format date for display
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  } catch (error) {
    return '-';
  }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === null || amount === undefined) return '-';

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get status chip color based on state value
 */
export const getStateColor = (
  state?: number,
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  // This should match the legacy color mapping
  switch (state) {
    case 1:
      return 'primary';
    case 2:
      return 'warning';
    case 3:
      return 'success';
    case 4:
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Check if item has law firm information
 */
export const hasLawFirmInfo = (item: LegalProceedingsItem): boolean => {
  return Boolean(item.LawFirm && item.LawFirm);
};

/**
 * Check if item has earliest default date
 */

/**
 * Check if item has risk allowance data
 */
export const hasRiskAllowanceData = (item: LegalProceedingsItem): boolean => {
  return Boolean(item.CompanyId && item.FinancerId && item.ProductType !== undefined);
};
