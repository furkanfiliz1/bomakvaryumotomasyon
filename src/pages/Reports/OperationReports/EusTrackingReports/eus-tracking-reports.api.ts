import { baseApi, scoreBaseURL } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  CompanyByIdentifierResponse,
  EusFormulaType,
  EusStatusType,
  EusTrackingItem,
  EusTrackingQueryParams,
  EusTrackingResponse,
} from './eus-tracking-reports.types';

// Extended interface for EUS tracking data with server-side query structure
interface EusTrackingServerSideResult extends ServerSideQueryResult<EusTrackingItem> {
  // Early warning data follows standard pagination pattern
  // No additional totals like OperationPricing since this is a listing report
}

export const eusTrackingReportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get EUS tracking report data - matches legacy _getEarlyWarningList exactly
    getEusTrackingReport: build.query<EusTrackingServerSideResult, EusTrackingQueryParams>({
      query: (params) => ({
        url: `${scoreBaseURL}/earlyWarnings/companies`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: EusTrackingResponse): EusTrackingServerSideResult => ({
        Items: response.data || [],
        TotalCount: response.data?.length || 0, // Legacy API doesn't provide total count
        ExtensionData: response.extensionData ? String(response.extensionData) : null,
      }),
    }),

    // Get EUS formula types dropdown data - matches legacy getAllEUSFormulaTypes
    getEusFormulaTypes: build.query<EusFormulaType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'EUSFormulaTypes' },
      }),
      transformResponse: (response: EusFormulaType[]): EusFormulaType[] => response || [],
    }),

    // Get EUS status types dropdown data - matches legacy getAllEUSStatusTypes
    getEusStatusTypes: build.query<EusStatusType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'EUSStatusTypes' },
      }),
      transformResponse: (response: EusStatusType[]): EusStatusType[] => response || [],
    }),

    // Get company by identifier for navigation - matches legacy getCompanyId
    getCompanyByIdentifier: build.query<CompanyByIdentifierResponse, string>({
      query: (identifier) => ({
        url: `/companies/identifier/${identifier}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLazyGetEusTrackingReportQuery,
  useGetEusFormulaTypesQuery,
  useGetEusStatusTypesQuery,
  useLazyGetCompanyByIdentifierQuery,
} = eusTrackingReportsApi;
