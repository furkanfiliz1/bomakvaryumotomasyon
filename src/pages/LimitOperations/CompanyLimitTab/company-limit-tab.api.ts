/**
 * Company Limit Tab API
 * Following OperationPricing pattern with RTK Query
 * Contains only GET services as the first implementation step
 */

import { baseApi } from '@api';
import type {
  AllowanceInvoiceRisksParams,
  AllowanceInvoiceRisksResponse,
  AllowanceRisk,
  AllowanceRisksParams,
  CompaniesLimitResponse,
  CompanyLimitInfo,
  EnumOption,
  FinancerCompaniesParams,
  FinancerCompaniesResponse,
  GuarantorCompanyListResponse,
  GuarantorLimitCreateRequest,
  GuarantorLimitUpdateRequest,
  NonGuarantorCompanyListItem,
  NonGuarantorCompanyListResponse,
  NonGuarantorLimitCreateRequest,
  NonGuarantorLimitUpdateRequest,
  PeakLimitCreateRequest,
  PeakLimitUpdateRequest,
} from './company-limit-tab.types';

export const companyLimitTabApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // GET Services - First Step Implementation

    // Get guarantor company limit list - matches legacy _getGuaratorCompanyList
    getGuarantorCompanyList: build.query<GuarantorCompanyListResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/limit/details/${companyId}/financersV1`,
        method: 'GET',
      }),
    }),

    // Get non-guarantor company limit list - matches legacy _getNonGuaratorCompanyList
    getNonGuarantorCompanyList: build.query<NonGuarantorCompanyListResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/limit/financer/withoutGuarantor/${companyId}`,
        method: 'GET',
      }),
    }),

    // Get companies limit - matches legacy _getCompaniesLimit
    getCompaniesLimit: build.query<CompaniesLimitResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: '/companies/limit',
        method: 'GET',
        params: { identifier },
      }),
    }),

    // Get loan decision types - matches legacy _getLoanDecisionType
    getLoanDecisionTypes: build.query<EnumOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'LoanDecisionType' },
      }),
    }),

    // Get limit reject reason types - matches legacy _getLimitRejectReasons
    getLimitRejectReasonTypes: build.query<EnumOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'LimitRejectReasonTypes' },
      }),
    }),

    // Get product types - matches legacy _getProductTypes
    getProductTypes: build.query<EnumOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'ProductTypes' },
      }),
    }),

    // Get activity types - matches legacy _getActivityTypes
    getActivityTypes: build.query<EnumOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'ActivityType' },
      }),
    }),

    // Get financer companies (type = 2) - matches legacy getCompanyList with type: 2
    getFinancerCompanies: build.query<FinancerCompaniesResponse, FinancerCompaniesParams>({
      query: (params = {}) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 100,
          ...params,
        },
      }),
    }),

    // PUT/POST endpoints - matches legacy _putCompanyLimit and _postCompanyLimit
    updateCompanyLimit: build.mutation<void, Partial<CompanyLimitInfo>>({
      query: (companyLimit: Partial<CompanyLimitInfo>) => ({
        url: `/companies/limit/${companyLimit.Id}`, // Legacy format: /companies/limit/${data.Id}
        method: 'PUT',
        body: companyLimit,
      }),
    }),

    createCompanyLimit: build.mutation<void, Partial<CompanyLimitInfo>>({
      query: (companyLimit: Partial<CompanyLimitInfo>) => ({
        url: '/companies/limit',
        method: 'POST',
        body: companyLimit,
      }),
    }),

    // Roof Limit (Peak Limit) endpoints - matches legacy _postPeakLimit, _putPeakLimitDetail, _deletePeakLimitDetail
    createPeakLimit: build.mutation<void, PeakLimitCreateRequest>({
      query: (peakLimitData: PeakLimitCreateRequest) => ({
        url: '/companies/limit/peak',
        method: 'POST',
        body: peakLimitData,
      }),
    }),

    updatePeakLimitDetail: build.mutation<void, { id: number; data: PeakLimitUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/companies/limit/peak/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    deletePeakLimitDetail: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/companies/limit/peak/${id}`,
        method: 'DELETE',
      }),
    }),

    // Guarantor Limit mutations
    createGuarantorLimit: build.mutation<void, GuarantorLimitCreateRequest>({
      query: (guarantorLimitData: GuarantorLimitCreateRequest) => ({
        url: '/companies/limit/details/v1',
        method: 'POST',
        body: guarantorLimitData,
      }),
    }),

    updateGuarantorLimitDetail: build.mutation<void, { id: number; data: GuarantorLimitUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/companies/limit/details/${id}/v1`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteGuarantorLimitDetail: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/companies/limit/details/${id}`,
        method: 'DELETE',
      }),
    }),

    // Non-Guarantor Limit mutations - matches legacy _postNonGuarantorLimit, _putNonGuarantorLimitListUpdate, _deleteNonGuarantorLimitListUpdate
    createNonGuarantorLimit: build.mutation<void, NonGuarantorLimitCreateRequest>({
      query: (nonGuarantorLimitData: NonGuarantorLimitCreateRequest) => ({
        url: '/companies/limit/financer/withoutGuarantor',
        method: 'POST',
        body: nonGuarantorLimitData,
      }),
    }),

    updateNonGuarantorLimit: build.mutation<void, { id: number; data: NonGuarantorLimitUpdateRequest }>({
      query: ({ data }) => ({
        url: `/companies/limit/financer/withoutGuarantor`,
        method: 'PUT',
        body: data,
      }),
    }),

    deleteNonGuarantorLimit: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/companies/limit/financer/withoutGuarantor/${id}`,
        method: 'DELETE',
      }),
    }),

    // Risks Allowance Modal API endpoints - matches legacy RisksAllowanceModal.js

    // Get allowance risks - matches legacy _getAllowanceRisks
    getAllowanceRisks: build.query<AllowanceRisk[], AllowanceRisksParams>({
      query: (params) => ({
        url: '/allowances/riskAllowances',
        method: 'GET',
        params,
      }),
    }),

    // Get allowance risks for bills - matches legacy _getAllowanceRisksBills
    getAllowanceRisksBills: build.query<AllowanceRisk[], AllowanceRisksParams>({
      query: (params) => ({
        url: '/allowances/riskAllowancesForBill',
        method: 'GET',
        params,
      }),
    }),

    // Get allowance invoice risks - matches legacy _getAllowanceInvoicesRisks
    getAllowanceInvoiceRisks: build.query<AllowanceInvoiceRisksResponse, AllowanceInvoiceRisksParams>({
      query: (params) => ({
        url: '/allowances/riskAllowanceInvoices',
        method: 'GET',
        params,
      }),
    }),

    // Get allowance invoice risks for bills - matches legacy _getAllowanceInvoicesRisksBills
    getAllowanceInvoiceRisksBills: build.query<AllowanceInvoiceRisksResponse, AllowanceInvoiceRisksParams>({
      query: (params) => ({
        url: '/allowances/riskAllowanceBills',
        method: 'GET',
        params,
      }),
    }),

    putFinancierLimit: build.mutation<
      NonGuarantorCompanyListItem[],
      { companyId: number; data?: Partial<CompanyLimitInfo> }
    >({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/financerlimit`,
        method: 'PUT',
        body: {},
      }),
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetGuarantorCompanyListQuery,
  useLazyGetGuarantorCompanyListQuery,
  useGetNonGuarantorCompanyListQuery,
  useLazyGetNonGuarantorCompanyListQuery,
  useGetCompaniesLimitQuery,
  useLazyGetCompaniesLimitQuery,
  useGetLoanDecisionTypesQuery,
  useLazyGetLoanDecisionTypesQuery,
  useGetLimitRejectReasonTypesQuery,
  useLazyGetLimitRejectReasonTypesQuery,
  useGetProductTypesQuery,
  useLazyGetProductTypesQuery,
  useGetActivityTypesQuery,
  useLazyGetActivityTypesQuery,
  useGetFinancerCompaniesQuery,
  useLazyGetFinancerCompaniesQuery,
  useUpdateCompanyLimitMutation,
  useCreateCompanyLimitMutation,
  useCreatePeakLimitMutation,
  useUpdatePeakLimitDetailMutation,
  useDeletePeakLimitDetailMutation,
  useCreateGuarantorLimitMutation,
  useUpdateGuarantorLimitDetailMutation,
  useDeleteGuarantorLimitDetailMutation,
  useCreateNonGuarantorLimitMutation,
  useUpdateNonGuarantorLimitMutation,
  useDeleteNonGuarantorLimitMutation,
  // Risks Allowance Modal hooks
  useGetAllowanceRisksQuery,
  useLazyGetAllowanceRisksQuery,
  useGetAllowanceRisksBillsQuery,
  useLazyGetAllowanceRisksBillsQuery,
  useGetAllowanceInvoiceRisksQuery,
  useLazyGetAllowanceInvoiceRisksQuery,
  useGetAllowanceInvoiceRisksBillsQuery,
  useLazyGetAllowanceInvoiceRisksBillsQuery,
} = companyLimitTabApi;
