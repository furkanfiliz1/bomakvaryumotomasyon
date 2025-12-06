import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  BankDiscountReconciliationItem,
  BankDiscountReconciliationQueryParams,
  BankDiscountReconciliationResponse,
  CompaniesResponse,
  CompanyActivityType,
  CompanySearchResponse,
} from './bank-discount-reconciliation.types';

// Extended interface for bank discount reconciliation data with server-side query support
interface BankDiscountReconciliationServerSideResult extends ServerSideQueryResult<BankDiscountReconciliationItem> {
  // No additional totals needed for this report
}

export const bankDiscountReconciliationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get bank discount reconciliation report data - using the exact legacy API endpoint
    getBankDiscountReconciliationReport: build.query<
      BankDiscountReconciliationServerSideResult,
      BankDiscountReconciliationQueryParams
    >({
      query: (params) => {
        // Don't make request if required VKN fields are not provided - return empty result
        if (!params.identifier || !params.financerCompanyIdentifier) {
          return '';
        }

        return {
          url: '/reports/financerAllowanceAgreement',
          method: 'GET',
          params: {
            ...params,
            // Ensure proper parameter format for legacy API
            identifier: params.identifier,
            financerCompanyIdentifier: params.financerCompanyIdentifier,
          },
        };
      },
      transformResponse: (
        response: BankDiscountReconciliationResponse,
      ): BankDiscountReconciliationServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Get companies list for dropdowns - reusing existing companies API
    // Type 2 = Banks (Finans Şirketler), Type 1 = Buyers (Alıcı Şirketler)
    getCompaniesForBankDiscountReconciliation: build.query<
      CompaniesResponse,
      {
        type: number; // 1 for buyers, 2 for banks
        sort?: string;
        sortType?: string;
        page?: number;
        pageSize?: number;
      }
    >({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          page: 1,
          pageSize: 100,
          ...params,
        },
      }),
    }),

    // Search buyers (Alıcı Şirketler) by name or identifier for async autocomplete
    searchBuyersByCompanyNameOrIdentifier: build.query<
      CompanySearchResponse,
      { CompanyNameOrIdentifier?: string; CompanyActivityType: CompanyActivityType }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),

    // Search banks/financiers (Finans Şirketler) by name or identifier for async autocomplete
    searchBanksByCompanyNameOrIdentifier: build.query<
      CompanySearchResponse,
      { CompanyNameOrIdentifier?: string; CompanyActivityType: CompanyActivityType }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetBankDiscountReconciliationReportQuery,
  useGetCompaniesForBankDiscountReconciliationQuery,
  useLazySearchBuyersByCompanyNameOrIdentifierQuery,
  useLazySearchBanksByCompanyNameOrIdentifierQuery,
} = bankDiscountReconciliationApi;
