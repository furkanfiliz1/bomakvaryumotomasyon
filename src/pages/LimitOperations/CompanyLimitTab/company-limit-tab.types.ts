/**
 * Company Limit Tab Types
 * Following OperationPricing pattern with comprehensive type definitions
 * Based on legacy ScoreCompanyLimit.js data structures
 */

// Enum option type for dropdowns - matches legacy API response format
export interface EnumOption {
  Description: string;
  Value: string;
}

// Base response wrapper type for paginated API responses
export interface ApiResponseWrapper<T> {
  Items?: T[] | null;
  Page?: number;
  PageSize?: number;
  SortType?: string;
  Sort?: string | null;
  TotalCount?: number;
  IsExport?: boolean;
  ExtensionData?: string | null;
}

// Company limit information - matches legacy companyLimitInfos state
export interface CompanyLimitInfo {
  Id?: number;
  InsertedDate?: string | null;
  MaxInvoiceAmount?: number;
  InvoiceScore?: number;
  FinancialScore?: number;
  IsRisk?: boolean;
  IsVDMK?: boolean;
  IsActive?: boolean;
  LimitRejectReasonType?: number | null;
  CreditTerms?: string | null;
  CreditRiskLoanDecision?: number | null;
  FigoScoreLoanDecision?: number | null;
  FibabankaGuaranteeRate?: number | null;
  CreditDeskLoanDecision?: number | null;
  FinalLoanDecision?: number | null;
  CompanyId?: number;
  TotalLimit?: number;
  RemainingLimit?: number;
  Description?: string | null;
  MaxInvoiceDueDay?: number;
  CompanyName?: string;
  CompanyIdentifier?: string;
  Spread?: number;
  LimitRejectReasonName?: string;
}

// Guarantor company list item - matches _getGuaratorCompanyList response
export interface GuarantorCompanyListItem {
  Id: number;
  ProductType: number;
  ProductTypeName: string;
  Amount: number;
  UsedLimit: number;
  RemainingLimit: number;
  LimitDetails: GuarantorLimitDetail[];
}

// Guarantor limit detail - nested within GuarantorCompanyListItem
export interface GuarantorLimitDetail {
  Id: number;
  CompanyPeakId: number;
  FinancerId: number;
  FinancerIdentifier: string;
  FinancerName: string;
  Ratio?: number | null;
  TotalLimit: number;
  UsedLimit: number;
  RemainingLimit: number;
  IsHold: boolean;
  ProductType: number;
}

// Non-guarantor company list item - matches _getNonGuaratorCompanyList response
export interface NonGuarantorCompanyListItem {
  Id: number;
  CompanyId: number;
  FinancerId: number;
  FinancerName: string;
  TotalLimit: number;
  AvailableLimit: number;
  UsedLimit: number;
  FigoTotalLimit: number;
  FigoAvailableLimit: number;
  Hold: boolean;
  ProductType: number;
  ProductTypeName: string;
  IsManuel: boolean;
  LimitMaturityDate?: string | null;
  ErrorMessage?: string | null;
  FinancerUnsecuredLimit?: number | null;
  IsFinancialStatus: boolean;
  IsSuccess: boolean;
}

// Financer company - matches getCompanyList with type: 2 response
export interface FinancerCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address?: string | null;
  Phone?: string | null;
  Verify?: string | null;
  MailAddress?: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

// API Response Types

// Response type for _getGuaratorCompanyList
export type GuarantorCompanyListResponse = GuarantorCompanyListItem[];

// Response type for _getNonGuaratorCompanyList
export type NonGuarantorCompanyListResponse = NonGuarantorCompanyListItem[];

// Response type for _getCompaniesLimit
export type CompaniesLimitResponse = ApiResponseWrapper<CompanyLimitInfo>;

// Response type for getCompanyList with type: 2 (financers)
export type FinancerCompaniesResponse = ApiResponseWrapper<FinancerCompany>;

// API Request Types (for future mutations - not used in GET-only implementation)
export interface CompanyLimitCreateRequest {
  CompanyId: number;
  MaxInvoiceAmount?: number;
  InvoiceScore?: number;
  FinancialScore?: number;
  IsRisk?: boolean;
  IsVDMK?: boolean;
  IsActive?: boolean;
  LimitRejectReasonType?: number | null;
  CreditTerms?: string | null;
  CreditDeskLoanDecision?: number | null;
  FinalLoanDecision?: number | null;
  FibabankaGuaranteeRate?: number | null;
}

export interface CompanyLimitUpdateRequest extends CompanyLimitCreateRequest {
  Id: number;
}

// Peak (Roof) Limit Types - matches legacy _postPeakLimit, _putPeakLimitDetail
export interface PeakLimitCreateRequest {
  ActivityType?: string | null;
  CommentText?: string | null;
  CompanyId: number;
  ProductType: number;
  Amount: number;
}

export interface PeakLimitUpdateRequest {
  Id: number;
  ActivityType?: string | null;
  CommentText?: string | null;
  Amount: number;
}

// Guarantor Limit Types - matches legacy _postGuarantorLimit, _putGuarantorLimitListUpdate
export interface GuarantorLimitCreateRequest {
  ActivityType?: string | null;
  CommentText?: string | null;
  CompanyPeakLimitId: number;
  FinancerId: number;
  TotalLimit: number;
  IsHold: boolean;
}

export interface GuarantorLimitUpdateRequest {
  ActivityType?: string | null;
  CommentText?: string | null;
  TotalLimit: number;
  Id: number;
  IsHold: boolean;
}

// Non-guarantor Limit Types - matches legacy _postNonGuarantorLimit, _putNonGuarantorLimitListUpdate, _deleteNonGuarantorLimitListUpdate
export interface NonGuarantorLimitCreateRequest {
  ProductType: number;
  CompanyId?: number; // Will be set automatically in API
  FinancerCompanyId: number;
  TotalLimit: number;
}

export interface NonGuarantorLimitUpdateRequest {
  TotalLimit: number;
  Id: number;
}

// Query parameter types
export interface FinancerCompaniesParams {
  sort?: string;
  sortType?: 'Asc' | 'Desc';
  type?: number;
  page?: number;
  pageSize?: number;
}

// Dashboard data type - used by LimitDashboard component
export type DashboardData = GuarantorCompanyListItem[];

// Fibabanka guarantee rate options - hardcoded in legacy CompanyLimitInfos
export interface FibabankaGuaranteeRateOption {
  id: number;
  Description: string;
  Value: string;
}

// Form field change handler type
export type FieldChangeHandler = (value: unknown, fieldName: string) => void;

// Component props interfaces
export interface CompanyLimitTabPageProps {
  companyId: string;
}

export interface CompanyLimitInfosProps {
  companyLimitInfos: CompanyLimitInfo;
  getCompaniesLimit: () => void;
  companyId: string;
}

export interface LimitDashboardProps {
  dashboardData: DashboardData;
  productTypes?: EnumOption[];
}

export interface RoofLimitProps {
  creditRiskLoanDecision?: number | null;
  figoScoreLoanDecision?: number | null;
  roofLimitData: GuarantorCompanyListItem[];
  getGuarantedList: () => void;
  onChangeRoofLimitField: (value: number, index: number) => void;
  productTypes?: EnumOption[];
  activityTypes?: EnumOption[];
  companyId: string;
}

export interface GuarantorLimitListProps {
  creditRiskLoanDecision?: number | null;
  figoScoreLoanDecision?: number | null;
  roofLimitData: GuarantorCompanyListItem[];
  getGuarantedList: () => void;
  withGuarantorLimitListData: GuarantorCompanyListItem[];
  onChangeGuarantorLimitField: (value: number, index: number, detailIndex: number) => void;
}

export interface NonGuarantorLimitListProps {
  getNonGuarantedList: () => void;
  withoutGuarantorLimitListData: NonGuarantorCompanyListItem[];
  withoutGuarantorLimitData?: NonGuarantorCompanyListItem[] | null;
  onChangeNonGuarantorLimitField: (name: string, value: unknown, index: number) => void;
  getFinancersLimit: () => void;
}

// Risks Allowance Modal Types - matches legacy RisksAllowanceModal.js

// Allowance risk item - matches response from _getAllowanceRisks
export interface AllowanceRisk {
  AllowanceId: number;
  CreatedAt?: string | null;
  Amount: number;
}

// Allowance invoice/bill item - matches response from _getAllowanceInvoicesRisks / _getAllowanceInvoicesRisksBills
export interface AllowanceInvoiceRisk {
  InvoiceId?: number;
  BillId?: number;
  Amount: number;
  DueDate?: string | null;
}

// Paginated response for allowance invoice risks - matches legacy API response structure
export interface AllowanceInvoiceRisksResponse {
  AllowanceInvoices?: AllowanceInvoiceRisk[];
  AllowanceBills?: AllowanceInvoiceRisk[];
  Page: number;
  PageSize: number;
  TotalCount: number;
}

// Request parameters for getting allowance risks - matches legacy API calls
export interface AllowanceRisksParams {
  financerId: number;
  CompanyId: number;
  productType: number;
}

// Request parameters for getting allowance invoice risks - matches legacy API calls
export interface AllowanceInvoiceRisksParams {
  page: number;
  pageSize: number;
  AllowanceIds: number;
}

// Props for RisksAllowanceModal component - matches legacy props
export interface RisksAllowanceModalProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
  selectedFinancerId: number;
  selectedFinancerProductType: number;
}

// Hook return types
export interface UseCompanyLimitDataResult {
  companyLimitInfos: CompanyLimitInfo;
  dashboardData: DashboardData;
  roofLimitData: GuarantorCompanyListItem[];
  withGuarantorLimitListData: GuarantorCompanyListItem[];
  withoutGuarantorLimitListData: NonGuarantorCompanyListItem[];
  withoutGuarantorLimitData: NonGuarantorCompanyListItem[] | null;
  companyIdentifier: string | null;
  isLoading: boolean;
  error: unknown;
  // Refresh functions matching legacy methods
  getGuarantedList: () => void;
  getNonGuarantedList: () => void;
  getCompaniesLimit: () => void;
  getFinancersLimit: () => Promise<void>;
  // Field change handlers
  onChangeRoofLimitField: (value: number, index: number) => void;
  onChangeGuarantorLimitField: (field: string, value: unknown) => void;
  onChangeNonGuarantorLimitField: (name: string, value: unknown, index: number) => void;
}

export interface UseCompanyLimitDropdownDataResult {
  loanDecisionTypes: EnumOption[];
  limitRejectReasonTypes: EnumOption[];
  productTypes: EnumOption[];
  activityTypes: EnumOption[];
  financerCompanies: FinancerCompany[];
  fibabankaGuaranteeRates: FibabankaGuaranteeRateOption[];
  isLoading: boolean;
}
