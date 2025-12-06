import { useMemo } from 'react';
import type { RepresentativeTargetFilters } from '../representative-target-entry.types';

interface UseRepresentativeTargetQueryParamsProps {
  additionalFilters: Partial<RepresentativeTargetFilters>;
}

/**
 * Hook for generating query parameters for representative target API calls
 * Follows OperationPricing pattern exactly
 */
export const useRepresentativeTargetQueryParams = ({ additionalFilters }: UseRepresentativeTargetQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      ...additionalFilters,
      // Remove empty/null values
      month: additionalFilters.month || undefined,
      year: additionalFilters.year || undefined,
      userId: additionalFilters.userId || undefined,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useRepresentativeTargetQueryParams;
