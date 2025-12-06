import dayjs from 'dayjs';
import type { CompensationTransactionType, FinancerCompany } from '../compensation-transactions.types';

/**
 * Transform transaction types for form dropdown
 */
export function transformTransactionTypes(
  transactionTypes: CompensationTransactionType[],
): { value: string; label: string }[] {
  return transactionTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));
}

/**
 * Transform financer companies for form dropdown
 */
export function transformFinancerCompanies(financerCompanies: FinancerCompany[]): { value: number; label: string }[] {
  return financerCompanies.map((company) => ({
    value: company.Id,
    label: company.CompanyName,
  }));
}

/**
 * Generate Excel file name for compensation transactions export
 * Following the pattern from legacy CompensationTransactions.js
 */
export function generateExcelFileName(): string {
  const fileInitial =
    localStorage.getItem('language') === 'tr' ? 'kanuni_takip_muhasebe_islemleri' : 'compensation_transactions';
  const fileDate = dayjs().format('YYYY-MM-DD');
  return `${fileInitial}_${fileDate}.xls`;
}

/**
 * Format date for display
 */
export function formatTransactionDate(dateString: string): string {
  return dayjs(dateString).format('DD.MM.YYYY HH:mm');
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get display value for empty/null fields
 */
export function getDisplayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}
