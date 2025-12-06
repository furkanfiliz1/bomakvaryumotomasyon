import { baseApi, baseURL } from '@api';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  ScoreInvoiceTransferReportItem,
  ScoreInvoiceTransferReportsFilters,
  ScoreInvoiceTransferReportsResponse,
} from './score-invoice-transfer-reports.types';

// Extended interface for Score Invoice Transfer Reports data with server-side query support
interface ScoreInvoiceTransferReportsServerSideResult extends ServerSideQueryResult<ScoreInvoiceTransferReportItem> {}

export const scoreInvoiceTransferReportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Score Invoice Transfer Reports data
    // Matches legacy ScoreInvoiceTransferReport.js endpoint exactly
    getScoreInvoiceTransferReports: builder.query<
      ScoreInvoiceTransferReportsServerSideResult,
      ServerSideQueryArgs & ScoreInvoiceTransferReportsFilters
    >({
      query: (params) => ({
        url: `${baseURL}/companies/integrator/transfer`,
        method: 'GET',
        params,
      }),
      // Transform response to match ServerSideQueryResult format
      transformResponse: (
        response: ScoreInvoiceTransferReportsResponse,
      ): ScoreInvoiceTransferReportsServerSideResult => ({
        Items: response.Items || response.Data || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData,
      }),
      // Keep data fresh for 30 seconds - following ScoreInvoiceReports pattern
      keepUnusedDataFor: 30,
    }),
  }),
});

// Export hooks for components - including lazy query for useServerSideQuery
export const { useGetScoreInvoiceTransferReportsQuery, useLazyGetScoreInvoiceTransferReportsQuery } =
  scoreInvoiceTransferReportsApi;
