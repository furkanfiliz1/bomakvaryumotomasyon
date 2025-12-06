import { baseApi } from '@api';
import type { RevolvingLoanLimitsRequest, RevolvingLoanLimitsResponse } from './revolving-loan-limits.types';

export const revolvingLoanLimitsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Search Revolving Loan limit - matches legacy _searchLimitForRevolvingCredit
    searchRevolvingLoanLimit: build.mutation<RevolvingLoanLimitsResponse, RevolvingLoanLimitsRequest>({
      query: (data) => ({
        url: '/revolvingCredit/searchLimitForRevolvingCredit',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSearchRevolvingLoanLimitMutation } = revolvingLoanLimitsApi;
