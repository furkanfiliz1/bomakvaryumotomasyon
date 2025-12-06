import {
  useGetAllowanceKindsQuery,
  useGetOperationManualChargeStatusQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} from '../manual-transaction-fee-tracking.api';
import { CompanyActivityType } from '../manual-transaction-fee-tracking.types';

export const useDropdownData = () => {
  // Get status options
  const { data: statusData = [], isLoading: statusLoading } = useGetOperationManualChargeStatusQuery();

  // Get allowance kinds for İskonto Tipi (AllowanceKind) - matching old project exactly
  const { data: allowanceKindsData = [], isLoading: allowanceKindsLoading } = useGetAllowanceKindsQuery();

  // Async search for buyers (for autocomplete)
  const [
    _searchBuyersByCompanyNameOrIdentifier,
    { data: buyersCompanySearchResults, isLoading: isBuyersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Async search for sellers (for autocomplete)
  const [
    _searchSellersByCompanyNameOrIdentifier,
    { data: sellersCompanySearchResults, isLoading: isSellersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  // Async search for financiers (for autocomplete)
  const [
    _searchFinanciersByCompanyNameOrIdentifier,
    { data: financiersCompanySearchResults, isLoading: isFinanciersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  const searchBuyersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchBuyersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.BUYER,
      }).unwrap();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const searchSellersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      console.log('geldi', CompanyNameOrIdentifier);
      await _searchSellersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: 2,
      }).unwrap();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const searchFinanciersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchFinanciersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.FINANCIER,
      }).unwrap();
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return {
    statusList: statusData,
    allowanceKindsList: allowanceKindsData,
    buyersCompanySearchResults: buyersCompanySearchResults?.Items || [],
    sellersCompanySearchResults: sellersCompanySearchResults?.Items || [],
    financiersCompanySearchResults: financiersCompanySearchResults?.Items || [],
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    searchFinanciersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
    isFinanciersSearchLoading,
    isLoading: statusLoading || allowanceKindsLoading,
  };
};
