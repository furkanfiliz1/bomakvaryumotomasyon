// InvoiceOperations module types - Legacy Parity Implementation
import { ServerSideQueryArgs } from 'src/hooks/useServerSideQuery';

// Operation card configuration - matches legacy cards exactly
export interface OperationCard {
  id: string;
  title: string;
  description?: string;
  route: string;
  icon?: string;
  disabled?: boolean;
}

// Invoice Report Types - Based on provided API response structure

export interface InvoiceItem {
  Id: number;
  SenderCompanyId: number;
  ReceiverCompanyId: number;
  UuId: string | null;
  EnvUuId: string | null;
  InvoiceNumber: string;
  CustomerInvoiceNumber: string | null;
  SenderIdentifier: string;
  SenderName: string;
  ReceiverIdentifier: string;
  ReceiverName: string;
  InsertedDate: string;
  ProfileId: string;
  PaymentDueDate: string;
  InvoiceTypeCode: string;
  DocumentCurrency: string | null;
  PayableAmount: number;
  PayableAmountCurrency: string;
  IssueDate: string;
  IssueTime: string | null;
  UserId: number;
  ExpireDate: string | null;
  HashCode: string | null;
  Type: number;
  Status: number;
  SerialNumber: string | null;
  SequenceNumber: string | null;
  OperationType: string | null;
  UsageType: string | null;
  BankOperationType: string | null;
  IsSampleInvoice: boolean | null;
  RemainingAmount: number;
  ApprovedPayableAmount: number;
  DeductionAmount: number | null;
  BalanceAmount: number | null;
  ReceiverErpInvoiceCode: string | null;
  IsDeleted: boolean | null;
  ExtraSenderInterest: number | null;
  DocumentExist: number;
  KdvRate: number | null;
  EInvoiceType: number;
  TaxFreeAmount: number;
  IsGibApproved: boolean | null;
  GibApproveDate: string | null;
  GibMessage: string | null;
  PaymentDate: string | null;
  CurrencyId: number;
  ChargedAmount: number | null;
  AllowanceStatus: number;
  AllowanceStatusDescription: string;
  AllowanceId: number;
  // Additional properties for table state
  checked?: boolean;
  marked?: boolean;
  errorMessage?: string;
}

export interface InvoiceSearchResponse {
  Invoices: InvoiceItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

export interface InvoiceSearchRequest extends ServerSideQueryArgs {
  receiverIdentifier?: string;
  senderIdentifier?: string | null;
  notifyBuyer?: number;
  type?: string;
  SourceType?: string;
  availableType?: string;
  isDeleted?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: number;
  profileId?: string;
  currencyId?: number;
  invoiceNumber?: string;
  serialNumber?: string;
  sequenceNumber?: string;
  isExport?: boolean;
}

// Invoice Report Filter Form Data - matches legacy form exactly
export interface InvoiceReportFilters {
  receiverIdentifier?: string;
  senderIdentifier?: string;
  notifyBuyer?: number;
  type?: string;
  SourceType?: string;
  availableType?: string;
  isDeleted?: string;
  status?: number;
  profileId?: string;
  currencyId?: number;
  startDate?: string; // Format as YYYY-MM-DD string, undefined for empty dates
  endDate?: string; // Format as YYYY-MM-DD string, undefined for empty dates
  invoiceNumber?: string;
  serialNumber?: string;
  sequenceNumber?: string;
}

// Dropdown Data Types
export interface CompanySearchItem {
  Id: number;
  Identifier: string;
  CompanyName: string;
  CustomerName?: string;
}

export interface CompanySearchResponse {
  Items: CompanySearchItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

export interface InvoiceSourceType {
  Value: string;
  Description: string;
}

export type InvoiceSourceTypesResponse = InvoiceSourceType[];

export interface Currency {
  Id: number;
  Code: string;
  Name: string;
}

export interface CurrenciesResponse {
  data: Currency[];
}

export interface BuyerItem {
  Identifier: string;
  CompanyName: string;
}

export interface BuyersListResponse {
  data: BuyerItem[];
}

// Status and Type Options
export interface StatusOption {
  id: string;
  name: string;
}

export interface TypeOption {
  value: string;
  label: string;
}

// Enums for Invoice Report
export enum InvoiceType {
  All = '',
  EInvoice = '1',
  PaperInvoice = '2',
}

export enum InvoiceStatus {
  Passive = 0,
  Active = 1,
}

export enum NotifyBuyerType {
  EasyFinance = 0,
  BuyerApproved = 1,
}

export enum AvailableType {
  All = '',
  Used = '0',
  Suitable = '1',
}

export enum DeletedStatus {
  No = '0',
  Yes = '1',
}

export enum ProfileIdType {
  All = '',
  TICARIFATURA = 'TICARIFATURA',
  TEMELFATURA = 'TEMELFATURA',
  EARSIVFATURA = 'EARSIVFATURA',
  EMUSTAHSIL = 'EMUSTAHSIL',
}

// Invoice History Types - Based on API response structure
export interface InvoiceHistory {
  AllowanceId: number;
  AllowanceInvoiceStatusDescription: string;
  AllowanceStatusDescription: string;
  InsertDateTime: string;
  FinancerCompanyName: string;
}

// Delete invoices response types
export interface FailedInvoiceItem {
  InvoiceId: number;
  InvoiceNumber: string;
  ErrorMessage: string;
}

export interface DeleteInvoicesResponse {
  FailedInvoiceList?: FailedInvoiceItem[];
  IsSuccess: boolean;
  Message?: string;
}

// Bulk update types
export interface BulkUpdateRequest {
  selectedInvoices: number[];
  issueDate?: string;
  paymentDueDate?: string;
  payableAmount?: number;
  approvedPayableAmount?: number;
  remainingAmount?: number;
  IsResetPaymentDueDate?: boolean;
  maxIssueDate?: string;
  minPayableAmount?: number;
}

export interface BulkUpdateResponse {
  IsSuccess: boolean;
  Message?: string;
  FailedInvoiceList?: FailedInvoiceItem[];
}

// Invoice Update Request - Based on curl data
export interface InvoiceUpdateRequest {
  Id: number;
  SenderCompanyId: number;
  ReceiverCompanyId: number;
  UuId?: string | null;
  EnvUuId?: string | null;
  InvoiceNumber?: string;
  CustomerInvoiceNumber?: string | null;
  SenderIdentifier: string;
  SenderName: string;
  ReceiverIdentifier: string;
  ReceiverName: string;
  InsertedDate: string;
  ProfileId?: string;
  PaymentDueDate?: string;
  InvoiceTypeCode?: string;
  DocumentCurrency?: string | null;
  PayableAmount: number;
  PayableAmountCurrency: string;
  IssueDate: string;
  IssueTime?: string | null;
  UserId: number;
  ExpireDate?: string | null;
  HashCode?: string | null;
  Type: number;
  Status: number;
  SerialNumber?: string | null;
  SequenceNumber?: string | null;
  OperationType?: string | null;
  UsageType?: string | null;
  BankOperationType?: string | null;
  IsSampleInvoice?: boolean | null;
  RemainingAmount: number;
  ApprovedPayableAmount: number;
  DeductionAmount?: number | null;
  BalanceAmount?: number | null;
  ReceiverErpInvoiceCode?: string | null;
  IsDeleted?: boolean | null;
  ExtraSenderInterest?: number | null;
  DocumentExist?: number;
  KdvRate?: number | null;
  EInvoiceType?: number;
  TaxFreeAmount?: number;
  IsGibApproved?: boolean | null;
  GibApproveDate?: string | null;
  GibMessage?: string | null;
  PaymentDate?: string | null;
  CurrencyId: number;
  ChargedAmount?: number | null;
  AllowanceStatus?: number;
  AllowanceStatusDescription?: string;
  AllowanceId?: number;
}

// Profile types for dropdown
export interface ProfileType {
  Description: string;
}

// Invoice Edit Form Data - Only the fields that can be edited
export interface InvoiceEditFormData {
  ReceiverName: string;
  CurrencyId: number;
  IssueDate: string;
  PaymentDueDate: string | null;
  PayableAmount: number;
  ApprovedPayableAmount: number;
  RemainingAmount: number;
  Type: number;
  EInvoiceType: number | null;
  Status: number;
  IsDeleted: boolean | null;
  IsGibApproved: boolean | null;
  GibMessage: string;
  ProfileId: string;
  TaxFreeAmount: number | null;
  InvoiceNumber: string;
  HashCode: string;
  SerialNumber: string;
  SequenceNumber: string;
}

// Legacy invoice operation types (for future modules)
export interface InvoiceOperation {
  id: string;
  // Add your invoice operation types here
}

export interface InvoiceOperationFilters {
  // Add your filter types here
}
