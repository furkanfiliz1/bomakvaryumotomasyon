// Bank Discount Reconciliation Report Types - Following BankInvoiceReconciliation Pattern

/**
 * Individual report item matching actual API response structure from financerAllowanceAgreement
 */
export interface BankDiscountReconciliationItem {
  /** Satıcı Adı */
  SenderName: string;
  /** Finansör Adı */
  FinancerName: string;
  /** İskonto ID */
  AllowanceId: number;
  /** İskonto Vade Tarihi */
  AllowanceDueDate: string;
  /** Toplam Ödenecek Tutar (TRY currency) */
  TotalPayableAmount: number;
  /** Toplam Ödenen Tutar (TRY currency) */
  TotalPaidAmount: number;
  /** Toplam Faiz Tutarı (TRY currency) */
  TotalInterestAmount: number;
  /** Ortalama Vade Gün Sayısı */
  AverageDueDayCount: number;
  /** Ay */
  Month: number;
  /** Toplam Fatura Adedi */
  TotalInvoiceCount: number;
  /** Faiz Oranı (%) */
  InterestRate: number;
  /** Figopara Komisyon Tutarı (TRY currency) */
  FigoCommissionRate: number;
}

/**
 * API Response structure matching actual API response
 * Standard pagination response with real fields
 */
export interface BankDiscountReconciliationResponse {
  Items: BankDiscountReconciliationItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string;
}

/**
 * Filter form values interface
 * Following BankInvoiceReconciliation pattern exactly
 */
export interface BankDiscountReconciliationFilters {
  /** Alıcı Şirket Identifier (VKN/TCKN) */
  identifier?: string;
  /** Finans Şirket Identifier (VKN) */
  financerCompanyIdentifier?: string;
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

/**
 * Query parameters interface for API calls
 * Maps form values to API parameters exactly
 */
export interface BankDiscountReconciliationQueryParams extends BankDiscountReconciliationFilters {
  // All fields inherited from filters interface
  // This ensures type safety between form and API
}

/**
 * Form values interface for React Hook Form
 * Matches filter interface for consistency
 */
export interface BankDiscountReconciliationFilterFormValues extends BankDiscountReconciliationFilters {
  // All fields inherited from filters interface
  // Ensures form state matches API expectations
}

// Company activity types for search filtering - shared with other reconciliation reports
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Company search result interface for async autocomplete
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
  label: string;
  value: string;
}

export interface CompanySearchResponse {
  Items: CompanySearchResult[];
}

// Companies response interface for dropdown data
export interface Company {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

export interface CompaniesResponse {
  Items: Company[];
}

/**
 * Month option structure for month selector
 * Used in dropdown helpers
 */
export interface MonthOption {
  value: number; // Month number (1-12)
  label: string; // Turkish month name
}

/**
 * Year option structure for year selector
 * Used in dropdown helpers - matches BankInvoiceReconciliation pattern
 */
export interface YearOption {
  value: number; // Year as number to match BankInvoiceReconciliation
  label: string; // Year display (string format)
}
