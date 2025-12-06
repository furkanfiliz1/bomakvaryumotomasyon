import { useMemo } from 'react';
import { ManualTransactionFeeFilters } from '../manual-transaction-fee-tracking.types';

interface UseQueryParamsProps {
  additionalFilters: Partial<ManualTransactionFeeFilters>;
}

export const useQueryParams = ({ additionalFilters }: UseQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      Status: 1,
      ...additionalFilters,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};
