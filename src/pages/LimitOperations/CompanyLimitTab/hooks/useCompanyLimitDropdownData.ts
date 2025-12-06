/**
 * Company Limit Dropdown Data Hook
 * Fetches dropdown data for Company Limit Tab forms
 * Following OperationPricing pattern for dropdown data management
 */

import {
  useGetActivityTypesQuery,
  useGetFinancerCompaniesQuery,
  useGetLimitRejectReasonTypesQuery,
  useGetLoanDecisionTypesQuery,
  useGetProductTypesQuery,
} from '../company-limit-tab.api';
import type {
  EnumOption,
  FibabankaGuaranteeRateOption,
  FinancerCompany,
  UseCompanyLimitDropdownDataResult,
} from '../company-limit-tab.types';
import { FIBABANKA_GUARANTEE_RATES } from '../helpers';

/**
 * Hook for fetching dropdown data needed for Company Limit Tab forms
 * Matches legacy component data fetching for dropdowns
 */
export const useCompanyLimitDropdownData = (): UseCompanyLimitDropdownDataResult => {
  // Fetch loan decision types - matches legacy _getLoanDecisionType
  const { data: loanDecisionTypesData, isLoading: isLoanDecisionLoading } = useGetLoanDecisionTypesQuery();

  // Fetch limit reject reason types - matches legacy _getLimitRejectReasons
  const { data: limitRejectReasonTypesData, isLoading: isLimitRejectLoading } = useGetLimitRejectReasonTypesQuery();

  // Fetch product types - matches legacy _getProductTypes
  const { data: productTypesData, isLoading: isProductTypesLoading } = useGetProductTypesQuery();

  // Fetch activity types - matches legacy _getActivityTypes
  const { data: activityTypesData, isLoading: isActivityTypesLoading } = useGetActivityTypesQuery();

  // Fetch financer companies - matches legacy getCompanyList with type: 2
  const { data: financerCompaniesResponse, isLoading: isFinancerCompaniesLoading } = useGetFinancerCompaniesQuery({
    sort: 'CompanyName',
    sortType: 'Asc',
    type: 2,
    page: 1,
    pageSize: 100,
  });

  // Process data with fallbacks
  const loanDecisionTypes: EnumOption[] = loanDecisionTypesData || [];
  const limitRejectReasonTypes: EnumOption[] = limitRejectReasonTypesData || [];
  const productTypes: EnumOption[] = productTypesData || [];
  const activityTypes: EnumOption[] = activityTypesData || [];
  // Handle both wrapped and direct array responses for financer companies
  // API returns direct array, not wrapped in Items property as expected by type definition
  const financerCompanies: FinancerCompany[] = Array.isArray(financerCompaniesResponse)
    ? financerCompaniesResponse
    : financerCompaniesResponse?.Items || [];

  // Fibabanka guarantee rates - hardcoded as in legacy
  const fibabankaGuaranteeRates: FibabankaGuaranteeRateOption[] = FIBABANKA_GUARANTEE_RATES;

  // Calculate overall loading state
  const isLoading =
    isLoanDecisionLoading ||
    isLimitRejectLoading ||
    isProductTypesLoading ||
    isActivityTypesLoading ||
    isFinancerCompaniesLoading;

  return {
    loanDecisionTypes,
    limitRejectReasonTypes,
    productTypes,
    activityTypes,
    financerCompanies,
    fibabankaGuaranteeRates,
    isLoading,
  };
};
