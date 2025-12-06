/**
 * Customer Acquisition Team API Endpoints
 * Following OperationPricing RTK Query pattern exactly
 * Matches legacy endpoints: /trackingTeam (GET, POST, PUT, DELETE)
 */

import { baseApi } from '@api';
import type {
  CreateCustomerAcquisitionTeamMemberRequest,
  CustomerAcquisitionTeamMember,
  UpdateCustomerAcquisitionTeamMemberRequest,
} from './customer-acquisition-team.types';

export const customerAcquisitionTeamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get all customer acquisition team members
     * GET /trackingTeam
     */
    getCustomerAcquisitionTeamList: build.query<CustomerAcquisitionTeamMember[], void>({
      query: () => ({
        url: '/trackingTeam',
        method: 'GET',
      }),
    }),

    /**
     * Create new customer acquisition team member
     * POST /trackingTeam
     */
    createCustomerAcquisitionTeamMember: build.mutation<void, CreateCustomerAcquisitionTeamMemberRequest>({
      query: (body) => ({
        url: '/trackingTeam',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Update existing customer acquisition team member
     * PUT /trackingTeam/{id}
     */
    updateCustomerAcquisitionTeamMember: build.mutation<void, UpdateCustomerAcquisitionTeamMemberRequest>({
      query: (body) => ({
        url: `/trackingTeam/${body.Id}`,
        method: 'PUT',
        body,
      }),
    }),

    /**
     * Delete customer acquisition team member
     * DELETE /trackingTeam/{id}
     */
    deleteCustomerAcquisitionTeamMember: build.mutation<void, number>({
      query: (id) => ({
        url: `/trackingTeam/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCustomerAcquisitionTeamListQuery,
  useCreateCustomerAcquisitionTeamMemberMutation,
  useUpdateCustomerAcquisitionTeamMemberMutation,
  useDeleteCustomerAcquisitionTeamMemberMutation,
} = customerAcquisitionTeamApi;
