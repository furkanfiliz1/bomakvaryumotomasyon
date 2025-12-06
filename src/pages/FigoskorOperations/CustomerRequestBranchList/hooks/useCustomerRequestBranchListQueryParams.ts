import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  CustomerRequestBranchListFilters,
  UseCustomerRequestBranchListQueryParamsReturn,
} from '../customer-request-branch-list.types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SORT, DEFAULT_SORT_TYPE } from '../helpers';

/**
 * Hook for managing URL query parameters for customer request branch list
 * Following OperationPricing URL parameter pattern
 */
export const useCustomerRequestBranchListQueryParams = (): UseCustomerRequestBranchListQueryParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse query parameters from URL with defaults
  const queryParams = useMemo((): CustomerRequestBranchListFilters => {
    return {
      TargetCompanyIdentifier: searchParams.get('TargetCompanyIdentifier') || '',
      TargetCompanyTitle: searchParams.get('TargetCompanyTitle') || '',
      status: searchParams.get('status') || '',
      page: Number(searchParams.get('page')) || DEFAULT_PAGE,
      pageSize: Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE,
      sort: searchParams.get('sort') || DEFAULT_SORT,
      sortType: (searchParams.get('sortType') as 'Asc' | 'Desc') || DEFAULT_SORT_TYPE,
    };
  }, [searchParams]);

  // Update specific parameters
  const updateParams = useCallback(
    (newParams: Partial<CustomerRequestBranchListFilters>) => {
      const currentParams = Object.fromEntries(searchParams.entries());

      // Convert new params to string values for URL
      const stringParams: Record<string, string> = {};
      for (const [key, value] of Object.entries(newParams)) {
        if (value !== '' && value !== null && value !== undefined) {
          stringParams[key] = String(value);
        }
      }

      // Merge with current params
      const updatedParams = { ...currentParams, ...stringParams };

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams],
  );

  // Reset to default parameters
  const resetParams = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    queryParams,
    updateParams,
    resetParams,
  };
};
