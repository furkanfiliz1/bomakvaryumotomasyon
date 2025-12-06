import { useMemo } from 'react';
import {
  useGetCompanyListQuery,
  useLazySearchSellersByCompanyNameOrIdentifierQuery,
  useLazySearchFinanciersByCompanyNameOrIdentifierQuery,
} from '../integration-reports.api';
import type { CompanyListItem } from '../integration-reports.types';
import { CompanyActivityType } from '../integration-reports.types';

/**
 * Hook for fetching dropdown data used in Integration Reports filters
 * Following OperationPricing dropdown data pattern with async search functionality
 */
export const useIntegrationReportsDropdownData = () => {
  // Fetch company list for CompanyIdentifier dropdown - matches legacy getCompanyList
  const { data: companyResponse, isLoading: companyLoading } = useGetCompanyListQuery({
    sort: 'CompanyName',
    sortType: 'Asc',
    type: 2, // Bank type as per legacy
    page: 1,
    pageSize: 100,
  });

  // Async search for sellers (for SenderIdentifier - Tedarikçi VKN autocomplete)
  const [
    _searchSellersByCompanyNameOrIdentifier,
    { data: sellersCompanySearchResults, isLoading: isSellersSearchLoading },
  ] = useLazySearchSellersByCompanyNameOrIdentifierQuery();

  // Async search for financiers (for CompanyIdentifier - Finansör VKN autocomplete)
  const [
    _searchFinanciersByCompanyNameOrIdentifier,
    { data: financiersCompanySearchResults, isLoading: isFinanciersSearchLoading },
  ] = useLazySearchFinanciersByCompanyNameOrIdentifierQuery();

  // Transform company data to dropdown format
  const companyList: CompanyListItem[] = useMemo(() => {
    return companyResponse?.Items || [];
  }, [companyResponse]);

  // Search function for sellers (Tedarikçi VKN)
  const searchSellersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchSellersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.SELLER,
      }).unwrap();
    } catch (error) {
      console.error('Seller search error:', error);
    }
  };

  // Search function for financiers (Finansör VKN)
  const searchFinanciersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchFinanciersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.FINANCIER,
      }).unwrap();
    } catch (error) {
      console.error('Financier search error:', error);
    }
  };

  return {
    companyList,
    companyLoading,
    // Company search data for async autocomplete
    sellersCompanySearchResults: sellersCompanySearchResults?.Items || [],
    financiersCompanySearchResults: financiersCompanySearchResults?.Items || [],
    searchSellersByCompanyNameOrIdentifier,
    searchFinanciersByCompanyNameOrIdentifier,
    isSellersSearchLoading,
    isFinanciersSearchLoading,
    isLoading: companyLoading,
  };
};
