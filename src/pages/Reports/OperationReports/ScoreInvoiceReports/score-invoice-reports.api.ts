import { baseApi, scoreBaseURL } from '@api';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type { ScoreInvoiceReportItem, ScoreInvoiceReportsFilters } from './score-invoice-reports.types';

// Extended interface for Score Invoice Reports data with server-side query support
interface ScoreInvoiceReportsServerSideResult extends ServerSideQueryResult<ScoreInvoiceReportItem> {}

export const scoreInvoiceReportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Score Invoice Reports data
    // Updated to use correct API endpoint: https://apiscoreqa.figopara.com/invoices/statusReport
    getScoreInvoiceReports: builder.query<
      ScoreInvoiceReportsServerSideResult,
      ServerSideQueryArgs & ScoreInvoiceReportsFilters
    >({
      query: (params) => ({
        url: `${scoreBaseURL}/invoices/statusReport`,
        method: 'GET',
        params,
      }),
      // Transform response to match ServerSideQueryResult format
      transformResponse: (response: {
        Items?: ScoreInvoiceReportItem[];
        Data?: ScoreInvoiceReportItem[];
        data?: ScoreInvoiceReportItem[];
        TotalCount?: number;
        page?: { totalCount?: number };
        ExtensionData?: string;
      }): ScoreInvoiceReportsServerSideResult => ({
        Items: response.Items || response.Data || response.data || [],
        TotalCount: response.TotalCount || response.page?.totalCount || 0,
        ExtensionData: response.ExtensionData,
      }),
      // Keep data fresh for 30 seconds
      keepUnusedDataFor: 30,
    }),
  }),
});

// Export hooks for components - including lazy query for useServerSideQuery
export const { useGetScoreInvoiceReportsQuery, useLazyGetScoreInvoiceReportsQuery } = scoreInvoiceReportsApi;
