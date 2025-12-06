/**
 * Company Representative Settings API
 * Matches legacy CustomerManagerList API endpoints exactly
 * Following OperationPricing RTK Query patterns
 */

import { baseApi } from '@api';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  BuyerCompany,
  CompanyCustomerManagerFilters,
  CompanyCustomerManagerHistoryItem,
  CompanyCustomerManagerItem,
  CompanyCustomerManagerResponse,
  CustomerManagerListResponse,
  FinancerCompanyListResponse,
  UpdateCompanyCustomerManagerRequest,
} from './company-representative-settings.types';

export const companyRepresentativeApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get company customer manager list - matches legacy _getCompanyCustomerManager
    getCompanyCustomerManagers: builder.query<
      ServerSideQueryResult<CompanyCustomerManagerItem>,
      ServerSideQueryArgs & CompanyCustomerManagerFilters
    >({
      query: (params) => ({
        url: '/companies/customerManagers',
        method: 'GET',
        params,
      }),
      transformResponse: (response: CompanyCustomerManagerResponse) => ({
        Data: response.CompanyList,
        Items: response.CompanyList,
        TotalCount: response.TotalCount,
        ExtensionData: response.ExtensionData as string | null,
      }),
    }),

    // Get customer manager list - matches legacy _getCustomerManagerList
    getCustomerManagerList: builder.query<CustomerManagerListResponse, void>({
      query: () => ({
        url: '/companies/customerManagers/managers',
        method: 'GET',
      }),
    }),

    // Get financers list - matches legacy getCompanyList with type=2
    getFinancersList: builder.query<FinancerCompanyListResponse, void>({
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
    }),

    // Get company customer manager history - matches legacy _getCompanyCustomerManagerHistory
    getCompanyCustomerManagerHistory: builder.query<
      { HistoryList: CompanyCustomerManagerHistoryItem[] },
      { companyId?: number }
    >({
      query: ({ companyId }) => ({
        url: `companies/customerManagers/${companyId}/histories`,
        method: 'GET',
      }),
    }),

    // Update company customer manager - matches legacy _putCompanyCustomerManager
    updateCompanyCustomerManager: builder.mutation<void, UpdateCompanyCustomerManagerRequest>({
      query: (body) => ({
        url: '/companies/customerManagers',
        method: 'PUT',
        body,
      }),
    }),

    // Get buyer companies list - for BuyerCompanyId filter slot
    getBuyerCompaniesList: builder.query<BuyerCompany[], void>({
      query: () => '/companies/activityType/1',
    }),
  }),
});

export const {
  useGetCompanyCustomerManagersQuery,
  useLazyGetCompanyCustomerManagersQuery,
  useGetCustomerManagerListQuery,
  useGetFinancersListQuery,
  useGetCompanyCustomerManagerHistoryQuery,
  useUpdateCompanyCustomerManagerMutation,
  useGetBuyerCompaniesListQuery,
} = companyRepresentativeApi;
