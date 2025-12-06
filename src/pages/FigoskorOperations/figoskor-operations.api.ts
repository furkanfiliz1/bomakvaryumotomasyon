import { baseApi } from '@api';
import type {
  CreateFigoskorReportRequest,
  CreateTargetCompanyMailsRequest,
  FigoskorClientRequestListRequest,
  FigoskorClientRequestListResponse,
  FigoskorCustomerListRequest,
  FigoskorCustomerListResponse,
  FigoskorFormData,
  FigoskorTargetCompanyListRequest,
  FigoskorTargetCompanyListResponse,
  SendBulkMailsRequest,
  UpdateTargetCompanyContactRequest,
} from './figoskor-operations.types';

export const figoskorOperationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get Figoskor Pro customers list - matches legacy _getSkorProCustomerList
    searchFigoScoreProClients: build.query<FigoskorCustomerListResponse, FigoskorCustomerListRequest>({
      query: (params) => ({
        url: '/figoscore/searchFigoScoreProClients',
        method: 'GET',
        params,
      }),
    }),

    // Get customer report requests - matches legacy _getFigoScoreProClientRequest
    getClientReportRequests: build.query<
      FigoskorClientRequestListResponse,
      FigoskorClientRequestListRequest & { customerId: string }
    >({
      query: ({ customerId, ...params }) => ({
        url: `/figoscore/getClientReportRequests/${customerId}`,
        method: 'GET',
        params,
      }),
    }),

    // Create client report request - matches legacy _createFigoscoreProRequest
    createClientReportRequest: build.mutation<void, CreateFigoskorReportRequest>({
      query: (body) => ({
        url: '/figoscore/createClientReportRequest',
        method: 'POST',
        body,
      }),
    }),

    // Get target companies for request - matches legacy _getFigoScoreProClientReportRequestTargetCompanies
    getClientReportRequestTargetCompanies: build.query<
      FigoskorTargetCompanyListResponse,
      FigoskorTargetCompanyListRequest & { requestId: string }
    >({
      query: ({ requestId, ...params }) => ({
        url: `/figoscore/getClientReportRequestTargetCompanies/${requestId}`,
        method: 'GET',
        params,
      }),
    }),

    // Get form data for company detail - matches legacy _getFigoScoreProFormData
    getFigoScoreProFormData: build.query<FigoskorFormData, { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/figoscore/getFigoScoreProFormData/${companyId}`,
        method: 'GET',
      }),
    }),

    // Cancel target company report request - matches legacy _putCancelRequestedTargetCompanyReport
    cancelRequestedTargetCompanyReport: build.mutation<unknown, { id: number }>({
      query: ({ id }) => ({
        url: `/figoscore/cancelRequestedTargetCompanyReport/${id}`,
        method: 'PUT',
        body: {},
      }),
    }),

    // Create target company mails - matches legacy _postCreateTargetCompanyMails
    createTargetCompanyMails: build.mutation<unknown, CreateTargetCompanyMailsRequest>({
      query: (data) => ({
        url: '/figoscore/createTargetCompanyMails',
        method: 'POST',
        body: data,
      }),
    }),

    // Get target company mails - matches legacy _getTargetCompanyMails
    getTargetCompanyMails: build.query<
      unknown,
      {
        targetCompanyIdentifier: string;
        reportRequestId: number;
        clientCompanyId: number;
      }
    >({
      query: (params) => ({
        url: '/figoscore/getTargetCompanyMails',
        method: 'GET',
        params,
      }),
    }),

    // Send bulk mails to target companies - matches legacy _postSendBulkMailsToTargetCompanies
    sendBulkMailsToTargetCompanies: build.mutation<unknown, SendBulkMailsRequest>({
      query: (data) => ({
        url: '/figoscore/sendBulkMailsToTargetCompanies',
        method: 'POST',
        body: data,
      }),
    }),

    // Update target company contact info - matches legacy _putUpdateTargetCompanyContactInfo
    updateTargetCompanyContactInfo: build.mutation<unknown, UpdateTargetCompanyContactRequest>({
      query: (data) => ({
        url: '/figoscore/updateTargetCompanyContactInfo',
        method: 'PUT',
        body: data,
      }),
    }),

    // Send figoscore pro info mail - matches legacy _getSendFigoscoreProInfoMail
    sendFigoScoreProInfoMail: build.query<unknown, { id: number }>({
      query: ({ id }) => ({
        url: `/figoscore/sendFigoScoreProInfoFormInvitationMail/${id}`,
        method: 'GET',
      }),
    }),

    // Get company documents - matches legacy _getCompanyDocuments
    getCompanyDocuments: build.query<unknown, { senderCompanyId: number }>({
      query: ({ senderCompanyId }) => ({
        url: '/documents/company',
        method: 'GET',
        params: { senderCompanyId },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  // Query hooks
  useSearchFigoScoreProClientsQuery,
  useLazySearchFigoScoreProClientsQuery,
  useGetClientReportRequestsQuery,
  useLazyGetClientReportRequestsQuery,
  useGetClientReportRequestTargetCompaniesQuery,
  useLazyGetClientReportRequestTargetCompaniesQuery,
  useGetFigoScoreProFormDataQuery,
  useLazyGetFigoScoreProFormDataQuery,
  useGetTargetCompanyMailsQuery,
  useLazyGetTargetCompanyMailsQuery,
  useSendFigoScoreProInfoMailQuery,
  useLazySendFigoScoreProInfoMailQuery,
  useGetCompanyDocumentsQuery,
  useLazyGetCompanyDocumentsQuery,

  // Mutation hooks
  useCreateClientReportRequestMutation,
  useCancelRequestedTargetCompanyReportMutation,
  useCreateTargetCompanyMailsMutation,
  useSendBulkMailsToTargetCompaniesMutation,
  useUpdateTargetCompanyContactInfoMutation,
} = figoskorOperationsApi;
