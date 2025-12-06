import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import { CompanyActivityType, CompanySearchResponse } from '../shared.types';
import type {
  BuyerReconciliationItem,
  BuyerReconciliationQueryParams,
  BuyerReconciliationResponse,
} from './buyer-reconciliation.types';

// Extended interface for buyer reconciliation data with server-side query capabilities
interface BuyerReconciliationServerSideResult extends ServerSideQueryResult<BuyerReconciliationItem> {
  // Additional metadata can be added here if needed in the future
}

export const buyerReconciliationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get buyer reconciliation report data - using the legacy /reports/receiverAgreement endpoint
    getBuyerReconciliationReport: build.query<BuyerReconciliationServerSideResult, BuyerReconciliationQueryParams>({
      query: (params) => ({
        url: '/reports/receiverAgreement',
        method: 'GET',
        params,
      }),
      transformResponse: (response: BuyerReconciliationResponse): BuyerReconciliationServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
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
  }),
});

// Export hooks following OperationPricing naming patterns
export const { useLazyGetBuyerReconciliationReportQuery, useLazySearchBuyersByCompanyNameOrIdentifierQuery } =
  buyerReconciliationApi;
