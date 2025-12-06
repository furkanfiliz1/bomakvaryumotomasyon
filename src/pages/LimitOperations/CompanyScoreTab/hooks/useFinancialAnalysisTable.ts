/**
 * Financial Analysis Table Configuration Hook
 * Following OperationPricing table pattern
 */

import { useMemo } from 'react';

import type { FinancialAccount, FinancialRatio } from '../company-score-tab.types';
import {
  getFinancialAccountsHeaders,
  getFinancialRatiosHeaders,
  sortAccountsByCode,
  sortRatiosByCategory,
  transformAccountsForTable,
  transformRatiosForTable,
} from '../helpers';

/**
 * Hook for financial accounts table configuration
 */
export const useFinancialAccountsTable = (accounts: FinancialAccount[] = []) => {
  const headers = useMemo(() => getFinancialAccountsHeaders(), []);

  const tableData = useMemo(() => {
    const transformed = transformAccountsForTable(accounts);
    return sortAccountsByCode(transformed);
  }, [accounts]);

  return {
    headers,
    data: tableData,
  };
};

/**
 * Hook for financial ratios table configuration
 */
export const useFinancialRatiosTable = (ratios: FinancialRatio[] = []) => {
  const headers = useMemo(() => getFinancialRatiosHeaders(), []);

  const tableData = useMemo(() => {
    const transformed = transformRatiosForTable(ratios);
    return sortRatiosByCategory(transformed);
  }, [ratios]);

  return {
    headers,
    data: tableData,
  };
};
