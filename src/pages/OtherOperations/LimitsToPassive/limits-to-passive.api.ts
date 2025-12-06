import { baseApi } from '@api';
// import type { LimitsToPassiveRequest, LimitsToPassiveResponse } from './limits-to-passive.types';

export const limitsToPassiveApi = baseApi.injectEndpoints({
  endpoints: () => ({
    // Add API endpoints for limits to passive operations when needed
    // Example:
    // setLimitsToPassive: builder.mutation<LimitsToPassiveResponse, LimitsToPassiveRequest>({
    //   query: (data) => ({
    //     url: '/limits/set-passive',
    //     method: 'POST',
    //     body: data,
    //   }),
    // }),
  }),
});

// Export hooks for the endpoints
// export const { useSetLimitsToPassiveMutation } = limitsToPassiveApi;
