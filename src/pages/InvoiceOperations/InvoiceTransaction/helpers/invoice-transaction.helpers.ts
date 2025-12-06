import dayjs from 'dayjs';
import { HUMAN_READABLE_DATE_TIME } from '@constant';
import type { InvoiceTransactionFilters } from '../invoice-transaction.types';

/**
 * Transform filter object to API query parameters
 * Converts Date objects to formatted strings and handles empty values
 */
export const transformFiltersToParams = (filters: InvoiceTransactionFilters) => {
  const params: Record<string, unknown> = { ...filters };

  // Handle date formatting
  if (filters.StartDate) {
    params.StartDate = dayjs(filters.StartDate).format('YYYY-MM-DD');
  }

  if (filters.EndDate) {
    params.EndDate = dayjs(filters.EndDate).format('YYYY-MM-DD');
  }

  // Remove empty or null values
  return removeEmptyQueryParams(params);
};

/**
 * Remove empty or null values from query object
 * Matches legacy setEmptyToNull helper
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
 * Format date/time string using dayjs
 * Used for consistent date formatting throughout the component
 */
export const formatDateTime = (dateString: string, format: string = HUMAN_READABLE_DATE_TIME): string => {
  if (!dateString) return '-';
  return dayjs(dateString).format(format);
};

/**
 * Get status description for invoice status
 * Matches legacy getStatusDesc method
 */
export const getInvoiceStatusDescription = (status: number): string => {
  switch (status) {
    case 0:
      return 'Gönderildi';
    case 1:
      return 'Bekliyor';
    case 2:
      return 'Gönderildi';
    case 3:
      return 'Hata';
    default:
      return 'Tanımsız';
  }
};

/**
 * Get badge properties for invoice transfer status
 * Based on legacy status rendering logic
 */
export const getTransferStatusBadgeProps = (status: number) => {
  switch (status) {
    case 0: // Sent
      return {
        color: 'success' as const,
        label: getInvoiceStatusDescription(status),
      };
    case 1: // Waiting
      return {
        color: 'warning' as const,
        label: getInvoiceStatusDescription(status),
      };
    case 2: // Sent
      return {
        color: 'default' as const,
        label: getInvoiceStatusDescription(status),
      };
    case 3: // Error
      return {
        color: 'error' as const,
        label: getInvoiceStatusDescription(status),
      };
    default:
      return {
        color: 'default' as const,
        label: 'Tanımsız',
      };
  }
};

/**
 * Get badge properties for refund status
 * Based on legacy return invoice logic
 */
export const getRefundStatusBadgeProps = (returnInvoiceNumber: string | null) => {
  if (returnInvoiceNumber !== null) {
    return {
      color: 'error' as const,
      label: 'İade Edildi',
    };
  } else {
    return {
      color: 'success' as const,
      label: 'Başarılı',
    };
  }
};
