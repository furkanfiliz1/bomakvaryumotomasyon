/**
 * Financial Analysis Table Configuration Helpers
 * Following OperationPricing table helpers pattern
 */

import type { HeadCell } from 'src/components/common/Table/types';

import type { FinancialAccount, FinancialRatio } from '../company-score-tab.types';

// Type aliases for better maintainability
type ActivePassiveType = 'A' | 'P' | 'G' | 'M';
type AccountTypeColor = 'primary' | 'secondary' | 'success' | 'warning';

/**
 * Get financial accounts table headers
 */
export const getFinancialAccountsHeaders = (): HeadCell[] => [
  { id: 'Code', label: 'Hesap Kodu', width: 120 },
  { id: 'AccountName', label: 'Hesap Adı', width: 300 },
  { id: 'Amount', label: 'Tutar', width: 150, type: 'currency' },
  { id: 'ActivePassive', label: 'Tür', width: 80, slot: true },
];

/**
 * Get financial ratios table headers
 */
export const getFinancialRatiosHeaders = (): HeadCell[] => [
  { id: 'Name', label: 'Oran Adı', width: 200 },
  { id: 'Ratio', label: 'Değer', width: 120, slot: true },
  { id: 'Point', label: 'Puan', width: 80, slot: true },
  { id: 'Weight', label: 'Ağırlık', width: 80, type: 'number' },
  { id: 'TypeName', label: 'Kategori', width: 150 },
  { id: 'SectorAverage', label: 'Sektör Ort.', width: 120, slot: true },
  { id: 'SectorDiffRate', label: 'Sektör Farkı', width: 120, slot: true },
];

/**
 * Transform financial accounts for table display
 */
export const transformAccountsForTable = (accounts: FinancialAccount[]): FinancialAccount[] => {
  return accounts.map((account) => ({
    ...account,
    // Ensure amount is number for proper sorting
    Amount: Number(account.Amount) || 0,
  }));
};

/**
 * Transform financial ratios for table display
 */
export const transformRatiosForTable = (ratios: FinancialRatio[]): FinancialRatio[] => {
  return ratios
    .filter((ratio) => ratio.Weight > 0) // Only show ratios with weight > 0
    .map((ratio) => ({
      ...ratio,
      // Ensure numeric values are properly formatted
      Ratio: Number(ratio.Ratio) || 0,
      Point: ratio.Point !== null ? Number(ratio.Point) : null,
      Weight: Number(ratio.Weight) || 0,
      SectorAverage: Number(ratio.SectorAverage) || 0,
      SectorDiffRate: Number(ratio.SectorDiffRate) || 0,
    }));
};

/**
 * Filter accounts by type for categorized display
 */
export const filterAccountsByType = (accounts: FinancialAccount[], type: ActivePassiveType): FinancialAccount[] => {
  return accounts.filter((account) => account.ActivePassive === type);
};

/**
 * Get account type display name
 */
export const getAccountTypeDisplayName = (type: ActivePassiveType): string => {
  const typeNames = {
    A: 'Aktif',
    P: 'Pasif',
    G: 'Gelir',
    M: 'Maliyet',
  };
  return typeNames[type] || type;
};

/**
 * Get account type color
 */
export const getAccountTypeColor = (type: ActivePassiveType): AccountTypeColor => {
  const typeColors = {
    A: 'primary' as const,
    P: 'secondary' as const,
    G: 'success' as const,
    M: 'warning' as const,
  };
  return typeColors[type] || 'primary';
};

/**
 * Calculate account hierarchy level for indentation
 */
export const calculateAccountHierarchyLevel = (account: FinancialAccount): number => {
  if (!account.TopAccountCode) return 0; // Main account
  if (account.Code.length <= 2) return 1; // Second level
  if (account.Code.length <= 3) return 2; // Third level
  return 3; // Fourth level and beyond
};

/**
 * Sort ratios by category and weight
 */
export const sortRatiosByCategory = (ratios: FinancialRatio[]): FinancialRatio[] => {
  return [...ratios].sort((a, b) => {
    // First sort by category
    if (a.TypeName !== b.TypeName) {
      return a.TypeName.localeCompare(b.TypeName, 'tr');
    }
    // Then sort by weight (descending)
    return b.Weight - a.Weight;
  });
};
