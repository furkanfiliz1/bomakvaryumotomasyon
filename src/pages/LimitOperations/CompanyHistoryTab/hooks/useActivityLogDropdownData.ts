import { useErrorListener } from '@hooks';
import { useMemo } from 'react';
import {
  useGetActivityTypesQuery,
  useGetAdminUsersQuery,
  useGetOnboardingStatusTypesQuery,
} from '../company-history-tab.api';

/**
 * Hook to fetch dropdown data for activity log filters
 * Matches legacy data fetching pattern exactly
 */
export const useActivityLogDropdownData = () => {
  // Get admin users list - matches legacy _getAdminUsers
  const { data: adminUsers = [], isLoading: adminUsersLoading, error: adminUsersError } = useGetAdminUsersQuery();

  // Get activity types - matches legacy _getActivityTypes
  const {
    data: activityTypes = [],
    isLoading: activityTypesLoading,
    error: activityTypesError,
  } = useGetActivityTypesQuery();

  // Get onboarding status types - matches legacy _getCompanyStatus
  const {
    data: onboardingStatusTypes = [],
    isLoading: statusTypesLoading,
    error: statusTypesError,
  } = useGetOnboardingStatusTypesQuery();

  // Error handling for all dropdown queries
  useErrorListener([adminUsersError, activityTypesError, statusTypesError]);

  // Transform data for dropdowns - maintaining legacy format
  const adminUsersList = useMemo(
    () =>
      adminUsers.map((user) => ({
        id: user.Id,
        label: user.FullName,
        value: user.Id,
      })),
    [adminUsers],
  );

  const activityTypesList = useMemo(
    () =>
      activityTypes.map((type) => ({
        id: type.Value,
        label: type.Description,
        value: type.Value,
      })),
    [activityTypes],
  );

  const statusTypesList = useMemo(
    () =>
      onboardingStatusTypes.map((status) => ({
        id: status.Value,
        label: status.Description,
        value: status.Value,
      })),
    [onboardingStatusTypes],
  );

  return {
    adminUsersList,
    activityTypesList,
    statusTypesList,
    isLoading: adminUsersLoading || activityTypesLoading || statusTypesLoading,
  };
};
