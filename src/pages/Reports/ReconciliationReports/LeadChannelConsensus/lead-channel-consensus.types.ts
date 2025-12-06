/**
 * Lead Channel Consensus Report Types
 * Following IntegratorConsensus patterns with 100% legacy API parity
 *
 * Legacy API: /definitions/leadingChannels/report
 * Legacy URL: /raporlar/figoscore-lead-mutabakat
 */

/**
 * Individual lead channel consensus item matching exact API response structure
 */
export interface LeadChannelConsensusItem {
  /** İskonto Numarası */
  AllowanceId: number;
  /** Lead Kanal Adı */
  LeadChannel: string;
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
  /** Lead Kanal Komisyonu */
  LeadChannelComission: number;
  /** Düzenleme Tarihi */
  IssueDate: string;
  /** Entegratör Bağlılık Durumu */
  IsIntegratorConnect: boolean | null;
}

/**
 * API Response structure matching actual API response
 * Standard pagination response with real fields
 */
export interface LeadChannelConsensusResponse {
  Items: LeadChannelConsensusItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

/**
 * Query parameters for the lead channel consensus API
 * Matching legacy URL parameters exactly
 */
export interface LeadChannelConsensusQueryParams {
  /** Lead Kanal ID */
  LeadChannelId?: number;
  /** Başlangıç Tarihi (YYYY-MM-DD) */
  StartDate?: string;
  /** Bitiş Tarihi (YYYY-MM-DD) */
  EndDate?: string;
  /** Sayfa numarası */
  Page?: number;
  /** Sayfa boyutu */
  PageSize?: number;
  /** Sıralama türü */
  SortType?: 'ASC' | 'DESC';
  /** Sıralama alanı */
  Sort?: string;
  /** Excel export flag */
  isExport?: boolean;
}

/**
 * Lead channel dropdown option interface
 * Based on /definitions/leadingChannels/consensus response
 */
export interface LeadChannelOption {
  /** Lead kanal ID */
  Id: number;
  /** Lead kanal adı */
  Value: string;
  /** Komisyon oranı */
  Rate: number;
  /** Mutabakat durumu */
  IsConsensus: boolean;
  /** Dropdown value (same as Id) */
  value: number;
  /** Dropdown label (same as Value) */
  label: string;
}

/**
 * Filter form interface following OperationPricing pattern
 * Maps to query parameters for API calls
 */
export interface LeadChannelConsensusFilters {
  /** Seçili Lead Kanal ID */
  LeadChannelId: number | null;
  /** Başlangıç Tarihi */
  StartDate: Date | null;
  /** Bitiş Tarihi */
  EndDate: Date | null;
}

/**
 * Form data interface for React Hook Form
 * String representation for form inputs
 */
export interface LeadChannelConsensusFormData {
  /** Lead Kanal ID (as string for autocomplete) */
  LeadChannelId: string;
  /** Başlangıç Tarihi (YYYY-MM-DD format) */
  StartDate: string;
  /** Bitiş Tarihi (YYYY-MM-DD format) */
  EndDate: string;
}
