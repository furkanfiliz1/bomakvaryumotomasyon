import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  ActivityLogItem,
  ActivityLogQueryParams,
  ActivityLogResponse,
  ActivityType,
  AdminUser,
  CreateActivityLogRequest,
  OnboardingStatusType,
} from './company-history-tab.types';

export const companyHistoryTabApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // =============================================================================
    // COMPANY ACTIVITY LOG (TARIHÇE TAB) ENDPOINTS
    // =============================================================================

    // Get company activity log with filters and pagination - matches legacy exactly
    getCompanyActivityLog: builder.query<
      ServerSideQueryResult<ActivityLogItem>,
      { companyId: number; params?: ActivityLogQueryParams }
    >({
      query: ({ companyId, params = {} }) => ({
        url: `/companies/${companyId}/ActivityLog`,
        method: 'GET',
        params: {
          page: 1,
          pageSize: 25,
          sort: 'InsertDateTime',
          sortType: 'Desc',
          onboardingStatusType: '',
          userId: '',
          ActivityType: '',
          ...params,
        },
      }),
      transformResponse: (response: ActivityLogResponse): ServerSideQueryResult<ActivityLogItem> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? JSON.stringify(response.ExtensionData) : null,
      }),
    }),

    // Get admin users list - matches legacy /users/admins exactly
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => ({
        url: '/users/admins',
        method: 'GET',
      }),
    }),

    // Get activity types - matches legacy /types?EnumName=ActivityType exactly
    getActivityTypes: builder.query<ActivityType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'ActivityType' },
      }),
    }),

    // Get onboarding status types - matches legacy /types?EnumName=OnboardingStatusTypes exactly
    getOnboardingStatusTypes: builder.query<OnboardingStatusType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'OnboardingStatusTypes' },
      }),
    }),

    // Create activity log entry - matches legacy _postActivityType exactly
    createActivityLog: builder.mutation<void, CreateActivityLogRequest>({
      query: (data) => ({
        url: '/companies/activities',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCompanyActivityLogQuery,
  useLazyGetCompanyActivityLogQuery,
  useGetAdminUsersQuery,
  useLazyGetAdminUsersQuery,
  useGetActivityTypesQuery,
  useLazyGetActivityTypesQuery,
  useGetOnboardingStatusTypesQuery,
  useLazyGetOnboardingStatusTypesQuery,
  useCreateActivityLogMutation,
} = companyHistoryTabApi;
