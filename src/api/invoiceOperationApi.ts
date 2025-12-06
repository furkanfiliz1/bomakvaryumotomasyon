import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ExceptionResponseModel, InvoiceCreateRequestModel } from './figoParaApi';
import { RootState } from '@store';

export interface IInvoiceCreateRequestModel extends InvoiceCreateRequestModel {
  legalMonPayableAmount?: number;
  legalMonTaxInclAmountCurrencyId?: string;
  paymentCurrencyCode?: string;
  invoiceType?: string;
  currency?: string;
  uuid?: string;
}

const invoiceOperationServiceFormatter = (invoice: IInvoiceCreateRequestModel) => {
  invoice.type = invoice.invoiceType === 'EInvoice' ? 1 : 2;
  invoice.eInvoiceType = invoice.profileId === 'EARSIVFATURA' ? 2 : 1;
  invoice.payableAmount = invoice.legalMonPayableAmount;
  invoice.remainingAmount = invoice.legalMonPayableAmount;
  invoice.approvedPayableAmount = invoice.legalMonPayableAmount;

  invoice.payableAmountCurrency = invoice.paymentCurrencyCode || invoice?.currency;

  if (invoice.invoiceType !== 'EInvoice') {
    invoice.uuid = '';
    invoice.hashCode = '';
    invoice.invoiceNumber = '';
  } else {
    invoice.serialNumber = '';
    invoice.sequenceNumber = '';
  }
  return invoice;
};

export const invoiceOperationApi = createApi({
  reducerPath: 'invoiceOperationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_INVOICE_OPERATION_ROOT_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token || '';
      headers.set('Token', token);
      return headers;
    },
  }) as BaseQueryFn<string | FetchArgs, unknown, { data: ExceptionResponseModel }, object>,
  endpoints: (builder) => ({
    postInvoiceFile: builder.query<IInvoiceCreateRequestModel, { file: File; lastModified: number; name: string }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('files', file);
        return {
          url: '/invoices',
          body: formData,
          method: 'POST',
        };
      },
      transformResponse: (invoices: IInvoiceCreateRequestModel[]) => {
        return invoiceOperationServiceFormatter(invoices?.[0] || {});
      },
    }),
  }),
});

export const { usePostInvoiceFileQuery, useLazyPostInvoiceFileQuery } = invoiceOperationApi;
