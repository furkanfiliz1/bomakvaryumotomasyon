// Types for Score Reports module
// Based on legacy ScoreInvoiceTransferReport implementation

export interface ScoreReportCompany {
  Id: number;
  CompanyId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  Name: string;
  Identifier: string;
  IsActive: boolean;
  Config: {
    StartTransferDate: string;
    LastTransferDate: string;
    CreatedDate: string;
    IsActive: boolean;
  };
}

export interface ScoreReportsResponse {
  Items: ScoreReportCompany[];
  TotalCount: number;
}

export interface ScoreReportsFilters {
  type: number;
  page: number;
  pageSize: number;
  identifier?: string;
}

// Form state types
export interface ScoreReportsFilterForm {
  identifier: string;
}

// Hook return types
export interface UseScoreReportsDropdownData {
  // No specific dropdown data needed for this report
  isLoading: boolean;
  error: unknown;
}

export interface UseScoreReportsQueryParams {
  queryParams: ScoreReportsFilters;
  setQueryParams: (params: Partial<ScoreReportsFilters>) => void;
  resetFilters: () => void;
}
