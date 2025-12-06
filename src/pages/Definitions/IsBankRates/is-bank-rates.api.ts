/**
 * İş Bankası Oranları (Is Bank Rates) API Endpoints
 * RTK Query endpoints for /currencies CRUD operations
 */

import { baseApi } from '@api';
import type { CreateIsBankRateRequest, IsBankRateItem, UpdateIsBankRateRequest } from './is-bank-rates.types';

const isBankRatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /currencies/monthlyAverage
     * Fetches all İş Bankası rates
     */
    getIsBankRatesList: builder.query<IsBankRateItem[], void>({
      query: () => '/currencies/monthlyAverage',
    }),

    /**
     * POST /currencies
     * Creates a new İş Bankası rate
     */
    createIsBankRate: builder.mutation<void, CreateIsBankRateRequest>({
      query: (body) => ({
        url: '/currencies',
        method: 'POST',
        body,
      }),
    }),

    /**
     * PUT /currencies/{id}
     * Updates an existing İş Bankası rate
     */
    updateIsBankRate: builder.mutation<void, UpdateIsBankRateRequest>({
      query: ({ Id, ...body }) => ({
        url: `/currencies/${Id}`,
        method: 'PUT',
        body: { Id, ...body },
      }),
    }),

    /**
     * DELETE /currencies/{id}
     * Deletes an İş Bankası rate
     */
    deleteIsBankRate: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/currencies/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIsBankRatesListQuery,
  useLazyGetIsBankRatesListQuery,
  useCreateIsBankRateMutation,
  useUpdateIsBankRateMutation,
  useDeleteIsBankRateMutation,
} = isBankRatesApi;
