import { baseApi } from '@api';
import type {
  BankListItem,
  BuyerLimitReportItem,
  BuyerLimitReportsFilters,
  BuyerListItem,
} from './buyer-limit-reports.types';

// Buyer Limit Reports API endpoints
// Exact match with legacy API endpoints and behavior
export const buyerLimitReportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get buyer limit report - matching legacy _getBankBuyerLimitReport
    getBuyerLimitReports: builder.query<BuyerLimitReportItem, BuyerLimitReportsFilters>({
      query: (params) => ({
        url: '/companies/BankLimit',
        method: 'GET',
        params,
      }),
      // API returns the data directly as an object, no transformation needed
      keepUnusedDataFor: 30,
    }),

    // Get bank list - matching legacy getCompanyList with type: 2
    getBankList: builder.query<{ Items: BankListItem[] }, void>({
      query: () => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2, // Bank type filter
          page: 1,
          pageSize: 100,
        },
      }),
      // Transform to filter specific banks like legacy (hardcoded bank IDs)
      transformResponse: (response: { Items: BankListItem[] }): { Items: BankListItem[] } => {
        const bankIds = ['0150015264', '4810058590']; // Legacy hardcoded bank filter
        const filteredBanks = response.Items?.filter((bank) => bankIds.includes(bank.Identifier)) || [];

        return {
          Items: filteredBanks,
        };
      },
      // Cache bank list for longer since it rarely changes
      keepUnusedDataFor: 300,
    }),

    // Get buyer list for selected bank - matching legacy getBuyerListWithBank
    getBuyerListWithBank: builder.query<BuyerListItem[], number>({
      query: (bankId) => ({
        url: `/companies/${bankId}/SenderCompanies`,
        method: 'GET',
      }),
      // Transform response to array format
      transformResponse: (response: BuyerListItem[]): BuyerListItem[] => {
        return response || [];
      },
      // Keep data fresh for 60 seconds
      keepUnusedDataFor: 60,
    }),
  }),
});

// Export hooks for components - following OperationPricing pattern
export const { useLazyGetBuyerLimitReportsQuery, useGetBankListQuery, useLazyGetBuyerListWithBankQuery } =
  buyerLimitReportsApi;
