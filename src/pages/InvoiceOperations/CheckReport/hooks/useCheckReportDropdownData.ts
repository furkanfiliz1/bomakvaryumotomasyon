import { useCallback, useMemo, useState } from 'react';
import {
  useGetBankBranchessQuery,
  useGetBanksQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
} from '../check-report.api';
import type { BankOption, BranchOption, CompanySearchResult } from '../check-report.types';

/**
 * Hook to fetch dropdown data for check report filters
 * Follows OperationPricing pattern for dropdown data management
 * Supports dynamic branch loading and async company search
 */
export const useCheckReportDropdownData = () => {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [companySearchResults, setCompanySearchResults] = useState<CompanySearchResult[]>([]);

  // Fetch banks list
  const { data: banksData, isLoading: banksLoading } = useGetBanksQuery();

  // Fetch branches for selected bank
  const { data: branchesData, isLoading: branchesLoading } = useGetBankBranchessQuery(selectedBankId!, {
    skip: !selectedBankId,
  });

  // Lazy query for company search
  const [searchCompanies, { isLoading: isCompanySearchLoading }] = useLazySearchCompaniesByNameOrIdentifierQuery();

  // Transform banks data to options format
  const bankList = useMemo(() => {
    if (!banksData) return [];
    return banksData.map((bank: BankOption) => ({
      value: bank.Id,
      label: bank.Name,
    }));
  }, [banksData]);

  // Transform branches data to options format
  const branchList = useMemo(() => {
    if (!branchesData || !branchesData.Items) return [];
    return branchesData.Items.map((branch: BranchOption) => ({
      value: branch.Id,
      label: branch.Name,
    }));
  }, [branchesData]);

  // Handle bank selection change to load branches
  const handleBankChange = useCallback((bankId: string | null) => {
    setSelectedBankId(bankId);
  }, []);

  // Handle company search for async autocomplete
  const searchCompaniesByNameOrIdentifier = useCallback(
    async (CompanyNameOrIdentifier: string) => {
      if (CompanyNameOrIdentifier.length >= 3) {
        try {
          const result = await searchCompanies({
            CompanyNameOrIdentifier,
            companyActivityType: 2, // Following the pattern from the curl command
          }).unwrap();

          console.log('Raw API result:', result);

          // If the result has Items property, extract it; otherwise use the result directly
          const companies = Array.isArray(result) ? result : (result as { Items?: CompanySearchResult[] })?.Items || [];
          console.log('Extracted companies:', companies);

          setCompanySearchResults(companies);
        } catch (error) {
          console.error('Company search failed:', error);
          setCompanySearchResults([]);
        }
      } else {
        setCompanySearchResults([]);
      }
    },
    [searchCompanies],
  );

  return {
    bankList,
    branchList,
    banksLoading,
    branchesLoading,
    selectedBankId,
    handleBankChange,
    // Company search data and functions
    companySearchResults,
    searchCompaniesByNameOrIdentifier,
    isCompanySearchLoading,
  };
};
