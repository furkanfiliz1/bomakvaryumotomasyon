/**
 * Company Score Tab API
 * Following OperationPricing pattern for API integration
 */

import { analysisBaseURL, baseApi } from '@api';

import type { CompanyFigoScoreData, FinancialAnalysisData, LoanDecisionType } from './company-score-tab.types';

export const companyScoreTabApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Company Figo Score Information - returns data directly without wrapper
    getCompanyFigoScore: builder.query<CompanyFigoScoreData, { companyId: string | number }>({
      query: ({ companyId }) => ({
        url: `/companies/companyFigoScore/${companyId}`,
        method: 'GET',
      }),
    }),

    // Get Financial Analysis Data from Analysis API - returns array of data directly without wrapper
    getFinancialAnalysis: builder.query<FinancialAnalysisData, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `${analysisBaseURL}/eledger/score/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get Loan Decision Types - returns array directly
    getLoanDecisionTypes: builder.query<LoanDecisionType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'LoanDecisionType' },
      }),
      // Transform response to extract just the array
      transformResponse: (response: LoanDecisionType[]) => response || [],
    }),
  }),
});

// Export hooks following RTK Query convention
export const {
  useGetCompanyFigoScoreQuery,
  useLazyGetCompanyFigoScoreQuery,
  useGetFinancialAnalysisQuery,
  useLazyGetFinancialAnalysisQuery,
  useGetLoanDecisionTypesQuery,
  useLazyGetLoanDecisionTypesQuery,
} = companyScoreTabApi;

// Export for use in other modules
export default companyScoreTabApi;
