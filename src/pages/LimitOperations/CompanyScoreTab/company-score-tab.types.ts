/**
 * Company Score Tab Types
 * Following OperationPricing pattern for type definitions
 */

// Loan Decision Type from API
export interface LoanDecisionType {
  Description: string;
  Value: string;
}

// Company Figo Score Response - matches API structure exactly (no data wrapper)
export interface CompanyFigoScoreData {
  CompanyName: string;
  Identifier: string;
  Score: number;
  FigoScoreModel: string;
  LoanDecisionType: number;
  LoanDecisionTypeDescription: string;
  FinancialDate: string | null;
}

// Historical Score Data for card display (future enhancement)
export interface HistoricalScoreData {
  year: string;
  score: number;
  subtitle: string;
  period?: string;
}

// Financial Analysis Account Structure - matches analysis API exactly
export interface FinancialAccount {
  TopAccountCode: string | null;
  PeriodQuarter: string | null;
  Code: string;
  Name: string;
  Amount: number;
  ActivePassive: 'A' | 'P' | 'G' | 'M'; // Active, Passive, Gelir, Maliyet
  AccountName: string;
}

// Financial Ratio Structure - matches analysis API exactly
export interface FinancialRatio {
  RatioId: number;
  Name: string;
  Ratio: number;
  Point: number | null;
  Weight: number;
  Trend: number;
  TypeName: string;
  SectorAverage: number;
  YearOverYearRate: number | null;
  SectorDiffRate: number;
  RateState: string;
}

// Analysis Summary Structure - matches analysis API exactly
export interface AnalysisSummaryItem {
  Name: string;
  Point: number;
  Trend: number;
}

export interface AnalysisSummary {
  Point: number;
  Trend: number;
  Total: number;
  CreditLimit: number | null;
  FindexCreditLimit: number | null;
  Items: AnalysisSummaryItem[];
}

// Period Information
export interface FinancialPeriod {
  Year: number;
  Type: number;
  PeriodQuarter: number | null;
  PeriodMonth: number;
}

// Single Financial Analysis Item
export interface FinancialAnalysisItem {
  Year: number;
  Periods: FinancialPeriod[];
  Accounts: FinancialAccount[];
  Ratios: FinancialRatio[];
  Analysis: AnalysisSummary;
}

// Complete Financial Analysis Response - array of items
export type FinancialAnalysisData = FinancialAnalysisItem[];

// Component Props Interfaces
export interface CompanyScoreTabPageProps {
  companyId: string;
}

export interface CompanyScoreInfoProps {
  companyId: string | number;
}

export interface FinancialAnalysisTableProps {
  financialAnalysisData?: FinancialAnalysisData;
  loading: boolean;
  error?: unknown;
}

export interface RatiosAnalysisTableProps {
  financialAnalysisData?: FinancialAnalysisData;
  loading: boolean;
  error?: unknown;
}

export interface AnalysisSummaryProps {
  financialAnalysisData?: FinancialAnalysisData;
  figoScoreData?: CompanyFigoScoreData;
  loading: boolean;
  error?: unknown;
}

// Hook Return Types
export interface UseCompanyScoreTabDataReturn {
  // Company Figo Score Data
  figoScoreData?: CompanyFigoScoreData;
  figoScoreLoading: boolean;
  figoScoreError?: unknown;

  // Financial Analysis Data
  financialAnalysisData?: FinancialAnalysisData;
  financialAnalysisLoading: boolean;
  financialAnalysisError?: unknown;

  // Loan Decision Types
  loanDecisionTypes: LoanDecisionType[];
  loanDecisionTypesLoading: boolean;
  loanDecisionTypesError?: unknown;

  // Combined loading and error states
  isLoading: boolean;
  hasError: boolean;

  // Refetch functions
  refetchFigoScore: () => void;
  refetchFinancialAnalysis: () => void;
  refetchLoanDecisionTypes: () => void;
  refetchAll: () => void;
}
