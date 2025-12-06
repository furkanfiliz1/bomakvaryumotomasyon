import { useMemo } from 'react';
import { useGetBankBranchesQuery, useGetBanksQuery } from '../discount-operations.api';

/**
 * Hook for managing dropdown data for single cheque form
 * Following OperationPricing patterns for data fetching hooks
 */
export const useSingleChequeDropdownData = (selectedBankId?: number) => {
  // Get banks list
  const { data: banksData, isLoading: banksLoading, error: banksError } = useGetBanksQuery();

  // Get bank branches for selected bank
  const {
    data: branchesData,
    isLoading: branchesLoading,
    error: branchesError,
  } = useGetBankBranchesQuery(
    { BankId: selectedBankId!, pageSize: 999999 },
    { skip: !selectedBankId }, // Skip query if no bank is selected
  );

  // Transform banks data for Select component
  const banksOptions = useMemo(() => {
    if (!banksData) return [];
    return banksData.map((bank) => ({
      id: bank.Id,
      name: `${bank.Name} (${bank.Code})`, // Display name with code
      code: bank.Code,
    }));
  }, [banksData]);

  // Transform branches data for Select component
  const branchesOptions = useMemo(() => {
    if (!branchesData) return [];

    return branchesData?.Items.map((branch) => ({
      id: branch.Id,
      name: `${branch.Name} (${branch.Code})`, // Display name with code
      code: branch.Code,
    }));
  }, [branchesData]);

  return {
    // Banks data
    banksOptions,
    banksLoading,
    banksError,

    // Branches data
    branchesOptions,
    branchesLoading,
    branchesError,

    // Combined loading state
    isLoading: banksLoading || branchesLoading,

    // Has errors
    hasError: !!(banksError || branchesError),
  };
};
