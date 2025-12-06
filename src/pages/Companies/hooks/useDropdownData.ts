import { useMemo } from 'react';
import {
  useGetCompanyActivityTypesQuery,
  useGetCompanyStatusQuery,
  useGetLeadingChannelListQuery,
  useGetCitiesQuery,
} from '../companies.api';
import { useGetCustomerManagerListQuery } from '@api';
import { companyTypes, companyStatusOptions, signedContractOptions } from '../helpers';

export const useDropdownData = () => {
  const { data: activityTypes, isLoading: loadingActivityTypes } = useGetCompanyActivityTypesQuery();
  const { data: onboardingStatus, isLoading: loadingOnboardingStatus } = useGetCompanyStatusQuery();
  const { data: customerManagerResponse, isLoading: loadingCustomerManagers } = useGetCustomerManagerListQuery();
  const { data: leadingChannels, isLoading: loadingLeadingChannels } = useGetLeadingChannelListQuery();
  const { data: cities, isLoading: loadingCities } = useGetCitiesQuery();

  const dropdownOptions = useMemo(
    () => ({
      companyTypes,
      companyStatusOptions,
      signedContractOptions,
      activityTypes:
        activityTypes?.map((item) => ({
          value: item.Value,
          label: item.Description,
        })) || [],
      onboardingStatus:
        onboardingStatus?.map((item) => ({
          value: item.Value,
          label: item.Description,
        })) || [],
      customerManagers:
        customerManagerResponse?.Items?.map((item) => ({
          value: item.Id,
          label: item.FullName,
        })) || [],
      leadingChannels:
        leadingChannels?.map((item) => ({
          value: item.Id,
          label: item.Value,
        })) || [],
      cities:
        cities?.map((item) => ({
          value: item.Id,
          label: item.Name,
        })) || [],
    }),
    [activityTypes, onboardingStatus, customerManagerResponse, leadingChannels, cities],
  );

  const isLoading =
    loadingActivityTypes ||
    loadingOnboardingStatus ||
    loadingCustomerManagers ||
    loadingLeadingChannels ||
    loadingCities;

  return {
    dropdownOptions,
    isLoading,
  };
};
