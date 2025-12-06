import { useMemo } from 'react';
import type { ScoreReportsFilters } from '../score-reports.types';

interface UseScoreReportsQueryParamsProps {
  additionalFilters: Partial<ScoreReportsFilters>;
}

/**
 * Hook for managing Score Reports query parameters
 * Following OperationPricing and SupplierReports pattern
 * Exact match with legacy ScoreInvoiceTransferReport parameters
 */
export const useScoreReportsQueryParams = ({ additionalFilters }: UseScoreReportsQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      // Legacy default parameters from ScoreInvoiceTransferReport
      type: 1, // Fixed value from legacy
      page: 1,
      pageSize: 50, // Legacy page size
      // Apply additional filters from form
      identifier: additionalFilters.identifier ?? undefined,
      ...additionalFilters,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};
