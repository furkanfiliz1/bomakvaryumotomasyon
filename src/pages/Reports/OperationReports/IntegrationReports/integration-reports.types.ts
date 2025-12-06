// Integration Reports type definitions
// Following OperationPricing pattern

// Company activity types for search filtering
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Base types matching legacy data structure
export interface IntegrationReportsFilters {
  AllowanceId?: string;
  CompanyIdentifier?: string;
  SenderIdentifier?: string;
  StartDate?: string;
  EndDate?: string;
  Page?: number;
  PageSize?: number;
  isExport?: boolean;
}

export interface IntegrationTransactionItem {
  AllowanceTransactionId: number;
  AllowanceId: number;
  AllowanceStatus: string;
  Description: string | null;
  Status: string;
  InsertedDate: string;
  SenderName: string;
  ReceiverName: string;
  FinancerName: string;
  InvoiceNumber?: string;
  BankStatus?: string;
  UpdatedDate?: string;
}

// Response interface matching actual API response
export interface IntegrationTransactionsResponse {
  Items: IntegrationTransactionItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string;
}

// Transaction details for expand/collapse section
export interface IntegrationTransactionDetailsResponse {
  Items: IntegrationTransactionDetailItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

// Transaction detail item from the API
export interface IntegrationTransactionDetailItem {
  InvoiceNumber: string;
  Status: string;
  Description: string;
  InsertedDate: string;
  UpdatedDate: string;
  BankStatus: string;
  Requests: IntegrationRequestItem[];
}

// Request/Response detail item for modal display
export interface IntegrationRequestItem {
  Id: number;
  Description: string | null;
  Type: string | null;
  RequestDate: string | null;
  ResponseDate: string | null;
  Status: string | null;
  Request: string | null;
  Response: string | null;
  RequestFileName: string | null;
  ResponseFileName: string | null;
}

// Company dropdown data
export interface CompanyListItem {
  Id: number;
  Name: string;
  CompanyIdentifier: string;
}

export interface CompanyListResponse {
  data: CompanyListItem[];
  success: boolean;
  message?: string;
}

// Transaction details query parameters
export interface IntegrationTransactionDetailsParams {
  AllowanceTransactionId: number;
  Page?: number;
  PageSize?: number;
}
