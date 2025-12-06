import { useMemo } from 'react';
import type { GuaranteeProtocolFilterFormValues } from '../guarantee-protocol.types';

/**
 * Hook for generating query parameters from form data
 * Following OperationPricing pattern exactly
 */

interface UseGuaranteeProtocolQueryParamsProps {
  additionalFilters: Partial<GuaranteeProtocolFilterFormValues>;
}

export const useGuaranteeProtocolQueryParams = ({ additionalFilters }: UseGuaranteeProtocolQueryParamsProps) => {
  const baseQueryParams = useMemo(() => {
    // Format dates to API expected format (YYYY-MM-DD)
    const formatDateForApi = (date: Date | undefined): string => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };

    return {
      FinancerIdentifier: additionalFilters.FinancerIdentifier || undefined,
      SenderIdentifier: additionalFilters.SenderIdentifier || undefined,
      StartDate: formatDateForApi(additionalFilters.StartDate),
      EndDate: formatDateForApi(additionalFilters.EndDate),
    };
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};
