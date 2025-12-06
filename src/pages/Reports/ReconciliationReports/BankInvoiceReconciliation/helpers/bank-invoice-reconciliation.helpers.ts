import dayjs from 'dayjs';
import type { BankInvoiceReconciliationItem } from '../bank-invoice-reconciliation.types';

/**
 * Business logic helpers for Bank Invoice Reconciliation
 * Following OperationPricing pattern for utility functions
 */

/**
 * Format currency amount for display
 * @param amount - Amount to format
 * @param currency - Currency code (default: TRY)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date for display
 * @param date - Date string to format
 * @param formatString - Date format (default: DD.MM.YYYY)
 * @returns Formatted date string
 */
export const formatDate = (date: string, formatString = 'DD.MM.YYYY'): string => {
  return dayjs(date).format(formatString);
};

/**
 * Format commission amount with 2 decimal places
 * @param amount - Commission amount to format
 * @returns Formatted commission string
 */
export const formatCommission = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Generate Excel export filename matching legacy pattern
 * @param receiverIdentifier - Receiver identifier
 * @param financerIdentifier - Financer identifier
 * @param month - Month number
 * @param year - Year number
 * @param language - Language code (default: 'tr')
 * @returns Generated filename
 */
export const generateExportFilename = (
  receiverIdentifier: string,
  financerIdentifier: string,
  month: number,
  year: number,
  language = 'tr',
): string => {
  const fileInitial = language === 'tr' ? 'banka_alici_bazli_fatura_raporlari' : 'bank_buyer_based_invoice_reports';
  const fileDate = dayjs().format('YYYY-MM-DD');

  return `${receiverIdentifier}-${financerIdentifier}-${month}-${year}_${fileInitial}_${fileDate}.xls`;
};

/**
 * Validate if a report item has required data
 * @param item - Report item to validate
 * @returns true if valid, false otherwise
 */
export const isValidReportItem = (item: BankInvoiceReconciliationItem): boolean => {
  return !!(
    item.SenderCode &&
    item.AllowanceId &&
    item.InvoiceNumber &&
    item.InvoicePayableAmount !== null &&
    item.PaymentDate &&
    item.ApprovedPaymentDueDate &&
    item.AllowanceDueDate &&
    item.DueDayCount !== null &&
    item.CommissionAmount !== null
  );
};

/**
 * Get month name in Turkish
 * @param month - Month number (1-12)
 * @returns Turkish month name
 */
export const getMonthNameTurkish = (month: number): string => {
  const months = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];
  return months[month - 1] || '';
};

/**
 * Parse and validate VKN/TCKN identifier
 * @param identifier - Identifier string to validate
 * @returns Cleaned identifier or empty string if invalid
 */
export const parseIdentifier = (identifier: string): string => {
  if (!identifier) return '';

  // Remove non-numeric characters
  const cleaned = identifier.replace(/\D/g, '');

  // Basic length validation (VKN: 10 digits, TCKN: 11 digits)
  if (cleaned.length === 10 || cleaned.length === 11) {
    return cleaned;
  }

  return cleaned;
};

/**
 * Check if export data is valid
 * @param extensionData - Extension data from API response
 * @returns true if valid export data exists
 */
export const isValidExportData = (extensionData: string | null): boolean => {
  return !!(extensionData && extensionData.length > 0);
};
