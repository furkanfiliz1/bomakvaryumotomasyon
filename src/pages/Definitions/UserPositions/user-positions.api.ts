import { baseApi } from '@api';
import type {
  CreateUserPositionRequest,
  UpdateUserPositionRequest,
  UserPosition,
  UserPositionsListResponse,
} from './user-positions.types';

/**
 * User Positions API
 * RTK Query endpoints for user position CRUD operations
 * Following OperationPricing pattern exactly
 */
export const userPositionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /userPositions - Fetch all user positions
    getUserPositions: build.query<UserPositionsListResponse, void>({
      query: () => ({
        url: '/userPositions',
        method: 'GET',
      }),
      providesTags: ['UserPositions'],
    }),

    // POST /userPositions - Create a new user position
    createUserPosition: build.mutation<UserPosition, CreateUserPositionRequest>({
      query: (position) => ({
        url: '/userPositions',
        method: 'POST',
        body: position,
      }),
      invalidatesTags: ['UserPositions'],
    }),

    // PUT /userPositions/{id} - Update an existing user position
    updateUserPosition: build.mutation<void, UpdateUserPositionRequest>({
      query: ({ Id, ...position }) => ({
        url: `/userPositions/${Id}`,
        method: 'PUT',
        body: { Id, ...position },
      }),
      invalidatesTags: ['UserPositions'],
    }),

    // DELETE /userPositions/{id} - Delete a user position
    deleteUserPosition: build.mutation<void, number>({
      query: (id) => ({
        url: `/userPositions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserPositions'],
    }),
  }),
});

export const {
  useGetUserPositionsQuery,
  useCreateUserPositionMutation,
  useUpdateUserPositionMutation,
  useDeleteUserPositionMutation,
} = userPositionsApi;
