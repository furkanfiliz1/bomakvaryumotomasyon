import {
  useGetCompensationTransactionTypesQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
} from '../compensation-transactions.api';

/**
 * Hook for managing dropdown data for compensation transactions filters
 * Following the OperationPricing pattern
 */
export function useCompensationTransactionsDropdownData() {
  // Get transaction types from API - following OperationPricing pattern
  const { data: transactionTypeList = [] } = useGetCompensationTransactionTypesQuery();

  // Add "Tümü" option to transaction type list

  // Company search for async autocomplete - following invoice operations pattern
  const [_searchCompaniesByNameOrIdentifier, { data: companySearchResults, isLoading: isCompanySearchLoading }] =
    useLazySearchCompaniesByNameOrIdentifierQuery();

  const searchCompaniesByNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchCompaniesByNameOrIdentifier({
        CompanyNameOrIdentifier: CompanyNameOrIdentifier || '',
        Status: 1,
        ActivityType: 2,
      });
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  return {
    transactionTypeList,
    // Company search for async autocomplete - extract Items array from response
    companySearchResults: companySearchResults?.Items || [],
    isCompanySearchLoading,
    searchCompaniesByNameOrIdentifier,
  };
}
