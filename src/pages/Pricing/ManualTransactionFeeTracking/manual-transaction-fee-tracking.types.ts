// Types based on actual API response structure
export interface ManualTransactionFeeItem {
  Id: number;
  AllowanceId: number;
  IsInvoiceBilled: boolean;
  IsExtraFinancialRecorded: boolean;
  Status: number;
  StatusDescription: string;
  AllowanceIssueDate: string;
  Description: string | null;
  NotifyBuyer: number;
  NotifyBuyerDescription: string;
  ReceiverIdentifier: string;
  ReceiverCompanyName: string;
  SenderIdentifier: string;
  SenderCompanyName: string;
  AllowanceKindDescription: string;
}

// Filters based on old project ManuelTransactionPayTracking structure
export interface ManualTransactionFeeFilters {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
  AllowanceId?: number;
  NotifyBuyer?: number;
  AllowanceKind?: number;
  Status?: number;
  StartDate?: string;
  EndDate?: string;
  ReceiverIdentifier?: string;
  SenderIdentifier?: string;
}

export interface ManualTransactionFeeDetailResponse {
  Id: number;
  AllowanceId: number;
  IsInvoiceBilled: boolean;
  IsExtraFinancialRecorded: boolean;
  Status: number;
  StatusDescription: string;
  AllowanceIssueDate: string;
  Description: string | null;
  NotifyBuyer: number;
  NotifyBuyerDescription: string;
  ReceiverIdentifier: string;
  ReceiverCompanyName: string;
  SenderIdentifier: string;
  SenderCompanyName: string;
  AllowanceKindDescription: string;
}

export interface UpdateManualTransactionFeeRequest {
  Id: number;
  Status: number;
  Description?: string;
}

export interface ManualTransactionFeeStatusOption {
  Value: number;
  Text: string;
  Description?: string;
}

// Company search types for async autocomplete
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
  label: string;
  value: string;
}

export interface CompanySearchByNameOrIdentifierResult {
  Items: CompanySearchResult[];
}

export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Filter form data interface for UI
export interface ManualTransactionFeeFilterFormData {
  allowanceId: string;
  notifyBuyer: string;
  allowanceKind: string;
  status: string;
  startDate: string;
  endDate: string;
  receiverIdentifier: string; // Alıcı Ünvan / VKN (async search input)
  senderIdentifier: string; // Satıcı Ünvan / VKN (async search input)
}

// Detail response interface for individual record operations
export interface ManualTransactionFeeDetailResponse {
  Id: number;
  AllowanceId: number;
  Status: number;
  StatusDescription: string;
  ReceiverIdentifier: string;
  SenderIdentifier: string;
  ReceiverCompanyName: string;
  SenderCompanyName: string;
  InvoiceNumber: string;
  NotifyBuyer: number;
  InvoiceDate: string;
  InvoiceAmount: number;
  TransactionAmount: number;
  Currency: string;
  PaymentDate?: string;
  CompanyName: string;
  Notes?: string;
  IsInvoiceBilled: boolean;
  IsExtraFinancialRecorded: boolean;
  CreatedDate: string;
  ModifiedDate?: string;
}

// Update request interface - Legacy parity with ManuelTransactionPayTrackingEdit.js
export interface UpdateManualTransactionFeeRequest {
  Id: number;
  AllowanceId: number;
  IsInvoiceBilled: boolean;
  IsExtraFinancialRecorded: boolean;
  Status: number;
  Description?: string;
}
