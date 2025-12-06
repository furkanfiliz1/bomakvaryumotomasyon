/**
 * Company Document Data Tab API
 * Following OperationPricing pattern for API definitions
 * Matches legacy ScoreCompanyDocumentAndInvoices.js API calls exactly
 */

import { baseApi, scoreBaseURL } from '@api';
import type {
  CompanyDetailResponse,
  ConnectedIntegratorParams,
  ConnectedIntegratorResponse,
  FinancialDataParams,
  FinancialDataResponse,
  FindeksReportParams,
  FindeksReportResponse,
  FindeksReportsParams,
  FindeksReportsResponse,
} from './company-document-data-tab.types';

// Additional types for API parameters
export interface CompanyDetailParams {
  identifier: string;
}

export const companyDocumentDataTabApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /companies/findexReportAll/{companyId} - matches legacy _getFindexReports
    getFindexReports: builder.query<FindeksReportsResponse, FindeksReportsParams>({
      query: ({ companyId }) => ({
        url: `/companies/findexReportAll/${companyId}`,
        method: 'GET',
      }),
    }),

    // GET /companies/findexReportById/{reportId} - matches legacy _getFindexReport
    getFindexReport: builder.query<FindeksReportResponse, FindeksReportParams>({
      query: ({ reportId }) => ({
        url: `/companies/findexReportById/${reportId}`,
        method: 'GET',
      }),
    }),

    // GET /eledgers?identifier={identifier} - matches legacy _getFinancialData
    getFinancialData: builder.query<FinancialDataResponse, FinancialDataParams>({
      query: ({ identifier }) => ({
        url: `${scoreBaseURL}/eledgers`,
        method: 'GET',
        params: { identifier },
      }),
    }),

    // GET /companies/integrator?type={type}&identifier={identifier} - matches legacy _getConnectedIntegratorList
    getConnectedIntegrator: builder.query<ConnectedIntegratorResponse, ConnectedIntegratorParams>({
      query: ({ type, identifier }) => ({
        url: `/companies/integrator`,
        method: 'GET',
        params: { type, identifier },
      }),
    }),

    // GET /companies/{identifier} - Score API endpoint for invoice integrator details
    getCompanyDetailScore: builder.query<CompanyDetailResponse, CompanyDetailParams>({
      query: ({ identifier }) => ({
        url: `${scoreBaseURL}/companies/${identifier}`,
        method: 'GET',
      }),
    }),

    // DELETE /eledgers/{id} - matches legacy _deleteEledgerDocument
    deleteFinancialData: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `${scoreBaseURL}/eledgers/${id}`,
        method: 'DELETE',
      }),
    }),

    // PUT /companies/{identifier} - matches legacy _putConnectedIntegratorList
    updateInvoiceIntegratorDetails: builder.mutation<
      void,
      { identifier: string; data: UpdateInvoiceIntegratorRequest }
    >({
      query: ({ identifier, data }) => ({
        url: `${scoreBaseURL}/companies/${identifier}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

// Export hooks following OperationPricing pattern
export const {
  useGetFindexReportsQuery,
  useLazyGetFindexReportsQuery,
  useGetFindexReportQuery,
  useLazyGetFindexReportQuery,
  useGetFinancialDataQuery,
  useLazyGetFinancialDataQuery,
  useGetConnectedIntegratorQuery,
  useLazyGetConnectedIntegratorQuery,
  useGetCompanyDetailScoreQuery,
  useLazyGetCompanyDetailScoreQuery,
  useDeleteFinancialDataMutation,
  useUpdateInvoiceIntegratorDetailsMutation,
} = companyDocumentDataTabApi;

// Additional type for company detail params
export interface CompanyDetailParams {
  identifier: string;
}

// Update invoice integrator request type - matching legacy _putConnectedIntegratorList
export interface UpdateInvoiceIntegratorRequest {
  nextIncomingDate: string; // YYYY-MM-DD format
  nextOutgoingDate: string; // YYYY-MM-DD format
  requestCurrentLimit: number;
  requestLimitDate: string; // YYYY-MM-DD format
}
