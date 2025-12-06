export interface LimitOperation {
  id: string;
  // Add your limit operation properties here
}

export interface LimitOperationState {
  // Add your state properties here
}

// =============================================================================
// COMPANY SEARCH TYPES
// =============================================================================

// Company search parameters for searchByCompanyNameOrIdentifier endpoint
export interface CompanySearchParams {
  CompanyNameOrIdentifier?: string;
  Status?: number;
  ActivityType?: number;
}

// Individual company search result item
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

// Response structure for searchByCompanyNameOrIdentifier endpoint
export interface CompanySearchByNameOrIdentifierResult {
  Items: CompanySearchResult[];
}

// Company Activity Type enum for search filtering
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Financer company search parameters
export interface FinancerCompanySearchParams {
  sort?: string;
  sortType?: string;
  type?: number;
  page?: number;
  pageSize?: number;
}

// Individual financer company search result item (from /companies/search API)
export interface FinancerCompanySearchResult {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address?: string | null;
  Phone: string;
  Verify: number;
  MailAddress?: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
  label?: string; // For autocomplete display
  value?: number; // For autocomplete value
}

// Response structure for financer companies search endpoint
export interface FinancerCompanySearchResponse {
  Items: FinancerCompanySearchResult[];
}

// =============================================================================
// LEGAL PROCEEDINGS (KANUNI TAKIP) TYPES
// ============================================================================="

export interface LegalProceedingsItem {
  Id: number;
  Identifier?: string;
  CompanyId?: number;
  CompanyName?: string;
  CustomerName?: string;
  CustomerManagerId?: number;
  CustomerManager?: string;
  TotalRisk?: number;
  CompensationDate?: string;
  Amount: number;
  TotalCollectionAmount: number;
  InterestAmount?: number;
  InterestRate?: number;
  TotalExpense?: number;
  ClosingBalance?: number;
  EarliestDefaultDate?: string;
  IntegratorId?: number;
  Integrator?: string;
  DocumentState?: number;
  DocumentStateDescription?: string;
  LawFirmId?: number;
  LawFirm?: string;
  AssignmentDate?: string;
  AssignmentFee?: number;
  CollectionAmountPostAssignmentDate?: number;
  ProductType?: number;
  GuarantorRate?: number;
  ProductTypeDescription?: string;
  GuarantorRateDescription?: string;
  State?: number;
  StateDescription?: string;
  Protocol?: number;
  ProtocolDescription?: string;
  FinancerId?: number;
  Financer?: string;
  ClosingDate?: string;
  RiskyFinancialSituations?: number[];
  IsDigital?: boolean;
  RemainingCompensationAmount?: number; // Calculated field
  index?: number; // For table row numbering
}

export interface LegalProceedingsQueryParams {
  // Company search
  Identifier?: string;

  // Date ranges
  startCompensationDate?: string; // YYYY-MM-DD format
  endCompensationDate?: string; // YYYY-MM-DD format
  startCollectionDate?: string; // YYYY-MM-DD format
  endCollectionDate?: string; // YYYY-MM-DD format

  // Enum selections
  compensationState?: number; // CompensationState enum
  lawFirmId?: number; // Law firm selection
  compensationProtocol?: number; // CompensationProtocol enum
  integratorStatus?: number; // IntegratorStatus enum
  ProductType?: number; // Product type enum
  guarantorRate?: number; // GuarantorRate enum

  // Entity selections
  financerId?: number; // Financer selection
  customerManagerId?: number; // Customer manager selection

  // Special fields
  Id?: number; // Specific ID filter
  RiskyFinancialSituations?: number[]; // Multi-select array

  // Table controls
  page?: number; // Current page (default: 1)
  pageSize?: number; // Items per page (default: 50)
  sort?: string; // Sort field (default: 'Id')
  sortType?: 'Asc' | 'Desc'; // Sort direction (default: 'Asc')
  isExport?: boolean; // Export flag
}

export interface LegalProceedingsResponse {
  Items?: LegalProceedingsItem[];
  TotalCount?: number;
  ExtensionData?: string | null;
  AllTotalAmount?: number; // Total compensation amount across all items
  AllTotalCollectionAmount?: number; // Total collection amount across all items
  AllTotalClosingBalance?: number; // Total remaining compensation amount
}

// Enum Types for Dropdowns
export interface CompensationStateType {
  Id: number;
  Description: string;
  Value: number;
}

export interface CompensationProtocolType {
  Id: number;
  Description: string;
  Value: number;
}

export interface IntegratorStatusType {
  Id: number;
  Description: string;
  Value: number;
}

// =============================================================================
// COMPENSATION UPDATE TYPES
// =============================================================================

export interface CompensationDetail {
  Id: number;
  AllowanceId?: number;
  BillNumber?: string; // For cheques
  InvoiceNumber?: string; // For invoices
  AllowanceAmount?: number;
  AllowanceDate?: string;
  AllowanceDueDate?: string;
  CompensationAmount?: number;
}

export interface CompensationUpdateFormData {
  Identifier?: string | CompanySearchResult;
  CompensationDate?: string;
  Amount?: number;
  FinancerId?: number;
  RiskyFinancialSituations?: RiskyCalculationType[];
  GuarantorRate?: number;
  DocumentState?: number;
  LawFirmId?: number;
  AssignmentFee?: number;
  AssignmentDate?: string;
  Protocol?: number;
  ProductType?: number;
  State?: number;
  InterestRate?: number;
  InterestAmount?: number;
  Note?: string;
  IsDigital?: boolean;
  details?: CompensationDetail[];
}

export interface CompensationUpdateRequest {
  Identifier?: string;
  CompensationDate?: string;
  Amount?: number;
  FinancerId?: number;
  RiskyFinancialSituations?: number[];
  GuarantorRate?: number;
  DocumentState?: number;
  LawFirmId?: number;
  AssignmentFee?: number;
  AssignmentDate?: string;
  Protocol?: number;
  ProductType?: number;
  State?: number;
  InterestRate?: number;
  InterestAmount?: number;
  Note?: string;
  IsDigital?: boolean; // API now expects boolean
  details?: CompensationDetail[];
}

export interface CompensationUpdateResponse {
  success: boolean;
  message?: string;
}

export interface CompensationItemResponse {
  Id: number;
  CompanyId?: number;
  Identifier?: string;
  CustomerName?: string;
  CompensationDate?: string;
  Amount?: number;
  FinancerId?: number;
  RiskyFinancialSituations?: number[];
  GuarantorRate?: number;
  DocumentState?: number;
  LawFirmId?: number;
  AssignmentFee?: number;
  AssignmentDate?: string;
  Protocol?: number;
  ProductType?: number;
  State?: number;
  InterestRate?: number;
  InterestAmount?: number;
  Note?: string;
  IsDigital?: boolean;
  ClosingBalance?: number;
  PrincipalAmount?: number;
  IntegratorStatus?: number;
}

export interface GuarantorRateType {
  Id: number;
  Description: string;
  Value: number;
}

export interface RiskyCalculationType {
  Id: number;
  Name: string;
  label?: string; // For form compatibility
  value?: number; // For form compatibility
}

export interface LawFirmType {
  Id: number;
  Name: string;
  Description?: string;
}

// =============================================================================
// COMPANY SETTINGS AND STATUS TYPES
// =============================================================================

// Company System Settings types
export interface CompanySystemSettings {
  Id: number;
  IsTwoFactorAuthenticationPassive: boolean;
  OnboardingStatusName: string;
  FinancerWorkingType: number;
  LanguageId: number | null;
  ChequeAllowed: number;
  OrderAllowed: number;
  LeadingChannelId: number | null;
  OnboardingStatusType: number | null;
  IsInvoicesBlockedForOtherProducts: boolean;
  TheBuyerIsSeller: boolean;
}

// Onboarding Status option for dropdown
export interface OnboardingStatusOption {
  Value: string;
  Description: string;
}

// Company Status Update Request
export interface CompanyStatusUpdateRequest {
  OnboardingStatusTypes: string;
  LoanDecisionTypes?: string;
  OperationalLimit?: number;
  commentText?: string;
}

// Modal Types
export interface LawFirmModalData {
  CompanyId?: number;
  CompensationId?: number;
  LawFirmId?: number;
  LawFirm?: string;
}

export interface EarliestDefaultDateModalData {
  CompanyId?: number;
  CompensationId?: number;
  EarliestDefaultDate?: string;
}

export interface RisksAllowanceModalData {
  CompanyId?: number;
  FinancerId?: number;
  ProductType?: number;
}

// Status Count Dashboard Types
export interface OnboardingStatusCount {
  OnboardingStatusType: number;
  Count: number;
}

export interface OnboardingStatusCountResponse {
  data: OnboardingStatusCount[];
}

// Score/Company Scoring Types
export interface CompanyScoring {
  CompanyId?: number;
  CompanyName?: string;
  Identifier?: string;
  CustomerManagerFullName?: string;
  IntegratorName?: string;
  IsLimitActive?: boolean | null;
  IsRisk?: boolean;
  Limit?: number;
}

// Extended Company Detail Types for ScoreCompanyDetail page
export interface CompanyDetail {
  CompanyId?: number;
  CompanyName?: string;
  Identifier?: string;
  Address?: string;
  CityId?: number;
  CityName?: string;
  DistrictId?: number;
  CitySubdivisionName?: string;
  AffiliateStructure?: string;
  Activity?: string;
  Bail?: string;
  RequestedLimit?: number;
  LimitAllocations?: LimitAllocation[];
}

export interface LimitAllocation {
  Id?: number;
  TypeDescription?: string;
  Description?: string;
  ProductTypeDescription?: string;
  FinancierCompany?: string;
  RequestedLimit?: number;
}

export interface IntegratorConfig {
  Id?: number;
  IsActive?: boolean;
  StartTransferDate?: string;
  LastTransferDate?: string;
  CreatedDate?: string;
}

export interface IntegratorDetail {
  Id?: number;
  Name?: string;
  IsActive?: boolean;
  Config?: IntegratorConfig;
}

export interface ScoreCompanyData {
  identifier?: string;
  nextOutgoingDate?: string;
}

export interface IntegratorHistory {
  Id?: number;
  IntegratorName?: string;
  ConnectedTime?: string;
  DisconnectedTime?: string;
}

export interface GroupCompany {
  Identifier?: string;
  CompanyName?: string;
}

// Company General Form Data - Following OperationPricing pattern
export interface CompanyGeneralFormData {
  companyName: string;
  identifier: string;
  address: string;
  cityName: string;
  citySubdivisionName: string;
  integratorName: string;
  eInvoiceStatus: string;
  figoTransferStatus: string;
  transferActive: string; // String for radio button compatibility ('true' or 'false')
  startTransferDate: Date | null;
  nextOutgoingDate: Date | null;
  affiliateStructure: string;
  activity: string;
  bail: string;
  requestedLimit: number;
}

export interface CompaniesScoringResponse {
  Page?: number;
  PageSize?: number;
  SortType?: string;
  Sort?: string;
  TotalCount?: number;
  IsExport?: boolean;
  ExtensionData?: string;
  Items?: CompanyScoring[];
}

export interface CompaniesScoringParams {
  page?: number;
  pageSize?: number;
  companyName?: string;
  identifier?: string;
  integratorId?: string | number;
  invoiceTransferIsActive?: string;
  isRisk?: string;
  LeadingChannelId?: string;
  limitStatus?: string;
  onboardingStatusTypes?: string;
  earlyWarningStatus?: string;
  fibabankaGuaranteeRate?: string;
  Month?: string;
  Year?: string;
  userIds?: number[] | string;
  sort?: string;
  sortType?: string;
  isExport?: boolean;
}

export interface Integrator {
  Id: number;
  Name: string;
}

export type IntegratorsResponse = Integrator[];

// Company Status Types
export interface OnboardingStatusType {
  Value?: number;
  Description?: string;
}

export interface CompanyStatusResponse {
  data?: OnboardingStatusType[];
}

export type CompanyStatusesResponse = OnboardingStatusType[];

// Customer Manager Types
export interface CustomerManager {
  Id: number;
  FullName: string;
}

export interface CustomerManagerResponse {
  Items: CustomerManager[];
  IsSuccess: boolean;
}

// Early Warning Status Types
export interface EarlyWarningStatusType {
  Value?: number;
  Description?: string;
}

export interface EarlyWarningStatusResponse {
  data?: EarlyWarningStatusType[];
}

export type EarlyWarningStatusesResponse = EarlyWarningStatusType[];

// Leading Channel Types
export interface LeadingChannel {
  Id?: number;
  Value?: string;
}

export interface LeadingChannelResponse {
  data?: LeadingChannel[];
}

export type LeadingChannelsResponse = LeadingChannel[];

// Excel Export Response
export interface ExcelExportResponse {
  data?: {
    ExtensionData?: string;
  };
}

// Score Data Types
export interface ScoreData {
  CompanyName?: string;
  Identifier?: string;
  Score?: number;
  Risk?: boolean;
}

export interface ScoreResponse {
  data?: ScoreData;
}

// Company Detail Types
export interface ScoreCompanyDetail {
  Id?: number;
  Identifier?: string;
  CompanyName?: string;
  IsActive?: boolean;
  OnboardingStatusType?: number;
  CustomerManagerId?: number;
}

export interface ScoreCompanyDetailResponse {
  data?: ScoreCompanyDetail;
}

// Invoice Buyer Types
export interface InvoiceBuyerMetric {
  Name?: string;
  Score?: number | null;
}

export interface InvoiceBuyerReceiver {
  Identifier?: string;
  Score?: number;
  Metrics?: InvoiceBuyerMetric[];
}

export interface InvoiceBuyerScore {
  CompanyName?: string;
  Identifier?: string;
  InvoiceCount?: number;
  TotalAmount?: number;
  MinInvoiceScore?: number;
  MaxInvoiceScore?: number;
  AverageInvoiceScore?: number;
  Receivers?: InvoiceBuyerReceiver[];
}

export interface InvoiceBuyerResponse {
  data?: InvoiceBuyerScore;
}

// Invoice Buyer Analysis Types (matching the exact API response format)
export interface InvoiceBuyerAnalysisMetric {
  Name: string;
  Score: number;
}

export interface InvoiceBuyerAnalysisReceiver {
  Identifier: string;
  CompanyName: string;
  Score: number;
  AverageInvoiceAmount: number;
  Metrics: InvoiceBuyerAnalysisMetric[];
}

export interface InvoiceBuyerAnalysisResponse {
  AverageInvoiceAmount: number;
  MinInvoiceScore: number;
  MaxInvoiceScore: number;
  AverageInvoiceScore: number;
  Receivers: InvoiceBuyerAnalysisReceiver[];
}

// E-Invoices (Score Invoices) Types
export interface ScoreInvoiceAmount {
  year?: number;
  month?: number;
  outgoingCount?: number;
  outgoingAmount?: number;
  outgoingAverage?: number;
  incomingCount?: number;
  incomingAmount?: number;
  incomingAverage?: number;
}

export interface ScoreInvoiceCurrency {
  currency?: string;
  amounts?: ScoreInvoiceAmount[];
}

export interface ScoreInvoicesData {
  currencies?: ScoreInvoiceCurrency[];
}

export interface ScoreInvoicesResponse {
  data?: ScoreInvoicesData;
}

// EUS (Early Warning System) Types
export interface EUSData {
  CompanyIdentifier?: string;
  Status?: number;
  StatusDescription?: string;
  LastUpdateDate?: string;
}

export interface EUSResponse {
  data?: EUSData;
}

// Filter Form Types
export interface CompaniesFilterFormData {
  companyName?: string;
  identifier?: string;
  integratorId?: string | number;
  invoiceTransferIsActive?: string;
  isRisk?: string;
  LeadingChannelId?: string;
  limitStatus?: string;
  onboardingStatusTypes?: string;
  earlyWarningStatus?: string;
  fibabankaGuaranteeRate?: string;
  Month?: string;
  Year?: string;
  userIds?: number[] | string;
}

// Guarantee Rate Types
export interface FibabankaGuaranteeRate {
  id: number;
  Description: string;
  Value: string;
}

// Companies Transfer List Types
export interface CompanyTransferItem {
  Id?: number;
  Name?: string; // Entegratör name from API
  CompanyId?: number;
  CompanyName?: string;
  Identifier?: string;
  IntegratorId?: number;
  IntegratorName?: string;
  Config?: IntegratorConfig;
  IsActive?: boolean;
}

export interface CompaniesTransferListResponse {
  Items?: CompanyTransferItem[];
  TotalCount?: number;
}

export interface CompaniesTransferListParams {
  identifier?: string;
  integratorId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// Company Invoice Transfer Check Types
export interface InvoiceTransferCheck {
  IsAvailable?: boolean;
  Message?: string;
  LastCheckDate?: string;
}

export interface InvoiceTransferCheckResponse {
  data?: InvoiceTransferCheck;
}

// Company Transfer List Update Types
export interface CompanyTransferUpdateRequest {
  Id?: number;
  IsActive?: boolean;
  StartTransferDate?: string;
  Config?: IntegratorConfig;
}

export interface CompanyTransferUpdateResponse {
  IsSuccess?: boolean;
  Message?: string;
}

// Score Company by Identifier Types
export interface ScoreCompanyByIdentifier {
  CompanyId?: number;
  CompanyName?: string;
  Identifier?: string;
  Score?: number;
  Risk?: boolean;
  LastScoreDate?: string;
  IsActive?: boolean;
  nextOutgoingDate?: string;
}

export interface ScoreCompanyByIdentifierResponse {
  data?: ScoreCompanyByIdentifier;
}

// Connected Integrator List Types
export interface ConnectedIntegrator {
  Id?: number;
  IntegratorId?: number;
  IntegratorName?: string;
  CompanyId?: number;
  IsActive?: boolean;
  ConnectedDate?: string;
  LastTransferDate?: string;
}

export interface ConnectedIntegratorListResponse {
  Items?: ConnectedIntegrator[];
  TotalCount?: number;
}

export interface ConnectedIntegratorListParams {
  companyId?: number;
  integratorId?: number;
  isActive?: boolean;
}

export interface ConnectedIntegratorUpdateRequest {
  IntegratorId?: number;
  IsActive?: boolean;
  Config?: IntegratorConfig;
}

export interface ConnectedIntegratorUpdateResponse {
  IsSuccess?: boolean;
  Message?: string;
}

// Integrator History Types (Enhanced)
export interface IntegratorHistoryItem {
  Id?: number;
  CompanyId?: number;
  IntegratorId?: number;
  IntegratorName?: string;
  ConnectedTime?: string;
  DisconnectedTime?: string;
  Reason?: string;
  UserId?: number;
  UserName?: string;
}

export interface IntegratorHistoryResponse {
  Items?: IntegratorHistoryItem[];
  TotalCount?: number;
}

// Company Detail (Enhanced for getCompanyDetail API)
export interface CompanyDetailFullResponse {
  Id?: number;
  CompanyName?: string;
  Identifier?: string;
  CompanyTypeId?: number;
  CompanyTypeName?: string;
  Address?: string;
  CityId?: number;
  CityName?: string;
  DistrictId?: number;
  CitySubdivisionName?: string;
  PostalCode?: string;
  Phone?: string;
  Email?: string;
  WebSite?: string;
  IsActive?: boolean;
  OnboardingStatusType?: number;
  OnboardingStatusName?: string;
  CustomerManagerId?: number;
  CustomerManagerName?: string;
  IntegratorId?: number;
  IntegratorName?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
  AffiliateStructure?: string;
  Activity?: string;
  Bail?: string;
  RequestedLimit?: number;
  LimitAllocations?: LimitAllocation[];
}

// Product Type Information
export interface ProductTypeInfo {
  ProductType: number;
  ProductTypeDescription: string;
}

// Company Detail with Allocations Response (from /companies/{id}/details)
export interface CompanyDetailWithAllocationsResponse {
  Id: number;
  ProductTypes: ProductTypeInfo[];
  RevenueType?: number;
  RevenueTypeDescription?: string;
  CompanySizeType?: number;
  CompanySizeTypeDescription?: string;
  FoundationYear?: number;
  IntegratorId?: number;
  AffiliateStructure?: string;
  Bail?: string;
  Activity?: string;
  CompanyKind?: number;
  RequestedLimit?: number | null;
  LimitAllocations: LimitAllocation[];
}

// Group Company Types (Enhanced)
export interface GroupCompanyItem {
  Id?: number;
  Identifier?: string;
  CompanyName?: string;
  CompanyTypeId?: number;
  CompanyTypeName?: string;
  IsActive?: boolean;
  GroupId?: number;
  GroupName?: string;
  RelationType?: string;
  CreatedDate?: string;
}

export interface GroupCompanyResponse {
  Items?: GroupCompanyItem[];
  TotalCount?: number;
}

// Company Score Types - Following legacy ScoreCompanyScore.js exactly
export interface BalanceSheetAccount {
  Code?: string;
  Name?: string;
  Type?: 'A' | 'P' | 'G'; // A=Assets, P=Liabilities, G=Income
  PeriodYear?: number;
  Amount?: number;
}

export interface ScoreDataAccount {
  Code?: string;
  Amount?: number;
  PeriodYear?: number;
}

export interface ScoreDataPeriod {
  Year?: number;
  Periods?: unknown[];
  Accounts?: ScoreDataAccount[];
}

export interface BalanceSheetResponse {
  data?: {
    data?: ScoreDataPeriod[];
  };
}

export interface CompanyScoreResponse {
  data?: ScoreDataPeriod[];
}

export interface FigoScoreData {
  CompanyName?: string;
  Identifier?: string;
  Score?: number;
  LoanDecisionTypeDescription?: string;
  FigoScoreModel?: string;
  FinancialDate?: string;
}

export interface FigoScoreResponse {
  data?: FigoScoreData;
}

export interface YearlySum {
  Type?: 'A' | 'P' | 'G';
  Sum?: Array<{
    PeriodYear?: number;
    Amount?: number;
  }>;
}

export interface BalanceSheetCalculations {
  balanceSheet?: BalanceSheetAccount[][];
  yearlySums?: YearlySum[];
  periodYears?: number[];
}

// Balance Sheet Template Item (from beyannameTemplate.json)
export interface BalanceSheetTemplateItem {
  Key?: string;
  AccountNumber?: string;
}
