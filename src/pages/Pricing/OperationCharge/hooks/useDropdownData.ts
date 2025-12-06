import { useGetProductTypesQuery } from '@api';
import {
  useGetBuyersByActivityTypeQuery,
  useGetIntegratorStatusQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} from '../operation-charge.api';
import { CompanyActivityType } from '../operation-charge.types';

/**
 * Hook for fetching dropdown data needed for operation charge filters
 * Centralized data fetching to avoid multiple API calls
 */
export const useDropdownData = () => {
  const {
    data: integratorStatusOptions = [],
    isLoading: isIntegratorStatusLoading,
    error: integratorStatusError,
  } = useGetIntegratorStatusQuery();

  const {
    data: productTypeOptions = [],
    isLoading: isProductTypesLoading,
    error: productTypesError,
  } = useGetProductTypesQuery();

  // Fetch buyers using companies/activityType/1 endpoint
  const { data: buyersData, isLoading: isBuyersLoading } = useGetBuyersByActivityTypeQuery();

  const [
    _searchSendersByCompanyNameOrIdentifier,
    { data: sendersCompanySearchResults, isLoading: isSendersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  const [
    _searchFinancersByCompanyNameOrIdentifier,
    { data: financersCompanySearchResults, isLoading: isFinancersSearchLoading },
  ] = useLazySearchByCompanyNameOrIdentifierQuery();

  const searchSendersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchSendersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.SELLER,
      }).unwrap();
    } catch (error) {
      // Handle errors gracefully - RTK Query will manage the error state
      console.error('Search error:', error);
    }
  };

  const searchFinancersByCompanyNameOrIdentifier = async (CompanyNameOrIdentifier?: string): Promise<void> => {
    try {
      await _searchFinancersByCompanyNameOrIdentifier({
        CompanyNameOrIdentifier,
        CompanyActivityType: CompanyActivityType.FINANCIER,
      }).unwrap();
    } catch (error) {
      // Handle errors gracefully - RTK Query will manage the error state
      console.error('Search error:', error);
    }
  };

  // Daily options matching legacy structure
  const isDailyOptions = [
    { label: 'Evet', value: 'true' },
    { label: 'Hayır', value: 'false' },
  ];

  return {
    integratorStatusOptions,
    productTypeOptions,
    isDailyOptions,
    isLoading: isIntegratorStatusLoading || isProductTypesLoading,
    error: integratorStatusError || productTypesError,
    buyersList: buyersData ?? [],
    isBuyersLoading,
    sendersCompanySearchResults: sendersCompanySearchResults?.Items ?? [],
    searchSendersByCompanyNameOrIdentifier,
    isSendersSearchLoading,
    financersCompanySearchResults: financersCompanySearchResults?.Items ?? [],
    searchFinancersByCompanyNameOrIdentifier,
    isFinancersSearchLoading,
  };
};
