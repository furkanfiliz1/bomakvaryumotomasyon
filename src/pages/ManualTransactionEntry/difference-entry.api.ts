import { baseApi } from '@api';
import {
  DifferenceEntry,
  DifferenceEntryFilters,
  DifferenceEntrySearchResponse,
  DifferenceEntryStatus,
  DifferenceEntryType,
  ProcessType,
  SearchedCompany,
} from './difference-entry.types';

// Based on legacy API endpoints in /src/api.js
export const differenceEntryApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Search difference entries - _searchDifferenceEntry
    searchDifferenceEntries: builder.query<DifferenceEntrySearchResponse, DifferenceEntryFilters>({
      query: (params) => ({
        url: 'companyDeficiencyMonitoring/search',
        method: 'GET',
        params,
      }),
    }),

    // Export difference entries
    exportDifferenceEntries: builder.query<{ ExtensionData: string }, DifferenceEntryFilters & { IsExport?: boolean }>({
      query: (params) => ({
        url: 'companyDeficiencyMonitoring/search',
        method: 'GET',
        params,
      }),
    }),

    // Get difference entry by ID - _getDifferenceEntry
    getDifferenceEntry: builder.query<DifferenceEntry, number>({
      query: (id) => ({
        url: `companyDeficiencyMonitoring/${id}`,
        method: 'GET',
      }),
    }),

    // Create difference entry - _postDifferenceEntry
    createDifferenceEntry: builder.mutation<void, Partial<DifferenceEntry>>({
      query: (data) => ({
        url: 'companyDeficiencyMonitoring',
        method: 'POST',
        body: data,
      }),
    }),

    // Update difference entry - _putDifferenceEntry
    updateDifferenceEntry: builder.mutation<void, { id: number; data: Partial<DifferenceEntry> }>({
      query: ({ id, data }) => ({
        url: `companyDeficiencyMonitoring/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Get difference entry types - _getDifferenceEntryTypes
    getDifferenceEntryTypes: builder.query<DifferenceEntryType[], void>({
      query: () => ({
        url: 'types',
        method: 'GET',
        params: { EnumName: 'CompanyDeficiencyTypes' },
      }),
    }),

    // Get difference entry status - _getDifferenceEntryStatus
    getDifferenceEntryStatus: builder.query<DifferenceEntryStatus[], void>({
      query: () => ({
        url: 'types',
        method: 'GET',
        params: { EnumName: 'CompanyDeficiencyStatus' },
      }),
    }),

    // Get process types for difference entry - _getDifferenceEntryProcessType
    getDifferenceEntryProcessTypes: builder.query<ProcessType[], void>({
      query: () => ({
        url: 'types',
        method: 'GET',
        params: { EnumName: 'ProductTypes' },
      }),
    }),

    // Search companies for autocomplete - _getSearchedGroupCompany (from legacy)
    searchGroupCompanies: builder.query<
      { Items: SearchedCompany[] },
      {
        GroupedCompanyId?: number;
        CompanyName?: string;
        Status?: number;
      }
    >({
      query: (params) => ({
        url: 'companies/search',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useSearchDifferenceEntriesQuery,
  useLazySearchDifferenceEntriesQuery,
  useLazyExportDifferenceEntriesQuery,
  useGetDifferenceEntryQuery,
  useCreateDifferenceEntryMutation,
  useUpdateDifferenceEntryMutation,
  useGetDifferenceEntryTypesQuery,
  useGetDifferenceEntryStatusQuery,
  useGetDifferenceEntryProcessTypesQuery,
  useLazySearchGroupCompaniesQuery,
} = differenceEntryApi;
