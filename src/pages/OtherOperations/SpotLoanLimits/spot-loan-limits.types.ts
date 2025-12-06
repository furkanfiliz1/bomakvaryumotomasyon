// SpotLoanLimits module types - Legacy Parity Implementation

export type SpotLoanSearchType = 'COMPANY' | 'PERSON';
export type SpotLoanCustomerType = 'YES' | 'NO';

// Form values - matching legacy exact field names and types
export interface SpotLoanLimitsFormValues {
  NationalIdentityNumber: string;
  TaxNumber: string;
  BirthDate: string;
  searchType: SpotLoanSearchType;
  PhoneNumber: string;
  IsExistCustomer: SpotLoanCustomerType;
}

// API Request - matches legacy _postSpotLoanSearchLimitForFiba payload
export interface SpotLoanLimitsRequest {
  NationalIdentityNumber: string;
  TaxNumber: string;
  BirthDate: string;
  searchType: SpotLoanSearchType;
  PhoneNumber: string;
  IsExistCustomer: boolean; // API expects boolean, form uses string
}

// API Response - matches legacy response structure
export interface SpotLoanLimitsResponse {
  AvailableLimit?: number;
  MaxTerm?: number;
  CompanyName?: string;
  IsSuccess?: boolean;
}

// Stats types - matches legacy QuerySummary interface
export interface SpotLoanLimitsStats {
  CompanyQueryCount: number;
  TCKNQueryCount: number;
  TotalCount: number;
  VKNQueryCount: number;
}

export interface SpotLoanLimitsStatsResponse {
  Data: SpotLoanLimitsStats;
}
