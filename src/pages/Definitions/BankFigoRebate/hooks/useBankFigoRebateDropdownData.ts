/**
 * Hook for fetching dropdown data needed for bank figo rebate form
 * Following OperationPricing pattern exactly
 */

import { useGetBankFigoRebateFinancerCompaniesQuery } from '../bank-figo-rebate.api';
import type { FinancerCompanyOption } from '../bank-figo-rebate.types';

interface UseBankFigoRebateDropdownDataReturn {
  financerCompanyList: FinancerCompanyOption[];
  isLoading: boolean;
}

export const useBankFigoRebateDropdownData = (): UseBankFigoRebateDropdownDataReturn => {
  const { data: financerCompaniesData, isLoading } = useGetBankFigoRebateFinancerCompaniesQuery();

  const financerCompanyList = financerCompaniesData || [];

  return {
    financerCompanyList,
    isLoading,
  };
};

export default useBankFigoRebateDropdownData;
