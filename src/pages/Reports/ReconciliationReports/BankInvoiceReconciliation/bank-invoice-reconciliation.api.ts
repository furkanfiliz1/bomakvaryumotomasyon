import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  BankInvoiceReconciliationItem,
  BankInvoiceReconciliationQueryParams,
  BankInvoiceReconciliationResponse,
  CompaniesResponse,
  CompanyActivityType,
  CompanyActivityTypeResponse,
  CompanySearchResponse,
} from './bank-invoice-reconciliation.types';

// Extended interface for bank invoice reconciliation data with server-side query support
interface BankInvoiceReconciliationServerSideResult extends ServerSideQueryResult<BankInvoiceReconciliationItem> {
  // No additional totals needed for this report unlike OperationPricing
}

export const bankInvoiceReconciliationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get bank invoice reconciliation report data - using the exact legacy API endpoint
    getBankInvoiceReconciliationReport: build.query<
      BankInvoiceReconciliationServerSideResult,
      BankInvoiceReconciliationQueryParams
    >({
      query: (params) => {
        // Don't make request if required VKN fields are not provided - return empty result
        if (!params.receiverIdentifier || !params.financerIdentifier) {
          return '';
        }

        return {
          url: '/reports/financerAgreement',
          method: 'GET',
          params: {
            ...params,
            // Ensure proper parameter format for legacy API
            receiverIdentifier: params.receiverIdentifier,
            financerIdentifier: params.financerIdentifier,
          },
        };
      },
      transformResponse: (response: BankInvoiceReconciliationResponse): BankInvoiceReconciliationServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
      }),
    }),

    // Get buyers by activity type - companies/activityType/1
    getBuyersByActivityType: build.query<CompanyActivityTypeResponse, void>({
      query: () => ({
        url: '/companies/activityType/1',
        method: 'GET',
      }),
    }),

    // Get companies list for dropdowns - reusing existing companies API
    // Type 2 = Banks (Finans Şirketler), Type 1 = Buyers (Alıcı Şirketler)
    getCompaniesForBankInvoiceReconciliation: build.query<
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
  useGetBankInvoiceReconciliationReportQuery,
  useLazyGetBankInvoiceReconciliationReportQuery,
  useGetBuyersByActivityTypeQuery,
  useGetCompaniesForBankInvoiceReconciliationQuery,
  useLazySearchBuyersByCompanyNameOrIdentifierQuery,
  useLazySearchBanksByCompanyNameOrIdentifierQuery,
} = bankInvoiceReconciliationApi;
