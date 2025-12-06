import { useMemo } from 'react';
import { BuyerReconciliationFilters } from '../buyer-reconciliation.types';

interface UseBuyerReconciliationQueryParamsProps {
  additionalFilters: Partial<BuyerReconciliationFilters>;
}

export const useBuyerReconciliationQueryParams = ({ additionalFilters }: UseBuyerReconciliationQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      // VKN identifier - kept as string for legacy compatibility
      identifier: additionalFilters.identifier || '',

      // Month/Year selectors with defaults matching BankInvoiceReconciliation pattern
      month: additionalFilters.month || 1,
      year: additionalFilters.year || new Date().getFullYear(),
    }),
    [additionalFilters],
  );

  // Determine if the query should be skipped (no identifier provided)
  const shouldSkipQuery = useMemo(() => {
    return !additionalFilters.identifier || additionalFilters.identifier.trim() === '';
  }, [additionalFilters.identifier]);

  return {
    baseQueryParams,
    shouldSkipQuery,
  };
};

export default useBuyerReconciliationQueryParams;
