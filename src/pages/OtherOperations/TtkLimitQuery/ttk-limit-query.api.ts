import { baseApi } from '@api';
import type { TtkLimitQueryRequest, TtkLimitQueryResponse, TtkLimitStatsResponse } from './ttk-limit-query.types';

export const ttkLimitQueryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Search TTK limit for company/person
    searchTtkLimit: build.mutation<TtkLimitQueryResponse, TtkLimitQueryRequest>({
      query: (data) => ({
        url: '/installmentCommercialLoan/searchLimitForFiba',
        method: 'POST',
        body: data,
      }),
    }),

    // Get TTK limit search stats
    getTtkLimitStats: build.query<TtkLimitStatsResponse, void>({
      query: () => ({
        url: '/companyExtarnalFinancerLimit/summary',
        method: 'GET',
        params: {
          productType: 'InstallmentCommercialLoan',
        },
      }),
    }),
  }),
});

export const { useSearchTtkLimitMutation, useGetTtkLimitStatsQuery, useLazyGetTtkLimitStatsQuery } = ttkLimitQueryApi;
