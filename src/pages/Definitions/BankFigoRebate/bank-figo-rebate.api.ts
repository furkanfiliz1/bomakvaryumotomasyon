/**
 * Bank Figo Rebate API Endpoints
 * Following OperationPricing RTK Query pattern exactly
 * Matches legacy endpoints: /financer/rebate (GET, POST, PUT, DELETE)
 */

import { baseApi } from '@api';
import type {
  BankFigoRebateItem,
  CreateBankFigoRebateRequest,
  FinancerCompanyOption,
  UpdateBankFigoRebateRequest,
} from './bank-figo-rebate.types';

// Response type for companies endpoint
interface FinancerCompaniesResponse {
  Items: FinancerCompanyOption[];
  TotalCount: number;
}

export const bankFigoRebateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get all bank figo rebates
     * GET /financer/rebate
     */
    getBankFigoRebates: build.query<BankFigoRebateItem[], void>({
      query: () => ({
        url: '/financer/rebate',
        method: 'GET',
      }),
    }),

    /**
     * Create new bank figo rebate
     * POST /financer/rebate
     */
    createBankFigoRebate: build.mutation<void, CreateBankFigoRebateRequest>({
      query: (body) => ({
        url: '/financer/rebate',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Update existing bank figo rebate
     * PUT /financer/rebate
     */
    updateBankFigoRebate: build.mutation<void, UpdateBankFigoRebateRequest>({
      query: (body) => ({
        url: '/financer/rebate',
        method: 'PUT',
        body,
      }),
    }),

    /**
     * Delete bank figo rebate
     * DELETE /financer/rebate/{id}
     */
    deleteBankFigoRebate: build.mutation<void, number>({
      query: (id) => ({
        url: `/financer/rebate/${id}`,
        method: 'DELETE',
      }),
    }),

    /**
     * Get financer companies for dropdown (type=2)
     * Matches legacy: getCompanyList({ type: 2, sort: 'CompanyName', sortType: 'Asc' })
     */
    getBankFigoRebateFinancerCompanies: build.query<FinancerCompanyOption[], void>({
      query: () => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 100,
        },
      }),
      transformResponse: (response: FinancerCompaniesResponse): FinancerCompanyOption[] => {
        return response.Items || [];
      },
    }),
  }),
});

export const {
  useGetBankFigoRebatesQuery,
  useCreateBankFigoRebateMutation,
  useUpdateBankFigoRebateMutation,
  useDeleteBankFigoRebateMutation,
  useGetBankFigoRebateFinancerCompaniesQuery,
} = bankFigoRebateApi;
