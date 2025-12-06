import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  AllowanceItem,
  BankOption,
  BranchOption,
  CheckReportItem,
  CheckReportQueryParams,
  CheckReportResponse,
  CheckUpdateRequest,
  CompanySearchResponse,
  DocumentDownloadResponse,
  DocumentItem,
  DocumentUploadRequest,
} from './check-report.types';

// Extended interface for check report data
interface CheckReportServerSideResult extends ServerSideQueryResult<CheckReportItem> {}

export const checkReportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get check report data - using the bills/search endpoint from legacy system
    getCheckReport: build.query<CheckReportServerSideResult, CheckReportQueryParams>({
      query: (params) => ({
        url: '/bills/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: CheckReportResponse): CheckReportServerSideResult => ({
        Items: response.Bills || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Get single check detail
    getCheckDetail: build.query<CheckReportItem, number>({
      query: (id) => ({
        url: `/bills/${id}`,
        method: 'GET',
      }),
    }),

    // Get check allowances
    getCheckAllowances: build.query<AllowanceItem[], number>({
      query: (id) => ({
        url: `/bills/${id}/allowances`,
        method: 'GET',
      }),
    }),

    // Get check documents
    getCheckDocuments: build.query<DocumentItem[], number>({
      query: (billId) => ({
        url: `/bills/${billId}/document`,
        method: 'GET',
      }),
    }),

    // Download check document - returns the download response with base64 data
    downloadCheckDocument: build.query<DocumentDownloadResponse, { billId: number; documentId: number }>({
      query: ({ billId, documentId }) => ({
        url: `/bills/${billId}/document/${documentId}`,
        method: 'GET',
      }),
    }),

    // Upload document to check
    uploadCheckDocument: build.mutation<void, { billId: number; data: DocumentUploadRequest }>({
      query: ({ billId, data }) => ({
        url: `/bills/${billId}/document`,
        method: 'POST',
        body: data,
      }),
    }),

    // Update existing document
    updateCheckDocument: build.mutation<void, { billId: number; documentId: number; data: DocumentUploadRequest }>({
      query: ({ billId, documentId, data }) => ({
        url: `/bills/${billId}/document/${documentId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Update check information
    updateCheck: build.mutation<void, CheckUpdateRequest>({
      query: (data) => ({
        url: `/bills/updateInfo/${data.id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete check
    deleteCheck: build.mutation<void, number>({
      query: (id) => ({
        url: `/bills/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get banks list for dropdown
    getBanks: build.query<BankOption[], void>({
      query: () => ({
        url: '/banks',
        method: 'GET',
      }),
    }),

    // Get bank branches for dropdown
    getBankBranchess: build.query<{ Items: BranchOption[] }, string>({
      query: (bankId) => ({
        url: '/banks/branch/search',
        method: 'GET',
        params: { BankId: bankId, pageSize: '99999999' },
      }),
      transformResponse: (response: { Items: BranchOption[] }) => response,
    }),

    // Get currencies for dropdown
    getCurrencies: build.query<{ Id: string; Name: string }[], void>({
      query: () => ({
        url: '/currencies',
        method: 'GET',
      }),
    }),

    // Search companies by name or identifier for async autocomplete
    searchCompaniesByNameOrIdentifier: build.query<
      CompanySearchResponse,
      { CompanyNameOrIdentifier: string; companyActivityType?: number }
    >({
      query: ({ CompanyNameOrIdentifier, companyActivityType = 2 }) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params: {
          CompanyNameOrIdentifier: CompanyNameOrIdentifier,
          CompanyActivityType: companyActivityType,
        },
      }),
    }),
  }),
});

export const {
  useGetCheckReportQuery,
  useLazyGetCheckReportQuery,
  useGetCheckDetailQuery,
  useGetCheckAllowancesQuery,
  useGetCheckDocumentsQuery,
  useLazyDownloadCheckDocumentQuery,
  useUploadCheckDocumentMutation,
  useUpdateCheckDocumentMutation,
  useUpdateCheckMutation,
  useDeleteCheckMutation,
  useGetBanksQuery,
  useGetBankBranchessQuery,
  useLazyGetBankBranchessQuery,
  useGetCurrenciesQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
} = checkReportApi;
