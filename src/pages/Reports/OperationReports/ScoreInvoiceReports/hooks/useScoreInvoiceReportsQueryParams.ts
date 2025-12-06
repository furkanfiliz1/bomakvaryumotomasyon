import { useMemo } from 'react';
import type { ScoreInvoiceReportsFilters } from '../score-invoice-reports.types';

interface UseScoreInvoiceReportsQueryParamsProps {
  additionalFilters: Partial<ScoreInvoiceReportsFilters>;
}

export const useScoreInvoiceReportsQueryParams = ({ additionalFilters }: UseScoreInvoiceReportsQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      startDate: additionalFilters.startDate || new Date().toISOString().split('T')[0],
      endDate: additionalFilters.endDate || new Date().toISOString().split('T')[0],
      companyIdentifier: additionalFilters.companyIdentifier || undefined,
      integratorIdentifier: additionalFilters.integratorIdentifier || undefined,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};
