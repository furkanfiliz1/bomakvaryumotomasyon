/**
 * Application Channel API Endpoints
 * RTK Query endpoints for /applicationChannel CRUD operations
 */

import { baseApi } from '@api';
import type {
  ApplicationChannelItem,
  CreateApplicationChannelRequest,
  UpdateApplicationChannelRequest,
} from './application-channel.types';

const applicationChannelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /applicationChannel
     * Fetches all application channels
     */
    getApplicationChannelList: builder.query<ApplicationChannelItem[], void>({
      query: () => '/applicationChannel',
    }),

    /**
     * POST /applicationChannel
     * Creates a new application channel
     */
    createApplicationChannel: builder.mutation<void, CreateApplicationChannelRequest>({
      query: (body) => ({
        url: '/applicationChannel',
        method: 'POST',
        body,
      }),
    }),

    /**
     * PUT /applicationChannel/{id}
     * Updates an existing application channel
     */
    updateApplicationChannel: builder.mutation<void, UpdateApplicationChannelRequest>({
      query: ({ Id, ...body }) => ({
        url: `/applicationChannel/${Id}`,
        method: 'PUT',
        body: { Id, ...body },
      }),
    }),

    /**
     * DELETE /applicationChannel/{id}
     * Deletes an application channel
     */
    deleteApplicationChannel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/applicationChannel/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApplicationChannelListQuery,
  useCreateApplicationChannelMutation,
  useUpdateApplicationChannelMutation,
  useDeleteApplicationChannelMutation,
} = applicationChannelApi;
