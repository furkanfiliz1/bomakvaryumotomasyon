import { useCallback } from 'react';
import {
  useGetCompensationTransactionTypesQuery,
  useGetFinancerCompaniesForCompensationQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
} from '../compensation-transactions.api';

/**
 * Hook for managing compensation transaction form dropdown data
 * Following OperationPricing dropdown data patterns
 */
export const useCompensationTransactionFormData = () => {
  // Get transaction types
  const { data: transactionTypes = [], isLoading: isLoadingTypes } = useGetCompensationTransactionTypesQuery();

  // Get financer companies
  const { data: financerCompanies = [], isLoading: isLoadingFinancers } = useGetFinancerCompaniesForCompensationQuery();

  // Lazy query for company search
  const [searchCompanies, { isLoading: isSearching }] = useLazySearchCompaniesByNameOrIdentifierQuery();

  // Company search function for async select
  const handleCompanySearch = useCallback(
    async (inputValue: string) => {
      if (!inputValue || inputValue.length < 3) {
        return [];
      }

      try {
        const result = await searchCompanies({
          CompanyNameOrIdentifier: inputValue,
          Status: 1,
          ActivityType: 2,
        }).unwrap();

        // Transform for autocomplete display - return the Items array from the response
        return result.Items || [];
      } catch (error) {
        console.error('Company search error:', error);
        return [];
      }
    },
    [searchCompanies],
  );

  // Transform transaction types for select dropdown
  const transactionTypeOptions = transactionTypes.map((type) => ({
    value: type.Value,
    label: type.Description,
  }));

  // Transform financer companies for select dropdown
  const financerCompanyOptions = financerCompanies.map((company) => ({
    value: company.Id,
    label: company.CompanyName,
  }));

  return {
    transactionTypeOptions,
    financerCompanyOptions,
    handleCompanySearch,
    isLoading: isLoadingTypes || isLoadingFinancers,
    isSearching,
    companiesSearchResults: [], // This will be managed by the form component state
  };
};
