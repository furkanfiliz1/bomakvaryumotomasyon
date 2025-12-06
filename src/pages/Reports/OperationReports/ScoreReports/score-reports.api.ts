import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type { ScoreReportCompany, ScoreReportsFilters } from './score-reports.types';

// Extended interface for Score Reports data with server-side query support
interface ScoreReportsServerSideResult extends ServerSideQueryResult<ScoreReportCompany> {}

export const scoreReportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Score Reports data (Companies Integrator Transfer List)
    // Exact match with legacy endpoint: `/companies/integrator/transfer`
    getScoreReports: builder.query<ScoreReportsServerSideResult, ScoreReportsFilters>({
      query: (params) => ({
        url: '/companies/integrator/transfer',
        method: 'GET',
        params,
      }),
      // Transform response to match ServerSideQueryResult format
      transformResponse: (response: {
        Items: ScoreReportCompany[];
        TotalCount: number;
      }): ScoreReportsServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
      }),
      // Keep data fresh for 30 seconds
      keepUnusedDataFor: 30,
    }),
  }),
});

// Export hooks for components - including lazy query for useServerSideQuery
export const { useGetScoreReportsQuery, useLazyGetScoreReportsQuery } = scoreReportsApi;
