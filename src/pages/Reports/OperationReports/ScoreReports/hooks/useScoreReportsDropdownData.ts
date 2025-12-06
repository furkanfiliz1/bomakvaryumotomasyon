import { useMemo } from 'react';
import type { UseScoreReportsDropdownData } from '../score-reports.types';

/**
 * Hook for fetching dropdown data for Score Reports filters
 * Based on legacy implementation pattern from OperationPricing
 * Currently no dropdown data is needed for Score Reports (only identifier filter)
 */
export const useScoreReportsDropdownData = (): UseScoreReportsDropdownData => {
  const dropdownData = useMemo(
    () => ({
      isLoading: false,
      error: null,
    }),
    [],
  );

  return dropdownData;
};
