/**
 * Integrator Consensus helper functions
 * Following OperationPricing pattern for business logic utilities
 */

/**
 * Format currency values with Turkish locale
 * Following existing currency formatting patterns
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date values for display
 * Following existing date formatting patterns
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format datetime values for display
 * Following existing datetime formatting patterns
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format boolean values for display using Chip components
 * Following OperationPricing boolean display patterns
 */
export const formatBoolean = (value: boolean): { label: string; color: 'success' | 'error' } => {
  return value ? { label: 'Evet', color: 'success' } : { label: 'Hayır', color: 'error' };
};

/**
 * Connection status options for filter dropdown
 * Following OperationPricing STATUS_OPTIONS pattern
 */
export const CONNECTION_STATUS_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'true', label: 'Bağlı' },
  { value: 'false', label: 'Bağlı Değil' },
];
