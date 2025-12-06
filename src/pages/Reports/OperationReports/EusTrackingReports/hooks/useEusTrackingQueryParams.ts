import { useMemo } from 'react';
import { EUS_DEFAULT_PAGE, EUS_DEFAULT_PAGE_SIZE } from '../constants';
import type { EusTrackingFilters, EusTrackingQueryParams } from '../eus-tracking-reports.types';

/**
 * Hook for generating query parameters for EUS Tracking API calls
 * Follows OperationPricing useOperationPricingQueryParams pattern
 */
interface UseEusTrackingQueryParamsProps {
  additionalFilters: Partial<EusTrackingFilters>;
}

export const useEusTrackingQueryParams = ({ additionalFilters }: UseEusTrackingQueryParamsProps) => {
  const baseQueryParams = useMemo((): EusTrackingQueryParams => {
    return {
      page: EUS_DEFAULT_PAGE,
      pageSize: EUS_DEFAULT_PAGE_SIZE,
      ...additionalFilters,
    };
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};
