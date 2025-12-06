import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  AvailableCompensationDetail,
  CompanySearchByNameOrIdentifierResult,
  CompanySearchParams,
  CompanySearchResponse,
  CompensationTransactionCreateData,
  CompensationTransactionItem,
  CompensationTransactionQueryParams,
  CompensationTransactionResponse,
  CompensationTransactionType,
  FinancerCompaniesResponse,
  FinancerCompany,
  LegalProceedingCompensationCreateData,
} from './compensation-transactions.types';

// Extended interface for compensation transaction data
interface CompensationTransactionServerSideResult extends ServerSideQueryResult<CompensationTransactionItem> {
  // Add any additional summary data if needed
}

export const compensationTransactionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get compensation transactions report data
    getCompensationTransactionsReport: build.query<
      CompensationTransactionServerSideResult,
      CompensationTransactionQueryParams
    >({
      query: (params) => ({
        url: '/compensationTransactions/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: CompensationTransactionResponse): CompensationTransactionServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Create new compensation transaction
    createCompensationTransaction: build.mutation<
      { success: boolean; message: string },
      CompensationTransactionCreateData
    >({
      query: (data) => ({
        url: '/compensationTransactions',
        method: 'POST',
        body: data,
      }),
    }),

    // Get compensation transaction types
    getCompensationTransactionTypes: build.query<CompensationTransactionType[], void>({
      query: () => ({
        url: '/types?EnumName=CompensationTransactionType',
        method: 'GET',
      }),
    }),

    // Search companies
    searchCompanies: build.query<CompanySearchResponse[], CompanySearchParams>({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params,
      }),
    }),

    // Search companies by name or identifier for async autocomplete
    searchCompaniesByNameOrIdentifier: build.query<
      CompanySearchByNameOrIdentifierResult,
      {
        CompanyNameOrIdentifier: string;
        Status?: number;
        ActivityType?: number;
      }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params: {
          ...params,
          Status: params.Status ?? 1,
          ActivityType: params.ActivityType ?? 2,
        },
      }),
    }),

    // Get financer companies
    getFinancerCompaniesForCompensation: build.query<FinancerCompany[], void>({
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
      transformResponse: (response: FinancerCompaniesResponse): FinancerCompany[] => {
        return response.Items || [];
      },
    }),

    // Get compensation transaction by ID
    getCompensationTransactionById: build.query<CompensationTransactionItem, number>({
      query: (id) => ({
        url: `/compensationTransactions/${id}`,
        method: 'GET',
      }),
    }),

    // Update compensation transaction
    updateCompensationTransaction: build.mutation<
      { success: boolean; message: string },
      { id: number; data: CompensationTransactionCreateData }
    >({
      query: ({ id, data }) => ({
        url: `/compensationTransactions/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete compensation transaction
    deleteCompensationTransaction: build.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/compensationTransactions/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get available compensations details for legal proceedings
    getAvailableCompensationsDetails: build.query<
      AvailableCompensationDetail[],
      { companyId: number; financerCompanyId: number; ProductType: number }
    >({
      query: (params) => ({
        url: '/compensations/GetAvailableCompensationsDetails',
        method: 'GET',
        params,
      }),
    }),

    // Create legal proceeding compensation
    createLegalProceedingCompensation: build.mutation<
      { success: boolean; message: string },
      LegalProceedingCompensationCreateData
    >({
      query: (data) => ({
        url: '/compensations',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLazyGetCompensationTransactionsReportQuery,
  useGetCompensationTransactionsReportQuery,
  useCreateCompensationTransactionMutation,
  useGetCompensationTransactionTypesQuery,
  useLazySearchCompaniesQuery,
  useLazySearchCompaniesByNameOrIdentifierQuery,
  useGetFinancerCompaniesForCompensationQuery,
  useGetCompensationTransactionByIdQuery,
  useUpdateCompensationTransactionMutation,
  useDeleteCompensationTransactionMutation,
  useLazyGetAvailableCompensationsDetailsQuery,
  useCreateLegalProceedingCompensationMutation,
} = compensationTransactionsApi;
