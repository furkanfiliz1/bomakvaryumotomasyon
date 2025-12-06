/**
 * Company Score Tab Business Logic Helpers
 * Following OperationPricing pattern for business logic utilities
 */

import type { AnalysisSummary, FinancialAccount, LoanDecisionType } from '../company-score-tab.types';

/**
 * Get loan decision type description by value
 */
export const getLoanDecisionDescription = (loanDecisionType: number, loanDecisionTypes: LoanDecisionType[]): string => {
  const type = loanDecisionTypes.find((type) => parseInt(type.Value) === loanDecisionType);
  return type?.Description || '-';
};

/**
 * Format score value with proper decimal places
 */
export const formatScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return '-';
  return score.toFixed(5);
};

/**
 * Format financial amount with currency
 */
export const formatFinancialAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage value
 */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(2)}%`;
};

/**
 * Get account level based on code structure
 */
export const getAccountLevel = (code: string): number => {
  if (!code) return 0;
  return code.length;
};

/**
 * Check if account is a main account (top level)
 */
export const isMainAccount = (account: FinancialAccount): boolean => {
  return !account.TopAccountCode && account.Code.length === 1;
};

/**
 * Check if account is a sub-account
 */
export const isSubAccount = (account: FinancialAccount, parentCode: string): boolean => {
  return account.TopAccountCode === parentCode;
};

/**
 * Get account indentation level for display
 */
export const getAccountIndentation = (account: FinancialAccount): number => {
  if (isMainAccount(account)) return 0;
  if (account.Code.length === 2) return 1;
  if (account.Code.length === 3) return 2;
  return 3; // Maximum indentation
};

/**
 * Sort accounts by code for hierarchical display
 */
export const sortAccountsByCode = (accounts: FinancialAccount[]): FinancialAccount[] => {
  return [...accounts].sort((a, b) => a.Code.localeCompare(b.Code));
};

/**
 * Group accounts by ActivePassive type
 */
export const groupAccountsByType = (accounts: FinancialAccount[]) => {
  return {
    assets: accounts.filter((acc) => acc.ActivePassive === 'A'), // Aktif
    liabilities: accounts.filter((acc) => acc.ActivePassive === 'P'), // Pasif
    income: accounts.filter((acc) => acc.ActivePassive === 'G'), // Gelir
    expenses: accounts.filter((acc) => acc.ActivePassive === 'M'), // Maliyet
  };
};

/**
 * Get ratio color based on point value
 */
export const getRatioPointColor = (point: number | null): 'success' | 'warning' | 'error' | 'default' => {
  if (point === null) return 'default';
  if (point >= 80) return 'success';
  if (point >= 60) return 'warning';
  if (point >= 40) return 'warning';
  return 'error';
};

/**
 * Format ratio value for display
 */
export const formatRatioValue = (ratio: number | null | undefined): string => {
  if (ratio === null || ratio === undefined) return '-';
  return ratio.toFixed(4);
};

/**
 * Get sector difference color and icon
 */
export const getSectorComparisonColor = (
  sectorDiffRate: number,
): { color: 'success' | 'error' | 'default'; symbol: string } => {
  if (sectorDiffRate > 0) {
    return { color: 'success', symbol: '↑' };
  } else if (sectorDiffRate < 0) {
    return { color: 'error', symbol: '↓' };
  }
  return { color: 'default', symbol: '=' };
};

/**
 * Calculate total analysis points
 */
export const calculateTotalPoints = (analysis: AnalysisSummary): number => {
  return analysis?.Items?.reduce((total, item) => total + item.Point, 0) || 0;
};

/**
 * Get analysis grade based on total points
 */
export const getAnalysisGrade = (totalPoints: number): { grade: string; color: string } => {
  if (totalPoints >= 80) return { grade: 'A', color: '#4caf50' };
  if (totalPoints >= 70) return { grade: 'B+', color: '#8bc34a' };
  if (totalPoints >= 60) return { grade: 'B', color: '#ffeb3b' };
  if (totalPoints >= 50) return { grade: 'C+', color: '#ff9800' };
  if (totalPoints >= 40) return { grade: 'C', color: '#ff5722' };
  return { grade: 'F', color: '#f44336' };
};

/**
 * Check if financial date is recent (within last 2 years)
 */
export const isFinancialDateRecent = (financialDate: string | null): boolean => {
  if (!financialDate) return false;

  const date = new Date(financialDate);
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

  return date >= twoYearsAgo;
};
