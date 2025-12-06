import { useMemo } from 'react';
import { CompensationTransactionFilters, CompensationTransactionQueryParams } from '../compensation-transactions.types';

interface UseCompensationTransactionsQueryParamsProps {
  additionalFilters?: Partial<CompensationTransactionFilters>;
}

/**
 * Hook for generating query parameters for compensation transactions API
 * Following the OperationPricing pattern
 */
export function useCompensationTransactionsQueryParams({
  additionalFilters = {},
}: UseCompensationTransactionsQueryParamsProps) {
  const baseQueryParams = useMemo((): CompensationTransactionQueryParams => {
    return {
      page: 1,
      pageSize: 50,
      sort: 'Id',
      sortType: 'Dsc',
      startTransactionDate: additionalFilters.startTransactionDate || '',
      endTransactionDate: additionalFilters.endTransactionDate || '',
      ...additionalFilters,
    };
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
}
