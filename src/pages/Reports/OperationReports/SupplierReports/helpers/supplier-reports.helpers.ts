import type { SupplierReportsFilters } from '../supplier-reports.types';

/**
 * Supplier Reports Helper Functions
 * Following OperationPricing helper patterns exactly
 */

// Display value or dash for null/empty values - matches OperationPricing pattern
export const displayValueOrDash = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '−';
  }
  return String(value);
};

// Format currency values - matches OperationPricing pattern
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return '−';
  }
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '−';
  }
  return new Intl.NumberFormat('tr-TR').format(value);
};

// Format date and time - matches OperationPricing pattern
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '−';
  }
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '−';
  }
};

// Process filter params for API - matches legacy parameter processing
export const processFilterParams = (params: SupplierReportsFilters): SupplierReportsFilters => {
  const processedParams = { ...params };

  // Remove empty values
  Object.keys(processedParams).forEach((key) => {
    const value = processedParams[key as keyof SupplierReportsFilters];
    if (value === null || value === undefined || value === '') {
      delete processedParams[key as keyof SupplierReportsFilters];
    }
  });

  return processedParams;
};

// Get active contract badge properties - matching legacy API structure
export const getActiveContractBadgeProps = (isActive: boolean) => {
  return {
    label: isActive ? 'Aktif' : 'Pasif',
    color: isActive ? ('success' as const) : ('error' as const),
    variant: 'filled' as const,
  };
};
