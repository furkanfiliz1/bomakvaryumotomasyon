// Buyer Reconciliation Report Types - Matching Legacy ReceiverInvoiceReconciliation.js

/**
 * Individual report item matching actual API response structure
 * Maps to real API response items from getBuyerInvoiceReconciliationReport
 */
export interface BuyerReconciliationItem {
  SenderName: string; // Satıcı
  FinancerName: string; // Finansör
  PaymentRequestNumber: string; // İskonto No (secondary line)
  AllowanceId: number; // İskonto No (primary)
  AllowanceDueDate: string; // İskonto Vade Tarihi
  TotalPayableAmount: number; // Ödeme Tutarı (TRY currency)
  TotalPaidAmount: number; // Ödenmiş Tutar (TRY currency)
  TotalInterestAmount: number; // Faiz Tutarı
  AvarageDueDayCount: number; // Ortalama Vade Gün
  BidAverageDueDayCount: number; // Teklif Ortalama Vade Gün
  BSMV: number; // BSMV
  Rebate: number; // Rabate
  FinancerExcludeRebate: number | null; // Finansör Rabat Hariç
  ReceiverCredit: number; // Alıcı Kredisi
  Year: number; // Yıl
  Month: number; // Ay
  TotalInvoiceCount: number; // Fatura Adedi
  FinancerCommissionRate: number | null; // Finansör Komisyon Oranı
  ReceiverCommissionRate: number; // Alıcı Komisyon Oranı
}

/**
 * API Response structure matching actual API response
 * Standard pagination response with real fields
 */
export interface BuyerReconciliationResponse {
  Items: BuyerReconciliationItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string;
}

/**
 * Filter form values matching legacy component state.filter
 * Used in form validation and API query parameters
 */
export interface BuyerReconciliationFilters {
  identifier?: string; // VKN (text input or dropdown selection) - optional
  month: number; // Month (1-12)
  year: number; // Year as number to match BankInvoiceReconciliation pattern
}

/**
 * Query parameters sent to API - matches legacy API call parameters exactly
 * useServerSideQuery will add pagination (page, pageSize) automatically
 */
export interface BuyerReconciliationQueryParams extends BuyerReconciliationFilters {
  isExport?: boolean; // Flag for Excel export request
}

/**
 * Dropdown option structure for VKN/buyer selection
 * Matches legacy buyerList structure from getBuyerList API
 */
export interface BuyerOption {
  Identifier: string; // VKN identifier
  CompanyName: string; // Display name for dropdown
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

// Shared types are now exported from ../shared.types
