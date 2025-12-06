import { useErrorListener } from '@hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { useLazyGetCompanyActivityLogQuery } from '../company-history-tab.api';
import type { ActivityLogFilters, ActivityLogQueryParams } from '../company-history-tab.types';

interface UseActivityLogQueryProps {
  companyId: number;
  additionalFilters: Partial<ActivityLogFilters>;
}

/**
 * Custom hook that provides activity log data with pagination support
 * This creates a compatible interface for our specific activity log API
 */
export const useActivityLogQuery = ({ companyId, additionalFilters }: UseActivityLogQueryProps) => {
  // Build query parameters
  const queryParams = useMemo(
    () => ({
      page: 1,
      pageSize: 25,
      sort: 'InsertDateTime',
      sortType: 'Desc' as const,
      onboardingStatusType: '',
      userId: '',
      ActivityType: '',
      ...additionalFilters,
    }),
    [additionalFilters],
  );

  // Use direct query
  const [trigger, result] = useLazyGetCompanyActivityLogQuery();

  // Error handling for activity log query
  useErrorListener(result.error);

  // Manually trigger the query with our parameters
  const fetch = useCallback(
    (params: ActivityLogQueryParams = queryParams) => {
      return trigger({ companyId, params });
    },
    [trigger, companyId, queryParams],
  );

  // Trigger initial load when companyId changes
  useEffect(() => {
    if (companyId) {
      fetch(queryParams);
    }
  }, [companyId, fetch, queryParams]);

  // Create pagination config manually
  const pagingConfig = useMemo(() => {
    const totalCount = result.data?.TotalCount || 0;
    const pageSize = queryParams.pageSize || 25;
    const currentPage = queryParams.page || 1;

    return {
      page: currentPage - 1, // Table component expects 0-based indexing
      rowsPerPage: pageSize,
      totalCount,
      onPageChange: (newPage: number) => {
        fetch({ ...queryParams, page: newPage + 1 }); // Convert back to 1-based
      },
      onPageSizeChange: (newPageSize: number) => {
        fetch({ ...queryParams, pageSize: newPageSize, page: 1 });
      },
    };
  }, [result.data?.TotalCount, queryParams, fetch]);

  // Create sorting config manually
  const sortingConfig = useMemo(() => {
    const order: 'asc' | 'desc' = queryParams.sortType?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    return {
      order,
      orderBy: queryParams.sort || 'InsertDateTime',
      onSort: (field: string, sortOrder: 'asc' | 'desc') => {
        fetch({
          ...queryParams,
          sort: field,
          sortType: sortOrder === 'asc' ? 'Asc' : 'Desc',
          page: 1, // Reset to first page when sorting
        });
      },
    };
  }, [queryParams, fetch]);

  return {
    data: result.data,
    error: result.error,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    pagingConfig,
    sortingConfig,
    refetch: () => fetch(queryParams),
    fetch,
  };
};
