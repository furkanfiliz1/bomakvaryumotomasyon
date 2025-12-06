// Date formatting utilities are implemented inline to avoid unused imports
import type { CheckReportFilters } from '../check-report.types';

/**
 * Transforms form data to API query parameters
 * Matches legacy system date formatting and parameter structure
 */
export const transformFiltersToQueryParams = (filters: CheckReportFilters): CheckReportFilters => {
  const params = { ...filters };

  // Transform date fields to YYYY-MM-DD format like legacy system
  if (params.minPaymentDate) {
    const date = new Date(params.minPaymentDate);
    params.minPaymentDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  if (params.maxPaymentDate) {
    const date = new Date(params.maxPaymentDate);
    params.maxPaymentDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  return params;
};

/**
 * Format currency value for display
 * Matches legacy system currency formatting
 */
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date for display
 * Matches legacy system date format (DD.MM.YYYY)
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Get display value or default dash
 * Matches legacy system null/empty handling
 */
export const getDisplayValue = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
};

/**
 * Validate form data before submission
 * Matches legacy system validation rules
 */
export const validateFilters = (filters: CheckReportFilters): string[] => {
  const errors: string[] = [];

  // Check date range validation
  if (filters.minPaymentDate && filters.maxPaymentDate) {
    const minDate = new Date(filters.minPaymentDate);
    const maxDate = new Date(filters.maxPaymentDate);

    if (minDate > maxDate) {
      errors.push('Başlangıç tarihi, bitiş tarihinden sonra olamaz');
    }
  }

  // Check amount range validation
  if (filters.minPayableAmount && filters.maxPayableAmount) {
    if (filters.minPayableAmount > filters.maxPayableAmount) {
      errors.push('Minimum tutar, maksimum tutardan büyük olamaz');
    }
  }

  // Check negative amounts
  if (filters.minPayableAmount && filters.minPayableAmount < 0) {
    errors.push('Minimum tutar negatif olamaz');
  }

  if (filters.maxPayableAmount && filters.maxPayableAmount < 0) {
    errors.push('Maksimum tutar negatif olamaz');
  }

  return errors;
};

/**
 * Generate export filename
 * Matches legacy system filename pattern
 * Note: useServerSideQuery will automatically append date and .xls extension
 */
export const generateExportFilename = (): string => {
  return 'cek_raporlari';
};
