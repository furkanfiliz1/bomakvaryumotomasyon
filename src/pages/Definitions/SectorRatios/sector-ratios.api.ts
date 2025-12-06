/**
 * Sector Ratios API
 * RTK Query endpoints for ratio tallies management
 * Matches legacy API exactly: https://apiscoretest.figopara.com/ratios, /ratiotallies
 */

import { baseApi, scoreBaseURL } from '@api';
import type {
  CreateRatioTallyRequest,
  CreateRatioTallyResponse,
  DeleteRatioTallyResponse,
  GetRatioTalliesResponse,
  GetRatiosResponse,
  Ratio,
  RatioTally,
  UpdateRatioTallyRequest,
  UpdateRatioTallyResponse,
} from './sector-ratios.types';

export const sectorRatiosApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /ratios - Get all ratio definitions
     * Used to populate the ratio dropdown in add/edit forms
     */
    getSectorRatios: build.query<Ratio[], void>({
      query: () => ({
        url: `${scoreBaseURL}/ratios`,
        method: 'GET',
      }),
      transformResponse: (response: GetRatiosResponse): Ratio[] => {
        return response.data || [];
      },
    }),

    /**
     * GET /ratiotallies - Get all ratio tallies (paginated)
     * Returns all sector-ratio mappings with point, min, max values
     */
    getRatioTallies: build.query<RatioTally[], void>({
      query: () => ({
        url: `${scoreBaseURL}/ratiotallies`,
        method: 'GET',
        params: {
          page: 1,
          pageSize: 2000, // Get all records like legacy
          isExport: false,
        },
      }),
      transformResponse: (response: GetRatioTalliesResponse): RatioTally[] => {
        return response.data || [];
      },
    }),

    /**
     * POST /ratiotallies - Create new ratio tally
     */
    createRatioTally: build.mutation<CreateRatioTallyResponse, CreateRatioTallyRequest>({
      query: (payload) => ({
        url: `${scoreBaseURL}/ratiotallies`,
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * PUT /ratiotallies/{id} - Update existing ratio tally
     */
    updateRatioTally: build.mutation<UpdateRatioTallyResponse, UpdateRatioTallyRequest>({
      query: (payload) => ({
        url: `${scoreBaseURL}/ratiotallies/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    /**
     * DELETE /ratiotallies/{id} - Delete ratio tally
     */
    deleteRatioTally: build.mutation<DeleteRatioTallyResponse, number>({
      query: (id) => ({
        url: `${scoreBaseURL}/ratiotallies/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSectorRatiosQuery,
  useLazyGetSectorRatiosQuery,
  useGetRatioTalliesQuery,
  useLazyGetRatioTalliesQuery,
  useCreateRatioTallyMutation,
  useUpdateRatioTallyMutation,
  useDeleteRatioTallyMutation,
} = sectorRatiosApi;
