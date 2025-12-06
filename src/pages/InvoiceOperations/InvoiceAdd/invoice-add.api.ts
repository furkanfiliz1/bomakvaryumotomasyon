import { figoParaApi } from 'src/api/figoParaApi';
import type { CreateInvoiceRequest, CreateInvoiceResponse } from './invoice-add.types';

const invoiceAddApi = figoParaApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create invoices - Following the curl pattern from request
    createInvoice: builder.mutation<CreateInvoiceResponse, CreateInvoiceRequest[]>({
      query: (invoiceData) => ({
        url: 'invoices',
        method: 'POST',
        body: invoiceData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateInvoiceMutation } = invoiceAddApi;
