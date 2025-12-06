/**
 * Integrator Consensus Report Types
 * Following OperationPricing patterns with 100% legacy API parity
 *
 * Legacy API: /integrators/commission/getreport
 * Legacy URL: /raporlar/entegrator-mutabakat
 */

/**
 * Individual integrator consensus item matching exact API response structure
 */
export interface IntegratorConsensusItem {
  /** İskonto Numarası */
  AllowanceId: number;
  /** Entegratör Adı */
  IntegratorName: string;
  /** Fatura Numarası */
  InvoiceNumber: string;
  /** Gönderici VKN */
  SenderIdentifier: string;
  /** Gönderici Firma Adı */
  SenderCompanyName: string;
  /** Fatura Tutarı */
  InvoiceAmount: number;
  /** İşlem Değişim Tutarı */
  OperationChangeAmount: number;
  /** Entegratör Komisyonu */
  IntegratorCommission: number;
  /** Düzenleme Tarihi */
  IssueDate: string;
  /** Entegratör Bağlantısı */
  IsIntegratorConnect: boolean;
}

/**
 * API Response structure matching actual API response
 * Standard pagination response with real fields
 */
export interface IntegratorConsensusResponse {
  Items: IntegratorConsensusItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

/**
 * Filter form values matching legacy URL parameters
 * Used in form validation and API query parameters
 */
export interface IntegratorConsensusFilters {
  IntegratorId: number; // Integrator ID (required)
  StartDate: Date; // Start date
  EndDate: Date; // End date
  IsIntegratorConnect?: boolean | null; // Entegratör Bağlılık Durumu (optional)
}

/**
 * Query parameters sent to API - matches legacy API call parameters exactly
 * useServerSideQuery will add pagination (page, pageSize) automatically
 */
export interface IntegratorConsensusQueryParams {
  IntegratorId?: number;
  StartDate?: string; // ISO date string for API
  EndDate?: string; // ISO date string for API
  IsIntegratorConnect?: boolean; // Connection status filter
  Page?: number;
  PageSize?: number;
  isExport?: boolean;
}

/**
 * Filter form values for React Hook Form (before conversion to API params)
 */
export interface IntegratorConsensusFilterFormValues {
  IntegratorId: number | string; // Allow string for form input
  StartDate: string; // Form date input format
  EndDate: string; // Form date input format
  IsIntegratorConnect: string; // Connection status as string for form
}

/**
 * Integrator option structure for dropdown
 * Used in integrator selector dropdown
 */
export interface IntegratorOption {
  Id: number; // Integrator ID
  Name: string; // Display name for dropdown
  value: number; // For react-hook-form compatibility
  label: string; // For react-hook-form compatibility
}

/**
 * Connection status options for filter dropdown
 */
export enum IntegratorConnectionStatus {
  All = 'all',
  Connected = 'true',
  NotConnected = 'false',
}

export interface ConnectionStatusOption {
  value: string;
  label: string;
}
