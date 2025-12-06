/**
 * Company E-Invoices Tab Helpers
 * Following OperationPricing pattern for business logic functions
 * Contains pure functions for data transformation and formatting
 */

import type { CurrencyInvoices, EInvoicesTableColumn, InvoiceAmount } from '../company-einvoices-tab.types';

/**
 * Format invoice month display as YYYY-MM
 * Matches legacy template format: {inv.year}-{inv.month}
 */
export const formatInvoiceDate = (invoice: InvoiceAmount): string => {
  const monthStr = invoice.month.toString().padStart(2, '0');
  return `${invoice.year}-${monthStr}`;
};

/**
 * Check if currency invoices data has any records
 */
export const hasInvoiceData = (currencies: CurrencyInvoices[]): boolean => {
  return currencies.length > 0 && currencies.some((currency) => currency.amounts.length > 0);
};

/**
 * Get total record count across all currencies
 */
export const getTotalRecordCount = (currencies: CurrencyInvoices[]): number => {
  return currencies.reduce((total, currency) => total + currency.amounts.length, 0);
};

/**
 * Format currency amount with proper locale formatting
 * Matches legacy FormattedNumber behavior
 */
export const formatCurrencyAmount = (amount: number, currency: string, locale: string = 'tr-TR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with locale formatting
 */
export const formatNumber = (value: number, locale: string = 'tr-TR'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Get display value for table cell based on column type
 */
export const getTableCellValue = (invoice: InvoiceAmount, column: EInvoicesTableColumn, currency?: string): string => {
  if (column.key === 'dateDisplay') {
    return formatInvoiceDate(invoice);
  }

  const value = invoice[column.key as keyof InvoiceAmount];

  if (value === null || value === undefined) {
    return '-';
  }

  switch (column.format) {
    case 'currency':
      return currency ? formatCurrencyAmount(value, currency) : formatNumber(value);
    case 'number':
      return formatNumber(value);
    default:
      return value.toString();
  }
};

/**
 * Check if a value should be displayed as dash (empty state)
 */
export const shouldDisplayDash = (value: number | null | undefined): boolean => {
  return value === null || value === undefined || value === 0;
};
