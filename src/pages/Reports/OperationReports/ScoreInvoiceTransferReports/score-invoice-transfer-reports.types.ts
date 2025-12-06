// Types for Score Invoice Transfer Reports module
// Following OperationPricing and ScoreInvoiceReports patterns exactly

export interface ScoreInvoiceTransferReportItem {
  Id: number;
  Name: string;
  Identifier: string;
  Type: number;
  IntegratorId: number;
  IsActive: boolean;
  CompanyId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  Config: {
    Id: number;
    StartTransferDate: string;
    LastTransferDate: string | null;
    CreatedDate: string;
    IsActive: boolean;
  };
}

export interface ScoreInvoiceTransferReportsFilters {
  identifier?: string; // Tedarikçi Kimlik Numarası
  type: number; // Always 1
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
}

// Form state types - matching legacy ScoreInvoiceTransferReport.js (single identifier field)
export interface ScoreInvoiceTransferReportsFilterForm {
  identifier: string; // Tedarikçi Kimlik Numarası
}

// Integrator options - exactly matching ScoreInvoiceReports data structure
export interface IntegratorOption {
  id: number;
  identifier: string | undefined;
  name: string;
}

// Status options for transfer reports
export interface StatusOption {
  value: string;
  label: string;
}

// Query parameter types following legacy ScoreInvoiceTransferReport.js patterns
export interface ScoreInvoiceTransferReportsQueryParams extends ScoreInvoiceTransferReportsFilters {
  type: number; // Always 1
  page: number;
  pageSize: number; // Always 50
  sort?: string; // Optional sorting
  sortType?: string; // Optional sort direction
}

// Hook return types - no dropdown data needed for single identifier field
export interface UseScoreInvoiceTransferReportsDropdownData {
  // No dropdown data needed - legacy has only a text input field
}

export interface UseScoreInvoiceTransferReportsQueryParams {
  baseQueryParams: ScoreInvoiceTransferReportsQueryParams;
}

// Response interface matching ScoreInvoiceReports API response structure
export interface ScoreInvoiceTransferReportsResponse {
  Items?: ScoreInvoiceTransferReportItem[];
  Data?: ScoreInvoiceTransferReportItem[]; // Alternative data property
  TotalCount?: number;
  ExtensionData?: string;
}
