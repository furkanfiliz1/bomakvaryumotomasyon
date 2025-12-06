import { analysisApi } from 'src/api/analysisApi';
import type {
  CreateInvoiceScoreMetricRequest,
  InvoiceScoreMetric,
  UpdateInvoiceScoreMetricRequest,
} from './invoice-score-ratios.types';

export const invoiceScoreRatiosApi = analysisApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /invoice/ScoreMetrics - Get all score metrics
    getInvoiceScoreMetrics: build.query<InvoiceScoreMetric[], void>({
      query: () => ({
        url: '/invoice/ScoreMetrics',
        method: 'GET',
      }),
    }),

    // POST /invoice/ScoreMetrics - Create new score metric definition
    createInvoiceScoreMetric: build.mutation<{ Success: boolean; Id?: number }, CreateInvoiceScoreMetricRequest>({
      query: (data) => ({
        url: '/invoice/ScoreMetrics',
        method: 'POST',
        body: data,
      }),
    }),

    // PUT /invoice/ScoreMetrics - Update score metric definition
    updateInvoiceScoreMetric: build.mutation<{ Success: boolean }, UpdateInvoiceScoreMetricRequest>({
      query: (data) => ({
        url: `/invoice/ScoreMetrics/${data.Id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE /invoice/ScoreMetrics/{id} - Delete score metric definition
    deleteInvoiceScoreMetric: build.mutation<{ Success: boolean }, number>({
      query: (id) => ({
        url: `/invoice/ScoreMetrics/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetInvoiceScoreMetricsQuery,
  useLazyGetInvoiceScoreMetricsQuery,
  useCreateInvoiceScoreMetricMutation,
  useUpdateInvoiceScoreMetricMutation,
  useDeleteInvoiceScoreMetricMutation,
} = invoiceScoreRatiosApi;
