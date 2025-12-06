import { baseApi } from '@api';
import { ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import type {
  OperationChargeHistoryDetailItem,
  OperationPricingItem,
  OperationPricingQueryParams,
  OperationPricingResponse,
  PaymentDetail,
} from './operation-pricing.types';

// Define specific response type for payment details
interface OperationChargePaymentDetails {
  Id: number;
  ChargeId: number;
  Details: Record<string, unknown>[]; // Generic object array for payment details
}

// Extended interface for operation pricing data with additional totals
interface OperationPricingServerSideResult extends ServerSideQueryResult<OperationPricingItem> {
  TotalAmount?: number;
  TotalReturnAmount?: number;
  TotalSubAmount?: number;
  TotalDiscountAmount?: number;
}

export const operationPricingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get operation pricing report data - using the correct payments/report endpoint
    getOperationPricingReport: build.query<OperationPricingServerSideResult, OperationPricingQueryParams>({
      query: (params) => ({
        url: '/payments/report',
        method: 'GET',
        params,
      }),
      transformResponse: (response: OperationPricingResponse): OperationPricingServerSideResult => ({
        Items: response.Items || [],
        TotalCount: response.TotalCount || 0,
        ExtensionData: response.ExtensionData ? String(response.ExtensionData) : null,
        // Include additional totals from the API response
        TotalAmount: response.TotalAmount || 0,
        TotalReturnAmount: response.TotalReturnAmount || 0,
        TotalSubAmount: response.TotalSubAmount || 0,
        TotalDiscountAmount: response.TotalDiscountAmount || 0,
      }),
    }),

    // Refund payment - matches legacy API exactly (POST /payments/refundPayment)
    refundPayment: build.mutation<void, { OrderNumber: string; RefundReason: string }>({
      query: (refundData) => ({
        url: '/payments/refundPayment',
        method: 'POST',
        body: refundData,
      }),
    }),

    // Refund payment transaction - matches legacy API exactly (POST /payments/refundPaymentTransaction)
    refundPaymentTransaction: build.mutation<void, { operationChargeHistoryDetailId: number; refundReason: string }>({
      query: (refundData) => ({
        url: '/payments/refundPaymentTransaction',
        method: 'POST',
        body: refundData,
      }),
    }),

    // Get operation charge payment details
    getOperationChargePaymentDetails: build.query<OperationChargePaymentDetails, number>({
      query: (chargeId) => ({
        url: `/operationCharges/${chargeId}/details`,
        method: 'GET',
      }),
    }),

    // Get payment details from payments endpoint (simple GET without pagination)
    getPaymentDetails: build.query<PaymentDetail[], { paymentId: number }>({
      query: ({ paymentId }) => ({
        url: `/payments/${paymentId}/details`,
        method: 'GET',
      }),
    }),

    // Get operation charge history details for regular charges (not FigoSkor)
    getOperationChargeHistoryDetails: build.query<
      {
        Items: OperationChargeHistoryDetailItem[];
        Page: number;
        PageSize: number;
        TotalCount: number;
        Sort: string | null;
        SortType: string;
        IsExport: boolean;
        ExtensionData: unknown;
      },
      { operationChargeHistoryId: number; filters?: Record<string, unknown> }
    >({
      query: ({ operationChargeHistoryId, filters = {} }) => ({
        url: '/payments/operationChargeHistoryDetails',
        method: 'GET',
        params: {
          OperationChargeHistoryId: operationChargeHistoryId,
          Page: filters.Page || 1,
          PageSize: filters.PageSize || 10,
          Sort: filters.Sort || 'Id',
          SortType: filters.SortType || 'Desc',
          ...filters,
        },
      }),
    }),
  }),
});

export const {
  useGetOperationPricingReportQuery,
  useLazyGetOperationPricingReportQuery,
  useRefundPaymentMutation,
  useRefundPaymentTransactionMutation,
  useGetOperationChargePaymentDetailsQuery,
  useGetPaymentDetailsQuery,
  useLazyGetPaymentDetailsQuery,
  useGetOperationChargeHistoryDetailsQuery,
  useLazyGetOperationChargeHistoryDetailsQuery,
} = operationPricingApi;
