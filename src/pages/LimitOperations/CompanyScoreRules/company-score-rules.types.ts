// Company Score Rules Types - Following OperationPricing pattern exactly

export interface CompanyScoreRule {
  Id?: number;
  SenderCompanyId: number;
  ReceiverCompanyId?: number;
  NotifyBuyer: number;
  SenderIdentifier: string;
  ReceiverIdentifier?: string;
  ReceiverCompanyName?: string;
  CompanyCategoryId?: number;
  PartialAllowance: number;
  SenderInvoiceUpload: number;
  IsBidViewable: boolean;
  SenderCancel: number;
  CompanyCategoryCode?: string;
  SenderBankAccountUpdate?: string;
  SenderCompanyName: string;
  ProductType: number;
  IsSenderOrderAdd: boolean;
  AllowOnlySingleInvoice: boolean;
}

export interface FinanceCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  TaxOffice: string;
  Status: number;
  selected?: boolean; // For UI state
}

export interface FinanceCompanyRule {
  Id: number;
  CompanyDefinitionId: number;
  FinancerCompanyId: number;
  BidProcess?: string;
  IntegrationType?: string;
  IntegrationModel?: string;
  FinancerIdentifier: string;
  Urf?: string;
  ProductType?: number;
}

export interface ProductTypeOption {
  id: number;
  name: string;
  label: string;
}

export interface CompanyScoreRulesProps {
  companyId: string;
}

// API Request/Response Types
export interface GetRulesRequest {
  notifyBuyer: number;
  senderCompanyId: number;
  productType: number;
}

export interface CreateRuleRequest {
  IsBidViewable: boolean;
  PartialAllowance: number;
  SenderCancel: number;
  notifyBuyer: number;
  SenderIdentifier: string;
  ProductType: number;
}

export interface UpdateRuleRequest extends CreateRuleRequest {
  Id: number;
}

export interface UpdateFinanceCompaniesRequest {
  CompanyDefinitionId: number;
  FinancerIdentifier: string;
}

// Form Data Types
export interface CompanyScoreRulesFormData {
  IsBidViewable: boolean;
  PartialAllowance: number;
  SenderCancel: number;
  ProductType: number;
}

// Product Types Constants (matching legacy exactly)
export const ProductTypesList = {
  SME_FINANCING: 3,
  SPOT_LOAN_FINANCING_WITHOUT_INVOICE: 8,
  REVOLVING_CREDIT: 9,
} as const;

export type ProductType = (typeof ProductTypesList)[keyof typeof ProductTypesList];
