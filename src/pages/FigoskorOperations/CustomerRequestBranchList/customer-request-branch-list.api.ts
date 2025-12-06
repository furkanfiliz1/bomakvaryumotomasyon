import { baseApi } from '@api';
import type {
  CreateTargetCompanyMailsRequest,
  CustomerRequestBranchListRequest,
  CustomerRequestBranchListResponse,
  DeleteTargetCompanyMailRequest,
  RejectRequestRequest,
  SendBulkEmailRequest,
  ServerEmailListResponse,
  UpdateContactInfoRequest,
} from './customer-request-branch-list.types';

export const customerRequestBranchListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get customer request branch list - matches legacy _getFigoScoreProClientReportRequestTargetCompanies
    getCustomerRequestBranchList: build.query<
      CustomerRequestBranchListResponse,
      CustomerRequestBranchListRequest & { requestId: string }
    >({
      query: ({ requestId, ...params }) => ({
        url: `/figoscore/getClientReportRequestTargetCompanies/${requestId}`,
        method: 'GET',
        params,
      }),
    }),

    // Update target company contact info - matches legacy _putUpdateTargetCompanyContactInfo
    updateTargetCompanyContactInfo: build.mutation<unknown, UpdateContactInfoRequest>({
      query: (data) => ({
        url: '/figoscore/updateTargetCompanyContactInfo',
        method: 'PUT',
        body: data,
      }),
    }),

    // Get target company emails - matches legacy _getTargetCompanyMails
    getTargetCompanyEmails: build.query<
      ServerEmailListResponse,
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

    // Create/Send target company mails - matches legacy _postCreateTargetCompanyMails
    createTargetCompanyMails: build.mutation<unknown, CreateTargetCompanyMailsRequest>({
      query: (data) => ({
        url: '/figoscore/createTargetCompanyMails',
        method: 'POST',
        body: data,
      }),
    }),

    // Send bulk emails to target companies - matches legacy _postSendBulkMailsToTargetCompanies
    sendBulkEmailsToTargetCompanies: build.mutation<unknown, SendBulkEmailRequest>({
      query: (data) => ({
        url: '/figoscore/sendBulkMailsToTargetCompanies',
        method: 'POST',
        body: data,
      }),
    }),

    // Cancel/Reject target company report request - matches legacy _putCancelRequestedTargetCompanyReport
    rejectTargetCompanyRequest: build.mutation<unknown, RejectRequestRequest>({
      query: ({ targetCompanyId }) => ({
        url: `/figoscore/cancelRequestedTargetCompanyReport/${targetCompanyId}`,
        method: 'PUT',
      }),
    }),

    // Delete target company mail
    deleteTargetCompanyMail: build.mutation<unknown, DeleteTargetCompanyMailRequest>({
      query: (data) => ({
        url: '/figoscore/deleteTargetCompanyMails',
        method: 'DELETE',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  // Query hooks
  useGetCustomerRequestBranchListQuery,
  useLazyGetCustomerRequestBranchListQuery,
  useGetTargetCompanyEmailsQuery,
  useLazyGetTargetCompanyEmailsQuery,

  // Mutation hooks
  useUpdateTargetCompanyContactInfoMutation,
  useCreateTargetCompanyMailsMutation,
  useSendBulkEmailsToTargetCompaniesMutation,
  useRejectTargetCompanyRequestMutation,
  useDeleteTargetCompanyMailMutation,
} = customerRequestBranchListApi;
