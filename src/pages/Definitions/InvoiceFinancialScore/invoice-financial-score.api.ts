/**
 * Invoice Financial Score API
 * RTK Query endpoints for concentration metrics (financial score) management
 * Matches legacy API exactly: https://apiscoretest.figopara.com/concentrationmetrics
 */

import { baseApi, scoreBaseURL } from '@api';
import type {
  ConcentrationMetric,
  CreateConcentrationMetricPayload,
  GetConcentrationMetricsResponse,
  UpdateConcentrationMetricPayload,
} from './invoice-financial-score.types';

export const invoiceFinancialScoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /concentrationmetrics - List all concentration metrics
    getInvoiceFinancialScoreMetrics: build.query<ConcentrationMetric[], void>({
      query: () => ({
        url: `${scoreBaseURL}/concentrationmetrics`,
        method: 'GET',
      }),
      transformResponse: (response: GetConcentrationMetricsResponse): ConcentrationMetric[] => {
        return response.data || [];
      },
    }),

    // POST /concentrationmetrics - Create new concentration metric
    createInvoiceFinancialScoreMetric: build.mutation<void, CreateConcentrationMetricPayload>({
      query: (payload) => ({
        url: `${scoreBaseURL}/concentrationmetrics`,
        method: 'POST',
        body: payload,
      }),
    }),

    // PUT /concentrationmetrics/{id} - Update existing concentration metric
    updateInvoiceFinancialScoreMetric: build.mutation<void, UpdateConcentrationMetricPayload>({
      query: (payload) => ({
        url: `${scoreBaseURL}/concentrationmetrics/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // DELETE /concentrationmetrics/{id} - Delete concentration metric
    deleteInvoiceFinancialScoreMetric: build.mutation<void, number>({
      query: (id) => ({
        url: `${scoreBaseURL}/concentrationmetrics/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetInvoiceFinancialScoreMetricsQuery,
  useLazyGetInvoiceFinancialScoreMetricsQuery,
  useCreateInvoiceFinancialScoreMetricMutation,
  useUpdateInvoiceFinancialScoreMetricMutation,
  useDeleteInvoiceFinancialScoreMetricMutation,
} = invoiceFinancialScoreApi;
