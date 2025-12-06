import { baseApi } from 'src/api/baseApi';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  CreateRepresentativeTargetPayload,
  RepresentativeTargetItem,
  RepresentativeTargetQueryParams,
  RepresentativeTargetResponse,
  UserTargetType,
} from './representative-target-entry.types';

export const representativeTargetEntryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get representative targets list - GET /userSaleTargets/search
    getRepresentativeTargets: build.query<
      ServerSideQueryResult<RepresentativeTargetItem>,
      RepresentativeTargetQueryParams
    >({
      query: (params) => ({
        url: '/userSaleTargets/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: RepresentativeTargetResponse): ServerSideQueryResult<RepresentativeTargetItem> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Create representative target - POST /userSaleTargets
    createRepresentativeTarget: build.mutation<void, CreateRepresentativeTargetPayload>({
      query: (payload) => ({
        url: '/userSaleTargets',
        method: 'POST',
        body: payload,
      }),
    }),

    // Delete representative target - DELETE /userSaleTargets/{id}
    deleteRepresentativeTarget: build.mutation<void, number>({
      query: (id) => ({
        url: `/userSaleTargets/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get user target types - GET /userTargetTypes
    getUserTargetTypes: build.query<UserTargetType[], void>({
      query: () => ({
        url: '/userTargetTypes',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetRepresentativeTargetsQuery,
  useLazyGetRepresentativeTargetsQuery,
  useCreateRepresentativeTargetMutation,
  useDeleteRepresentativeTargetMutation,
  useGetUserTargetTypesQuery,
} = representativeTargetEntryApi;
