import { useMemo } from 'react';
import type { ActivityLogFilters, ActivityLogQueryParams } from '../company-history-tab.types';
import { getDefaultActivityLogParams } from '../helpers';

interface UseActivityLogQueryParamsProps {
  additionalFilters: Partial<ActivityLogFilters>;
}

/**
 * Hook to generate query parameters for activity log API
 * Matches legacy parameter building exactly
 */
export const useActivityLogQueryParams = ({ additionalFilters }: UseActivityLogQueryParamsProps) => {
  const baseQueryParams = useMemo(() => {
    const defaultParams = getDefaultActivityLogParams();

    return {
      ...defaultParams,
      ...additionalFilters,
    } as ActivityLogQueryParams;
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};
