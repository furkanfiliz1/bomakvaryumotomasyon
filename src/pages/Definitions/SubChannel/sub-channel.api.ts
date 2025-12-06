/**
 * Sub Channel API Endpoints
 * RTK Query endpoints for /applicationSubChannel CRUD operations
 */

import { baseApi } from '@api';
import type { CreateSubChannelRequest, SubChannelItem, UpdateSubChannelRequest } from './sub-channel.types';

const subChannelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /applicationSubChannel
     * Fetches all sub channels
     */
    getSubChannelList: builder.query<SubChannelItem[], void>({
      query: () => '/applicationSubChannel',
    }),

    /**
     * POST /applicationSubChannel
     * Creates a new sub channel
     */
    createSubChannel: builder.mutation<void, CreateSubChannelRequest>({
      query: (body) => ({
        url: '/applicationSubChannel',
        method: 'POST',
        body,
      }),
    }),

    /**
     * PUT /applicationSubChannel/{id}
     * Updates an existing sub channel
     */
    updateSubChannel: builder.mutation<void, UpdateSubChannelRequest>({
      query: ({ Id, ...body }) => ({
        url: `/applicationSubChannel/${Id}`,
        method: 'PUT',
        body,
      }),
    }),

    /**
     * DELETE /applicationSubChannel/{id}
     * Deletes a sub channel
     */
    deleteSubChannel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/applicationSubChannel/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubChannelListQuery,
  useCreateSubChannelMutation,
  useUpdateSubChannelMutation,
  useDeleteSubChannelMutation,
} = subChannelApi;
