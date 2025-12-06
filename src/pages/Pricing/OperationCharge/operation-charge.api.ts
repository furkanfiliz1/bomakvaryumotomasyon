import { baseApi } from '@api';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import {
  CompanyActivityType,
  CompanyFinancierOption,
  CompanySearchByNameOrIdentifierResult,
  CompanySearchResult,
  CreateOperationChargeAmountRequest,
  CreateOperationChargeRequest,
  CreateOperationChargeResponse,
  DeleteOperationChargesRequest,
  DiscountAutoFillItem,
  GetCompanyOperationChargeResponse,
  GetOperationChargeByIdResponse,
  IntegratorStatusOption,
  OperationCharge,
  OperationChargeFilters,
  UpdateOperationChargeRequest,
} from './operation-charge.types';

export const pricingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOperationCharges: builder.query<
      ServerSideQueryResult<OperationCharge>,
      ServerSideQueryArgs & OperationChargeFilters
    >({
      query: (params) => ({
        url: '/companies/operationcharges/search',
        params,
      }),
    }),

    deleteOperationCharges: builder.mutation<void, DeleteOperationChargesRequest>({
      query: (body) => ({
        url: '/companies/operationcharges/deleteOperationCharges',
        method: 'DELETE',
        body,
      }),
    }),

    getIntegratorStatus: builder.query<IntegratorStatusOption[], void>({
      query: () => ({
        url: '/types?EnumName=OperationChargeDefinitionType',
      }),
      transformResponse: (response: { Value: number; Description: string }[]) =>
        response.map((item) => ({
          value: item.Value,
          label: item.Description,
        })),
    }),

    searchCompanies: builder.query<
      CompanySearchResult[],
      {
        GroupedCompanyId?: number;
        CompanyNameOrIdentifier?: string;
        CompanyActivityType: CompanyActivityType;
      }
    >({
      query: (params) => ({
        url: '/companies/search',
        params,
      }),
      transformResponse: (response: { Items: CompanySearchResult[] }) =>
        response.Items.map((item) => ({
          ...item,
          label: `${item.CompanyName ?? '-'} / ${item.Identifier ?? '-'}`,
          value: item.Identifier,
        })),
    }),

    searchByCompanyNameOrIdentifier: builder.query<
      CompanySearchByNameOrIdentifierResult,
      { CompanyNameOrIdentifier?: string; CompanyActivityType: CompanyActivityType }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        params,
      }),
    }),

    // Get buyers by activity type - companies/activityType/1
    getBuyersByActivityType: builder.query<CompanySearchResult[], void>({
      query: () => ({
        url: '/companies/activityType/1',
      }),
    }),

    // Operation Charge CRUD endpoints
    getOperationChargeById: builder.query<GetOperationChargeByIdResponse, number>({
      query: (id) => ({
        url: `/companies/operationcharges/GetCompanyOperationCharge/${id}?isDeleted=false`,
      }),
    }),

    createOperationCharge: builder.mutation<CreateOperationChargeResponse, CreateOperationChargeRequest>({
      query: (body) => ({
        url: '/companies/operationcharges/createByReceiverAndFinancerIdList',
        method: 'POST',
        body,
      }),
    }),

    updateOperationCharge: builder.mutation<void, UpdateOperationChargeRequest>({
      query: ({ Id, ...body }) => ({
        url: `/companies/operationcharges/${Id}`,
        method: 'PUT',
        body,
      }),
    }),

    deleteOperationChargeAmount: builder.mutation<void, number>({
      query: (id) => ({
        url: `/companies/operationcharges/OperationChargeAmount/${id}`,
        method: 'DELETE',
      }),
    }),

    createOperationChargeAmount: builder.mutation<void, { id: number; body: CreateOperationChargeAmountRequest }>({
      query: ({ id, body }) => ({
        url: `/companies/operationcharges/${id}/CreateOperationChargeAmount`,
        method: 'POST',
        body,
      }),
    }),

    getDiscountAutoFillItems: builder.query<DiscountAutoFillItem, { Identifier: string; ProductType: string }>({
      query: (params) => ({
        url: '/companies/discounts/getDiscountAutoFillItems',
        params,
      }),
    }),

    getCompanyOperationCharge: builder.query<GetCompanyOperationChargeResponse, number>({
      query: (id) => ({
        url: `/companies/operationcharges/GetCompanyOperationCharge/${id}?isDeleted=true`,
      }),
    }),

    getFinancierCompaniesFromActivityType: builder.query<CompanyFinancierOption[], void>({
      query: () => ({
        url: '/companies/search',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 999,
        },
      }),
      transformResponse: (response: { Items: { Id: number; Identifier: string; CompanyName: string }[] }) =>
        response.Items.map((item) => ({
          value: item.Identifier,
          label: `${item.Identifier} - ${item.CompanyName}`,
          Id: item.Id,
          Identifier: item.Identifier,
          CompanyName: item.CompanyName,
        })),
    }),
  }),
});

export const {
  useGetOperationChargesQuery,
  useLazyGetOperationChargesQuery,
  useDeleteOperationChargesMutation,
  useGetIntegratorStatusQuery,
  useLazySearchCompaniesQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
  useGetBuyersByActivityTypeQuery,
  useGetOperationChargeByIdQuery,
  useCreateOperationChargeMutation,
  useUpdateOperationChargeMutation,
  useDeleteOperationChargeAmountMutation,
  useCreateOperationChargeAmountMutation,
  useLazyGetDiscountAutoFillItemsQuery,
  useGetCompanyOperationChargeQuery,
  useGetFinancierCompaniesFromActivityTypeQuery,
} = pricingApi;
