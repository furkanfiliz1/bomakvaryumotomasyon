/**
 * Lead Management API
 * Following OperationPricing pattern for RTK Query endpoints with mock data
 * Note: Cache tags (providesTags/invalidatesTags) are commented out for mock data.
 * They will be needed when connecting to real API endpoints.
 */

import { baseApi } from 'src/api/baseApi';
import {
  CallHistory,
  CreateCallApiArgs,
  CreateCallApiResponse,
  CreateLeadApiArgs,
  CreateLeadApiResponse,
  CreateLeadsExcelApiArgs,
  CreateLeadsExcelApiResponse,
  DeleteCallApiArgs,
  DeleteCallApiResponse,
  DeleteLeadApiArgs,
  DeleteLeadApiResponse,
  GetCallHistoryApiArgs,
  GetCallHistoryApiResponse,
  GetLeadDetailApiArgs,
  GetLeadDetailApiResponse,
  GetLeadsApiArgs,
  GetLeadsApiResponse,
  LeadSalesScenario,
  SearchCallHistoryApiArgs,
  SearchCallHistoryApiResponse,
  UpdateCallApiArgs,
  UpdateCallApiResponse,
  UpdateLeadApiArgs,
  UpdateLeadApiResponse,
} from './lead-management.types';

// Mock data removed - using real API endpoints now

// API Definition
export const leadManagementApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Leads List - Real API Integration
    getLeads: builder.query<GetLeadsApiResponse, GetLeadsApiArgs>({
      query: (params) => ({
        url: '/api/leads/search',
        method: 'GET',
        params: {
          ...params,
        },
      }),
    }),

    // Get Lead Detail - Real API Integration
    getLeadDetail: builder.query<GetLeadDetailApiResponse, GetLeadDetailApiArgs>({
      query: ({ id }) => ({
        url: `/api/leads/${id}`,
        method: 'GET',
      }),
    }),

    // Create Lead (Single) - Real API Integration
    createLead: builder.mutation<CreateLeadApiResponse, CreateLeadApiArgs>({
      query: ({ data }) => ({
        url: '/api/leads',
        method: 'POST',
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          mobilePhone: data.phone,
          companyName: data.title,
          taxNumber: data.taxNumber,
          productTypes: data.products,
        },
      }),
    }),

    // Create Leads from Excel - Using LeadRequestModel structure
    // Endpoint: POST /api/leads/import-excel
    // Maps LeadAddManuelFormData to LeadRequestModel with all required fields
    createLeadsExcel: builder.mutation<CreateLeadsExcelApiResponse, CreateLeadsExcelApiArgs>({
      query: ({ data }) => ({
        url: '/api/leads/import-excel',
        method: 'POST',
        body: data.map((lead) => ({
          companyName: lead.title,
          taxNumber: lead.taxNumber,
          firstName: lead.firstName,
          lastName: lead.lastName,
          mobilePhone: lead.phone,
          productTypes: lead.products,
        })),
      }),
    }),

    // Update Lead - Real API Integration
    updateLead: builder.mutation<UpdateLeadApiResponse, UpdateLeadApiArgs>({
      query: ({ id, data }) => {
        return {
          url: `/api/leads/${id}`,
          method: 'PUT',
          body: data,
        };
      },
    }),

    // Get Call History - Real API Integration
    getCallHistory: builder.query<GetCallHistoryApiResponse, GetCallHistoryApiArgs>({
      query: ({ leadId }) => ({
        url: `/api/leads/${leadId}/phone-calls`,
        method: 'GET',
      }),
      transformResponse: (response: CallHistory[]) => ({
        Data: response,
      }),
    }),

    // Search Call History (Paginated) - Real API Integration
    searchCallHistory: builder.query<SearchCallHistoryApiResponse, SearchCallHistoryApiArgs>({
      query: (args) => ({
        url: '/api/leads/phone-calls/search',
        method: 'POST',
        body: {
          page: args.page || 1,
          pageSize: args.pageSize || 25,
          leadId: args.leadId,
          callerId: args.callerId,
          callResult: args.callResult,
          salesScenario: args.salesScenario,
          startDate: args.startDate,
          endDate: args.endDate,
        },
      }),
    }),

    // Create Call - Real API Integration
    createCall: builder.mutation<CreateCallApiResponse, CreateCallApiArgs>({
      query: ({ data }) => ({
        url: '/api/leads/phone-calls',
        method: 'POST',
        body: data,
      }),
    }),

    // Update Call - Real API Integration
    updateCall: builder.mutation<UpdateCallApiResponse, UpdateCallApiArgs>({
      query: ({ id, data }) => ({
        url: `/api/leads/phone-calls/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Delete Call - Real API Integration
    deleteCall: builder.mutation<DeleteCallApiResponse, DeleteCallApiArgs>({
      query: ({ id }) => ({
        url: `/api/leads/phone-calls/${id}`,
        method: 'DELETE',
      }),
    }),

    // Delete Lead - Real API Integration
    deleteLead: builder.mutation<DeleteLeadApiResponse, DeleteLeadApiArgs>({
      query: ({ id }) => ({
        url: `/api/leads/${id}`,
        method: 'DELETE',
      }),
    }),

    // Common types/enums
    getSalesScenarios: builder.query<LeadSalesScenario[], void>({
      query: () => ({
        url: '/types?EnumName=LeadSalesScenario',
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useGetLeadDetailQuery, // For Lead Detail page
  useLazyGetLeadDetailQuery, // For Lead Detail page
  useCreateLeadMutation, // For Lead Add page (Manuel)
  useCreateLeadsExcelMutation, // For Lead Add page (Excel)
  useUpdateLeadMutation, // For Lead Detail page (Update)
  useDeleteLeadMutation, // For Lead List page - DELETE /api/leads/{id}
  useGetCallHistoryQuery, // For Lead Detail page (Call History tab) - GET /leads/{leadId}/phone-calls
  useLazyGetCallHistoryQuery, // For Lead Detail page (Call History tab)
  useSearchCallHistoryQuery, // For Call History search (Paginated) - POST /leads/phone-calls/search
  useLazySearchCallHistoryQuery, // For Call History search (Lazy)
  useCreateCallMutation, // For Lead Detail page (Call History tab) - POST /leads/phone-calls
  useUpdateCallMutation, // For Lead Detail page (Call History tab) - PUT /leads/phone-calls/{id}
  useDeleteCallMutation, // For Lead Detail page (Call History tab) - DELETE /leads/phone-calls/{id}
  useGetSalesScenariosQuery,
} = leadManagementApi;
