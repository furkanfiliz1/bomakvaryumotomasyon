/**
 * Company Buyer Limits Tab API Integration
 * Following OperationPricing API patterns exactly
 */

import { baseApi } from '@api';
import type {
  BuyerLimitsQueryParams,
  BuyerLimitsResponse,
  SearchBuyerLimitsParams,
  SyncBuyerConcentrationRequest,
  UpdateBuyerLimitRequest,
} from './company-buyer-limits-tab.types';

export const companyBuyerLimitsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /**
     * Get company buyer limits with pagination
     * GET /companies/limit/{companyId}/buyers
     */
    getCompanyBuyerLimits: builder.query<BuyerLimitsResponse, BuyerLimitsQueryParams>({
      query: ({ companyId, ...params }) => ({
        url: `/companies/limit/${companyId}/buyers`,
        method: 'GET',
        params,
      }),
    }),

    /**
     * Update buyer limit
     * PUT /companies/limit/{companyLimitId}/buyers/{buyerId}
     * Matches legacy _putCompanyBuyerLimit exactly
     */
    updateBuyerLimit: builder.mutation<
      void,
      {
        companyLimitId: number;
        buyerId: number;
        data: UpdateBuyerLimitRequest;
      }
    >({
      query: ({ companyLimitId, buyerId, data }) => ({
        url: `/companies/limit/${companyLimitId}/buyers/${buyerId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    /**
     * Search buyer limits by criteria
     * GET /companies/limit/{companyId}/buyers?ReceiverIdentifier={receiverIdentifier}
     * Uses query string parameters, only ReceiverIdentifier filter supported
     */
    searchBuyerLimits: builder.mutation<BuyerLimitsResponse, SearchBuyerLimitsParams>({
      query: ({ companyId, ReceiverIdentifier }) => {
        const params: Record<string, string> = {};

        if (ReceiverIdentifier) {
          params.ReceiverIdentifier = ReceiverIdentifier;
        }

        return {
          url: `/companies/limit/${companyId}/buyers`,
          method: 'GET',
          params,
        };
      },
    }),

    /**
     * Sync buyer concentration calculation
     * POST /companies/limit/sync/{identifier}
     * Matches legacy _syncBuyerTrigger exactly
     */
    syncBuyerConcentration: builder.mutation<void, SyncBuyerConcentrationRequest>({
      query: ({ identifier }) => ({
        url: `/companies/limit/sync/${identifier}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetCompanyBuyerLimitsQuery,
  useLazyGetCompanyBuyerLimitsQuery,
  useUpdateBuyerLimitMutation,
  useSearchBuyerLimitsMutation,
  useSyncBuyerConcentrationMutation,
} = companyBuyerLimitsApi;
