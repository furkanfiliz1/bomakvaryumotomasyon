import { baseApi } from '@api';
import { RESPONSE_DATE } from '@constant';
import { AllowanceStatusEnum } from '@types';
import dayjs from 'dayjs';
import { ServerSideQueryArgs, ServerSideQueryResult } from 'src/hooks/useServerSideQuery';
import {
  AllowanceBidsResponseModel,
  AllowanceDetailResponseModel,
  AllowanceFundingData,
  AllowanceListResponseModel,
  AllowanceLogsParams,
  AllowanceLogsResponseModel,
  AllowancePaymentGetResponseModel,
  AllowancePaymentInfoResponseModel,
  AllowancePaymentRequestModel,
  AllowanceStatusOption,
  BankBranchOption,
  BankOption,
  BillData,
  ChequeData,
  City,
  CollectionsResponseModel,
  CompanyDocumentData,
  CompanyListItem,
  CompanySearchItem,
  CreateAllowanceRequest,
  CreateAllowanceResponse,
  CreateCompanyForBillOperationRequest,
  CreateCompanyForBillOperationResponse,
  CreateFinancerRetreatRequest,
  CreateTransactionFeeRequest,
  CustomerManager,
  DiscountFeeData,
  DiscountOperation,
  District,
  DocumentDownloadResponse,
  DownloadBillDocumentRequest,
  ExtractPdfPageRequest,
  ExtractPdfPageResponse,
  FinancerRetreatData,
  GetAllowanceChecksRequest,
  GetAllowanceChequesRequest,
  GetAllowanceInvoicesRequest,
  GetAllowanceReceivablesRequest,
  GetBillsCompanyRequest,
  GetBillsCompanyResponse,
  GetCompanyDocumentsRequest,
  GetFinancersRequest,
  GetFinancersResponse,
  GetSenderUsageDetailRequest,
  InvoicesResponseModel,
  OffersResponseModel,
  PaymentStatus,
  ReceivableData,
  SetAllowanceIsCompleteRequest,
  ShowCompanyDocumentRequest,
  SpotFundingData,
  UpdateCollectionDetailRequest,
  UpdateFinancerRetreatRequest,
} from './discount-operations.types';

const transformAllowanceData = (allowances: AllowanceListResponseModel): DiscountOperation[] => {
  if (!allowances?.Allowances) return [];

  return allowances.Allowances.map((allowance) => ({
    Id: allowance.Id ?? 0,
    AllowanceStatus: (allowance.AllowanceStatus ?? 0) as AllowanceStatusEnum,
    Status: (allowance.Status ?? 0) as AllowanceStatusEnum,
    StatusDesc: allowance.StatusDesc ?? allowance.AllowanceStatusDescription ?? '-',
    SenderCompanyName: allowance.SenderCompanyName ?? '-',
    ReceiverCompanyName: allowance.ReceiverCompanyName ?? '-',
    FinancerName: allowance.FinancerName ?? allowance.WinnerFinancerCompanyName ?? '-',
    WinnerFinancerCompanyName: allowance.WinnerFinancerCompanyName,
    CustomerManagerName: allowance.CustomerManagerName ?? '-',
    TotalPayableAmount: allowance.TotalPayableAmount ?? 0,
    TotalPaidAmount: allowance.TotalPaidAmount ?? allowance.TotalApprovedPayableAmount ?? 0,
    PayableAmountCurrency: allowance.PayableAmountCurrency ?? 'TRY',
    AllowanceInvoiceCount: allowance.AllowanceInvoiceCount ?? allowance.TotalInvoiceCount ?? 0,
    AllowanceBillCount: allowance.AllowanceBillCount ?? allowance.TotalInvoiceCount ?? 0,
    AvgDueDayCount: allowance.AvgDueDayCount ?? 0,
    AllowanceDueDate: allowance.AllowanceDueDate ?? '',
    InsertDatetime: allowance.InsertDatetime ?? '',
    RemainingChargedAmount: allowance.RemainingChargedAmount,
    IntegratorName: allowance.IntegratorName,
    IsManualPaymentApproved: allowance.IsManualPaymentApproved,
    RejectedBidCount: allowance.RejectedBidCount ?? 0,
    IsGivingBid: allowance.IsGivingBid,
  }));
};

interface DiscountServerSideQueryArgs extends ServerSideQueryArgs {
  kind?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  senderCompanyId?: number;
  receiverCompanyId?: number;
  financerCompanyId?: number;
  invoiceNumber?: string;
  billNo?: string;
  senderName?: string;
  receiverName?: string;
  receiverIdentifier?: string;
  senderIdentifier?: string;
  senderCompanyName?: string;
  status?: number;
  allowanceId?: number;
  notifyBuyer?: boolean;
  companyNameOrAllowanceNoFilter?: string;
  isOperationChargePayable?: boolean;
  totalCount?: number;
  extensionData?: string;
  drawerName?: string;
  PaymentStatus?: string;
  customerManagerUserId?: number;
  isPartialBid?: boolean;
}

const discountOperationsServerSideApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllowancesUnified: builder.query<
      ServerSideQueryResult<DiscountOperation>,
      DiscountServerSideQueryArgs & { endpoint: string; productType: number }
    >({
      query: ({ productType, ...filters }) => {
        const dateStartDate =
          filters.startDate instanceof Date ? dayjs(filters.startDate).format(RESPONSE_DATE) : filters.startDate;
        const dateEndDate =
          filters.endDate instanceof Date ? dayjs(filters.endDate).format(RESPONSE_DATE) : filters.endDate;

        const getApiEndpoint = (productType: number) => {
          switch (productType) {
            case 2:
              return '/allowances/search/ReceiverGuaranteed';
            case 3:
              return '/allowances/search/EasyFinancing';
            case 4:
              return '/allowances/search/EasyFinancing';
            case 6:
              return '/allowances/search/EasyFinancing';
            case 7:
              return '/allowances/search/ReceivablesFinancing';
            case 8:
              return '/spotLoanWithoutInvoice/search';
            case 9:
              return '/revolvingCredit/search';
            case 11:
              return '/InstallmentCommercialLoan/search/InstallmentCommercialLoan';
            case 13:
              return '/instantCommercialLoan/search';
            default:
              return '/allowances/search/EasyFinancing';
          }
        };

        const apiUrl = getApiEndpoint(productType);

        return {
          url: apiUrl,
          params: {
            startDate: dateStartDate,
            endDate: dateEndDate,
            Kind: filters.kind,
            Page: filters.page,
            PageSize: filters.pageSize,
            SenderCompanyId: filters.senderCompanyId,
            ReceiverCompanyId: filters.receiverCompanyId,
            FinancerCompanyId: filters.financerCompanyId,
            InvoiceNumber: filters.invoiceNumber,
            BillNo: filters.billNo,
            SenderName: filters.senderName,
            ReceiverName: filters.receiverName,
            ReceiverIdentifier: filters.receiverIdentifier,
            SenderIdentifier: filters.senderIdentifier,
            SenderCompanyName: filters.senderCompanyName,
            Status: filters.status,
            AllowanceId: filters.allowanceId,
            NotifyBuyer: filters.notifyBuyer,
            CompanyNameOrAllowanceNoFilter: filters.companyNameOrAllowanceNoFilter,
            IsOperationChargePayable: filters.isOperationChargePayable,
            SortType: filters.sortType,
            Sort: filters.sort,
            TotalCount: filters.totalCount,
            IsExport: filters.isExport,
            ExtensionData: filters.extensionData,
            DrawerName: filters.drawerName,
            PaymentStatus: filters.PaymentStatus,
            CustomerManagerUserId: filters.customerManagerUserId,
            IsPartialBid: filters.isPartialBid,
          },
        };
      },
      transformResponse: (response: AllowanceListResponseModel): ServerSideQueryResult<DiscountOperation> => ({
        Items: transformAllowanceData(response),
        TotalCount: response.TotalCount ?? 0,
        ExtensionData: response.ExtensionData ?? null,
      }),
    }),
  }),
});

export const discountOperationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    cancelAllowance: builder.mutation<void, number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/cancel`,
        method: 'PUT',
      }),
    }),

    cancelAllowancePaymentRequest: builder.mutation<void, { allowanceId: number }>({
      query: (params) => ({
        url: '/paymentRequests/cancel',
        method: 'PUT',
        params,
      }),
    }),

    getPaymentRequest: builder.query<AllowancePaymentGetResponseModel[], { allowanceId: number }>({
      query: (params) => ({
        url: '/paymentRequests',
        method: 'GET',
        params,
      }),
    }),

    getPaymentInfo: builder.query<AllowancePaymentInfoResponseModel, { allowanceId: number }>({
      query: ({ allowanceId }) => ({
        url: `/allowances/${allowanceId}/payments/info`,
        method: 'GET',
      }),
    }),

    getBuyerListForAllowance: builder.query<CompanyListItem[], void>({
      query: () => ({
        url: '/companies/activityType/1',
        method: 'GET',
      }),
    }),

    getBankListForAllowance: builder.query<{ Items: CompanyListItem[] }, Record<string, unknown>>({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params: {
          sort: 'CompanyName',
          sortType: 'Asc',
          type: 2,
          page: 1,
          pageSize: 100,
          ...params,
        },
      }),
    }),

    // Get Customer Manager List
    getCustomerManagerList: builder.query<{ Items: CustomerManager[] }, void>({
      query: () => ({
        url: '/companies/customerManagers/managers',
        method: 'GET',
      }),
    }),

    // Get All Allowance Status
    getAllAllowanceStatus: builder.query<AllowanceStatusOption[], void>({
      query: () => ({
        url: '/types/allowanceStatus',
        method: 'GET',
      }),
    }),

    // Get Allowance Payment Status
    getAllowancePaymentStatus: builder.query<PaymentStatus[], void>({
      query: () => ({
        url: '/types',
        method: 'GET',
        params: {
          EnumName: 'AllowancePaymentStatus',
        },
      }),
    }),

    // Get Allowance Bids - matches the curl endpoint /allowances/{allowanceId}/bids
    getAllowanceBids: builder.query<AllowanceBidsResponseModel, number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/bids`,
        method: 'GET',
      }),
    }),

    // Create Allowance Payment - matches the curl endpoint /allowances/{allowanceId}/payments
    createAllowancePayment: builder.mutation<void, { allowanceId: number; data: AllowancePaymentRequestModel }>({
      query: ({ allowanceId, data }) => ({
        url: `/allowances/${allowanceId}/payments`,
        method: 'POST',
        body: data,
      }),
    }),

    // Get Allowance Type by ID - This is the correct first call to determine allowance kind/type
    getAllowanceTypeById: builder.query<AllowanceDetailResponseModel, number>({
      query: (allowanceId) => ({
        url: `/allowances/allowanceType/${allowanceId}`,
        method: 'GET',
      }),
    }),

    // Get Allowance Detail by Kind and AllowanceId - EasyFinancing endpoint (SME, Cheque, Spot with invoice)
    getEasyFinancingDetail: builder.query<AllowanceListResponseModel, { Kind: number; allowanceId: number }>({
      query: (params) => ({
        url: '/allowances/search/EasyFinancing',
        method: 'GET',
        params,
      }),
    }),

    // Get Allowance Detail - BuyerApproved/ReceiverGuaranteed endpoint (Supplier, Receivable)
    getBuyerApprovedDetail: builder.query<AllowanceListResponseModel, { Kind: number; allowanceId: number }>({
      query: (params) => ({
        url: '/allowances/search/ReceiverGuaranteed',
        method: 'GET',
        params,
      }),
    }),

    // Get Allowance Logs for Transaction History
    getAllowanceLogs: builder.query<AllowanceLogsResponseModel, AllowanceLogsParams>({
      query: (params) => ({
        url: '/logs',
        method: 'GET',
        params,
      }),
    }),

    // Get Collections (Payments)
    getCollections: builder.query<CollectionsResponseModel, number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/payments`,
        method: 'GET',
      }),
    }),

    // Post Collection (Payment)
    postCollection: builder.mutation<
      void,
      { allowanceId: number; allowancePaymentRequestModel: AllowancePaymentRequestModel }
    >({
      query: ({ allowanceId, allowancePaymentRequestModel }) => ({
        url: `/allowances/${allowanceId}/payments`,
        method: 'POST',
        body: allowancePaymentRequestModel,
      }),
    }),

    // Update Collection (Payment Detail)
    updateCollectionDetail: builder.mutation<
      void,
      {
        allowanceId: number;
        paymentId: number;
        detailId: number;
        detail: UpdateCollectionDetailRequest;
      }
    >({
      query: ({ allowanceId, paymentId, detailId, detail }) => ({
        url: `/allowances/${allowanceId}/payments/${paymentId}/details/${detailId}`,
        method: 'PUT',
        body: detail,
      }),
    }),

    // Delete Collection Detail Line
    deleteCollectionDetailLine: builder.mutation<void, { allowanceId: number; allowancePaymentDetailLineId: number }>({
      query: ({ allowanceId, allowancePaymentDetailLineId }) => ({
        url: `/allowances/${allowanceId}/payments/allowancePaymentDetailLine/${allowancePaymentDetailLineId}`,
        method: 'DELETE',
      }),
    }),

    // Get Allowance Funding (General - for invoices and receivables)
    getAllowanceFunding: builder.query<AllowanceFundingData[], number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/invoices/funding`,
        method: 'GET',
      }),
    }),

    // Get Bill Funding (for cheques)
    getBillFunding: builder.query<AllowanceFundingData[], number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/bills/funding`,
        method: 'GET',
      }),
    }),

    // Get Order Funding (for spot loans without invoices)
    getOrderFunding: builder.query<SpotFundingData[], number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/orders/funding`,
        method: 'GET',
      }),
    }),

    // Get Operation Charge History (for discount fee tab)
    getOperationChargeHistory: builder.query<DiscountFeeData[], number>({
      query: (allowanceId) => ({
        url: `/companies/operationcharges/histories/${allowanceId}`,
        method: 'GET',
      }),
    }),

    // Create Transaction Fee
    createTransactionFee: builder.mutation<void, CreateTransactionFeeRequest>({
      query: (data) => ({
        url: '/allowances/createTransactionFee',
        method: 'POST',
        body: data,
      }),
    }),

    // Set Allowance Is Complete (İşlem Ücretsiz Oluştur)
    setAllowanceIsComplete: builder.mutation<void, SetAllowanceIsCompleteRequest>({
      query: ({ allowanceId }) => ({
        url: `/allowances/setAllowanceIsComplete?allowanceId=${allowanceId}`,
        method: 'POST',
        body: {},
      }),
    }),

    // Get Sender Usage Detail (for offers tab)
    getSenderUsageDetail: builder.query<OffersResponseModel, GetSenderUsageDetailRequest>({
      query: (params) => ({
        url: '/reports/senderUsageDetail',
        method: 'GET',
        params,
      }),
    }),

    // Get Allowance Cheques (for cheques tab) - Correct endpoint from old project
    getAllowanceCheques: builder.query<ChequeData[], GetAllowanceChequesRequest>({
      query: ({ AllowanceId }) => ({
        url: `/allowances/${AllowanceId}/bills`,
        method: 'GET',
      }),
    }),

    // Get Allowance Invoices (for invoices tab)
    getAllowanceInvoices: builder.query<InvoicesResponseModel, GetAllowanceInvoicesRequest>({
      query: ({ AllowanceId, ...params }) => ({
        url: `/allowances/${AllowanceId}/invoices`,
        method: 'GET',
        params,
      }),
    }),

    // Search Allowance Invoices (with filters - matches old project endpoint)
    searchAllowanceInvoices: builder.query<InvoicesResponseModel, GetAllowanceInvoicesRequest>({
      query: ({ AllowanceId, ...params }) => ({
        url: `/allowances/${AllowanceId}/invoices/search`,
        method: 'GET',
        params,
      }),
    }),

    // Get Allowance Receivables (for receivables tab)
    getAllowanceReceivables: builder.query<ReceivableData[], GetAllowanceReceivablesRequest>({
      query: ({ AllowanceId, ...params }) => ({
        url: `allowances/${AllowanceId}/orders/search`,
        method: 'GET',
        params,
      }),
    }),

    // Export Allowance Receivables - for Excel export functionality
    exportAllowanceReceivabless: builder.query<{ ExtensionData: string }, GetAllowanceReceivablesRequest>({
      query: ({ AllowanceId, ...params }) => ({
        url: `allowances/${AllowanceId}/invoices/search`,
        method: 'GET',
        params: { ...params, IsExport: true },
      }),
    }),

    // Document-related endpoints for DocumentsTab
    // Get Allowance Checks (bills) with documents - matches legacy _getAllowanceChecks
    getAllowanceChecks: builder.query<BillData[], GetAllowanceChecksRequest>({
      query: ({ allowanceId }) => ({
        url: `/allowances/${allowanceId}/bills`,
        method: 'GET',
      }),
    }),

    // Get Company Documents - matches legacy getCompanyDocuments
    getCompanyDocuments: builder.query<CompanyDocumentData[], GetCompanyDocumentsRequest>({
      query: ({ allowanceId }) => ({
        url: '/documents',
        method: 'GET',
        params: { allowanceId },
      }),
    }),

    // Download Bill Document - matches legacy _downloadBillDocument
    downloadBillDocument: builder.mutation<DocumentDownloadResponse, DownloadBillDocumentRequest>({
      query: ({ billId, documentId }) => ({
        url: `/bills/${billId}/document/${documentId}`,
        method: 'GET',
      }),
    }),

    // Show Company Document - matches legacy _showCompanyDocuments
    showCompanyDocument: builder.mutation<Blob, ShowCompanyDocumentRequest>({
      query: ({ documentId }) => ({
        url: `/documents/${documentId}/view`,
        method: 'GET',
        responseHandler: (response) => response.arrayBuffer().then((buffer) => new Blob([buffer])),
      }),
    }),

    // Create Company for Bill Operation
    createCompanyForBillOperation: builder.mutation<
      CreateCompanyForBillOperationResponse,
      CreateCompanyForBillOperationRequest
    >({
      query: (body) => ({
        url: '/companies/createCompanyForBillOperation',
        method: 'POST',
        body,
      }),
    }),

    // Get Cities
    getCities: builder.query<City[], void>({
      query: () => ({
        url: '/addresses/cities',
        method: 'GET',
      }),
    }),

    // Get Districts by City ID
    getDistricts: builder.query<District[], number>({
      query: (cityId) => ({
        url: `/addresses/${cityId}/districts`,
        method: 'GET',
      }),
    }),

    // Search Company by Name or Identifier
    searchCompany: builder.query<{ Items: CompanySearchItem[] }, { companyNameOrIdentifier: string }>({
      query: ({ companyNameOrIdentifier }) => ({
        url: `/companies/searchByCompanyNameOrIdentifier?CompanyNameOrIdentifier=${encodeURIComponent(companyNameOrIdentifier)}&CompanyActivityType=2`,
        method: 'GET',
      }),
    }),

    // Get Bills/Cheques for Company - for ChequeDetailsStep
    getBillsCompany: builder.query<GetBillsCompanyResponse, GetBillsCompanyRequest>({
      query: (params) => ({
        url: '/bills/company',
        method: 'GET',
        params,
      }),
    }),

    // Get Financers for Financial Settings
    getFinancers: builder.query<GetFinancersResponse, GetFinancersRequest>({
      query: (params) => ({
        url: '/companies/search',
        method: 'GET',
        params,
      }),
    }),

    // Create Allowance - Final step submission
    createAllowance: builder.mutation<CreateAllowanceResponse, CreateAllowanceRequest>({
      query: (body) => ({
        url: '/allowances',
        method: 'POST',
        body,
      }),
    }),

    // Upload Single Bill/Check
    uploadSingleBill: builder.mutation<
      { success: boolean; message?: string },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { BillList: unknown[]; MultipleBillDocument?: any; isMultipleBill?: boolean }
    >({
      query: (body) => ({
        url: '/bills/uploadBillForCompany',
        method: 'POST',
        body,
      }),
    }),

    // Read QR Codes from Files
    readQrCodesFromFiles: builder.mutation<
      {
        ErrorMessage: string | null;
        FileResults: Array<{
          BillDetails: Array<{
            BillNo: string;
            AccountNo: string;
            BankName: string;
            BankBranchName: string;
            BankBranchCode: string;
            BankCode: string;
            DrawerName: string;
            DrawerIdentifier: string;
            MersisNo?: string;
            BarcodeText?: string;
            ErrorMessage: string | null;
            ImageIndex: number;
          }>;
          FileName: string;
          ErrorMessage: string | null;
        }>;
        TotalBillCount: number;
        IsSuccess: boolean;
      },
      {
        IsMultiple: boolean;
        IncludeBarcodeTexts: boolean;
        Files: Array<{
          FileName: string;
          Base64File: string;
        }>;
      }
    >({
      query: (body) => ({
        url: '/bills/readQrCodesFromFiles',
        method: 'POST',
        body,
        timeout: 180000, // 3 dakika (180 saniye)
      }),
    }),

    // Extract PDF Page - matches legacy documents/extract-pdf-page endpoint
    extractPdfPage: builder.mutation<ExtractPdfPageResponse, ExtractPdfPageRequest>({
      query: (body) => ({
        url: '/documents/extract-pdf-page',
        method: 'POST',
        body,
      }),
    }),

    // Get Banks for dropdown (single cheque form)
    getBanks: builder.query<BankOption[], void>({
      query: () => ({
        url: '/banks',
        method: 'GET',
      }),
    }),

    // Get Bank Branches for dropdown (single cheque form)
    getBankBranches: builder.query<{ Items: BankBranchOption[] }, { BankId: number; pageSize?: number }>({
      query: ({ BankId, pageSize = 999999 }) => ({
        url: '/banks/branch/search',
        method: 'GET',
        params: { BankId, pageSize },
      }),
    }),

    // Financer Retreat endpoints (for Change Process tab)
    // Get Financer Retreat status and details
    getFinancerRetreat: builder.query<FinancerRetreatData | null, number>({
      query: (allowanceId) => ({
        url: `/allowances/${allowanceId}/FinancerRetreat`,
        method: 'GET',
      }),
    }),

    // Create Financer Retreat request
    createFinancerRetreat: builder.mutation<void, { allowanceId: number; data: CreateFinancerRetreatRequest }>({
      query: ({ allowanceId, data }) => ({
        url: `/allowances/${allowanceId}/FinancerRetreat`,
        method: 'POST',
        body: data,
      }),
    }),

    // Update Financer Retreat status (approve/reject)
    updateFinancerRetreat: builder.mutation<void, { allowanceId: number; data: UpdateFinancerRetreatRequest }>({
      query: ({ allowanceId, data }) => ({
        url: `/allowances/${allowanceId}/FinancerRetreat`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useCancelAllowanceMutation,
  useCancelAllowancePaymentRequestMutation,
  useGetPaymentRequestQuery,
  useLazyGetPaymentRequestQuery,
  useGetBankListForAllowanceQuery,
  useLazyGetBankListForAllowanceQuery,
  useGetPaymentInfoQuery,
  useGetCustomerManagerListQuery,
  useLazyGetCustomerManagerListQuery,
  useGetAllAllowanceStatusQuery,
  useLazyGetAllAllowanceStatusQuery,
  useGetAllowancePaymentStatusQuery,
  useLazyGetAllowancePaymentStatusQuery,
  useGetAllowanceBidsQuery,
  useGetBuyerListForAllowanceQuery,
  useLazyGetBuyerListForAllowanceQuery,
  useLazyGetAllowanceBidsQuery,
  useCreateAllowancePaymentMutation,
  useGetAllowanceTypeByIdQuery,
  useLazyGetAllowanceTypeByIdQuery,
  useGetEasyFinancingDetailQuery,
  useLazyGetEasyFinancingDetailQuery,
  useGetBuyerApprovedDetailQuery,
  useLazyGetBuyerApprovedDetailQuery,
  useGetAllowanceLogsQuery,
  useLazyGetAllowanceLogsQuery,
  useGetCollectionsQuery,
  useLazyGetCollectionsQuery,
  usePostCollectionMutation,
  useUpdateCollectionDetailMutation,
  useDeleteCollectionDetailLineMutation,
  useGetAllowanceFundingQuery,
  useLazyGetAllowanceFundingQuery,
  useGetBillFundingQuery,
  useLazyGetBillFundingQuery,
  useGetOrderFundingQuery,
  useLazyGetOrderFundingQuery,
  useGetOperationChargeHistoryQuery,
  useLazyGetOperationChargeHistoryQuery,
  useCreateTransactionFeeMutation,
  useSetAllowanceIsCompleteMutation,
  useGetSenderUsageDetailQuery,
  useLazyGetSenderUsageDetailQuery,
  useGetAllowanceChequesQuery,
  useLazyGetAllowanceChequesQuery,
  useGetAllowanceInvoicesQuery,
  useLazyGetAllowanceInvoicesQuery,
  useSearchAllowanceInvoicesQuery,
  useLazySearchAllowanceInvoicesQuery,
  useGetAllowanceReceivablesQuery,
  useLazyGetAllowanceReceivablesQuery,
  useExportAllowanceReceivablessQuery,
  useLazyExportAllowanceReceivablessQuery,
  // Document-related hooks for DocumentsTab
  useGetAllowanceChecksQuery,
  useLazyGetAllowanceChecksQuery,
  useGetCompanyDocumentsQuery,
  useLazyGetCompanyDocumentsQuery,
  useDownloadBillDocumentMutation,
  useShowCompanyDocumentMutation,
  useCreateCompanyForBillOperationMutation,
  useGetCitiesQuery,
  useLazyGetCitiesQuery,
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
  useSearchCompanyQuery,
  useLazySearchCompanyQuery,
  useGetBillsCompanyQuery,
  useLazyGetBillsCompanyQuery,
  useGetFinancersQuery,
  useLazyGetFinancersQuery,
  useCreateAllowanceMutation,
  useUploadSingleBillMutation,
  useReadQrCodesFromFilesMutation,
  useExtractPdfPageMutation,
  useGetBanksQuery,
  useLazyGetBanksQuery,
  useGetBankBranchesQuery,
  useLazyGetBankBranchesQuery,
  // Financer Retreat hooks for Change Process tab
  useGetFinancerRetreatQuery,
  useLazyGetFinancerRetreatQuery,
  useCreateFinancerRetreatMutation,
  useUpdateFinancerRetreatMutation,
} = discountOperationsApi;

// Export the new server-side query hooks
export const { useGetAllowancesUnifiedQuery, useLazyGetAllowancesUnifiedQuery } = discountOperationsServerSideApi;
