import { baseApi } from 'src/api/baseApi';
import type {
  BankBuyerCommission,
  BankBuyerRatesFilters,
  BuyerCompany,
  CreateBankBuyerCommissionPayload,
  FinancerCompaniesQueryParams,
  FinancerCompaniesResponse,
  UpdateBankBuyerCommissionPayload,
} from './bank-buyer-rates.types';

/**
 * Bank Buyer Rates API Endpoints
 * Following OperationPricing pattern with unique endpoint names
 */
export const bankBuyerRatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get bank buyer commissions list - GET /commissions
    getBankBuyerRateCommissions: build.query<BankBuyerCommission[], BankBuyerRatesFilters | void>({
      query: (params) => ({
        url: '/commissions',
        method: 'GET',
        params: params ?? {},
      }),
    }),

    // Get buyer companies for dropdown - GET /companies/activityType/1
    getBankBuyerRateBuyerCompanies: build.query<BuyerCompany[], void>({
      query: () => ({
        url: '/companies/activityType/1',
        method: 'GET',
      }),
    }),

    // Get financer companies for dropdown - GET /companies/search
    getBankBuyerRateFinancerCompanies: build.query<FinancerCompaniesResponse, FinancerCompaniesQueryParams>({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 100,
          ...params,
        },
      }),
    }),

    // Create commission - POST /commissions
    createBankBuyerRateCommission: build.mutation<void, CreateBankBuyerCommissionPayload>({
      query: (payload) => ({
        url: '/commissions',
        method: 'POST',
        body: payload,
      }),
    }),

    // Update commission - PUT /commissions/{id}
    updateBankBuyerRateCommission: build.mutation<void, UpdateBankBuyerCommissionPayload>({
      query: ({ Id, ...payload }) => ({
        url: `/commissions/${Id}`,
        method: 'PUT',
        body: { Id, ...payload },
      }),
    }),

    // Delete commission - DELETE /commissions/{id}
    deleteBankBuyerRateCommission: build.mutation<void, number>({
      query: (id) => ({
        url: `/commissions/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBankBuyerRateCommissionsQuery,
  useLazyGetBankBuyerRateCommissionsQuery,
  useGetBankBuyerRateBuyerCompaniesQuery,
  useGetBankBuyerRateFinancerCompaniesQuery,
  useLazyGetBankBuyerRateFinancerCompaniesQuery,
  useCreateBankBuyerRateCommissionMutation,
  useUpdateBankBuyerRateCommissionMutation,
  useDeleteBankBuyerRateCommissionMutation,
} = bankBuyerRatesApi;
