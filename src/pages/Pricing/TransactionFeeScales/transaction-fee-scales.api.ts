import { baseApi } from '@api';
import {
  TransactionFeeScale,
  CreateTransactionFeeScaleRequest,
  UpdateTransactionFeeScaleRequest,
  TransactionFeeScaleFilters,
} from './transaction-fee-scales.types';

/**
 * RTK Query API slice for Transaction Fee Scales
 * Matches legacy endpoints exactly
 */
const transactionFeeScalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all transaction fee scales - matches _getTransactionFeeRates()
    getTransactionFeeScales: builder.query<TransactionFeeScale[], TransactionFeeScaleFilters>({
      query: (params = {}) => ({
        url: '/transactionFeeRates/getAll',
        method: 'GET',
        params,
      }),
      keepUnusedDataFor: 0, // No caching
    }),

    // Get single transaction fee scale by ID - matches _getTransactionFeeRate(id)
    getTransactionFeeScaleById: builder.query<TransactionFeeScale, number>({
      query: (id) => ({
        url: `/transactionFeeRates/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0, // No caching
    }),

    // Create new transaction fee scale - matches _postTransactionFeeRate(data)
    createTransactionFeeScale: builder.mutation<{ IsSuccess: boolean }, CreateTransactionFeeScaleRequest>({
      query: (scale) => ({
        url: '/transactionFeeRates',
        method: 'POST',
        body: scale,
      }),
    }),

    // Update transaction fee scale - matches _putTransactionFeeRate(data, id)
    updateTransactionFeeScale: builder.mutation<
      { IsSuccess: boolean },
      { id: number; data: UpdateTransactionFeeScaleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/transactionFeeRates/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete transaction fee scale - matches _deleteTransactionFeeRate(id)
    deleteTransactionFeeScale: builder.mutation<{ IsSuccess: boolean }, number>({
      query: (id) => ({
        url: `/transactionFeeRates/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTransactionFeeScalesQuery,
  useLazyGetTransactionFeeScalesQuery,
  useGetTransactionFeeScaleByIdQuery,
  useCreateTransactionFeeScaleMutation,
  useUpdateTransactionFeeScaleMutation,
  useDeleteTransactionFeeScaleMutation,
} = transactionFeeScalesApi;
