import { useMemo } from 'react';
import type {
  BankDiscountReconciliationFilters,
  BankDiscountReconciliationQueryParams,
} from '../bank-discount-reconciliation.types';

interface UseBankDiscountReconciliationQueryParamsProps {
  additionalFilters: Partial<BankDiscountReconciliationFilters>;
}

/**
 * Custom hook for generating Bank Discount Reconciliation query parameters
 * Following BankInvoiceReconciliation pattern exactly
 */
export const useBankDiscountReconciliationQueryParams = ({
  additionalFilters,
}: UseBankDiscountReconciliationQueryParamsProps) => {
  const baseQueryParams = useMemo((): BankDiscountReconciliationQueryParams => {
    return {
      identifier: additionalFilters.identifier || '',
      financerCompanyIdentifier: additionalFilters.financerCompanyIdentifier || '',
      month: additionalFilters.month || 1,
      year: additionalFilters.year || new Date().getFullYear(),
      page: additionalFilters.page || 1,
      pageSize: additionalFilters.pageSize || 25,
      isExport: additionalFilters.isExport || false,
    };
  }, [additionalFilters]);

  // Skip query if required identifiers are not provided
  const shouldSkipQuery = useMemo(() => {
    return !additionalFilters.identifier || !additionalFilters.financerCompanyIdentifier;
  }, [additionalFilters.identifier, additionalFilters.financerCompanyIdentifier]);

  return {
    baseQueryParams,
    shouldSkipQuery,
  };
};
