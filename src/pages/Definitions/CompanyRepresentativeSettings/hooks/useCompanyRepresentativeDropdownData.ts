/**
 * Company Representative Dropdown Data Hook
 * Fetches dropdown data for customer managers, product types, and financers
 * Following OperationPricing dropdown data patterns
 */

import { useGetProductTypesQuery } from '@api';
import {
  useGetBuyerCompaniesListQuery,
  useGetCustomerManagerListQuery,
  useGetFinancersListQuery,
} from '../company-representative-settings.api';
import type {
  BuyerCompany,
  CustomerManagerOption,
  FinancerOption,
  ProductTypeOption,
} from '../company-representative-settings.types';

export interface BuyerCompanyOption {
  Id: number;
  CompanyName: string;
}

interface UseCompanyRepresentativeDropdownDataReturn {
  customerManagerList: CustomerManagerOption[];
  productTypeList: ProductTypeOption[];
  financersList: FinancerOption[];
  buyerCompaniesList: BuyerCompanyOption[];
  isLoading: boolean;
  error: unknown;
}

/**
 * Hook for fetching dropdown data needed for company representative filters
 * Uses API responses with correct property mapping for form fields
 */
export const useCompanyRepresentativeDropdownData = (): UseCompanyRepresentativeDropdownDataReturn => {
  // Customer managers data
  const {
    data: customerManagersData,
    isLoading: isCustomerManagersLoading,
    error: customerManagersError,
  } = useGetCustomerManagerListQuery();

  // Product types data
  const {
    data: productTypesData,
    isLoading: isProductTypesLoading,
    error: productTypesError,
  } = useGetProductTypesQuery();

  // Financers data
  const { data: financersData, isLoading: isFinancersLoading, error: financersError } = useGetFinancersListQuery();

  // Buyer companies data
  const {
    data: buyerCompaniesData,
    isLoading: isBuyerCompaniesLoading,
    error: buyerCompaniesError,
  } = useGetBuyerCompaniesListQuery();

  // Transform customer managers to match form needs
  const customerManagerList: CustomerManagerOption[] =
    customerManagersData?.Items?.map((manager) => ({
      Id: manager.Id,
      FullName: manager.FullName,
    })) || [];

  // Transform product types - they come as array with Description/Value structure
  const productTypeList: ProductTypeOption[] = Array.isArray(productTypesData)
    ? productTypesData.map((type) => ({
        Value: type.Value,
        Description: type.Description,
      }))
    : [];

  // Transform financers to match form needs
  const financersList: FinancerOption[] =
    financersData?.Items?.map((financer) => ({
      Id: financer.Id,
      CompanyName: financer.CompanyName,
    })) || [];

  // Transform buyer companies to match form needs
  const buyerCompaniesList: BuyerCompanyOption[] =
    buyerCompaniesData?.map((buyer: BuyerCompany) => ({
      Id: buyer.Id,
      CompanyName: buyer.CompanyName,
    })) || [];

  // Determine overall loading state
  const isLoading = isCustomerManagersLoading || isProductTypesLoading || isFinancersLoading || isBuyerCompaniesLoading;

  // Determine if any error occurred
  const error = customerManagersError || productTypesError || financersError || buyerCompaniesError;

  return {
    customerManagerList,
    productTypeList,
    financersList,
    buyerCompaniesList,
    isLoading,
    error,
  };
};
