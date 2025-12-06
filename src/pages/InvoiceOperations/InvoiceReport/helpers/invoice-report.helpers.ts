import dayjs from 'dayjs';
import type { InvoiceItem } from '../invoice-report.types';

/**
 * Business logic helpers for InvoiceReport
 * Following OperationPricing helpers pattern exactly
 */

// Format date strings for display
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return dayjs(dateString).format('DD.MM.YYYY');
};

// Format date with time for display
export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  return dayjs(dateString).format('DD.MM.YYYY HH:mm');
};

// Format currency amount
export const formatCurrency = (amount: number | null, currency = 'TRY'): string => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get status display name and color
export const getInvoiceStatusDisplay = (status: number) => {
  switch (status) {
    case 0:
      return { text: 'Pasif', color: 'error' as const };
    case 1:
      return { text: 'Aktif', color: 'success' as const };
    default:
      return { text: 'Bilinmiyor', color: 'default' as const };
  }
};

// Get invoice type display name
export const getInvoiceTypeDisplay = (type: number) => {
  switch (type) {
    case 1:
      return 'E-Fatura';
    case 2:
      return 'Kağıt Fatura';
    default:
      return 'Bilinmiyor';
  }
};

// Get profile type display name
export const getProfileTypeDisplay = (profileId: string | null) => {
  if (!profileId) return '-';

  switch (profileId) {
    case 'TICARIFATURA':
      return 'Ticari E-Fatura';
    case 'TEMELFATURA':
      return 'Temel E-Fatura';
    case 'EARSIVFATURA':
      return 'E-Arşiv Fatura';
    case 'EMUSTAHSIL':
      return 'E-Müstahsil';
    default:
      return profileId;
  }
};

// Get usage status display
export const getUsageStatusDisplay = (remainingAmount: number, payableAmount: number) => {
  if (remainingAmount === payableAmount) {
    return { text: 'Uygun', color: 'success' as const };
  } else if (remainingAmount === 0) {
    return { text: 'Kullanılmış', color: 'error' as const };
  } else {
    return { text: 'Kısmi Kullanılmış', color: 'warning' as const };
  }
};

// Check if invoice can be deleted
export const canDeleteInvoice = (invoice: InvoiceItem, userDeleteAuth: boolean): boolean => {
  return userDeleteAuth && invoice.Status === 1 && !invoice.IsDeleted;
};

// Safe string display - show dash for null/empty values
export const safeDisplay = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return value;
};

// Safe number display - show dash for null/empty values
export const safeNumberDisplay = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  return value.toString();
};
