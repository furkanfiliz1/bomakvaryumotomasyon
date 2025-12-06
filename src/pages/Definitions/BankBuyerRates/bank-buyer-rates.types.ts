/**
 * Bank Buyer Rates Type Definitions
 * Following OperationPricing pattern exactly
 */

// Commission/Rate entity from API
export interface BankBuyerCommission {
  Id: number;
  SenderCompanyId: number | null;
  ReceiverCompanyId: number | null;
  FinancerCompanyId: number | null;
  Rate: number | null;
  Amount: number | null;
  IsConsensus: boolean;
}

// Buyer company from API
export interface BuyerCompany {
  Id: number;
  Identifier: string;
  CompanyName: string;
}

// Financer company from API (search endpoint)
export interface FinancerCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string | null;
  Phone: string | null;
  Verify: string | null;
  MailAddress: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

// Response from financer companies search
export interface FinancerCompaniesResponse {
  Items: FinancerCompany[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

// Filter parameters for commission search
export interface BankBuyerRatesFilters {
  ReceiverCompanyId?: number | null;
  FinancerCompanyId?: number | null;
}

// Create payload matching legacy exactly
export interface CreateBankBuyerCommissionPayload {
  isConsensus: boolean;
  receiverCompanyId: number | null;
  financerCompanyId: number | null;
  rate: number | null;
  amount: number | null;
}

// Update payload matching API response format
export interface UpdateBankBuyerCommissionPayload {
  Id: number;
  SenderCompanyId: number | null;
  ReceiverCompanyId: number | null;
  FinancerCompanyId: number | null;
  Rate: number | null;
  Amount: number | null;
  IsConsensus: boolean;
}

// Query params for financer companies
export interface FinancerCompaniesQueryParams {
  sort?: string;
  sortType?: string;
  type?: number;
  page?: number;
  pageSize?: number;
}
