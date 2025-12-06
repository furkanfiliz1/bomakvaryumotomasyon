import { baseApi } from '@api';
import type { CreateTargetTypeRequest, TargetType, TargetTypesListResponse } from './target-types.types';

/**
 * Target Types API
 * RTK Query endpoints for target type CRUD operations
 * Following UserPositions pattern exactly
 */
export const targetTypesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /userTargetTypes - Fetch all target types
    getTargetTypes: build.query<TargetTypesListResponse, void>({
      query: () => ({
        url: '/userTargetTypes',
        method: 'GET',
      }),
      providesTags: ['TargetTypes'],
    }),

    // POST /userTargetTypes - Create a new target type
    createTargetType: build.mutation<TargetType, CreateTargetTypeRequest>({
      query: (targetType) => ({
        url: '/userTargetTypes',
        method: 'POST',
        body: targetType,
      }),
      invalidatesTags: ['TargetTypes'],
    }),

    // DELETE /userTargetTypes/{id} - Delete a target type
    deleteTargetType: build.mutation<void, number>({
      query: (id) => ({
        url: `/userTargetTypes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TargetTypes'],
    }),
  }),
});

export const { useGetTargetTypesQuery, useCreateTargetTypeMutation, useDeleteTargetTypeMutation } = targetTypesApi;
