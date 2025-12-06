import { useMemo } from 'react';
import { transformFiltersToQueryParams, getDefaultPagination, getDefaultSorting } from '../helpers';
import type { CheckReportFilters, CheckReportQueryParams } from '../check-report.types';

interface UseCheckReportQueryParamsProps {
  additionalFilters: Partial<CheckReportFilters>;
}

/**
 * Hook to generate query parameters for check report API
 * Follows OperationPricing pattern for query parameter generation
 */
export const useCheckReportQueryParams = ({ additionalFilters }: UseCheckReportQueryParamsProps) => {
  const baseQueryParams = useMemo((): CheckReportQueryParams => {
    const defaultPagination = getDefaultPagination();
    const defaultSorting = getDefaultSorting();

    const filters: CheckReportFilters = {
      ...defaultPagination,
      ...defaultSorting,
      ...additionalFilters,
    };

    return transformFiltersToQueryParams(filters);
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};
