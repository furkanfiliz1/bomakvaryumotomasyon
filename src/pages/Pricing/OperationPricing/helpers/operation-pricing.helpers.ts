import dayjs from 'dayjs';
import { HUMAN_READABLE_DATE_TIME } from '@constant';

/**
 * Transform filter object to API query parameters
 * Converts Date objects to formatted strings and processes UserIds array
 */

/**
 * Remove empty or null values from query object
 * Matches legacy emptyOrNullRemoveQuery helper
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
 * Get badge properties for operation pricing status
 * Matches legacy OperationChargeReport status mapping exactly
 */
export const getStatusBadgeProps = (status: number, statusDescription?: string) => {
  // For status 4, always use statusDescription from API
  // For status 6, use statusDescription if provided (already formatted as "İade - RefundType")
  // For other statuses, use predefined labels to match legacy system
  let label: string;

  if (status === 4) {
    label = statusDescription || 'Bilinmeyen';
  } else if (status === 6 && statusDescription) {
    label = statusDescription; // Already formatted as "İade - RefundTypeDescription"
  } else {
    label = getDefaultStatusLabel(status);
  }

  switch (status) {
    case 1: // Paid - "Ödendi"
      return {
        label,
        color: 'success' as const,
        variant: 'filled' as const,
      };
    case 2: // Canceled - "İptal Edildi"
      return {
        label,
        color: 'error' as const,
        variant: 'filled' as const,
      };
    case 3: // Failed - "Başarısız"
      return {
        label,
        color: 'error' as const,
        variant: 'filled' as const,
      };
    case 4: // Custom status - uses Description field
      return {
        label,
        color: 'error' as const,
        variant: 'filled' as const,
      };
    case 6: // Refund - "İade" or "İade - RefundTypeDescription"
      return {
        label,
        color: 'error' as const,
        variant: 'filled' as const,
      };
    case 7: // Partial Return - "Kısmı İade"
      return {
        label,
        color: 'warning' as const,
        variant: 'filled' as const,
      };
    default:
      return {
        label: status?.toString() || '-',
        color: 'default' as const,
        variant: 'outlined' as const,
      };
  }
};

/**
 * Get default status label matching legacy operationChargeReport labels exactly
 */
const getDefaultStatusLabel = (status: number): string => {
  switch (status) {
    case 1:
      return 'Ödendi'; // legacy: paid
    case 2:
      return 'İptal Edildi'; // legacy: canceled
    case 3:
      return 'Başarısız'; // legacy: failed
    case 6:
      return 'İade'; // legacy: refund
    case 7:
      return 'Kısmı İade'; // legacy: partialReturn
    default:
      return status?.toString() || '-';
  }
};

/**
 * Set empty values to null
 * Matches legacy setEmptyToNull helper
 */
export const setEmptyToNull = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = { ...obj };

  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (value === '' || (typeof value === 'string' && value.trim() === '')) {
      result[key] = null;
    }
  });

  return result;
};

/**
 * Generate Excel export filename with current date
 * Matches legacy file naming pattern
 */
export const generateExportFilename = (languageCode = 'tr'): string => {
  const fileInitial = languageCode === 'tr' ? 'islem_basi_ucretlendirme_raporlari' : 'per_transaction_charge_reports';
  const fileDate = dayjs().format('YYYY-MM-DD');
  return `${fileInitial}_${fileDate}.xls`;
};

/**
 * Get status color class for badge display
 * Matches legacy status display logic
 */
export const getStatusColor = (status: number): 'success' | 'error' | 'warning' | 'default' => {
  switch (status) {
    case 1: // Paid
      return 'success';
    case 2: // Canceled
    case 3: // Failed
    case 4: // Error
    case 6: // Refund
      return 'error';
    case 7: // Partial Return
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Get status text for display
 * Matches legacy status text mapping
 */
export const getStatusText = (status: number, description?: string, refundTypeDescription?: string): string => {
  switch (status) {
    case 1:
      return 'Ödendi';
    case 2:
      return 'İptal Edildi';
    case 3:
      return 'Başarısız';
    case 4:
      return description || 'Hata';
    case 6: {
      const refundText = 'İade';
      return refundTypeDescription ? `${refundText} - ${refundTypeDescription}` : refundText;
    }
    case 7:
      return 'Kısmi İade';
    default:
      return 'Bilinmeyen';
  }
};

/**
 * Check if refund action should be available for the given status
 * Matches legacy refund button visibility logic
 */
export const canRefund = (status: number): boolean => {
  return status === 1 || status === 7; // Paid or Partial Return
};

/**
 * Format currency amount for display
 * Maintains consistency with legacy formatting
 */
export const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Format date for display using project standards
 * Uses HUMAN_READABLE_DATE_TIME format for consistency across the application
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';

  try {
    return dayjs(dateString).format(HUMAN_READABLE_DATE_TIME);
  } catch {
    return '-';
  }
};

/**
 * Transform customer manager response to dropdown options
 * Matches legacy dropdown data transformation
 */
