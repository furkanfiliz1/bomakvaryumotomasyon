/**
 * Buyer Limits Data Fetching Hook
 * Following OperationPricing useOperationPricingDropdownData pattern exactly
 */

import { useServerSideQuery } from '@hooks';
import { useMemo } from 'react';
import { useLazyGetCompanyBuyerLimitsQuery } from '../company-buyer-limits-tab.api';
import type { BuyerLimitsQueryParams } from '../company-buyer-limits-tab.types';
import { DEFAULT_PAGE_SIZE } from '../helpers';

// Stable empty object to prevent infinite re-renders
const EMPTY_ADDITIONAL_FILTERS: Partial<BuyerLimitsQueryParams> = {};

interface UseBuyerLimitsDataProps {
  /** Company ID to fetch buyer limits for */
  companyId: number;

  /** Additional filters to apply */
  additionalFilters?: Partial<BuyerLimitsQueryParams>;
}

/**
 * Hook for fetching buyer limits data with server-side pagination
 * Matches legacy getCompanyLimitBuyers functionality exactly
 */
export const useBuyerLimitsData = ({
  companyId,
  additionalFilters = EMPTY_ADDITIONAL_FILTERS,
}: UseBuyerLimitsDataProps) => {
  // Generate query parameters
  const baseQueryParams = useMemo(
    () => ({
      companyId,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...additionalFilters,
    }),
    [companyId, additionalFilters],
  );

  // Use server-side query hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetCompanyBuyerLimitsQuery,
    baseQueryParams,
  );

  // Extract table data from server response
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  return {
    // Data
    data: tableData,
    totalCount,

    // States
    isLoading,
    isFetching,
    error,

    // Pagination & sorting
    pagingConfig,
    sortingConfig,

    // Actions
    refetch,
    handleExport,
  };
};
