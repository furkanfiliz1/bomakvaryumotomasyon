import type { BankBuyerCommission, BuyerCompany, FinancerCompany } from '../bank-buyer-rates.types';

/**
 * Bank Buyer Rates Helper Functions
 * Following OperationPricing pattern exactly
 */

/**
 * Get receiver (buyer) company name from commission data
 */
export const getReceiverCompanyName = (commission: BankBuyerCommission, buyerList: BuyerCompany[]): string => {
  if (!commission.ReceiverCompanyId) return '-';
  const company = buyerList.find((c) => c.Id === commission.ReceiverCompanyId);
  return company?.CompanyName || '-';
};

/**
 * Get financer company name from commission data
 */
export const getFinancerCompanyName = (commission: BankBuyerCommission, financerList: FinancerCompany[]): string => {
  if (!commission.FinancerCompanyId) return '-';
  const company = financerList.find((c) => c.Id === commission.FinancerCompanyId);
  return company?.CompanyName || '-';
};

/**
 * Format rate value for display
 */
export const formatRateValue = (value: number | null): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Format amount value for display
 */
export const formatAmountValue = (value: number | null): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Parse string to number or null
 */
export const parseToNumber = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};
