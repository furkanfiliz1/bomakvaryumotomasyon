import { analysisBaseURL, baseApi, scoreBaseURL } from '@api';
import {
  CompaniesScoringParams,
  CompaniesScoringResponse,
  CompaniesTransferListParams,
  // New imports for CompanyGeneralTab APIs
  CompaniesTransferListResponse,
  CompanyDetailFullResponse,
  CompanyDetailWithAllocationsResponse,
  CompanySearchByNameOrIdentifierResult,
  CompanySearchParams,
  CompanyStatusUpdateRequest,
  CompanySystemSettings,
  CompanyTransferUpdateRequest,
  CompanyTransferUpdateResponse,
  CompensationDetail,
  CompensationItemResponse,
  CompensationProtocolType,
  CompensationStateType,
  CompensationUpdateRequest,
  CompensationUpdateResponse,
  ConnectedIntegratorListParams,
  ConnectedIntegratorListResponse,
  ConnectedIntegratorUpdateRequest,
  ConnectedIntegratorUpdateResponse,
  CustomerManagerResponse,
  EUSResponse,
  EarlyWarningStatusType,
  ExcelExportResponse,
  FinancerCompanySearchParams,
  FinancerCompanySearchResponse,
  GroupCompanyResponse,
  GuarantorRateType,
  IntegratorHistoryItem,
  IntegratorHistoryResponse,
  IntegratorStatusType,
  IntegratorsResponse,
  InvoiceBuyerAnalysisResponse,
  InvoiceBuyerResponse,
  InvoiceTransferCheckResponse,
  LawFirmType,
  LeadingChannel,
  // Legal proceedings imports
  LegalProceedingsItem,
  LegalProceedingsQueryParams,
  LegalProceedingsResponse,
  OnboardingStatusCount,
  OnboardingStatusOption,
  OnboardingStatusType,
  RiskyCalculationType,
  ScoreCompanyByIdentifierResponse,
  ScoreCompanyDetailResponse,
  ScoreResponse,
} from './limit-operations.types';
// Import CompanyEInvoicesTab API
import './CompanyEInvoicesTab/company-einvoices-tab.api';
// Import CompanyDocumentDataTab API
import './CompanyDocumentDataTab/company-document-data-tab.api';
// Import CompanyLimitTab API
import './CompanyLimitTab/company-limit-tab.api';

export const limitOperationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get onboarding status counts for dashboard
    getOnboardingStatusCount: builder.query<OnboardingStatusCount[], void>({
      query: () => ({
        url: '/companies/settings/onboardingStatusCount',
        method: 'GET',
      }),
    }),

    // Get companies scoring list with pagination and filters
    getCompaniesScoring: builder.query<CompaniesScoringResponse, CompaniesScoringParams>({
      query: (params) => ({
        url: '/companies/scoring',
        method: 'GET',
        params,
      }),
    }),

    // Export companies scoring to Excel
    getCompaniesScoringExcel: builder.query<ExcelExportResponse, CompaniesScoringParams>({
      query: (params) => ({
        url: '/companies/scoringExcelExport',
        method: 'GET',
        params: { ...params, isExport: true },
      }),
    }),

    // Get integrator pairs list
    getIntegratorsPairs: builder.query<IntegratorsResponse, { IsActive?: boolean; Type?: number }>({
      query: (params) => ({
        url: '/integrators/pairs',
        method: 'GET',
        params,
      }),
    }),

    // Get company onboarding status types
    getCompanyStatus: builder.query<OnboardingStatusType[], void>({
      query: () => ({
        url: '/types?EnumName=OnboardingStatusTypes',
        method: 'GET',
      }),
    }),

    // Get customer manager list
    getCustomerManagerList: builder.query<CustomerManagerResponse, void>({
      query: () => ({
        url: '/companies/customerManagers/managers',
        method: 'GET',
      }),
    }),

    // Get early warning status types (EUS)
    getEarlyWarningStatusTypes: builder.query<EarlyWarningStatusType[], void>({
      query: () => ({
        url: '/types?EnumName=EUSStatusTypes',
        method: 'GET',
      }),
    }),

    // Get leading channel list
    getLeadingChannelList: builder.query<LeadingChannel[], void>({
      query: () => ({
        url: '/definitions/leadingChannels',
        method: 'GET',
      }),
    }),

    // Get company detail by ID
    getScoreCompanyDetail: builder.query<ScoreCompanyDetailResponse, { companyId: string | number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/detail`,
        method: 'GET',
      }),
    }),

    // Get company score data
    getScoreData: builder.query<ScoreResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `/score/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get invoice buyer score information
    getInvoiceBuyerScore: builder.query<InvoiceBuyerResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `/invoiceBuyer/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get invoice buyer analysis data from analysis API (matches legacy exactly)
    getInvoiceBuyerAnalysis: builder.query<InvoiceBuyerAnalysisResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `${analysisBaseURL}/invoice/buyer/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get EUS (Early Warning System) data
    getEUSData: builder.query<EUSResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `/eus/${identifier}`,
        method: 'GET',
      }),
    }),

    // CompanyGeneralTab specific APIs

    // Get companies transfer list (integrator transfer info)
    getCompaniesTransferList: builder.query<CompaniesTransferListResponse, CompaniesTransferListParams>({
      query: (params) => ({
        url: '/companies/integrator/transfer',
        method: 'GET',
        params,
      }),
    }),

    // Get company invoice transfer check by identifier (uses scoreBaseURL)
    getCompanyInvoiceTransferCheck: builder.query<InvoiceTransferCheckResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `${scoreBaseURL}/invoices/check/${identifier}`,
        method: 'GET',
      }),
    }),

    // Update company transfer list configuration
    updateCompanyTransferList: builder.mutation<
      CompanyTransferUpdateResponse,
      { data: CompanyTransferUpdateRequest; id: number }
    >({
      query: ({ data, id }) => ({
        url: `/companies/integrator/${id}/transfer`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Get score company by identifier (uses scoreBaseURL)
    getScoreCompanyByIdentifier: builder.query<ScoreCompanyByIdentifierResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `${scoreBaseURL}/companies/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get connected integrator list
    getConnectedIntegratorList: builder.query<ConnectedIntegratorListResponse, ConnectedIntegratorListParams>({
      query: (params) => ({
        url: '/companies/integrator',
        method: 'GET',
        params,
      }),
    }),

    // Update connected integrator list
    updateConnectedIntegratorList: builder.mutation<
      ConnectedIntegratorUpdateResponse,
      { data: ConnectedIntegratorUpdateRequest; identifier: string }
    >({
      query: ({ data, identifier }) => ({
        url: `${scoreBaseURL}/companies/${identifier}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Get integrator history by company ID
    getIntegratorHistory: builder.query<IntegratorHistoryResponse | IntegratorHistoryItem[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/integrator/history/${companyId}`,
        method: 'GET',
      }),
    }),

    // Get full company detail by identifier from Score API (uses scoreBaseURL)
    getScoreCompanyDetailFull: builder.query<CompanyDetailFullResponse, { identifier: string }>({
      query: ({ identifier }) => ({
        url: `${scoreBaseURL}/companies/${identifier}`,
        method: 'GET',
      }),
    }),

    // Get company detail by company ID from main API (uses baseURL)
    getCompanyDetail: builder.query<CompanyDetailFullResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}`,
        method: 'GET',
      }),
    }),

    // Get company details with product types, revenue, limit allocations (uses baseURL)
    getCompanyDetailWithAllocations: builder.query<CompanyDetailWithAllocationsResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/details`,
        method: 'GET',
      }),
    }),

    // Get group companies by company ID
    getGroupCompany: builder.query<GroupCompanyResponse, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/groups/${companyId}`,
        method: 'GET',
      }),
    }),

    // =============================================================================
    // LEGAL PROCEEDINGS (KANUNI TAKIP) ENDPOINTS
    // =============================================================================

    // Get legal proceedings (compensation items) with search and pagination
    getLegalProceedingsReport: builder.query<LegalProceedingsResponse, LegalProceedingsQueryParams>({
      query: (params) => ({
        url: '/compensations/search',
        method: 'GET',
        params,
      }),
      transformResponse: (response: LegalProceedingsResponse): LegalProceedingsResponse => {
        const items =
          response.Items?.map((item, index) => ({
            ...item,
            RemainingCompensationAmount: item.Amount - item.TotalCollectionAmount,
            index: index + 1,
          })) || [];

        return {
          ...response,
          Items: items,
        };
      },
    }),

    // Get risky calculations for multi-select dropdown
    getRiskyCalculations: builder.query<RiskyCalculationType[], void>({
      query: () => ({
        url: '/compensations/getRiskyCalculations',
        method: 'GET',
      }),
      transformResponse: (response: RiskyCalculationType[]): RiskyCalculationType[] => {
        return response.map((item) => ({
          ...item,
          label: item.Name,
          value: item.Id,
        }));
      },
    }),

    // Get compensation state types enum
    getCompensationStateTypes: builder.query<CompensationStateType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'CompensationState' },
      }),
    }),

    // Get compensation protocol types enum
    getCompensationProtocolTypes: builder.query<CompensationProtocolType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'CompensationProtocol' },
      }),
    }),

    // Get integrator status types enum
    getIntegratorStatusTypes: builder.query<IntegratorStatusType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'IntegratorStatus' },
      }),
    }),

    // Get guarantor rates enum
    getGuarantorRates: builder.query<GuarantorRateType[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'GuarantorRate' },
      }),
    }),

    // Get law firms for dropdown
    getLawFirms: builder.query<LawFirmType[], void>({
      query: () => ({
        url: '/lawfirms',
        method: 'GET',
      }),
    }),

    // Get single compensation item by ID
    getLegalProceedingById: builder.query<LegalProceedingsItem, number>({
      query: (id) => ({
        url: `/compensations/${id}`,
        method: 'GET',
      }),
    }),

    // Create new compensation item
    createLegalProceeding: builder.mutation<void, Partial<LegalProceedingsItem>>({
      query: (data) => ({
        url: '/compensations',
        method: 'POST',
        body: data,
      }),
    }),

    // Update existing compensation item
    updateLegalProceeding: builder.mutation<void, { id: number; data: Partial<LegalProceedingsItem> }>({
      query: ({ id, data }) => ({
        url: `/compensations/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete compensation item
    deleteLegalProceeding: builder.mutation<void, number>({
      query: (id) => ({
        url: `/compensations/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get compensation item details for update
    getCompensationItem: builder.query<CompensationItemResponse, number>({
      query: (id) => ({
        url: `/compensations/${id}`,
        method: 'GET',
      }),
    }),

    // Get compensation details (allowance items)
    getCompensationDetails: builder.query<CompensationDetail[], number>({
      query: (id) => ({
        url: `/compensations/${id}/details`,
        method: 'GET',
      }),
    }),

    // Update compensation item
    updateCompensationItem: builder.mutation<
      CompensationUpdateResponse,
      { id: number; data: CompensationUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/compensations/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Search companies by name or identifier for async autocomplete
    searchCompaniesByNameOrIdentifier: builder.query<CompanySearchByNameOrIdentifierResult, CompanySearchParams>({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),

    // Search financer companies for FinancerId field
    searchFinancerCompanies: builder.query<FinancerCompanySearchResponse, FinancerCompanySearchParams>({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2, // FINANCIER type
          page: 1,
          pageSize: 100,
          ...params,
        },
      }),
    }),

    // Company settings and onboarding status endpoints (Limit-specific)
    getLimitCompanySettings: builder.query<CompanySystemSettings, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/settings`,
        method: 'GET',
      }),
    }),

    getLimitAvailableOnboardingStatus: builder.query<OnboardingStatusOption[], { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/companies/${companyId}/settings/availableOnboardingStatus`,
        method: 'GET',
      }),
    }),

    updateLimitCompanyOnboardingStatus: builder.mutation<void, { companyId: string; data: CompanyStatusUpdateRequest }>(
      {
        query: ({ companyId, data }) => ({
          url: `/companies/${companyId}/settings/onboardingStatus`,
          method: 'PUT',
          body: data,
        }),
      },
    ),
  }),
});

export const {
  useGetOnboardingStatusCountQuery,
  useGetCompaniesScoringQuery,
  useLazyGetCompaniesScoringQuery,
  useGetCompaniesScoringExcelQuery,
  useLazyGetCompaniesScoringExcelQuery,
  useGetIntegratorsPairsQuery,
  useLazyGetIntegratorsPairsQuery,
  useGetCompanyStatusQuery,
  useLazyGetCompanyStatusQuery,
  useGetCustomerManagerListQuery,
  useLazyGetCustomerManagerListQuery,
  useGetEarlyWarningStatusTypesQuery,
  useLazyGetEarlyWarningStatusTypesQuery,
  useGetLeadingChannelListQuery,
  useLazyGetLeadingChannelListQuery,
  useGetScoreCompanyDetailQuery,
  useLazyGetScoreCompanyDetailQuery,
  useGetScoreDataQuery,
  useLazyGetScoreDataQuery,
  useGetInvoiceBuyerScoreQuery,
  useLazyGetInvoiceBuyerScoreQuery,
  useGetInvoiceBuyerAnalysisQuery,
  useLazyGetInvoiceBuyerAnalysisQuery,
  useGetEUSDataQuery,
  useLazyGetEUSDataQuery,
  // CompanyGeneralTab specific hooks
  useGetCompaniesTransferListQuery,
  useLazyGetCompaniesTransferListQuery,
  useGetCompanyInvoiceTransferCheckQuery,
  useLazyGetCompanyInvoiceTransferCheckQuery,
  useUpdateCompanyTransferListMutation,
  useGetScoreCompanyByIdentifierQuery,
  useLazyGetScoreCompanyByIdentifierQuery,
  useGetConnectedIntegratorListQuery,
  useLazyGetConnectedIntegratorListQuery,
  useUpdateConnectedIntegratorListMutation,
  useGetIntegratorHistoryQuery,
  useLazyGetIntegratorHistoryQuery,
  useGetScoreCompanyDetailFullQuery,
  useLazyGetScoreCompanyDetailFullQuery,
  useGetCompanyDetailQuery,
  useLazyGetCompanyDetailQuery,
  useGetCompanyDetailWithAllocationsQuery,
  useLazyGetCompanyDetailWithAllocationsQuery,
  useGetGroupCompanyQuery,
  useLazyGetGroupCompanyQuery,
  // Legal proceedings hooks
  useGetLegalProceedingsReportQuery,
  useLazyGetLegalProceedingsReportQuery,
  useGetRiskyCalculationsQuery,
  useLazyGetRiskyCalculationsQuery,
  useGetCompensationStateTypesQuery,
  useLazyGetCompensationStateTypesQuery,
  useGetCompensationProtocolTypesQuery,
  useLazyGetCompensationProtocolTypesQuery,
  useGetIntegratorStatusTypesQuery,
  useLazyGetIntegratorStatusTypesQuery,
  useGetGuarantorRatesQuery,
  useLazyGetGuarantorRatesQuery,
  useGetLawFirmsQuery,
  useLazyGetLawFirmsQuery,
  useGetLegalProceedingByIdQuery,
  useLazyGetLegalProceedingByIdQuery,
  useCreateLegalProceedingMutation,
  useUpdateLegalProceedingMutation,
  useDeleteLegalProceedingMutation,
  // Compensation update hooks
  useGetCompensationItemQuery,
  useLazyGetCompensationItemQuery,
  useGetCompensationDetailsQuery,
  useLazyGetCompensationDetailsQuery,
  useUpdateCompensationItemMutation,
  // Company search hooks
  useLazySearchCompaniesByNameOrIdentifierQuery,
  useLazySearchFinancerCompaniesQuery,
  // Company settings and onboarding status hooks (Limit-specific)
  useGetLimitCompanySettingsQuery,
  useLazyGetLimitCompanySettingsQuery,
  useGetLimitAvailableOnboardingStatusQuery,
  useLazyGetLimitAvailableOnboardingStatusQuery,
  useUpdateLimitCompanyOnboardingStatusMutation,
} = limitOperationsApi;

// Re-export CompanyEInvoicesTab hooks
export {
  useGetCompanyEInvoicesQuery,
  useLazyGetCompanyEInvoicesQuery,
} from './CompanyEInvoicesTab/company-einvoices-tab.api';

// Re-export CompanyDocumentDataTab hooks
export {
  useDeleteFinancialDataMutation,
  useGetConnectedIntegratorQuery,
  useGetCompanyDetailScoreQuery as useGetDocumentDataCompanyDetailQuery,
  useGetFinancialDataQuery,
  useGetFindexReportQuery,
  useGetFindexReportsQuery,
  useLazyGetConnectedIntegratorQuery,
  useLazyGetCompanyDetailScoreQuery as useLazyGetDocumentDataCompanyDetailQuery,
  useLazyGetFinancialDataQuery,
  useLazyGetFindexReportQuery,
  useLazyGetFindexReportsQuery,
} from './CompanyDocumentDataTab/company-document-data-tab.api';

// Re-export CompanyLimitTab hooks
export {
  useGetActivityTypesQuery,
  useGetProductTypesQuery as useGetCompanyLimitProductTypesQuery,
  useGetCompaniesLimitQuery as useGetCompanyLimitQuery,
  useGetFinancerCompaniesQuery,
  useGetGuarantorCompanyListQuery,
  useGetLimitRejectReasonTypesQuery,
  useGetLoanDecisionTypesQuery,
  useGetNonGuarantorCompanyListQuery,
  useLazyGetActivityTypesQuery,
  useLazyGetProductTypesQuery as useLazyGetCompanyLimitProductTypesQuery,
  useLazyGetCompaniesLimitQuery as useLazyGetCompanyLimitQuery,
  useLazyGetFinancerCompaniesQuery,
  useLazyGetGuarantorCompanyListQuery,
  useLazyGetLimitRejectReasonTypesQuery,
  useLazyGetLoanDecisionTypesQuery,
  useLazyGetNonGuarantorCompanyListQuery,
} from './CompanyLimitTab/company-limit-tab.api';
