import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  InvoiceTransactionQueryParams,
  InvoiceTransactionResponse,
  InvoiceTransactionItem,
  UpdateInvoiceRequest,
} from './invoice-transaction.types';

export const invoiceTransactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get issued invoices list
    getIssuedInvoices: build.query<ServerSideQueryResult<InvoiceTransactionItem>, InvoiceTransactionQueryParams>({
      query: (params) => ({
        url: '/issuedInvoices',
        method: 'GET',
        params,
      }),
      transformResponse: (response: InvoiceTransactionResponse): ServerSideQueryResult<InvoiceTransactionItem> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Update issued invoice (for return invoice data)
    updateIssuedInvoice: build.mutation<void, { id: number; data: UpdateInvoiceRequest }>({
      query: ({ id, data }) => ({
        url: `/issuedInvoices/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetIssuedInvoicesQuery, useLazyGetIssuedInvoicesQuery, useUpdateIssuedInvoiceMutation } =
  invoiceTransactionApi;
