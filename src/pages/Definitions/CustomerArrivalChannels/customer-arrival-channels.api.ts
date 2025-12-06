import { baseApi } from '@api';
import type {
  LeadingChannel,
  LeadingChannelCreateRequest,
  LeadingChannelFilters,
  LeadingChannelUpdateRequest,
} from './customer-arrival-channels.types';

export const customerArrivalChannelsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get list of customer arrival channels with optional filters
    getCustomerArrivalChannels: build.query<LeadingChannel[], LeadingChannelFilters>({
      query: (params) => ({
        url: '/definitions/leadingChannels',
        params,
      }),
    }),

    // Create new customer arrival channel
    createCustomerArrivalChannel: build.mutation<void, LeadingChannelCreateRequest>({
      query: (data) => ({
        url: '/definitions/leadingChannels',
        method: 'POST',
        body: data,
      }),
    }),

    // Update existing customer arrival channel
    updateCustomerArrivalChannel: build.mutation<void, { id: number; data: LeadingChannelUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/definitions/leadingChannels/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete customer arrival channel
    deleteCustomerArrivalChannel: build.mutation<void, number>({
      query: (id) => ({
        url: `/definitions/leadingChannels/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCustomerArrivalChannelsQuery,
  useLazyGetCustomerArrivalChannelsQuery,
  useCreateCustomerArrivalChannelMutation,
  useUpdateCustomerArrivalChannelMutation,
  useDeleteCustomerArrivalChannelMutation,
} = customerArrivalChannelsApi;
