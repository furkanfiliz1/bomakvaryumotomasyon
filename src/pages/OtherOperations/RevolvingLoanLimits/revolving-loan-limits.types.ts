// RevolvingLoanLimits module types - Legacy Parity Implementation

// Form values - matches legacy exact field names and types
export interface RevolvingLoanLimitsFormValues {
  Identifier: string; // VKN field - matches legacy exactly
}

// API Request - matches legacy _searchLimitForRevolvingCredit payload
export interface RevolvingLoanLimitsRequest {
  Identifier: string;
}

// API Response - matches legacy response structure exactly (7 fields displayed)
export interface RevolvingLoanLimitsResponse {
  FinancerName?: string; // Finansör Adı
  FinancerIdentifier?: string; // Finansör VKN
  InterestRate?: number; // Faiz Oranı
  MarginRatio?: number; // Marj Oranı
  ActiveLimit?: number; // Aktif Limit (currency formatted)
  TotalLimit?: number; // Toplam Limit (currency formatted)
  MaxTerm?: number; // Not displayed but part of response
}
