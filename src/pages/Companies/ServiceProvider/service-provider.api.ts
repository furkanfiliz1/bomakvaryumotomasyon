import { baseApi } from '@api';
import type {
  CompanyIntegrator,
  GetAllIntegratorsResponse,
  IntegratorKey,
  IntegratorType,
  NewIntegrator,
  UpdateCompanyIntegratorStatusRequest,
  UpdateIntegratorRequest,
} from './service-provider.types';

export const serviceProviderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get nested integrators list for dropdown
    getNestedIntegrators: build.query<IntegratorType[], void>({
      query: () => ({
        url: '/integrators/nestedIntegrators',
        method: 'GET',
      }),
      // Response is already an array, no need to transform
    }),

    // Get integrator type details and keys for parameter inputs
    getIntegratorType: build.query<{ Keys: IntegratorKey[] }, number>({
      query: (integratorId) => ({
        url: `/companies/integrator/create?IntegratorId=${integratorId}`,
        method: 'GET',
      }),
      // API returns { Keys: IntegratorKey[] } directly
    }),

    // Get all integrators for a company
    getAllIntegrators: build.query<CompanyIntegrator[], string>({
      query: (companyIdentifier) => ({
        url: `/companies/allIntegrators`,
        method: 'GET',
        params: { Identifier: companyIdentifier },
      }),
      transformResponse: (response: GetAllIntegratorsResponse) => response.Integrators,
    }),

    // Create new integrator for company
    postIntegratorsCompany: build.mutation<void, NewIntegrator>({
      query: (newIntegrator) => ({
        url: '/companies/integrator',
        method: 'POST',
        body: newIntegrator,
      }),
    }),

    // Update existing integrator
    putIntegratorsCompany: build.mutation<void, { data: UpdateIntegratorRequest; id: number }>({
      query: ({ data, id }) => ({
        url: `/companies/integrator/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Update company integrator status (activate/deactivate)
    putCompanyStatusUpdate: build.mutation<void, UpdateCompanyIntegratorStatusRequest>({
      query: (statusUpdate) => ({
        url: `companies/integrator/${statusUpdate.Id}/statusUpdate`,
        method: 'PUT',
        body: statusUpdate,
      }),
    }),

    // Delete integrator
    deleteIntegrator: build.mutation<void, number>({
      query: (integratorId) => ({
        url: `/companies/integrator/${integratorId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetNestedIntegratorsQuery,
  useLazyGetIntegratorTypeQuery,
  useGetAllIntegratorsQuery,
  usePostIntegratorsCompanyMutation,
  usePutIntegratorsCompanyMutation,
  usePutCompanyStatusUpdateMutation,
  useDeleteIntegratorMutation,
} = serviceProviderApi;
