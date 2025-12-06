import { useLazySearchByCompanyNameOrIdentifierQuery } from '../transaction-fee-discount.api';
import { CompanyActivityType, CompanySearchResult } from '../transaction-fee-discount.types';

export const useDropdownData = () => {
  // Search queries for different company types - following ManualTransactionFeeTracking pattern
  const [searchBuyersQuery, { data: buyersSearchData, isLoading: isBuyersSearchLoading }] =
    useLazySearchByCompanyNameOrIdentifierQuery();
  const [searchSellersQuery, { data: sellersSearchData, isLoading: isSellersSearchLoading }] =
    useLazySearchByCompanyNameOrIdentifierQuery();

  // Transform API results to match expected format - following ManualTransactionFeeTracking pattern
  const buyersCompanySearchResults: CompanySearchResult[] = buyersSearchData?.Items || [];
  const sellersCompanySearchResults: CompanySearchResult[] = sellersSearchData?.Items || [];

  // Search functions for different company types - following ManualTransactionFeeTracking pattern
  const searchBuyersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier: string) => {
    if (CompanyNameOrIdentifier.length >= 3) {
      await searchBuyersQuery({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.BUYER,
      });
    }
  };

  const searchSellersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier: string) => {
    if (CompanyNameOrIdentifier.length >= 3) {
      await searchSellersQuery({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.SELLER,
      });
    }
  };

  return {
    // Search results
    buyersCompanySearchResults,
    sellersCompanySearchResults,

    // Search functions
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,

    // Loading states
    isBuyersSearchLoading,
    isSellersSearchLoading,
  };
};
