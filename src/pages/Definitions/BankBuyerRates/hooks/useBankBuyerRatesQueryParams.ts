import { useMemo } from 'react';
import type { BankBuyerRatesFilters } from '../bank-buyer-rates.types';

/**
 * Hook for generating query parameters for bank buyer rates search
 * Following OperationPricing pattern exactly
 */
interface UseBankBuyerRatesQueryParamsProps {
  additionalFilters?: Partial<BankBuyerRatesFilters>;
}

export const useBankBuyerRatesQueryParams = ({ additionalFilters = {} }: UseBankBuyerRatesQueryParamsProps = {}) => {
  const baseQueryParams = useMemo(() => {
    const params: BankBuyerRatesFilters = {};

    // Add filters if provided
    if (additionalFilters.ReceiverCompanyId) {
      params.ReceiverCompanyId = additionalFilters.ReceiverCompanyId;
    }

    if (additionalFilters.FinancerCompanyId) {
      params.FinancerCompanyId = additionalFilters.FinancerCompanyId;
    }

    return params;
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};

export default useBankBuyerRatesQueryParams;
