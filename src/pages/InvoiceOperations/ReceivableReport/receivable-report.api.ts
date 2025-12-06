import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  BuyerListItem,
  CreateReceivableRequest,
  ReceivableHistoryItem,
  ReceivableReportItem,
  ReceivableReportQueryParams,
  ReceivableReportResponse,
} from './receivable-report.types';

// Extended interface for receivable report data with server-side query result
interface ReceivableReportServerSideResult extends ServerSideQueryResult<ReceivableReportItem> {
  // Add any additional fields from the API response if needed
}

export const receivableReportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get receivable report data using the orders/search endpoint
    getReceivableReport: build.query<ReceivableReportServerSideResult, ReceivableReportQueryParams>({
      query: (params) => ({
        url: '/orders/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: ReceivableReportResponse): ReceivableReportServerSideResult => ({
        Items: response.Orders || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Export receivable report to Excel
    exportReceivableReport: build.query<ReceivableReportServerSideResult, ReceivableReportQueryParams>({
      query: (params) => ({
        url: '/orders/search',
        method: 'GET',
        params: {
          ...params,
          IsExport: true, // Flag to indicate Excel export request
        },
      }),
      transformResponse: (response: ReceivableReportResponse): ReceivableReportServerSideResult => ({
        Items: response.Orders || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Get single receivable report detail by ID
    getReceivableReportDetail: build.query<ReceivableReportItem, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
    }),

    // Get receivable history for a specific order
    getReceivableHistory: build.query<ReceivableHistoryItem[], number>({
      query: (id) => ({
        url: `/orders/${id}/allowancesHistory`,
        method: 'GET',
      }),
    }),

    // Create new receivable order
    createReceivable: build.mutation<ReceivableReportItem, CreateReceivableRequest>({
      query: (payload) => ({
        url: '/orders',
        method: 'POST',
        body: payload,
      }),
    }),

    // Update existing receivable order
    updateReceivable: build.mutation<ReceivableReportItem, CreateReceivableRequest>({
      query: (payload) => ({
        url: `/orders/${payload.Id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // Get buyer list for dropdown (companies with activity type 1)
    getBuyerListForReceivableReport: build.query<BuyerListItem[], void>({
      query: () => ({
        url: '/companies/activityType/1',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetReceivableReportQuery,
  useLazyGetReceivableReportQuery,
  useLazyExportReceivableReportQuery,
  useGetReceivableReportDetailQuery,
  useGetReceivableHistoryQuery,
  useCreateReceivableMutation,
  useUpdateReceivableMutation,
  useGetBuyerListForReceivableReportQuery
} = receivableReportApi;
