import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FigoskorClientRequestListRequest } from '../figoskor-operations.types';

/**
 * Hook for managing URL query parameters for Figoskor Request Operations
 * Follows CustomerTracking pattern for URL parameter management
 * Note: customerId is obtained from route params, not query params
 */
export const useFigoskorRequestQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current URL parameters into query params
  const queryParams = useMemo((): FigoskorClientRequestListRequest => {
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '20', 10);
    const sort = searchParams.get('sort') || 'Id';
    const sortType = (searchParams.get('sortType') as 'Asc' | 'Desc') || 'Desc';

    // Parse filter parameters
    const StartDate = searchParams.get('StartDate') || undefined;
    const EndDate = searchParams.get('EndDate') || undefined;
    const status = searchParams.get('status') || undefined;

    return {
      page,
      pageSize,
      sort,
      sortType,
      StartDate,
      EndDate,
      status,
    };
  }, [searchParams]);

  // Update URL parameters
  const updateParams = useCallback(
    (newParams: Partial<FigoskorClientRequestListRequest>) => {
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
      setOrDeleteParam('StartDate', newParams.StartDate);
      setOrDeleteParam('EndDate', newParams.EndDate);
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
