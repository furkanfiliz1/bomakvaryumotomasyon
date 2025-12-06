import { useMemo } from 'react';
import { useGetAdminUsersQuery, useGetCompanyStatusesQuery, useGetActivityTypesQuery } from '../company-comments.api';
import type { DropdownData } from '../company-comments.types';

export const useCompanyCommentsDropdownData = (): {
  dropdownData: DropdownData;
  isLoading: boolean;
  error: unknown;
} => {
  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetAdminUsersQuery();

  const { data: companyStatuses = [], isLoading: statusesLoading, error: statusesError } = useGetCompanyStatusesQuery();

  const {
    data: activityTypes = [],
    isLoading: activityTypesLoading,
    error: activityTypesError,
  } = useGetActivityTypesQuery();

  const dropdownData = useMemo(
    (): DropdownData => ({
      users,
      companyStatuses,
      activityTypes,
    }),
    [users, companyStatuses, activityTypes],
  );

  const isLoading = usersLoading || statusesLoading || activityTypesLoading;
  const error = usersError || statusesError || activityTypesError;

  return {
    dropdownData,
    isLoading,
    error,
  };
};
