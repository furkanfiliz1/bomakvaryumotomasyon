import { useGetProductTypesQuery } from '@api';
import { TRANSACTION_TYPE_OPTIONS } from '../constants';
import {
  useGetFinancierCompaniesFromActivityTypeQuery,
  useGetIntegratorStatusQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} from '../operation-charge.api';
import { CompanyActivityType } from '../operation-charge.types';

/**
 * Hook to get dropdown data for operation charge form
 * Following OperationPricing pattern with async autocomplete for company fields
 */
export const useOperationChargeDropdownData = () => {
  const { data: productTypes = [], isLoading: productTypesLoading } = useGetProductTypesQuery();
  const { data: integratorStatus = [], isLoading: integratorStatusLoading } = useGetIntegratorStatusQuery();
  const { data: financierCompanies = [], isLoading: financierCompaniesLoading } =
    useGetFinancierCompaniesFromActivityTypeQuery();

  // Async search for sellers (for autocomplete) - Changed from "Tedarikçi" to "Satıcı"
  const [
    _searchSellersByCompanyNameOrIdentifier,
    { data: sellersCompanySearchResults, isLoading: isSellersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Async search for buyers (for autocomplete)
  const [
    _searchBuyersByCompanyNameOrIdentifier,
    { data: buyersCompanySearchResults, isLoading: isBuyersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Note: Removed async search for financiers since we're now using multipleSelect with all companies

  // Search functions for each company type
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

  const searchBuyersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchBuyersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.BUYER,
      }).unwrap();
    } catch (error) {
      console.error('Buyer search error:', error);
    }
  };

  // Note: Removed searchFinanciersByCompanyNameOrIdentifier since we're using multipleSelect

  return {
    productTypes: productTypes.map((item) => ({
      value: item.Value,
      label: item.Description,
    })),
    integratorStatus: integratorStatus,
    transactionTypes: TRANSACTION_TYPE_OPTIONS,
    // Company search results
    sellersCompanySearchResults: sellersCompanySearchResults?.Items || [],
    buyersCompanySearchResults: buyersCompanySearchResults?.Items || [],
    financierCompanies: financierCompanies, // Changed from search results to direct list
    // Search functions
    searchSellersByCompanyNameOrIdentifier,
    searchBuyersByCompanyNameOrIdentifier,
    // Loading states (removed financier search loading)
    isSellersSearchLoading,
    isBuyersSearchLoading,
    isLoading: productTypesLoading || integratorStatusLoading || financierCompaniesLoading,
  };
};
