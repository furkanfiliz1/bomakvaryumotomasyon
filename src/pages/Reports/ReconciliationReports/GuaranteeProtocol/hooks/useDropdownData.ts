import { CompanyActivityType, CompanySearchResult } from '../../shared.types';
import { useLazySearchByCompanyNameOrIdentifierQuery } from '../guarantee-protocol.api';

/**
 * Hook for managing async company search data
 * Following TransactionFeeDiscount pattern exactly
 */
export const useDropdownData = () => {
  // Search queries for different company types
  const [searchFinanciersQuery, { data: financiersSearchData, isLoading: isFinanciersSearchLoading }] =
    useLazySearchByCompanyNameOrIdentifierQuery();
  const [searchSendersQuery, { data: sendersSearchData, isLoading: isSendersSearchLoading }] =
    useLazySearchByCompanyNameOrIdentifierQuery();

  // Transform API results to match expected format
  const financiersCompanySearchResults: CompanySearchResult[] = financiersSearchData?.Items || [];
  const sendersCompanySearchResults: CompanySearchResult[] = sendersSearchData?.Items || [];

  // Search functions for different company types
  const searchFinanciersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier: string) => {
    if (CompanyNameOrIdentifier.length >= 3) {
      await searchFinanciersQuery({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.FINANCIER,
      });
    }
  };

  const searchSendersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier: string) => {
    if (CompanyNameOrIdentifier.length >= 3) {
      await searchSendersQuery({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.SELLER,
      });
    }
  };

  return {
    // Search results
    financiersCompanySearchResults,
    sendersCompanySearchResults,

    // Search functions
    searchFinanciersByCompanyNameOrIdentifier,
    searchSendersByCompanyNameOrIdentifier,

    // Loading states
    isFinanciersSearchLoading,
    isSendersSearchLoading,
  };
};
