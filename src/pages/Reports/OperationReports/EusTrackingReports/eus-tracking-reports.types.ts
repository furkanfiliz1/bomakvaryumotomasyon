// EUS Tracking Reports Type Definitions
// Matches legacy EusTrackingReport component and API structures exactly

export interface EusTrackingFilters {
  companyIdentifier?: string;
  companyName?: string;
  EUSFormulaTypes?: string | null;
  EUSStatusTypes?: string | null;
  CompanyStatus?: string | null;
  month?: number | string;
  year?: number | string;
  page?: number;
  pageSize?: number;
}

// Query parameters interface matching legacy API call structure
export interface EusTrackingQueryParams extends EusTrackingFilters {
  page: number;
  pageSize: number;
}

// Individual EUS tracking item - matches legacy API response exactly
export interface EusTrackingItem {
  companyIdentifier: string;
  companyName: string | null;
  // Ratio fields (all numbers, displayed as percentages)
  invoiceMonthlyIncreaseRatio: number;
  invoiceThreeMonthlyIncreaseRatio: number;
  totalPaymentMonthlyDecreaseRatio: number;
  totalPaymentThreeMonthlyDecreaseRatio: number;
  returnedInvoiceTotalIncreaseRatio: number;
  senderAndReceiverRelation: number;
  senderAndReceiverReturnedAllowance: number;
  companyIntegratorCount: number;
  // Status fields for color coding (1=black, 2=yellow, 3=red)
  invoiceMonthlyIncreaseStatus: number;
  invoiceThreeMonthlyIncreaseStatus: number;
  totalPaymentMonthlyDecreaseStatus: number;
  totalPaymentThreeMonthlyDecreaseStatus: number;
  returnedInvoiceTotalIncreaseRatioStatus: number;
  senderAndReceiverRelationStatus: number;
  senderAndReceiverReturnedAllowanceStatus: number;
  companyIntegratorConnectionStatus: number;
}

// API response structure for EUS tracking data
export interface EusTrackingResponse {
  data: EusTrackingItem[];
  extensionData?: unknown;
  message?: string | null;
  success: boolean;
}

// Dropdown type definitions matching the enum API responses

// EUS Formula Types - matches /types?EnumName=EUSFormulaTypes
export interface EusFormulaType {
  Description: string;
  Value: string;
}

// EUS Status Types - matches /types?EnumName=EUSStatusTypes
export interface EusStatusType {
  Description: string;
  Value: string;
}

// Company lookup response for navigation
export interface CompanyByIdentifierResponse {
  id: number;
  identifier: string;
  name?: string;
}

// Form data interface for filter form
export interface EusTrackingFilterForm {
  companyIdentifier: string;
  companyName: string;
  eusFormulaTypes: string;
  eusStatusTypes: string;
  companyStatus: string;
  month: string;
  year: string;
}

// Month and Year options for dropdowns
export interface MonthYearOption {
  value: string;
  label: string;
}

// Status color type for type safety
export type EusStatusColor = 'black' | '#d1d422' | 'red';

// Filter change handler type
export type EusTrackingFilterChangeHandler = (filters: Partial<EusTrackingFilters>) => void;
