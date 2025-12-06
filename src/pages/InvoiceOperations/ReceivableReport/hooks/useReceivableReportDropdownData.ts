import { useGetBuyerListForReceivableReportQuery } from '../receivable-report.api';

/**
 * Hook for fetching dropdown data needed for receivable report filters
 * Fetches buyer list from the companies/activityType/1 endpoint
 */
export const useReceivableReportDropdownData = (): {
  buyerList: Array<{ Identifier: string; CompanyName: string }>;
  currencyList: Array<{ Id: number; Code: string }>;
  isLoading: boolean;
} => {
  const { data: buyerListData, isLoading: isBuyerListLoading } = useGetBuyerListForReceivableReportQuery();

  return {
    buyerList: buyerListData || [],
    currencyList: [
      { Id: 1, Code: 'TRY' },
      { Id: 2, Code: 'USD' },
      { Id: 3, Code: 'EUR' },
    ],
    isLoading: isBuyerListLoading,
  };
};

export default useReceivableReportDropdownData;
