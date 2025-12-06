import { baseApi } from '@api';
import {
  DailyCompanyActivityCountByAllowanceStatusResponse,
  DailyCompanyIntegrationCountResponse,
  DailyInvoiceStatsResponse,
  DailyPaymentStatsResponse,
  DailyRegisteredCompaniesResponse,
} from './dashboard.types';

const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDailyRegisteredCompanies: builder.query<DailyRegisteredCompaniesResponse, void>({
      query: () => ({
        url: '/stats/dailyRegisteredCompanies',
      }),
      keepUnusedDataFor: 0,
    }),
    getDailyCompanyIntegrationCount: builder.query<DailyCompanyIntegrationCountResponse, void>({
      query: () => ({
        url: '/stats/getDailyCompanyIntegrationCount',
      }),
      keepUnusedDataFor: 0,
    }),
    getDailyCompanyActivityCountByAllowanceStatus: builder.query<
      DailyCompanyActivityCountByAllowanceStatusResponse,
      void
    >({
      query: () => ({
        url: '/stats/getDailyCompanyActivityCountByAllowanceStatus',
      }),
      keepUnusedDataFor: 0,
    }),
    getDailyPaymentStats: builder.query<DailyPaymentStatsResponse, void>({
      query: () => ({
        url: '/stats/getDailyPaymentStats',
      }),
      keepUnusedDataFor: 0,
    }),
    getDailyInvoiceStats: builder.query<DailyInvoiceStatsResponse, void>({
      query: () => ({
        url: '/stats/getDailyInvoiceStats',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetDailyRegisteredCompaniesQuery,
  useGetDailyCompanyIntegrationCountQuery,
  useGetDailyCompanyActivityCountByAllowanceStatusQuery,
  useGetDailyPaymentStatsQuery,
  useGetDailyInvoiceStatsQuery,
  useLazyGetDailyRegisteredCompaniesQuery,
  useLazyGetDailyCompanyIntegrationCountQuery,
  useLazyGetDailyCompanyActivityCountByAllowanceStatusQuery,
  useLazyGetDailyPaymentStatsQuery,
  useLazyGetDailyInvoiceStatsQuery,
} = dashboardApi;
