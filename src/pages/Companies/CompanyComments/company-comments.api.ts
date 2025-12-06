import { baseApi } from '../../../api';
import type {
  ActivityLogRequest,
  ActivityType,
  AdminUser,
  CompanyCommentsFilters,
  CompanyCommentsResponse,
  CompanyStatus,
} from './company-comments.types';

export const companyCommentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCompanyComments: build.query<CompanyCommentsResponse, { companyId: number; params?: CompanyCommentsFilters }>({
      query: ({ companyId, params }) => {
        console.log('API: getCompanyComments called with:', { companyId, params });
        const result = {
          url: `/companies/${companyId}/ActivityLog`,
          params: params,
        };
        console.log('API: Making request to:', result.url, 'with params:', result.params);
        return result;
      },
      keepUnusedDataFor: 0, // Don't cache results to ensure fresh data on filter changes
    }),

    getAdminUsers: build.query<AdminUser[], void>({
      query: () => ({
        url: '/users/admins',
      }),
    }),

    getCompanyStatuses: build.query<CompanyStatus[], void>({
      query: () => ({
        url: '/types?EnumName=OnboardingStatusTypes',
      }),
    }),

    getActivityTypes: build.query<ActivityType[], void>({
      query: () => ({
        url: '/types?EnumName=ActivityType',
      }),
    }),

    postActivityLog: build.mutation<void, ActivityLogRequest>({
      query: (data) => ({
        url: '/companies/activities',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCompanyCommentsQuery,
  useGetAdminUsersQuery,
  useGetCompanyStatusesQuery,
  useGetActivityTypesQuery,
  usePostActivityLogMutation,
} = companyCommentsApi;
