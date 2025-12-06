import { baseApi } from '@api';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import {
  CompanyActivityType,
  CompanySearchByNameOrIdentifierResult,
  ManualTransactionFeeDetailResponse,
  ManualTransactionFeeFilters,
  ManualTransactionFeeItem,
  ManualTransactionFeeStatusOption,
  UpdateManualTransactionFeeRequest,
} from './manual-transaction-fee-tracking.types';

export const manualTransactionFeeTrackingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getManualTransactionFeeList: builder.query<
      ServerSideQueryResult<ManualTransactionFeeItem>,
      ServerSideQueryArgs & ManualTransactionFeeFilters
    >({
      query: (params) => {
        // Transform parameters to match legacy API exactly
        const apiParams = {
          page: params.page || 1,
          pageSize: params.pageSize || 25,
          sort: params.sort || 'AllowanceIssueDate',
          sortType: params.sortType || 'Desc',
          ...(params.AllowanceId && { AllowanceId: params.AllowanceId }),
          ...(params.NotifyBuyer !== undefined && { NotifyBuyer: params.NotifyBuyer }),
          ...(params.AllowanceKind !== undefined && { AllowanceKind: params.AllowanceKind }),
          ...(params.Status !== undefined && { Status: params.Status }),
          ...(params.StartDate && { StartDate: params.StartDate }),
          ...(params.EndDate && { EndDate: params.EndDate }),
          ...(params.ReceiverIdentifier && { ReceiverIdentifier: params.ReceiverIdentifier }),
          ...(params.SenderIdentifier && { SenderIdentifier: params.SenderIdentifier }),
          ...(params.isExport !== undefined && { isExport: params.isExport }),
        };

        return {
          url: '/operationManualCharge/search',
          params: apiParams,
        };
      },
      transformResponse: (response: {
        Items: ManualTransactionFeeItem[];
        TotalCount: number;
        Page: number;
        PageSize: number;
        SortType: string;
        Sort: string | null;
        IsExport: boolean;
        ExtensionData: unknown;
      }): ServerSideQueryResult<ManualTransactionFeeItem> => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: (response.ExtensionData as string) || null,
      }),
    }),

    getManualTransactionFeeById: builder.query<ManualTransactionFeeDetailResponse, number>({
      query: (id) => ({
        url: `/operationManualCharge/${id}`,
      }),
      keepUnusedDataFor: 0, // Disable caching for edit page
    }),

    updateManualTransactionFee: builder.mutation<void, UpdateManualTransactionFeeRequest>({
      query: ({ Id, ...data }) => ({
        url: `/operationManualCharge/${Id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    getOperationManualChargeStatus: builder.query<ManualTransactionFeeStatusOption[], void>({
      query: () => ({
        url: '/types?EnumName=OperationManualChargeStatus',
      }),
      transformResponse: (response: { Value: string; Description: string }[]) =>
        response.map((item) => ({
          Value: parseInt(item.Value, 10), // Convert string to number
          Text: item.Description,
        })),
    }),

    getAllowanceKinds: builder.query<ManualTransactionFeeStatusOption[], void>({
      query: () => ({
        url: '/types?EnumName=AllowanceKinds',
      }),
      transformResponse: (response: { Value: string; Description: string }[]) =>
        response.map((item) => ({
          Value: parseInt(item.Value, 10), // Convert string to number
          Text: item.Description,
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
  }),
});

export const {
  useGetManualTransactionFeeListQuery,
  useLazyGetManualTransactionFeeListQuery,
  useGetManualTransactionFeeByIdQuery,
  useLazyGetManualTransactionFeeByIdQuery,
  useUpdateManualTransactionFeeMutation,
  useGetOperationManualChargeStatusQuery,
  useGetAllowanceKindsQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} = manualTransactionFeeTrackingApi;
