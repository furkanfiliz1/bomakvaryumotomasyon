import { useMemo } from 'react';
import type { BankBranchFilters } from '../bank-definitions.types';

interface UseBankBranchQueryParamsProps {
  additionalFilters: Partial<BankBranchFilters>;
}

/**
 * Hook for generating query parameters for bank branch API calls
 * Follows RepresentativeTarget pattern exactly
 */
export const useBankBranchQueryParams = ({ additionalFilters }: UseBankBranchQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      ...additionalFilters,
      // Remove empty/null values
      bankId: additionalFilters.bankId || undefined,
      branchCode: additionalFilters.branchCode || undefined,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useBankBranchQueryParams;
