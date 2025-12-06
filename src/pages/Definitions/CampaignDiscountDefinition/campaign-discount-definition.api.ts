/**
 * Campaign Discount Definition API Endpoints
 * RTK Query endpoints for /campaign CRUD operations
 */

import { baseApi } from '@api';
import type {
  CampaignDiscountListResponse,
  CampaignDiscountSearchParams,
  CreateCampaignDiscountRequest,
} from './campaign-discount-definition.types';

const campaignDiscountDefinitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /campaign/search
     * Fetches campaign discounts with pagination and filters
     */
    getCampaignDiscountList: builder.query<CampaignDiscountListResponse, CampaignDiscountSearchParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', String(params.page));
        if (params.pageSize) queryParams.append('pageSize', String(params.pageSize));
        if (params.sortType) queryParams.append('sortType', params.sortType);
        if (params.Month) queryParams.append('Month', params.Month);
        if (params.Year) queryParams.append('Year', params.Year);
        if (params.campaignType) queryParams.append('campaignType', String(params.campaignType));

        return `/campaign/search?${queryParams.toString()}`;
      },
    }),

    /**
     * POST /campaign
     * Creates a new campaign discount
     */
    createCampaignDiscount: builder.mutation<void, CreateCampaignDiscountRequest>({
      query: (body) => ({
        url: '/campaign',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCampaignDiscountListQuery,
  useLazyGetCampaignDiscountListQuery,
  useCreateCampaignDiscountMutation,
} = campaignDiscountDefinitionApi;
