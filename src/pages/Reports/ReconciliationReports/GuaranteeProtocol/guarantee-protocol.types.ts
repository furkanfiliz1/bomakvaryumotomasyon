/**
 * G// Shared types are now exported from ../shared.typeseport Types
 * Following OperationPricing patterns with 100% legacy API parity
 *
 * Legacy API: /reports/guarantorprotocol
 * Legacy Component: GuaranteeAgreement.js
 */

// Company activity types for search filtering
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Company search result interface
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

/**
 * Detail item for each date within a guarantee protocol entry
 */
export interface GuaranteeProtocolDetail {
  /** Date of the guarantee protocol entry */
  Date: string;
  /** Total number of invoices */
  TotalInvoiceCount: number;
  /** Total system amount (Azami Garanti Tutarı) */
  TotalSystemAmount: number;
}

/**
 * Individual guarantee protocol item matching exact API response structure
 */
export interface GuaranteeProtocolItem {
  /** Sender Company ID */
  SenderCompanyId: number;
  /** Sender Company Name (Tedarikçi Ünvan) */
  SenderCompanyName: string;
  /** Sender Identifier/VKN (Tedarikçi VKN) */
  SenderIdentifier: string;
  /** Financier Identifier/VKN */
  FinancerIdentifier: string;
  /** Financier Company Name (Alıcı Ünvan) */
  FinancerCompanyName: string;
  /** Array of guarantee protocol details by date */
  Details: GuaranteeProtocolDetail[];
}

/**
 * API Response structure matching exact legacy API response
 */
export interface GuaranteeProtocolResponse {
  /** Array of guarantee protocol items */
  Items: GuaranteeProtocolItem[];
  /** Current page number */
  Page: number;
  /** Items per page */
  PageSize: number;
  /** Sort type (ASC/DESC) */
  SortType: string;
  /** Sort field */
  Sort: string | null;
  /** Total count of items */
  TotalCount: number;
  /** Export flag */
  IsExport: boolean;
  /** Extension data for exports */
  ExtensionData: string | null;
}

/**
 * Filter form values for guarantee protocol report
 * Following OperationPricing pattern exactly
 */
export interface GuaranteeProtocolFilters {
  /** Financier Identifier (VKN) - required */
  FinancerIdentifier?: string;
  /** Sender Identifier (VKN) - optional */
  SenderIdentifier?: string;
  /** Start date for the report */
  StartDate: string;
  /** End date for the report */
  EndDate: string;
  /** Current page number */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Export flag for PDF download */
  isExport?: boolean;
}

/**
 * Query parameters interface for API calls
 * Maps form values to API parameters exactly
 */
export interface GuaranteeProtocolQueryParams extends GuaranteeProtocolFilters {
  /** Formatted start date */
  StartDate: string;
  /** Formatted end date */
  EndDate: string;
}

/**
 * Form values interface for React Hook Form
 * Matches filter interface for consistency
 */
export interface GuaranteeProtocolFilterFormValues {
  /** Financier Identifier input */
  FinancerIdentifier?: string;
  /** Sender Identifier input */
  SenderIdentifier?: string;
  /** Start date picker value */
  StartDate: Date;
  /** End date picker value */
  EndDate: Date;
}

/**
 * Flattened row item for table display
 * Each detail becomes a separate row
 */
export interface GuaranteeProtocolTableRow extends GuaranteeProtocolDetail {
  /** Sender Company Name (Tedarikçi Ünvan) */
  SenderCompanyName: string;
  /** Sender Identifier/VKN (Tedarikçi VKN) */
  SenderIdentifier: string;
  /** Financier Company Name (Alıcı Ünvan) */
  FinancerCompanyName: string;
  /** Financier Identifier/VKN (Alıcı VKN) */
  FinancerIdentifier: string;
  /** Formatted date string for display */
  FormattedDate: string;
}

/**
 * Download request parameters for PDF generation
 * Matches legacy downloadConsensusFile functionality
 */
export interface GuaranteeProtocolDownloadParams {
  /** Date for specific document */
  Date: string;
  /** Financier Identifier */
  FinancerIdentifier: string;
  /** Sender Identifier */
  SenderIdentifier: string;
}
