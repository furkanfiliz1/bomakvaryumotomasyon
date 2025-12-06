import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  BulkUpdateRequest,
  BulkUpdateResponse,
  CompanySearchItem,
  CompanySearchResponse,
  Currency,
  DeleteInvoicesResponse,
  InvoiceHistory,
  InvoiceItem,
  InvoiceSearchRequest,
  InvoiceSearchResponse,
  InvoiceSourceType,
  InvoiceUpdateRequest,
  ProfileType,
} from './invoice-operations.types';

export const invoiceOperationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Main invoice search endpoint - matches the provided API structure
    getInvoices: builder.query<ServerSideQueryResult<InvoiceItem>, InvoiceSearchRequest>({
      query: (params) => ({
        url: '/invoices/search',
        params,
      }),
      transformResponse: (response: InvoiceSearchResponse): ServerSideQueryResult<InvoiceItem> => ({
        Items: response.Invoices || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData || null,
      }),
    }),

    // Company search for seller/buyer filters
    searchCompanies: builder.query<
      CompanySearchItem[],
      {
        CompanyNameOrIdentifier: string;
        CompanyActivityType?: number;
        GroupedCompanyId?: number;
      }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        params,
      }),
    }),

    // Dedicated seller search endpoint
    searchSellersForInvoice: builder.query<
      CompanySearchResponse,
      {
        CompanyNameOrIdentifier: string;
        CompanyActivityType?: number;
      }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        params: {
          ...params,
          CompanyActivityType: 2, // Force seller activity type
        },
      }),
    }),

    // Invoice source types for filter dropdown
    getInvoiceSourceTypes: builder.query<InvoiceSourceType[], void>({
      query: () => ({
        url: '/types?EnumName=SourceTypes',
      }),
    }),

    // Currencies for filter dropdown
    getCurrencies: builder.query<Currency[], void>({
      query: () => ({
        url: '/currencies',
      }),
    }),

    // Profile types for invoice editing
    getProfileTypes: builder.query<ProfileType[], void>({
      query: () => ({
        url: '/types?EnumName=ProfileTypes',
      }),
    }),

    // Buyer list for filter dropdown - returns direct array
    getBuyersByActivityType: builder.query<CompanySearchItem[], { page?: number }>({
      query: (params = {}) => ({
        url: '/companies/activityType/1',
        params,
      }),
    }),

    // Export invoices to Excel
    exportInvoicesToExcel: builder.query<{ ExtensionData: string }, InvoiceSearchRequest & { isExport: true }>({
      query: (params) => ({
        url: '/invoices/search',
        params: { ...params, isExport: true },
      }),
    }),

    // Delete invoices - for bulk operations
    deleteInvoices: builder.mutation<DeleteInvoicesResponse, number[]>({
      query: (ids) => ({
        url: '/invoices/deleteAll',
        method: 'POST',
        body: ids,
      }),
    }),

    // Get invoice detail by ID
    getInvoiceDetail: builder.query<InvoiceItem, number>({
      query: (id) => ({
        url: `/invoices/${id}`,
      }),
    }),

    // Get invoice histories by ID
    getInvoiceHistories: builder.query<InvoiceHistory[], number>({
      query: (id) => ({
        url: `/invoices/${id}/histories`,
      }),
    }),

    // Update single invoice
    updateInvoice: builder.mutation<InvoiceItem, { id: number; data: InvoiceUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Bulk update invoices
    bulkUpdateInvoices: builder.mutation<BulkUpdateResponse, BulkUpdateRequest>({
      query: (data) => ({
        url: '/invoices/bulkSet',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useLazyGetInvoicesQuery,
  useSearchCompaniesQuery,
  useLazySearchCompaniesQuery,
  useSearchSellersForInvoiceQuery,
  useLazySearchSellersForInvoiceQuery,
  useGetInvoiceSourceTypesQuery,
  useGetCurrenciesQuery,
  useGetProfileTypesQuery,
  useGetBuyersByActivityTypeQuery,
  useLazyExportInvoicesToExcelQuery,
  useDeleteInvoicesMutation,
  useGetInvoiceDetailQuery,
  useGetInvoiceHistoriesQuery,
  useUpdateInvoiceMutation,
  useBulkUpdateInvoicesMutation,
} = invoiceOperationsApi;
