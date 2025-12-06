// Types for Score Invoice Reports module
// Based on legacy ScoreInvoiceReport implementation - exact 1:1 parity

export interface ScoreInvoiceReportItem {
  companyIdentifier: string;
  integratorIdentifier: string;
  totalOutGoingEInvoice: number;
  totalIncomingEInvoice: number;
  totalOutGoingEArchive: number;
}

export interface ScoreInvoiceReportsFilters {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  companyIdentifier?: string;
  integratorIdentifier?: string;
}

// Form state types - exactly matching legacy form fields
export interface ScoreInvoiceReportsFilterForm {
  companyIdentifier: string;
  integratorIdentifier: string;
  date: string; // Form date fields use string format (YYYY-MM-DD)
}

// Integrator options - exactly matching legacy data
export interface IntegratorOption {
  id: number;
  identifier: string | undefined;
  name: string;
}

// Hook return types
export interface UseScoreInvoiceReportsDropdownData {
  integratorOptions: IntegratorOption[];
  isLoading: boolean;
  error: unknown;
}

export interface UseScoreInvoiceReportsQueryParams {
  queryParams: ScoreInvoiceReportsFilters;
  setQueryParams: (params: Partial<ScoreInvoiceReportsFilters>) => void;
  resetFilters: () => void;
}
