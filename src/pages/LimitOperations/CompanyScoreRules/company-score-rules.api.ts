// Company Score Rules API - Following OperationPricing RTK Query pattern exactly

import { baseApi } from '@api';
import type {
  CompanyScoreRule,
  CreateRuleRequest,
  FinanceCompany,
  FinanceCompanyRule,
  GetRulesRequest,
  UpdateFinanceCompaniesRequest,
  UpdateRuleRequest,
} from './company-score-rules.types';

export const companyScoreRulesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get company rules by parameters
    getCompanyRules: build.query<CompanyScoreRule[], GetRulesRequest & { companyId: number }>({
      query: ({ companyId, ...params }) => ({
        url: `/companies/${companyId}/definitions`,
        params,
      }),
    }),

    // Create new rule - matches legacy _postRules exactly
    createCompanyRule: build.mutation<void, CreateRuleRequest & { companyId: number }>({
      query: ({ companyId, ...body }) => ({
        url: `/companies/${companyId}/definitions`,
        method: 'POST',
        body,
      }),
    }),

    // Update existing rule - matches legacy _putRules exactly
    updateCompanyRule: build.mutation<void, UpdateRuleRequest & { companyId: number; ruleId: number }>({
      query: ({ companyId, ruleId, ...body }) => ({
        url: `/companies/${companyId}/definitions/${ruleId}`,
        method: 'PUT',
        body,
      }),
    }),

    // Get finance companies (type=2)
    getFinanceCompanies: build.query<FinanceCompany[], void>({
      query: () => ({
        url: '/companies',
        params: { type: 2 },
      }),
      transformResponse: (response: FinanceCompany[]) => {
        const sortedResponse = [...response];
        sortedResponse.sort((a, b) => a.CompanyName.localeCompare(b.CompanyName));
        return sortedResponse;
      },
    }),

    // Get company rule details (selected financers)
    getCompanyRuleDetails: build.query<FinanceCompanyRule[], { companyId: number; ruleId: number }>({
      query: ({ companyId, ruleId }) => ({
        url: `/companies/${companyId}/definitions/${ruleId}/details`,
      }),
    }),

    // Update rule financers - matches legacy _putRulesFinancer exactly
    updateRuleFinancers: build.mutation<
      void,
      { companyId: number; definitionId: number; financers: UpdateFinanceCompaniesRequest[] }
    >({
      query: ({ companyId, definitionId, financers }) => ({
        url: `/companies/${companyId}/definitions/${definitionId}/details`,
        method: 'PUT',
        body: financers,
      }),
    }),
  }),
});

export const {
  useGetCompanyRulesQuery,
  useLazyGetCompanyRulesQuery,
  useCreateCompanyRuleMutation,
  useUpdateCompanyRuleMutation,
  useGetFinanceCompaniesQuery,
  useGetCompanyRuleDetailsQuery,
  useLazyGetCompanyRuleDetailsQuery,
  useUpdateRuleFinancersMutation,
} = companyScoreRulesApi;
