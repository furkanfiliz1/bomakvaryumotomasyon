import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  CompanyListItem,
  IntegrationReportsFilters,
  IntegrationTransactionDetailsParams,
  IntegrationTransactionDetailsResponse,
  IntegrationTransactionItem,
  IntegrationTransactionsResponse,
} from './integration-reports.types';

// Integration Reports API endpoints
// Following OperationPricing RTK Query pattern
export const integrationReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get integration transactions - matches legacy _getTransactions
    getIntegrationTransactions: builder.query<
      ServerSideQueryResult<IntegrationTransactionItem>,
      IntegrationReportsFilters
    >({
      query: (params) => ({
        url: '/reports/transactions',
        method: 'GET',
        params,
      }),
      transformResponse: (
        response: IntegrationTransactionsResponse,
      ): ServerSideQueryResult<IntegrationTransactionItem> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData || null,
      }),
    }),

    // Get transaction details - matches legacy _getTransactionDetails
    // Supports pagination with Page and PageSize parameters
    getIntegrationTransactionDetails: builder.query<
      IntegrationTransactionDetailsResponse,
      IntegrationTransactionDetailsParams
    >({
      query: (params) => ({
        url: '/reports/transactionDetails',
        method: 'GET',
        params,
      }),
      transformResponse: (response: IntegrationTransactionDetailsResponse) => response,
    }),

    // Get company list for CompanyIdentifier dropdown - matches legacy getCompanyList
    getCompanyList: builder.query<
      { Items: CompanyListItem[] },
      { sort?: string; sortType?: string; type?: number; page?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: { Items: CompanyListItem[] }) => response,
    }),

    // Search companies by name or identifier for async autocomplete - sellers (tedarikçi)
    searchSellersByCompanyNameOrIdentifier: builder.query<
      { Items: Array<{ Id: number; CompanyName: string; Identifier: string }> },
      { CompanyNameOrIdentifier?: string; CompanyActivityType: number }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),

    // Search companies by name or identifier for async autocomplete - financiers (finansör)
    searchFinanciersByCompanyNameOrIdentifier: builder.query<
      { Items: Array<{ Id: number; CompanyName: string; Identifier: string }> },
      { CompanyNameOrIdentifier?: string; CompanyActivityType: number }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),
  }),
});

// Export hooks following OperationPricing pattern
export const {
  useGetIntegrationTransactionsQuery,
  useLazyGetIntegrationTransactionsQuery,
  useGetIntegrationTransactionDetailsQuery,
  useLazyGetIntegrationTransactionDetailsQuery,
  useGetCompanyListQuery,
  useLazyGetCompanyListQuery,
  useLazySearchSellersByCompanyNameOrIdentifierQuery,
  useLazySearchFinanciersByCompanyNameOrIdentifierQuery,
} = integrationReportsApi;
