/**
 * Lead Dropdown Data Hook
 * Following OperationPricing pattern for fetching dropdown data
 * Provides customer managers, leading channels, and product types data for filter form
 */

import { useMemo } from 'react';
import {
  CustomerManager,
  LeadingChannel,
  ProductTypeOption,
  useGetCustomerManagerListQuery,
  useGetLeadingChannelsQuery,
  useGetProductTypesQuery,
} from 'src/api/figoParaApi';
import { useGetLeadCallResultStatusDataQuery } from 'src/pages/Companies/companies.api';
import { getMembershipStatusOptions } from '../constants';

/**
 * Hook for fetching dropdown data needed for lead filters
 * Uses global API responses with correct property mapping for form fields
 */
export const useLeadDropdownData = (): {
  customerManagerList: CustomerManager[];
  leadingChannelList: LeadingChannel[];
  productTypeList: ProductTypeOption[];
  callResultList: { Value: string; Description: string }[];
  membershipOptions: { id: boolean; name: string }[];
  isLoading: boolean;
} => {
  // Customer managers data from global API
  const { data: customerManagersData, isLoading: isCustomerManagersLoading } = useGetCustomerManagerListQuery();

  // Leading channels data from global API
  const { data: leadingChannelsData, isLoading: isLeadingChannelsLoading } = useGetLeadingChannelsQuery();

  // Product types data from global API
  const { data: productTypesData, isLoading: isProductTypesLoading } = useGetProductTypesQuery();

  // Call result status data from companies API
  const { data: callResultData, isLoading: isCallResultLoading } = useGetLeadCallResultStatusDataQuery();

  // Memoize lists to prevent re-render loops
  const customerManagerList = useMemo(() => customerManagersData?.Items || [], [customerManagersData?.Items]);
  const leadingChannelList = useMemo(() => leadingChannelsData || [], [leadingChannelsData]);
  const productTypeList = useMemo(() => productTypesData || [], [productTypesData]);
  const callResultList = useMemo(() => callResultData || [], [callResultData]);

  // Static membership options from constants
  const membershipOptions = useMemo(() => getMembershipStatusOptions(), []);

  return {
    customerManagerList,
    leadingChannelList,
    productTypeList,
    callResultList,
    membershipOptions,
    isLoading: isCustomerManagersLoading || isLeadingChannelsLoading || isProductTypesLoading || isCallResultLoading,
  };
};

export default useLeadDropdownData;
