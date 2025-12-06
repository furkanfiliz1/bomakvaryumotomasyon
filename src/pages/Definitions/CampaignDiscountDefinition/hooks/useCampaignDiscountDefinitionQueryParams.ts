/**
 * Hook for campaign discount definition query params
 * Manages URL parameters for filters and pagination
 */

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CampaignDiscountSearchParams } from '../campaign-discount-definition.types';
import { DEFAULT_CAMPAIGN_TYPE, DEFAULT_PAGE_SIZE, DEFAULT_SORT_TYPE } from '../helpers';

function useCampaignDiscountDefinitionQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current params from URL
  const params: CampaignDiscountSearchParams = useMemo(() => {
    return {
      page: parseInt(searchParams.get('page') ?? '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10),
      sortType: searchParams.get('sortType') ?? DEFAULT_SORT_TYPE,
      Month: searchParams.get('Month') ?? null,
      Year: searchParams.get('Year') ?? null,
      campaignType: parseInt(searchParams.get('campaignType') ?? String(DEFAULT_CAMPAIGN_TYPE), 10),
    };
  }, [searchParams]);

  // Update URL params
  const updateParams = useCallback(
    (newParams: Partial<CampaignDiscountSearchParams>) => {
      const updatedParams = { ...params, ...newParams };

      const urlParams = new URLSearchParams();
      urlParams.set('page', String(updatedParams.page));
      urlParams.set('pageSize', String(updatedParams.pageSize));
      urlParams.set('sortType', updatedParams.sortType);
      urlParams.set('campaignType', String(updatedParams.campaignType));

      if (updatedParams.Month) {
        urlParams.set('Month', updatedParams.Month);
      }
      if (updatedParams.Year) {
        urlParams.set('Year', updatedParams.Year);
      }

      setSearchParams(urlParams);
    },
    [params, setSearchParams],
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: newPage });
    },
    [updateParams],
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterParams: Pick<CampaignDiscountSearchParams, 'Month' | 'Year'>) => {
      updateParams({ ...filterParams, page: 1 }); // Reset page on filter change
    },
    [updateParams],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    updateParams({ Month: null, Year: null, page: 1 });
  }, [updateParams]);

  return {
    params,
    updateParams,
    handlePageChange,
    handleFilterChange,
    clearFilters,
  };
}

export default useCampaignDiscountDefinitionQueryParams;
