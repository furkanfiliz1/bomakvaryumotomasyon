import { baseApi } from '@api';
import {
  Company,
  CompanySearchResponse,
  Currency,
  CustomerManager,
  DifferenceEntry,
  DifferenceEntryFilters,
  DifferenceEntryListResponse,
  FinancialActivityType,
  FinancialRecord,
  FinancialRecordFilters,
  FinancialRecordListResponse,
  FinancialRecordType,
  ProcessType,
} from './manual-transaction-entry.types';

export const manualTransactionEntryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Financial Records endpoints - Using correct legacy URLs
    getFinancialRecords: builder.query<FinancialRecordListResponse, FinancialRecordFilters>({
      query: (params) => ({
        url: 'extraFinancialRecords/search',
        method: 'GET',
        params,
      }),
    }),

    getFinancialRecord: builder.query<FinancialRecord, number>({
      query: (id) => `extraFinancialRecords/${id}`,
    }),

    createFinancialRecord: builder.mutation<void, Partial<FinancialRecord>>({
      query: (body) => ({
        url: 'extraFinancialRecords',
        method: 'POST',
        body,
      }),
    }),

    updateFinancialRecord: builder.mutation<void, { id: number; body: Partial<FinancialRecord> }>({
      query: ({ id, body }) => ({
        url: `extraFinancialRecords/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteFinancialRecord: builder.mutation<void, number>({
      query: (id) => ({
        url: `extraFinancialRecords/${id}`,
        method: 'DELETE',
      }),
    }),

    exportFinancialRecords: builder.query<{ ExtensionData: string }, FinancialRecordFilters & { IsExport?: boolean }>({
      query: (params) => ({
        url: 'extraFinancialRecords/search',
        method: 'GET',
        params,
      }),
    }),

    // Difference Entry endpoints - Using correct legacy URLs
    getDifferenceEntries: builder.query<DifferenceEntryListResponse, DifferenceEntryFilters>({
      query: (params) => ({
        url: 'companyDeficiencyMonitoring/search',
        method: 'GET',
        params,
      }),
    }),

    getDifferenceEntry: builder.query<DifferenceEntry, number>({
      query: (id) => `companyDeficiencyMonitoring/${id}`,
    }),

    createDifferenceEntry: builder.mutation<void, Partial<DifferenceEntry>>({
      query: (body) => ({
        url: 'companyDeficiencyMonitoring',
        method: 'POST',
        body,
      }),
    }),

    updateDifferenceEntry: builder.mutation<void, { id: number; body: Partial<DifferenceEntry> }>({
      query: ({ id, body }) => ({
        url: `companyDeficiencyMonitoring/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteDifferenceEntry: builder.mutation<void, number>({
      query: (id) => ({
        url: `companyDeficiencyMonitoring/${id}`,
        method: 'DELETE',
      }),
    }),

    // Lookup data endpoints - Using correct legacy URLs and parameters
    getCurrencies: builder.query<Currency[], void>({
      query: () => 'currencies',
    }),

    getFinancialRecordTypes: builder.query<FinancialRecordType[], void>({
      query: () => 'types?EnumName=FinancialRecordTypes',
    }),

    getFinancialActivityTypes: builder.query<FinancialActivityType[], void>({
      query: () => 'types?EnumName=FinancialActivityTypes',
    }),

    getFinancialRecordProcessTypes: builder.query<ProcessType[], void>({
      query: () => 'types?EnumName=FinancialRecordProcessTypes',
    }),

    getDifferenceEntryTypes: builder.query<Array<{ Value: number; Description: string }>, void>({
      query: () => 'types?EnumName=CompanyDeficiencyTypes',
    }),

    getDifferenceEntryStatuses: builder.query<Array<{ Value: number; Description: string }>, void>({
      query: () => 'types?EnumName=CompanyDeficiencyStatus',
    }),

    getDifferenceEntryProcessTypes: builder.query<Array<{ Value: number; Description: string }>, void>({
      query: () => 'types?EnumName=ProductTypes',
    }),

    getInvoicePartyTypes: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => 'types?EnumName=InvoiceParty',
    }),

    SearchByCompanyNameOrIdentifier: builder.query<
      CompanySearchResponse,
      { GroupedCompanyId?: number; CompanyNameOrIdentifier: string; Status?: number; ActivityType?: number }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),

    getBankListManuel: builder.query<
      { Items: Company[] },
      { sort?: string; sortType?: string; page?: number; pageSize?: number }
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
          type: 2, // Bank type = 2 - ensure this is always set
        },
      }),
    }),

    getBuyerListForManualTransactions: builder.query<Company[], { status?: number }>({
      query: (params) => ({
        url: 'buyers',
        method: 'GET',
        params,
      }),
    }),

    getCustomerManagers: builder.query<{ Items: CustomerManager[] }, void>({
      query: () => '/companies/customerManagers/managers',
    }),

    getAllowanceKinds: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => 'allowance-kinds',
    }),

    getNotifyBuyerOptions: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => 'notify-buyer-options',
    }),

    // Cheque Allowance endpoints
    createChequeAllowance: builder.mutation<{ Id: number }, Record<string, unknown>>({
      query: (data) => ({
        url: '/allowances/createExistsAllowance',
        method: 'POST',
        body: data,
      }),
    }),

    getBanks: builder.query<Array<{ Id: number; Name: string; Code?: string; EftCode?: string }>, void>({
      query: () => ({
        url: '/banks',
        method: 'GET',
      }),
    }),

    getBankBranches: builder.query<
      { Items: Array<{ Id: number; Name: string; Code?: string; EftCode?: string }> },
      { BankId: number; pageSize?: number }
    >({
      query: ({ BankId, pageSize = 9999 }) => ({
        url: '/banks/branch/search',
        method: 'GET',
        params: { BankId, pageSize },
      }),
    }),

    getFinancers: builder.query<
      { Items: Array<{ Id: number; Identifier: string; CompanyName: string }> },
      {
        sort?: string;
        sortType?: string;
        type?: number;
        page?: number;
        pageSize?: number;
      }
    >({
      query: (params = {}) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 999,
          ...params,
        },
      }),
    }),

    searchSellers: builder.query<
      { Items: Array<{ Id: number; Identifier: string; CompanyName: string }> },
      {
        CompanyNameOrIdentifier: string;
        Status?: number;
        CompanyActivityType?: number;
      }
    >({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  // Financial Records hooks
  useGetFinancialRecordsQuery,
  useLazyGetFinancialRecordsQuery,
  useGetFinancialRecordQuery,
  useLazyGetFinancialRecordQuery,
  useCreateFinancialRecordMutation,
  useUpdateFinancialRecordMutation,
  useDeleteFinancialRecordMutation,
  useLazyExportFinancialRecordsQuery,

  // Difference Entry hooks
  useGetDifferenceEntriesQuery,
  useLazyGetDifferenceEntriesQuery,
  useGetDifferenceEntryQuery,
  useCreateDifferenceEntryMutation,
  useUpdateDifferenceEntryMutation,
  useDeleteDifferenceEntryMutation,

  // Lookup data hooks
  useGetCurrenciesQuery,
  useGetFinancialRecordTypesQuery,
  useGetFinancialActivityTypesQuery,
  useGetFinancialRecordProcessTypesQuery,
  useGetInvoicePartyTypesQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
  useGetBankListManuelQuery,
  useGetBuyerListForManualTransactionsQuery,
  useGetCustomerManagersQuery,
  useGetAllowanceKindsQuery,
  useGetNotifyBuyerOptionsQuery,

  // Cheque Allowance hooks
  useCreateChequeAllowanceMutation,
  useGetBanksQuery,
  useLazyGetBankBranchesQuery,
  useGetFinancersQuery,
  useLazySearchSellersQuery,
} = manualTransactionEntryApi;
