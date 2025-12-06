/**
 * Opportunity Dropdown Data Hook
 * Following LeadManagement pattern for fetching dropdown data
 * Provides customer managers, product types, receivers and status options for filter/forms
 */

import { useMemo } from 'react';
import {
  CustomerManager,
  ProductTypeOption,
  useGetCustomerManagerListQuery,
  useGetProductTypesQuery,
} from 'src/api/figoParaApi';
import { useGetBuyerCompaniesQuery } from '../../companies.api';
import { Company } from '../../companies.types';
import {
  useGetOpportunityStatusQuery,
  useGetOpportunityWinningStatusQuery,
  useGetSalesScenarioTypesQuery,
} from '../opportunity-management.api';

/**
 * Hook for fetching dropdown data needed for opportunity filters and forms
 * Uses global API responses with correct property mapping for form fields
 */
export const useOpportunityDropdownData = (): {
  customerManagerList: CustomerManager[];
  productTypeList: ProductTypeOption[];
  receiverList: Company[];
  statusOptions: { Value: string; Description: string }[];
  winningStatusOptions: { Value: string; Description: string }[];
  salesScenarioOptions: { Value: string; Description: string }[];
  isLoading: boolean;
} => {
  // Customer managers data from global API
  const { data: customerManagersData, isLoading: isCustomerManagersLoading } = useGetCustomerManagerListQuery();

  // Product types data from global API
  const { data: productTypesData, isLoading: isProductTypesLoading } = useGetProductTypesQuery();

  // Buyer companies (receivers) from companies API
  const { data: buyerCompaniesData, isLoading: isBuyerCompaniesLoading } = useGetBuyerCompaniesQuery();

  // Sales scenario types from API - GET /types?EnumName=LeadSalesScenario
  const { data: salesScenarioTypesData, isLoading: isSalesScenarioLoading } = useGetSalesScenarioTypesQuery();

  const { data: opportunityStatusData, isLoading: isOpportunityStatusLoading } = useGetOpportunityStatusQuery();

  const { data: opportunityWinningStatusData, isLoading: isOpportunityWinningStatusLoading } =
    useGetOpportunityWinningStatusQuery();

  // Memoize lists to prevent re-render loops
  const customerManagerList = useMemo(() => customerManagersData?.Items || [], [customerManagersData?.Items]);
  const productTypeList = useMemo(() => productTypesData || [], [productTypesData]);
  const receiverList = useMemo(() => buyerCompaniesData || [], [buyerCompaniesData]);
  const statusOptions = useMemo(() => opportunityStatusData || [], [opportunityStatusData]);
  const winningStatusOptions = useMemo(() => opportunityWinningStatusData || [], [opportunityWinningStatusData]);

  // Sales scenario options from API
  const salesScenarioOptions = useMemo(() => salesScenarioTypesData || [], [salesScenarioTypesData]);

  return {
    customerManagerList,
    productTypeList,
    receiverList,
    statusOptions,
    winningStatusOptions,
    salesScenarioOptions,
    isLoading:
      isCustomerManagersLoading ||
      isProductTypesLoading ||
      isBuyerCompaniesLoading ||
      isSalesScenarioLoading ||
      isOpportunityStatusLoading ||
      isOpportunityWinningStatusLoading,
  };
};

export default useOpportunityDropdownData;
