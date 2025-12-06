/**
 * Integrators API
 * RTK Query endpoints for integrators management
 * Matches legacy API exactly: https://apitest.figopara.com/integrators
 */

import { baseApi } from '@api';
import type {
  CreateIntegratorRequest,
  DataTypeOption,
  InputDataTypeOption,
  IntegrationTypeOption,
  Integrator,
  IntegratorDetail,
  IntegratorTemplate,
  UpdateCommissionRateRequest,
  UpdateIntegratorRequest,
} from './integrators.types';

export const integratorsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * GET /integrators/nestedIntegrators - Get all integrators with nested structure
     * Returns hierarchical list of integrators with SubIntegrators
     */
    getNestedIntegrators: build.query<Integrator[], void>({
      query: () => ({
        url: '/integrators/nestedIntegrators',
        method: 'GET',
      }),
    }),

    /**
     * GET /integrators/{id} - Get integrator detail by ID
     * Returns single integrator with all details including Params
     */
    getIntegratorDetail: build.query<IntegratorDetail, number>({
      query: (id) => ({
        url: `/integrators/${id}`,
        method: 'GET',
      }),
    }),

    /**
     * POST /integrators - Create new integrator
     */
    createIntegrator: build.mutation<{ Id: number }, CreateIntegratorRequest>({
      query: (payload) => ({
        url: '/integrators',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * PUT /integrators/{id} - Update existing integrator
     */
    updateIntegrator: build.mutation<void, UpdateIntegratorRequest>({
      query: (payload) => ({
        url: `/integrators/${payload.Id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    /**
     * PUT /integrators/{id}/commissionRate - Update commission rate separately
     */
    updateIntegratorCommissionRate: build.mutation<void, UpdateCommissionRateRequest>({
      query: (payload) => ({
        url: `/integrators/${payload.Id}/commissionRate`,
        method: 'PUT',
        body: payload,
      }),
    }),

    /**
     * GET /types?EnumName=IntegrationType - Get integration type options
     */
    getIntegrationTypes: build.query<IntegrationTypeOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'IntegrationType' },
      }),
    }),

    /**
     * GET /types?EnumName=DataType - Get data type options for params
     */
    getDataTypes: build.query<DataTypeOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'DataType' },
      }),
    }),

    /**
     * GET /types?EnumName=InputDataType - Get input data type options for params
     */
    getInputDataTypes: build.query<InputDataTypeOption[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: { EnumName: 'InputDataType' },
      }),
    }),

    /**
     * GET /integrators/templates/{id}/{languageId} - Get integrator template
     */
    getIntegratorTemplate: build.query<IntegratorTemplate, { id: number; languageId: number }>({
      query: ({ id, languageId }) => ({
        url: `/integrators/templates/${id}/${languageId}`,
        method: 'GET',
      }),
    }),

    /**
     * POST /integrators/{id}/{languageId}/template - Upload template file
     */
    uploadIntegratorTemplate: build.mutation<void, { id: number; languageId: number; formData: FormData }>({
      query: ({ id, languageId, formData }) => ({
        url: `/integrators/${id}/${languageId}/template`,
        method: 'POST',
        body: formData,
        formData: true,
        contentType: 'multipart/form-data',
      }),
    }),

    /**
     * DELETE /integrators/templates/{id} - Delete integrator template
     */
    deleteIntegratorTemplate: build.mutation<void, number>({
      query: (templateId) => ({
        url: `/integrators/templates/${templateId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetNestedIntegratorsQuery,
  useLazyGetNestedIntegratorsQuery,
  useGetIntegratorDetailQuery,
  useLazyGetIntegratorDetailQuery,
  useCreateIntegratorMutation,
  useUpdateIntegratorMutation,
  useUpdateIntegratorCommissionRateMutation,
  useGetIntegrationTypesQuery,
  useGetDataTypesQuery,
  useGetInputDataTypesQuery,
  useGetIntegratorTemplateQuery,
  useLazyGetIntegratorTemplateQuery,
  useUploadIntegratorTemplateMutation,
  useDeleteIntegratorTemplateMutation,
} = integratorsApi;
