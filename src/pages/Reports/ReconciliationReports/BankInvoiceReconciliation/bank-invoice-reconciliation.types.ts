/**
 * Bank Invoice Reconciliation Types
 * Following exact legacy API structure with 100% parity
 */

export interface BankInvoiceReconciliationFilters {
  /** Alıcı Şirket Identifier (VKN/TCKN) */
  receiverIdentifier?: string;
  /** Finans Şirket Identifier (VKN) */
  financerIdentifier?: string;
  /** Month (1-12) */
  month: number;
  /** Year (YYYY) */
  year: number;
  /** Current page number */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Export flag for Excel download */
  isExport?: boolean;
}

export interface BankInvoiceReconciliationItem {
  /** Satıcı Kodu */
  SenderCode: string;
  /** İskonto Talebi ID */
  AllowanceId: number;
  /** Fatura Numarası */
  InvoiceNumber: string;
  /** Fatura Ödenecek Tutar (TRY) */
  InvoicePayableAmount: number;
  /** Onaylanan Ödeme Vade Tarihi */
  ApprovedPaymentDueDate: string;
  /** Ödeme Tarihi */
  PaymentDate: string;
  /** İskonto Vade Tarihi */
  AllowanceDueDate: string;
  /** Vadeye Kalan Gün Sayısı */
  DueDayCount: number;
  /** Komisyon Tutarı */
  CommissionAmount: number;
}

export interface BankInvoiceReconciliationResponse {
  /** Report data items */
  Items: BankInvoiceReconciliationItem[];
  /** Current page */
  Page: number;
  /** Items per page */
  PageSize: number;
  /** Sort type */
  SortType: string;
  /** Sort field */
  Sort: string | null;
  /** Total item count */
  TotalCount: number;
  /** Export flag */
  IsExport: boolean;
  /** Excel base64 data (when isExport=true) */
  ExtensionData: string | null;
}

export interface BankInvoiceReconciliationQueryParams extends BankInvoiceReconciliationFilters {
  /** Formatted month as string */
  month: number;
  /** Formatted year as string */
  year: number;
}

/** Company interface for dropdown data */
export interface Company {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string | null;
  Phone: string;
  Verify: number;
  MailAddress: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

export interface CompaniesResponse {
  Items: Company[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

/** Month options for dropdown */
export interface MonthOption {
  value: number;
  label: string;
}

/** Year options for dropdown */
export interface YearOption {
  value: number;
  label: string;
}

/** Filter form values */
export interface BankInvoiceReconciliationFilterFormValues {
  receiverIdentifier: string;
  financerIdentifier: string;
  month: number;
  year: number;
}

/** Company activity types for async search */
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

/** Company search result for async autocomplete */
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

/** Company search API response */
export interface CompanySearchResponse {
  Items: CompanySearchResult[];
}

/** Company activity type API response - returns array directly */
export type CompanyActivityTypeResponse = CompanySearchResult[];
