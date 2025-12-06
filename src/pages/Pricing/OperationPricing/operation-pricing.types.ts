export interface OperationPricingFilters {
  CompanyIdentifier?: string;
  CompanyName?: string;
  status?: number | null;
  referenceId?: string;
  productType?: string | null;
  startPaymentDate: string;
  endPaymentDate: string;
  UserIds?: number[];
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
}

export interface OperationPricingItem {
  Id: number;
  PaymentType: number;
  PaymentTypeDescription: string;
  Status: number;
  StatusDescription: string;
  PaymentOperationType: number;
  Description: string;
  PaymentDate: string;
  Amount: number;
  ReturnAmount: number;
  OrderNumber: string;
  CompanyId: number;
  CompanyIdentifier: string;
  CompanyName: string;
  ReferenceId: number;
  CompanyPaymentInfoId: number | null;
  Basket: string;
  TotalDiscountAmount: number;
  PaidAmount: number;
  NetAmount: number;
  CurrencyName: string;
  PaymentProvider: number;
  RefundTypeDescription: string;
  ReferenceIds: string;
  CustomerManagers: string;
  IsSuccess: boolean;
}

export interface OperationPricingResponse {
  TotalAmount: number;
  TotalReturnAmount: number;
  Items: OperationPricingItem[];
  TotalSubAmount: number;
  TotalDiscountAmount: number;
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

export interface ProductType {
  Value: number;
  Description: string;
}

// Legacy RefundRequest interface removed - using simple API request format now
// { OrderNumber: string; RefundReason: string }

// Payment details interface matching the API response
// Payment detail item for Details array
export interface PaymentDetailItem {
  Id: number;
  InvoiceNumber: string | null;
  BillNumber: string | null;
  OrderNo: string | null;
  InvoicePayableAmount: number;
  CurrencyName: string;
  MinAmountInfo: string | null;
  MaxAmountInfo: string | null;
  PercentFeeInfo: string | null;
  TransactionFeeInfo: string | null;
  PaidAmount: number;
  DiscountAmount: number;
  PaymentStatus: number;
  RefundTypeDescription: string | null;
  AllowanceInvoiceStatusDescription: string | null;
  AllowanceBillStatusDescription: string | null;
  AllowanceOrderStatusDescription: string | null;
}

export interface PaymentDetail {
  Id: number;
  AllowanceId: number;
  AllowanceKind: number;
  AllowanceKindDescription: string | null;
  TransactionFee: number;
  MinAmount: number;
  MaxAmount: number;
  PaymentDate: string | null;
  Status: number;
  Description: string;
  ChargeCompanyId: number;
  ChargeCompanyIdentifier: string | null;
  ChargeCompanyName: string | null;
  OperationPaymentType: number;
  FinancerCompanyId: number | null;
  ReturnedAmount: number;
  PaymentStatus: number;
  Details: PaymentDetailItem[] | null;
  DiscountAmount: number;
  PaidAmount: number;
  FigoscorePaymentDetailId: number;
  FigoscorePaymentDetailDescription: string;
  FigoscoreAmount: number;
  FigoscoreDiscountAmount: number;
  FigoscorePaymentStatus: number;
}

export interface OperationPricingQueryParams
  extends Omit<OperationPricingFilters, 'startPaymentDate' | 'endPaymentDate'> {
  startPaymentDate: string; // Formatted as YYYY-MM-DD
  endPaymentDate: string; // Formatted as YYYY-MM-DD
  isExport?: boolean;
}

// Status enum for better type safety - matching legacy exactly
export enum OperationPricingStatus {
  All = 0,
  Paid = 1,
  Canceled = 2,
  Failed = 3,
  Error = 4,
  Refund = 6,
  PartialReturn = 7,
}

// Refund reason enum
export enum RefundReason {
  Canceled = 0,
  Timeout = 1,
  FinanceCompanyWithdrawn = 2,
}

// Operation charge history detail item for regular charges (not FigoSkor)
export interface OperationChargeHistoryDetailItem {
  Id: number;
  InvoiceId: number | null;
  InvoicePayableAmount: number;
  TransactionFee: number;
  TransactionFeeInfo: string | null;
  PercentFeeInfo: number;
  MinAmountInfo: number;
  MaxAmountInfo: number;
  InvoiceNumber: string | null;
  DiscountAmount: number;
  PaidAmount: number;
  CurrencyName: string;
  BillId: number | null;
  BillNumber: string | null;
  OrderId: number | null;
  OrderNo: string | null;
  AllowanceInvoiceStatusDescription: string | null;
  AllowanceOrderStatusDescription: string | null;
  PaymentStatus: number;
  RefundTypeDescription: string;
  AllowanceBillStatusDescription: string | null;
}
