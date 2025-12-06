/**
 * Integrator Reconciliation Charts API
 * Following OperationPricing patterns and RTK Query conventions
 */

import { baseApi } from '@api';
import type { CreateIntegratorChartRequest, IntegratorChartsResponse } from './integrator-reconciliation-charts.types';

export const integratorReconciliationChartsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /integrators/commission/search - List all integrator charts
    getIntegratorCharts: build.query<IntegratorChartsResponse, void>({
      query: () => ({
        url: '/integrators/commission/search',
        method: 'GET',
      }),
    }),

    // POST /integrators/commission - Create new integrator chart
    createIntegratorChart: build.mutation<void, CreateIntegratorChartRequest>({
      query: (chartData) => ({
        url: '/integrators/commission',
        method: 'POST',
        body: chartData,
      }),
    }),

    // DELETE /integrators/commission/:id - Delete integrator chart
    deleteIntegratorChart: build.mutation<void, number>({
      query: (id) => ({
        url: `/integrators/commission/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetIntegratorChartsQuery,
  useLazyGetIntegratorChartsQuery,
  useCreateIntegratorChartMutation,
  useDeleteIntegratorChartMutation,
} = integratorReconciliationChartsApi;
