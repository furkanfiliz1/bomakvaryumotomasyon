import { baseApi } from '@api';
import {
  CompanyDiscount,
  CompanyDiscountListResponse,
  DiscountType,
  CreateCompanyDiscountRequest,
  UpdateCompanyDiscountRequest,
  TransactionFeeDiscountServerSideQueryArgs,
  CompanySearchResponse,
} from './transaction-fee-discount.types';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';

const transactionFeeDiscountApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCompanyDiscounts: builder.query<
      ServerSideQueryResult<CompanyDiscount>,
      TransactionFeeDiscountServerSideQueryArgs
    >({
      query: (filters) => ({
        url: '/companies/discounts',
        method: 'GET',
        params: {
          senderCompanyIdentifier: filters.senderCompanyIdentifier ?? undefined,
          receiverCompanyIdentifier: filters.receiverCompanyIdentifier ?? undefined,
          isActive: filters.isActive !== '' ? filters.isActive : undefined,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 25,
        },
      }),
      transformResponse: (response: CompanyDiscountListResponse): ServerSideQueryResult<CompanyDiscount> => ({
        Items: response.Items ?? [],
        TotalCount: response.TotalCount ?? 0,
      }),
    }),

    getCompanyDiscountById: builder.query<CompanyDiscount, number>({
      query: (id) => ({
        url: `/companies/discounts/${id}`,
        method: 'GET',
      }),
    }),

    createCompanyDiscount: builder.mutation<{ IsSuccess: boolean }, CreateCompanyDiscountRequest>({
      query: (discount) => ({
        url: '/companies/discounts',
        method: 'POST',
        body: discount,
      }),
    }),

    updateCompanyDiscount: builder.mutation<{ IsSuccess: boolean }, { id: number; data: UpdateCompanyDiscountRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/companies/discounts/${id}`,
          method: 'PUT',
          body: data,
        }),
      },
    ),

    deleteCompanyDiscount: builder.mutation<{ IsSuccess: boolean }, number>({
      query: (id) => ({
        url: `/companies/discounts/${id}`,
        method: 'DELETE',
      }),
    }),

    getDiscountTypes: builder.query<DiscountType[], void>({
      query: () => ({
        url: '/types/DiscountTypes',
        method: 'GET',
      }),
    }),

    searchByCompanyNameOrIdentifier: builder.query<
      CompanySearchResponse,
      {
        CompanyNameOrIdentifier?: string;
        CompanyActivityType: number;
      }
    >({
      query: (params) => ({
        url: '/companies/searchByCompanyNameOrIdentifier',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetCompanyDiscountsQuery,
  useGetCompanyDiscountByIdQuery,
  useCreateCompanyDiscountMutation,
  useUpdateCompanyDiscountMutation,
  useDeleteCompanyDiscountMutation,
  useGetDiscountTypesQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} = transactionFeeDiscountApi;
