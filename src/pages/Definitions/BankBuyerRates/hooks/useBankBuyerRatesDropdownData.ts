import { useEffect } from 'react';
import {
  useGetBankBuyerRateBuyerCompaniesQuery,
  useLazyGetBankBuyerRateFinancerCompaniesQuery,
} from '../bank-buyer-rates.api';
import type { BuyerCompany, FinancerCompany } from '../bank-buyer-rates.types';

/**
 * Hook for fetching dropdown data needed for bank buyer rates filters and forms
 * Following OperationPricing pattern exactly
 */
export const useBankBuyerRatesDropdownData = (): {
  buyerList: BuyerCompany[];
  financerList: FinancerCompany[];
  isBuyersLoading: boolean;
  isFinancersLoading: boolean;
  refetchFinancers: () => void;
} => {
  // Fetch buyer companies data
  const { data: buyersData, isLoading: isBuyersLoading } = useGetBankBuyerRateBuyerCompaniesQuery();

  // Lazy query for financer companies (will be triggered on mount)
  const [triggerFinancers, { data: financersData, isLoading: isFinancersLoading }] =
    useLazyGetBankBuyerRateFinancerCompaniesQuery();

  // Transform buyers data
  const buyerList = buyersData || [];

  // Transform financers data
  const financerList = financersData?.Items || [];

  // Fetch financers on mount
  useEffect(() => {
    triggerFinancers({
      sort: 'CompanyName',
      sortType: 'Asc',
      type: 2,
      page: 1,
      pageSize: 100,
    });
  }, [triggerFinancers]);

  return {
    buyerList,
    financerList,
    isBuyersLoading,
    isFinancersLoading,
    refetchFinancers: () => {
      triggerFinancers({
        sort: 'CompanyName',
        sortType: 'Asc',
        type: 2,
        page: 1,
        pageSize: 100,
      });
    },
  };
};

export default useBankBuyerRatesDropdownData;
