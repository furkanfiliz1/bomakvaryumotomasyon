export interface CompensationTransactionFilters {
  identifier?: string;
  type?: string;
  startTransactionDate: string;
  endTransactionDate: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
}

export interface CompensationTransactionItem {
  Id: number;
  CompanyId: number;
  Identifier: string;
  CustomerName: string;
  FinancerId: number;
  Amount: number;
  Type: number;
  TransactionDate: string;
  // Legacy fields for backward compatibility
  CompanyIdentifier?: string;
  CompanyName?: string;
  TypeDescription?: string;
  Status?: number;
  StatusDescription?: string;
  Description?: string;
  ReferenceId?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
  CreatedBy?: string;
  UpdatedBy?: string;
}

export interface CompensationTransactionResponse {
  Items: CompensationTransactionItem[];
  TotalCount: number;
  Page: number;
  PageSize: number;
  ExtensionData?: string | null;
}

export interface CompensationTransactionQueryParams extends CompensationTransactionFilters {
  page: number;
  pageSize: number;
}

// Types for creating new compensation transactions
export interface CompensationTransactionCreateData {
  Identifier: string;
  TransactionDate: string;
  Amount: number;
  Type: string;
  FinancerId?: number;
}

// Transaction type dropdown options
export interface CompensationTransactionType {
  Value: string;
  Description: string;
}

// Company search functionality
export interface CompanySearchParams {
  CompanyNameOrIdentifier: string;
  Status?: number;
  ActivityType?: number;
}

export interface CompanySearchResponse {
  Id: number;
  Identifier: string;
  CompanyName: string;
  label: string; // For autocomplete display
  value: string; // For autocomplete value
}

// Response wrapper for searchByCompanyNameOrIdentifier endpoint
export interface CompanySearchByNameOrIdentifierResult {
  Items: CompanySearchResponse[];
  TotalCount: number;
}

// Financer company options - matching actual API response
export interface FinancerCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string | null;
  Phone: string;
  Verify: number;
  MailAddress: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

// Response wrapper for financer companies
export interface FinancerCompaniesResponse {
  Items: FinancerCompany[];
  TotalCount: number;
}

// Form data interface
export interface CompensationTransactionFormData {
  operationType: string;
  identifier: string;
  customerName?: string;
  financerCompany?: number;
  transactionDate: string;
  amount: number;
}

// Enum for transaction types (if needed)
export enum CompensationTransactionTypeEnum {
  All = '',
  Collection = '1', // Tahsilat
  Cost = '2', // Maliyet
}

// Available compensation detail interface for legal proceedings
export interface AvailableCompensationDetail {
  Id: number;
  InvoiceNumber?: string | null;
  BillNumber?: string | null;
  Amount: number;
  AllowanceAmount: number;
  AllowanceDueDate: string;
  RemainingRiskAmount: number;
  GuarantorRate: number;
  AllowanceId: number;
  AllowanceDate: string;
  AllowanceBillId?: number | null;
  AllowanceInvoiceId?: number | null;
  ChargedAmount: number;
}

// Selected compensation item with calculations
export interface SelectedCompensationItem extends AvailableCompensationDetail {
  calculatedRemainingRisk: number;
  compensationWeight: number;
  compensationAmount: number;
}

// Legal proceeding compensation creation data
export interface LegalProceedingCompensationCreateData {
  Identifier: string;
  CompensationDate: string;
  Amount: number;
  FinancerId: string;
  ProductType: string;
  interestRate: number;
  details: {
    allowanceId: number;
    allowanceInvoiceId?: number;
    allowanceBillId?: number;
    compensationAmount: number;
    interestRate: number;
    compensationRate: number;
  }[];
}
