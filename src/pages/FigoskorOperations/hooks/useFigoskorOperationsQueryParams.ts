import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FigoskorCustomerFilters } from '../figoskor-operations.types';

/**
 * Hook for managing URL query parameters for Figoskor Customer Operations
 * Follows CustomerTracking pattern for URL parameter management
 */
export const useFigoskorOperationsQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current URL parameters into query params
  const queryParams = useMemo((): FigoskorCustomerFilters => {
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '20', 10);
    const sort = searchParams.get('sort') || undefined;
    const sortType = searchParams.get('sortType') as 'Asc' | 'Desc' | undefined;

    // Parse filter parameters
    const Identifier = searchParams.get('Identifier') || undefined;
    const CompanyName = searchParams.get('CompanyName') || undefined;
    const status = searchParams.get('status') || undefined;

    return {
      page,
      pageSize,
      sort,
      sortType,
      Identifier,
      CompanyName,
      status,
    };
  }, [searchParams]);

  // Update URL parameters
  const updateParams = useCallback(
    (newParams: Partial<FigoskorCustomerFilters>) => {
      const params = new URLSearchParams(searchParams);

      // Helper function to set or delete parameter
      const setOrDeleteParam = (key: string, value: string | number | undefined) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        } else if (value === undefined) {
          // Don't change existing parameter
        } else {
          params.delete(key);
        }
      };

      // Update all parameters
      setOrDeleteParam('page', newParams.page);
      setOrDeleteParam('pageSize', newParams.pageSize);
      setOrDeleteParam('sort', newParams.sort);
      setOrDeleteParam('sortType', newParams.sortType);
      setOrDeleteParam('Identifier', newParams.Identifier);
      setOrDeleteParam('CompanyName', newParams.CompanyName);
      setOrDeleteParam('status', newParams.status);

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Reset all parameters
  const resetParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    queryParams,
    updateParams,
    resetParams,
  };
};
