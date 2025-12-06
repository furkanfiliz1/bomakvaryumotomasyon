import { baseApi } from '@api';
import type {
  SpotLoanLimitsRequest,
  SpotLoanLimitsResponse,
  SpotLoanLimitsStatsResponse,
} from './spot-loan-limits.types';

export const spotLoanLimitsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Search Spot Loan limit for company/person - matches legacy _postSpotLoanSearchLimitForFiba
    searchSpotLoanLimit: build.mutation<SpotLoanLimitsResponse, SpotLoanLimitsRequest>({
      query: (data) => ({
        url: '/spotLoan/searchLimitForFiba',
        method: 'POST',
        body: data,
      }),
    }),

    // Get Spot Loan limit search stats - matches legacy _getLimitSearchStats with productType: "SpotLoan"
    getSpotLoanLimitsStats: build.query<SpotLoanLimitsStatsResponse, void>({
      query: () => ({
        url: '/companyExtarnalFinancerLimit/summary',
        method: 'GET',
        params: {
          productType: 'SpotLoan',
        },
      }),
    }),
  }),
});

export const { useSearchSpotLoanLimitMutation, useGetSpotLoanLimitsStatsQuery, useLazyGetSpotLoanLimitsStatsQuery } =
  spotLoanLimitsApi;
