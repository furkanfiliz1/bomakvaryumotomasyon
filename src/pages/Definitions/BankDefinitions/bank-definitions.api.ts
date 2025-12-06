import { baseApi } from 'src/api/baseApi';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  Bank,
  BankBranch,
  BankBranchQueryParams,
  BankBranchResponse,
  CreateBankBranchPayload,
  CreateBankPayload,
} from './bank-definitions.types';

export const bankDefinitionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get banks list - GET /banks
    getBankDefinitionsList: build.query<Bank[], void>({
      query: () => ({
        url: '/banks',
        method: 'GET',
      }),
    }),

    // Create bank - POST /banks
    createBankDefinition: build.mutation<void, CreateBankPayload>({
      query: (payload) => ({
        url: '/banks',
        method: 'POST',
        body: payload,
      }),
    }),

    // Delete bank - DELETE /banks/{id}
    deleteBankDefinition: build.mutation<void, number>({
      query: (id) => ({
        url: `/banks/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get bank branches list - GET /banks/branch/search
    getBankDefinitionBranches: build.query<ServerSideQueryResult<BankBranch>, BankBranchQueryParams>({
      query: (params) => ({
        url: '/banks/branch/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: BankBranchResponse): ServerSideQueryResult<BankBranch> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Create bank branch - POST /banks/branch
    createBankDefinitionBranch: build.mutation<void, CreateBankBranchPayload>({
      query: (payload) => ({
        url: '/banks/branch',
        method: 'POST',
        body: payload,
      }),
    }),

    // Delete bank branch - DELETE /banks/{id}/branch
    deleteBankDefinitionBranch: build.mutation<void, number>({
      query: (id) => ({
        url: `/banks/${id}/branch`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBankDefinitionsListQuery,
  useLazyGetBankDefinitionsListQuery,
  useCreateBankDefinitionMutation,
  useDeleteBankDefinitionMutation,
  useGetBankDefinitionBranchesQuery,
  useLazyGetBankDefinitionBranchesQuery,
  useCreateBankDefinitionBranchMutation,
  useDeleteBankDefinitionBranchMutation,
} = bankDefinitionsApi;
