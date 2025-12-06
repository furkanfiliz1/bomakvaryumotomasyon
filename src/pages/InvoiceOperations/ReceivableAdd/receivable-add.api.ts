import { figoParaApi } from 'src/api/figoParaApi';
import type { CreateReceivableRequest, CreateReceivableResponse } from './receivable-add.types';

const receivableAddApi = figoParaApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create receivables
    createReceivable: builder.mutation<CreateReceivableResponse, CreateReceivableRequest[]>({
      query: (receivableData) => ({
        url: 'orders', // Following Portal reference
        method: 'POST',
        body: receivableData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateReceivableMutation } = receivableAddApi;
