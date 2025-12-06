import { DEFAULT_STATUS_COLOR, EUS_STATUS_COLORS } from '../constants';
import type {
  EusStatusColor,
  EusTrackingFilterForm,
  EusTrackingFilters,
  EusTrackingItem,
} from '../eus-tracking-reports.types';

/**
 * Business logic helpers for EUS Tracking Reports
 * Based on legacy EusTrackingReport component patterns
 */

/**
 * Get status color based on status value - matches legacy returnColorRow method exactly
 */
export const getStatusColor = (status: number): EusStatusColor => {
  return EUS_STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;
};

/**
 * Format empty company name with fallback - matches legacy display logic
 */
export const formatCompanyName = (companyName: string | null): string => {
  return companyName || '-';
};

/**
 * Format ratio values as percentages - matches legacy display logic
 */
export const formatPercentageValue = (value: number): string => {
  if (value == null || isNaN(value)) {
    return '0';
  }
  return String(value);
};

/**
 * Format integrator count display - matches legacy logic exactly
 */
export const formatIntegratorCount = (count: number): string => {
  if (count === 0 || !count) {
    return 'Yok'; // Matches legacy lang.companyList.none
  }
  return 'Var'; // Matches legacy lang.common.thereIsAvailable
};

/**
 * Format returned allowance display - matches legacy display logic
 */
export const formatReturnedAllowance = (value: number): string => {
  if (value == null || value === 0) {
    return 'Yok';
  }
  return String(value);
};

/**
 * Transform form data to API filters - matches legacy form submission
 * Excludes "Tümü" (*) values from being sent as query parameters
 */
export const transformFormToFilters = (formData: EusTrackingFilterForm): Partial<EusTrackingFilters> => {
  const filters: Partial<EusTrackingFilters> = {};

  if (formData.companyIdentifier?.trim()) {
    filters.companyIdentifier = formData.companyIdentifier.trim();
  }

  if (formData.companyName?.trim()) {
    filters.companyName = formData.companyName.trim();
  }

  // Only add dropdown values if they are not "*" (Tümü option)
  if (formData.eusFormulaTypes && formData.eusFormulaTypes !== '*') {
    filters.EUSFormulaTypes = formData.eusFormulaTypes;
  }

  if (formData.eusStatusTypes && formData.eusStatusTypes !== '*') {
    filters.EUSStatusTypes = formData.eusStatusTypes;
  }

  if (formData.companyStatus && formData.companyStatus !== '*') {
    filters.CompanyStatus = formData.companyStatus;
  }

  if (formData.month && formData.month !== '*') {
    filters.month = formData.month;
  }

  if (formData.year && formData.year !== '*') {
    filters.year = formData.year;
  }

  return filters;
};

/**
 * Check if item has any warning/blocked status - for styling purposes
 */
export const hasWarningStatus = (item: EusTrackingItem): boolean => {
  const statusFields = [
    item.invoiceMonthlyIncreaseStatus,
    item.invoiceThreeMonthlyIncreaseStatus,
    item.totalPaymentMonthlyDecreaseStatus,
    item.totalPaymentThreeMonthlyDecreaseStatus,
    item.returnedInvoiceTotalIncreaseRatioStatus,
    item.senderAndReceiverRelationStatus,
    item.senderAndReceiverReturnedAllowanceStatus,
    item.companyIntegratorConnectionStatus,
  ];

  return statusFields.some((status) => status === 2 || status === 3);
};

/**
 * Generate navigation path for company detail - matches legacy navigation
 */
export const generateCompanyDetailPath = (companyId: number): string => {
  return `/figo-score/sirketler/${companyId}/eus`;
};
