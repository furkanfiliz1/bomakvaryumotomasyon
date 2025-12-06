/**
 * E-Invoice Transfer History API
 * Following OperationPricing RTK Query patterns
 * Based on legacy _getCompanyTransferHistory and _putTransferInvoiceFromScore APIs
 */

import { baseApi } from '@api';
import type {
  EInvoiceTransferHistoryFilters,
  EInvoiceTransferHistoryResponse,
  TransferInvoiceFromScoreRequest,
  TransferInvoiceFromScoreResponse,
} from './e-invoice-transfer-history.types';

export const eInvoiceTransferHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get company transfer history
     * Legacy: _getCompanyTransferHistory
     * URL: /companies/integrator/transfer/histories
     */
    getCompanyTransferHistory: builder.query<EInvoiceTransferHistoryResponse, EInvoiceTransferHistoryFilters>({
      query: (params) => ({
        url: '/companies/integrator/transfer/histories',
        method: 'GET',
        params,
      }),
    }),

    /**
     * Transfer invoice from score (manual transfer)
     * Legacy: _putTransferInvoiceFromScore
     * URL: /companies/integrator/transfer (PUT)
     */
    putTransferInvoiceFromScore: builder.mutation<TransferInvoiceFromScoreResponse, TransferInvoiceFromScoreRequest>({
      query: (data) => ({
        url: '/companies/integrator/transfer',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCompanyTransferHistoryQuery,
  useLazyGetCompanyTransferHistoryQuery,
  usePutTransferInvoiceFromScoreMutation,
} = eInvoiceTransferHistoryApi;
