import { baseApi } from '../../../api/baseApi';
import type {
  CallResultType,
  CustomerTrackingListResponse,
  CustomerTrackingQueryParams,
  LeadStatusType,
  LeadingChannel,
  TrackingTeamMember,
} from './customer-tracking.types';

export const customerTrackingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Main customer tracking list - matches legacy getNewCustomerList
    getNewCustomerList: builder.query<CustomerTrackingListResponse, CustomerTrackingQueryParams>({
      query: (params) => ({
        url: '/companyTracking/search',
        method: 'GET',
        params: {
          ...params,
          // Ensure static values are always set
          ActivityType: 2,
          Type: 1,
        },
      }),
    }),

    // Dropdown data endpoints - matches legacy API calls
    getLeadingChannels: builder.query<LeadingChannel[], void>({
      query: () => ({
        url: '/definitions/leadingChannels',
        method: 'GET',
      }),
    }),

    getTrackingTeamList: builder.query<TrackingTeamMember[], void>({
      query: () => ({
        url: '/trackingTeam',
        method: 'GET',
      }),
    }),

    getCallResultTypes: builder.query<CallResultType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: {
          EnumName: 'CallResultTypes',
        },
      }),
    }),

    getLeadStatusTypes: builder.query<LeadStatusType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: {
          EnumName: 'LeadStatusTypes',
        },
      }),
    }),

    // Export functionality
    exportNewCustomerList: builder.mutation<Blob, CustomerTrackingQueryParams>({
      query: (params) => ({
        url: '/companyTracking/search',
        method: 'GET',
        params: {
          ...params,
          ActivityType: 2,
          Type: 1,
          IsExport: true,
        },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useLazyGetNewCustomerListQuery,
  useGetLeadingChannelsQuery,
  useGetTrackingTeamListQuery,
  useGetCallResultTypesQuery,
  useGetLeadStatusTypesQuery,
  useExportNewCustomerListMutation,
} = customerTrackingApi;
