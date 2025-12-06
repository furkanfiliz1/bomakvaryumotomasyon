/**
 * Opportunity Management API
 * Following LeadManagement pattern for RTK Query endpoints
 * Endpoints based on Swagger API specification
 */

import { baseApi } from 'src/api/baseApi';
import {
  CreateOpportunityApiArgs,
  CreateOpportunityApiResponse,
  DeleteOpportunityApiArgs,
  DeleteOpportunityApiResponse,
  GetOpportunitiesApiArgs,
  GetOpportunitiesApiResponse,
  GetOpportunityDetailApiArgs,
  GetOpportunityDetailApiResponse,
  UpdateOpportunityApiArgs,
  UpdateOpportunityApiResponse,
  UpdateOpportunityStatusBulkApiArgs,
  UpdateOpportunityStatusBulkApiResponse,
} from './opportunity-management.types';

// API Definition
export const opportunityManagementApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /api/opportunities/search - List with pagination and filters
    getOpportunities: builder.query<GetOpportunitiesApiResponse, GetOpportunitiesApiArgs>({
      query: ({
        // Destructure to exclude camelCase versions from spread
        page,
        pageSize,
        sortType,
        sort,
        isExport,
        subject,
        receiverName,
        createdAtStart,
        createdAtEnd,
        statusDescription,
        productType,
        receiverId,
        customerManagerId,
        winningStatus,
        salesScenario,
      }) => ({
        url: '/api/opportunities/search',
        method: 'GET',
        params: {
          // Map camelCase to PascalCase for API
          Subject: subject,
          ReceiverName: receiverName,
          CreatedAtStart: createdAtStart,
          CreatedAtEnd: createdAtEnd,
          StatusDescription: statusDescription,
          ProductType: productType,
          ReceiverId: receiverId,
          CustomerManagerId: customerManagerId,
          WinningStatus: winningStatus,
          SalesScenario: salesScenario,
          Page: page,
          PageSize: pageSize,
          SortType: sortType,
          Sort: sort,
          IsExport: isExport,
        },
      }),
    }),

    // GET /api/opportunities/{id} - Get detail by ID
    getOpportunityDetail: builder.query<GetOpportunityDetailApiResponse, GetOpportunityDetailApiArgs>({
      query: ({ id }) => ({
        url: `/api/opportunities/${id}`,
        method: 'GET',
      }),
    }),

    // POST /api/opportunities - Create new opportunity
    createOpportunity: builder.mutation<CreateOpportunityApiResponse, CreateOpportunityApiArgs>({
      query: ({ data }) => ({
        url: '/api/opportunities',
        method: 'POST',
        body: data,
      }),
    }),

    // PUT /api/opportunities/{id} - Update opportunity
    updateOpportunity: builder.mutation<UpdateOpportunityApiResponse, UpdateOpportunityApiArgs>({
      query: ({ id, data }) => ({
        url: `/api/opportunities/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE /api/opportunities/{id} - Soft delete opportunity
    deleteOpportunity: builder.mutation<DeleteOpportunityApiResponse, DeleteOpportunityApiArgs>({
      query: ({ id }) => ({
        url: `/api/opportunities/${id}`,
        method: 'DELETE',
      }),
    }),

    // POST /api/opportunities/update-status-bulk - Bulk status update (Won/Lost)
    updateOpportunityStatusBulk: builder.mutation<
      UpdateOpportunityStatusBulkApiResponse,
      UpdateOpportunityStatusBulkApiArgs
    >({
      query: (data) => ({
        url: '/api/opportunities/update-status-bulk',
        method: 'POST',
        body: data,
      }),
    }),

    // GET /types?EnumName=LeadSalesScenario - Get sales scenario types from API
    getSalesScenarioTypes: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'LeadSalesScenario' },
      }),
    }),

    // GET /types?EnumName=LeadSalesScenario - Get sales scenario types from API
    getOpportunityStatus: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'OpportunityStatus' },
      }),
    }),

    // GET /types?EnumName=LeadSalesScenario - Get sales scenario types from API
    getOpportunityWinningStatus: builder.query<Array<{ Value: string; Description: string }>, void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'OpportunityWinningStatus' },
      }),
    }),
  }),
});

// Export hooks with unique and descriptive names
export const {
  // List queries
  useGetOpportunitiesQuery,
  useLazyGetOpportunitiesQuery,
  // Detail queries
  useGetOpportunityDetailQuery,
  useLazyGetOpportunityDetailQuery,
  // Enum queries
  useGetSalesScenarioTypesQuery,
  // Mutations
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
  useUpdateOpportunityStatusBulkMutation,
  useGetOpportunityStatusQuery,
  useGetOpportunityWinningStatusQuery,
} = opportunityManagementApi;
