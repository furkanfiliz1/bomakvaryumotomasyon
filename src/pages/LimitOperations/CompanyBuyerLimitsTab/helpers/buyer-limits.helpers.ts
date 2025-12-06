/**
 * Buyer Limits Business Logic Helpers
 * Following OperationPricing helpers pattern exactly
 */

import type { BuyerLimitFormData, BuyerLimitItem, UpdateBuyerLimitRequest } from '../company-buyer-limits-tab.types';

/**
 * Transform buyer limit item to form data for editing
 * Converts numbers to strings for form inputs
 */
export const transformBuyerLimitToFormData = (item: BuyerLimitItem): BuyerLimitFormData => ({
  maxInvoiceAmount: item.MaxInvoiceAmount?.toString() || '',
  maxInvoiceDueDay: item.MaxInvoiceDueDay?.toString() || '',
  isActive: item.IsActive || false,
});

/**
 * Transform form data back to API request format
 * Converts strings back to numbers and creates update request
 */
export const transformFormDataToBuyerLimitRequest = (
  formData: BuyerLimitFormData,
  originalItem: BuyerLimitItem,
): UpdateBuyerLimitRequest => ({
  Id: originalItem.Id,
  CompanyLimitId: originalItem.CompanyLimitId,
  ReceiverIdentifier: originalItem.ReceiverIdentifier,
  MaxInvoiceAmount: parseFloat(formData.maxInvoiceAmount) || 0,
  MaxInvoiceDueDay: parseInt(formData.maxInvoiceDueDay, 10) || 0,
  IsActive: formData.isActive,
  InvoiceScore: originalItem.InvoiceScore, // Read-only but required in request
});

/**
 * Format currency amount for display (Turkish format)
 * Matches legacy NumericFormat behavior: 1.000.000,00
 */
export const formatCurrencyAmount = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parse currency string back to number
 * Handles Turkish number format: removes dots and replaces comma with dot
 */
export const parseCurrencyAmount = (value: string): number => {
  if (!value) return 0;

  // Remove currency symbols and normalize
  const normalized = value
    .replace(/[^\d,.-]/g, '') // Remove non-numeric characters except separators
    .replace(/\./g, '') // Remove thousand separators (dots)
    .replace(/,/g, '.'); // Replace decimal comma with dot

  return parseFloat(normalized) || 0;
};

/**
 * Format days with "Gün" suffix matching legacy
 */
export const formatDaysWithSuffix = (days: number): string => {
  return `${days} Gün`;
};

/**
 * Validate buyer limit form data
 */
export const validateBuyerLimitFormData = (formData: BuyerLimitFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate max invoice amount
  const amount = parseCurrencyAmount(formData.maxInvoiceAmount);
  if (amount <= 0) {
    errors.push("Maksimum fatura tutarı 0'dan büyük olmalıdır");
  }

  // Validate max invoice due days
  const days = parseInt(formData.maxInvoiceDueDay, 10);
  if (days <= 0 || !Number.isInteger(days)) {
    errors.push('Maks vade gün sayısı pozitif bir tam sayı olmalıdır');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate success message for update operation matching legacy SweetAlert2 messages
 */
export const getUpdateSuccessMessage = (): { title: string; text: string } => ({
  title: 'Başarılı',
  text: 'Güncelleme başarılı',
});

/**
 * Generate error message for update operation matching legacy SweetAlert2 messages
 */
export const getUpdateErrorMessage = (error?: string): { title: string; text: string } => ({
  title: 'Başarısız',
  text: error || 'Güncelleme sırasında bir hata oluştu',
});

/**
 * Generate success message for concentration calculation
 */
export const getConcentrationSuccessMessage = (): { title: string; text: string } => ({
  title: 'Başarılı',
  text: 'Fatura konsantrasyonu hesaplandı',
});

/**
 * Check if buyer limit item has unsaved changes
 */
export const hasUnsavedChanges = (original: BuyerLimitItem, formData: BuyerLimitFormData): boolean => {
  const originalFormData = transformBuyerLimitToFormData(original);

  return (
    originalFormData.maxInvoiceAmount !== formData.maxInvoiceAmount ||
    originalFormData.maxInvoiceDueDay !== formData.maxInvoiceDueDay ||
    originalFormData.isActive !== formData.isActive
  );
};
