import { useMemo } from 'react';
import { transformFinancerOptions, transformProductTypeOptions } from '../helpers';
import { useGetFinancerCompaniesQuery, useGetProductTypesQuery } from '../other-operations.api';

/**
 * Custom hook for Limits to Passive dropdown data
 * Following OperationPricing patterns for data fetching
 * Updated for direct VKN/TCKN input instead of async company search
 */
export const useLimitsToPassiveDropdownData = () => {
  // Fetch financer companies
  const {
    data: financerCompanies = [],
    isLoading: financerLoading,
    error: financerError,
  } = useGetFinancerCompaniesQuery();

  // Fetch product types
  const {
    data: productTypes = [],
    isLoading: productTypesLoading,
    error: productTypesError,
  } = useGetProductTypesQuery();

  // Transform data for react-select format
  const financerOptions = useMemo(() => transformFinancerOptions(financerCompanies), [financerCompanies]);

  const productTypeOptions = useMemo(() => transformProductTypeOptions(productTypes), [productTypes]);

  return {
    // Financer data
    financerOptions,
    financerLoading,
    financerError,

    // Product type data
    productTypeOptions,
    productTypesLoading,
    productTypesError,

    // Overall loading state
    isLoading: financerLoading || productTypesLoading,
    hasError: Boolean(financerError || productTypesError),
  };
};
