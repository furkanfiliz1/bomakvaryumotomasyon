import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { defaultFilterValues, transformFiltersForAPI, type CompaniesFilterFormData } from '../helpers';

export const useFilterForm = (schema?: yup.ObjectSchema<CompaniesFilterFormData>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize form with URL params
  const initialValues = useMemo(() => {
    const values = { ...defaultFilterValues };

    // Parse URL parameters
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const companyIdentifier = searchParams.get('companyIdentifier');
    const companyName = searchParams.get('companyName');
    const activityType = searchParams.get('activityType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const onboardingStatusTypes = searchParams.get('onboardingStatusTypes');
    const signedContract = searchParams.get('signedContract');
    const LeadingChannelId = searchParams.get('LeadingChannelId');
    const UserMail = searchParams.get('UserMail');
    const UserPhone = searchParams.get('UserPhone');
    const UserName = searchParams.get('UserName');
    const NameSurname = searchParams.get('NameSurname');
    const userIds = searchParams.get('userIds');
    const CityId = searchParams.get('CityId');

    if (type) values.type = parseInt(type, 10);
    if (status) values.status = parseInt(status, 10);
    if (companyIdentifier) values.companyIdentifier = companyIdentifier;
    if (companyName) values.companyName = companyName;
    if (activityType) values.activityType = activityType;
    if (startDate) values.startDate = startDate;
    if (endDate) values.endDate = endDate;
    if (onboardingStatusTypes) values.onboardingStatusTypes = onboardingStatusTypes;
    if (signedContract) values.signedContract = signedContract;
    if (LeadingChannelId) values.LeadingChannelId = LeadingChannelId;
    if (UserMail) values.UserMail = UserMail;
    if (UserPhone) values.UserPhone = UserPhone;
    if (UserName) values.UserName = UserName;
    if (NameSurname) values.NameSurname = NameSurname;
    if (userIds) {
      values.userIds = userIds
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    }
    if (CityId) values.CityId = parseInt(CityId, 10);

    return values;
  }, [searchParams]);

  const form = useForm<CompaniesFilterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? (yupResolver(schema) as any) : undefined,
    defaultValues: initialValues,
    mode: 'onChange',
  });

  // Update URL params when form values change
  const updateSearchParams = useCallback(
    (filters: CompaniesFilterFormData) => {
      const apiFilters = transformFiltersForAPI(filters);
      const params = new URLSearchParams(searchParams);

      // Clear existing filter params first
      const filterKeys = [
        'type',
        'status',
        'companyIdentifier',
        'companyName',
        'activityType',
        'startDate',
        'endDate',
        'onboardingStatusTypes',
        'signedContract',
        'LeadingChannelId',
        'UserMail',
        'UserPhone',
        'UserName',
        'NameSurname',
        'userIds',
        'CityId',
        'CityLabel',
      ];

      filterKeys.forEach((key) => params.delete(key));

      Object.entries(apiFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','));
            }
          } else {
            params.set(key, String(value));
          }
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = useCallback(
    (data: CompaniesFilterFormData) => {
      updateSearchParams(data);
    },
    [updateSearchParams],
  );

  const handleReset = useCallback(() => {
    form.reset(defaultFilterValues);
    setSearchParams(new URLSearchParams());
  }, [form, setSearchParams]);

  return {
    form,
    handleSearch,
    handleReset,
    initialValues,
  };
};
