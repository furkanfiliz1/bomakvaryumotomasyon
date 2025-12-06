import { useGetCustomerManagerListQuery } from 'src/api/figoParaApi';
import { getMonthOptions, getYearOptions } from '../helpers';
import { useGetUserTargetTypesQuery } from '../representative-target-entry.api';
import type { CustomerManager, MonthOption, UserTargetType, YearOption } from '../representative-target-entry.types';

/**
 * Hook for fetching dropdown data needed for representative target entry filters and forms
 * Follows OperationPricing pattern exactly
 */
export const useRepresentativeTargetDropdownData = (): {
  customerManagerList: CustomerManager[];
  userTargetTypeList: UserTargetType[];
  monthOptions: MonthOption[];
  yearOptions: YearOption[];
  isLoading: boolean;
} => {
  // Fetch customer managers - existing API
  const { data: customerManagersData, isLoading: isCustomerManagersLoading } = useGetCustomerManagerListQuery();

  // Fetch user target types - new API
  const { data: userTargetTypesData, isLoading: isUserTargetTypesLoading } = useGetUserTargetTypesQuery();

  // Static month and year options
  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  // Transform customer managers data
  const customerManagerList = customerManagersData?.Items || [];

  // Transform user target types data
  const userTargetTypeList = userTargetTypesData || [];

  return {
    customerManagerList,
    userTargetTypeList,
    monthOptions,
    yearOptions,
    isLoading: isCustomerManagersLoading || isUserTargetTypesLoading,
  };
};

export default useRepresentativeTargetDropdownData;
