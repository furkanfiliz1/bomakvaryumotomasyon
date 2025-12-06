import { baseApi } from '@api';
import type { AssociatedSupplier, SupplierQueryRequest, SupplierQueryResponse } from './supplier-query.types';

export const supplierQueryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceiverAssociatedSupplier: builder.query<SupplierQueryResponse, SupplierQueryRequest>({
      query: ({ buyerCode }) => ({
        url: `/companies/getReceiverAssociatedSupplier/${buyerCode}`,
        method: 'GET',
      }),
      transformResponse: (response: AssociatedSupplier[]) => {
        console.log('response', response);
        return {
          suppliers: response || [],
        };
      },
    }),
  }),
});

export const { useGetReceiverAssociatedSupplierQuery, useLazyGetReceiverAssociatedSupplierQuery } = supplierQueryApi;
