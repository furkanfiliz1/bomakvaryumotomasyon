import { useCallback } from 'react';
import { useLazySearchCompaniesByNameOrIdentifierQuery } from '../limit-operations.api';

/**
 * Hook for managing company search functionality in Legal Proceeding Compensation forms
 * Following OperationPricing useOperationChargeDropdownData pattern
 */
export const useCompanySearch = () => {
  // Lazy query for company search using the new endpoint
  const [_searchCompaniesByNameOrIdentifier, { data: companySearchResults, isLoading: isCompanySearchLoading }] =
    useLazySearchCompaniesByNameOrIdentifierQuery();

  // Search function for companies - following the endpoint pattern you provided
  const searchCompaniesByNameOrIdentifier = useCallback(
    async (CompanyNameOrIdentifier?: string): Promise<void> => {
      try {
        await _searchCompaniesByNameOrIdentifier({
          CompanyNameOrIdentifier,
          Status: 1, // Active companies only
          ActivityType: 2, // Seller companies (ActivityType=2)
        }).unwrap();
      } catch (error) {
        console.error('Company search error:', error);
      }
    },
    [_searchCompaniesByNameOrIdentifier],
  );

  // Transform search results for autocomplete display
  // Format: "Identifier - CompanyName" as required by the schema
  const transformedSearchResults = (companySearchResults?.Items || []).map((item) => ({
    ...item,
    label: `${item.Identifier} - ${item.CompanyName}`,
    value: item.Identifier,
  }));

  return {
    // Search function
    searchCompaniesByNameOrIdentifier,

    // Search results (transformed for autocomplete)
    companySearchResults: transformedSearchResults,

    // Loading state
    isCompanySearchLoading,
  };
};

export default useCompanySearch;
