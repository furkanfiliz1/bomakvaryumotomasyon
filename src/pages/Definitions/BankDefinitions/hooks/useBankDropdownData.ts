import { useGetBankDefinitionsListQuery } from '../bank-definitions.api';
import type { Bank } from '../bank-definitions.types';

/**
 * Hook for fetching dropdown data needed for bank branch filters and forms
 * Follows RepresentativeTarget pattern exactly
 */
export const useBankDropdownData = (): {
  bankList: Bank[];
  isLoading: boolean;
} => {
  // Fetch banks data
  const { data: banksData, isLoading: isBanksLoading } = useGetBankDefinitionsListQuery();

  // Transform banks data
  const bankList = banksData || [];

  return {
    bankList,
    isLoading: isBanksLoading,
  };
};

export default useBankDropdownData;
