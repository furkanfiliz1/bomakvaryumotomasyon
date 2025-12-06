/**
 * Banka Şubesi Excel ile Toplu Ekle API Endpoints
 * RTK Query endpoints for bank branch bulk upload operations
 */

import { baseApi } from '@api';
import type {
  BankBranchSearchResponse,
  BankItem,
  CreateBankBranchesBulkRequest,
} from './bank-branch-bulk-upload.types';

const bankBranchBulkUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /banks
     * Fetches all banks for dropdown
     */
    getBanksBulkUpload: builder.query<BankItem[], void>({
      query: () => '/banks',
    }),

    /**
     * GET /banks/branch/search
     * Fetches bank branches for selected bank
     */
    getBankBranchesBulkUpload: builder.query<BankBranchSearchResponse, { BankId: number; pageSize?: number }>({
      query: ({ BankId, pageSize = 999999 }) => ({
        url: '/banks/branch/search',
        params: { BankId, pageSize },
      }),
    }),

    /**
     * POST /banks/branches/bulk
     * Creates bank branches in bulk
     */
    createBankBranchesBulk: builder.mutation<void, CreateBankBranchesBulkRequest>({
      query: (body) => ({
        url: '/banks/branches/bulk',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBanksBulkUploadQuery,
  useLazyGetBanksBulkUploadQuery,
  useGetBankBranchesBulkUploadQuery,
  useLazyGetBankBranchesBulkUploadQuery,
  useCreateBankBranchesBulkMutation,
} = bankBranchBulkUploadApi;
