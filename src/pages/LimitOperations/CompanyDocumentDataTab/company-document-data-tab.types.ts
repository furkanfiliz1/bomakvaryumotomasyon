/**
 * Company Document Data Tab Types
 * Following OperationPricing pattern for type definitions
 * Matches legacy ScoreCompanyDocumentAndInvoices.js data structures exactly
 */

// Findeks Report Types
export interface FindeksReportOption {
  Id: number;
  ReportDate: string;
  ReferenceCode: string;
}

export interface FindeksData {
  Id: number;
  CompanyId: number;
  DocumentId: number;
  DocumentType: string;
  ReportDate: string;
  ReferenceCode: string;
  LimitGroup: string;
  LimitCash: string;
  LimitNonCash: string;
  LimitTotal: string;
  LimitGeneralRevisionDueDate: string;
  LimitNumberOfDelayingAccounts: number | null;
  RiskGroup: string;
  RiskCash: string;
  RiskNonCash: string;
  RiskOther: string;
  RiskTotal: string;
  RiskOverdueAmount: string;
  FaktoringNotificationPeriod: string;
  FaktoringCreditLimit: string;
  Faktoring0112MonthsTerm: string;
  Faktoring1224MonthsTerm: string;
  FaktoringMoreThan24MonthsTerm: string;
  FaktoringInterestRediscountAndCommission: string;
  FaktoringInterestAccrualAndCommission: string;
  FaktoringReportingOrganizations: number | null;
  LimitOccupancyRate: number;
  FaktoringLimitOccupancyRate: number;
  Name: string;
  TCVkn: string;
  NumberOfAccountsInDelayA4: string;
  FirstCreditUsageDateA2: string;
  LastCreditUsageDateA3: string;
  LimitAllocationDateA5: string;
  CreditBalancesOfFollowUpC2TK: string;
  TotalTransferredCommercialDebt: string;
  TotalDebtInDelayA6: string;
}

// Financial Data Types
export interface FinancialDataItem {
  id: number;
  eLedgerType: number;
  periodMonth: number | null;
  periodQuarter: number | null;
  periodYear: number;
}

// Invoice Integrator Types - Based on actual API response
export interface InvoiceIntegratorDetail {
  id: number;
  companySectorId: number;
  companySector: string;
  identifier: string;
  createdDate: string; // ISO string format
  nextIncomingDate: string;
  nextOutgoingDate: string;
  nextOutgoingFirstDate: string;
  requestCurrentLimit: number;
  requestLimit: number;
  requestLimitDate: string;
  firstDownloadComplete: boolean;
}

export interface InvoiceIntegrator {
  entry: boolean;
  integratorName: string;
  active: boolean;
}

// Ledger Integrator Types
export interface LedgerIntegrator {
  entry: boolean;
  integratorName: string;
  active: boolean;
}

// Company Detail Type
export interface CompanyDetail {
  Id: number;
  Identifier: string;
  Name: string;
  // Add other company fields as needed
}

// API Response Types
export type FindeksReportsResponse = FindeksReportOption[];

export type FindeksReportResponse = FindeksData;

export interface FinancialDataResponse {
  data: FinancialDataItem[];
}

// Invoice Integrator API Response - Real structure from API
export interface IntegratorItem {
  Id: number;
  Name: string;
  Identifier: string;
  Type: number;
  IntegratorId: number;
  CompanyIntegratorParams: Array<{
    Key: string;
    SubKey: string | null;
    Value: string;
    DataType: number;
    Description: string;
  }>;
  IsActive: boolean;
  CompanyId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  IsReadyToBringInvoice: boolean;
  ConnectedTime: string;
  IntegratorMessage: string | null;
}

export interface ConnectedIntegratorResponse {
  Integrators: IntegratorItem[];
  IsSuccess: boolean;
}

// API direkt InvoiceIntegratorDetail döndürüyor, data wrapper'ı yok
export type CompanyDetailResponse = InvoiceIntegratorDetail;

// API Request Parameters
export interface FindeksReportsParams {
  companyId: string;
}

export interface FindeksReportParams {
  reportId: string;
}

export interface FinancialDataParams {
  identifier: string;
}

export interface ConnectedIntegratorParams {
  type: number; // 1 = invoice, 2 = ledger
  identifier: string;
}

// Component State Types
export interface DocumentDataState {
  // Findeks
  findeksReports: FindeksReportOption[];
  selectedReportId: string | null;
  findeksData: FindeksData | null;

  // Financial Data
  financialData: FinancialDataItem[];

  // Integrators
  invoiceIntegrator: InvoiceIntegrator;
  invoiceIntegratorDetail: InvoiceIntegratorDetail;
  ledgerIntegrator: LedgerIntegrator;

  // Company
  company: CompanyDetail | null;

  // Loading states
  loadingStates: {
    findeksReports: boolean;
    findeksData: boolean;
    financialData: boolean;
    invoiceIntegrator: boolean;
    ledgerIntegrator: boolean;
    company: boolean;
  };

  // Error states
  errors: {
    findeksReports: string | null;
    findeksData: string | null;
    financialData: string | null;
    invoiceIntegrator: string | null;
    ledgerIntegrator: string | null;
    company: string | null;
  };
}

// E-Ledger Type Mapping (from legacy checkEledgerType function)
export enum ELedgerType {
  MIZAN = 1,
  GECICI_BEYANNAME = 2,
  BEYANNAME = 3,
  DIGER = 4,
}

// Default Findeks Data Structure (matches legacy initial state)
