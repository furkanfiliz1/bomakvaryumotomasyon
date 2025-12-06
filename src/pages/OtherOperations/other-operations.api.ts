import { baseApi } from '@api';
import { CompanyActivityType } from './other-operations.types';
import type {
  LimitToPassiveRequest,
  LimitToPassiveResponse,
  FinancerCompany,
  ProductType,
  SpotLoanSearchRequest,
  SpotLoanSearchResponse,
  SpotLoanStatsRequest,
  SpotLoanStatsResponse,
  RevolvingLoanLimit,
  RevolvingLoanLimitsQuery,
  OtherOperationApiResponse,
} from './other-operations.types';

export const otherOperationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Limits to Passive Operations - Updated to match legacy API exactly
    setLimitsToPassive: build.mutation<LimitToPassiveResponse, LimitToPassiveRequest>({
      query: (data) => ({
        url: '/companies/limit/UpdateLimitsToPassive',
        method: 'PUT',
        body: data,
      }),
    }),

    // Get financer companies (type = 2) - matches legacy _getCompaniesOfType({type: 2})
    getFinancerCompanies: build.query<FinancerCompany[], void>({
      query: () => ({
        url: '/companies',
        method: 'GET',
        params: { type: 2 },
      }),
    }),

    // Get product types - matches legacy _getProductTypes()
    getProductTypes: build.query<ProductType[], void>({
      query: () => '/types?EnumName=ProductTypes',
    }),

    // Search companies for limits to passive - company search for async autocomplete
    searchCompaniesForLimitsToPassive: build.query<
      Array<{ Id: number; CompanyName: string; Identifier: string; label: string; value: string }>,
      { CompanyNameOrIdentifier?: string; CompanyActivityType: CompanyActivityType }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        params,
      }),
      transformResponse: (response: { Items: Array<{ Id: number; CompanyName: string; Identifier: string }> }) =>
        response.Items.map((item) => ({
          ...item,
          label: `${item.CompanyName ?? '-'} / ${item.Identifier ?? '-'}`,
          value: item.Identifier,
        })),
    }),

    // Search financer companies for limits to passive - financer search for async autocomplete
    searchFinancerCompaniesForLimitsToPassive: build.query<
      Array<{ Id: number; CompanyName: string; Identifier: string; label: string; value: number }>,
      { CompanyNameOrIdentifier?: string }
    >({
      query: (params) => ({
        url: '/companies/search',
        params: {
          ...params,
          type: 2, // Financer companies only
          Status: 1, // Active companies only
        },
      }),
      transformResponse: (response: { Items: Array<{ Id: number; CompanyName: string; Identifier: string }> }) =>
        response.Items.map((item) => ({
          ...item,
          label: `${item.CompanyName ?? '-'} / ${item.Identifier ?? '-'}`,
          value: item.Id, // Use Id for financers instead of Identifier
        })),
    }),

    // Supplier Query Operations - MOVED to supplier-query.api.ts

    // Spot Loan Limits - Legacy Parity Implementation
    postSpotLoanSearchLimit: build.mutation<SpotLoanSearchResponse, SpotLoanSearchRequest>({
      query: (data) => ({
        url: '/spotLoan/searchLimitForFiba',
        method: 'POST',
        body: data,
      }),
    }),

    getSpotLoanStats: build.query<SpotLoanStatsResponse, SpotLoanStatsRequest>({
      query: (params) => ({
        url: '/companyExtarnalFinancerLimit/summary',
        method: 'GET',
        params,
      }),
    }),

    // Revolving Loan Limits
    getRevolvingLoanLimits: build.query<OtherOperationApiResponse<RevolvingLoanLimit[]>, RevolvingLoanLimitsQuery>({
      query: (params) => ({
        url: '/other-operations/revolving-loan-limits',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useSetLimitsToPassiveMutation,
  useGetFinancerCompaniesQuery,
  useGetProductTypesQuery,
  useLazySearchCompaniesForLimitsToPassiveQuery,
  useLazySearchFinancerCompaniesForLimitsToPassiveQuery,

  usePostSpotLoanSearchLimitMutation,
  useGetSpotLoanStatsQuery,
  useLazyGetSpotLoanStatsQuery,
  useGetRevolvingLoanLimitsQuery,
  useLazyGetRevolvingLoanLimitsQuery,
} = otherOperationsApi;

// TTK Limit Query API is exported separately from its own module
export * from './TtkLimitQuery/ttk-limit-query.api';
