import { useMemo } from 'react';
import { useGetBankListQuery, useLazyGetBuyerListWithBankQuery } from '../buyer-limit-reports.api';
import type { UseBuyerLimitReportsDropdownData } from '../buyer-limit-reports.types';

export const useBuyerLimitReportsDropdownData = (): UseBuyerLimitReportsDropdownData => {
  // Get bank list - follows legacy getBankList implementation
  const { data: bankListData, isLoading: isBankListLoading, error: bankListError } = useGetBankListQuery();

  // Lazy query for buyer list - triggered manually when bank is selected
  const [loadBuyerList, { data: buyerListData = [], isLoading: isBuyerListLoading, error: buyerListError }] =
    useLazyGetBuyerListWithBankQuery();

  // Extract bank list from response
  const bankList = useMemo(() => bankListData?.Items || [], [bankListData]);

  // Manual trigger function for loading buyers (used by form)
  const loadBuyersForBank = (bankId: number) => {
    loadBuyerList(bankId);
  };

  return {
    bankList,
    buyerList: buyerListData || [],
    isBankListLoading,
    isBuyerListLoading,
    bankListError,
    buyerListError,
    loadBuyersForBank,
  };
};
