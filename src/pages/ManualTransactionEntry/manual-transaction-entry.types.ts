export interface FinancialRecord {
  Id?: number;
  FinancialRecordType: number | null;
  FinancialRecordProcessType: number | null;
  FinancialRecordProcessName?: string | null; // Process name for display
  FinancialActivityType: number;
  InvoiceNumber?: string | null;
  TaxFreeAmount: number | null;
  TotalPaidAmount?: number | null; // Total paid amount for display
  IssueDate: string | null;
  BillingIdentifier?: string | null;
  ReceiverIdentifier?: string | null;
  FinancerIdentifier?: string | null;
  FinancerName?: string | null; // Financer name for display
  SenderIdentifier?: string | null;
  SenderName?: string | null;
  SenderCustomerManagers?: string | null; // Comma-separated customer manager names
  InvoiceDueDate: string | null;
  CurrencyId: number;
  CurrencyCode?: string | null; // Currency code for display
  CurrencyName?: string | null; // Currency name for display
  ReferenceNumber?: string | null;
  BankGuaranteedAmount: number | null;
  SystemGuaranteedAmount: number | null;
  InvoiceParty?: number | null;
  selectedSenderValue?: {
    value: string;
    label: string;
  } | null;
}

export interface FinancialRecordFilters {
  ReferenceNumber?: string;
  SenderIdentifier?: string;
  FinancerIdentifier?: string;
  StartDate?: string;
  EndDate?: string;
  Type?: string;
  FinancialRecordProcessType?: string; // Fixed casing to match legacy
  BillingIdentifier?: string;
  ReceiverIdentifier?: string;
  SenderUserIds?: number[]; // Changed to number array to match legacy
  ReceiverUserIds?: number[]; // Changed to number array to match legacy
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: string;
  isExport?: boolean;
}

export interface FinancialRecordListResponse {
  ExtraFinancialRecords: FinancialRecord[]; // Changed to match legacy response structure
  TotalCount: number;
}

export interface DifferenceEntry {
  Id?: number;
  CompanyId: number;
  DifferenceType: number;
  Amount: number;
  Description?: string;
  ProcessDate: string;
  Status: number;
  CreatedDate?: string;
  UpdatedDate?: string;
}

export interface DifferenceEntryFilters {
  CompanyId?: number;
  DifferenceType?: number;
  StartDate?: string;
  EndDate?: string;
  Status?: number;
  page?: number;
  pageSize?: number;
}

export interface DifferenceEntryListResponse {
  Items: DifferenceEntry[];
  TotalCount: number;
}

export interface Currency {
  Id: number;
  Code: string;
  Name: string;
  Symbol: string;
}

export interface FinancialRecordType {
  Value: number;
  Description: string;
}

export interface FinancialActivityType {
  Value: number;
  Description: string;
}

export interface ProcessType {
  Value: number;
  Description: string;
}

export interface InvoicePartyType {
  Value: number;
  Description: string;
}

export interface Company {
  Id: number;
  Identifier: string;
  CompanyName: string;
  label?: string;
  value?: string;
}

export interface CustomerManager {
  Id: number;
  FullName: string;
}

export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Company search result for async autocomplete
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
  label?: string;
  value?: string;
}

export interface CompanySearchResponse {
  Items: CompanySearchResult[];
}

// Filter form data interface for UI
export interface FinancialRecordFilterFormData {
  referenceNumber: string;
  senderIdentifier: string | number;
  financerIdentifier: string | number;
  startDate: string;
  endDate: string;
  type: string;
  financialRecordProcessType: string;
  billingIdentifier: string;
  receiverIdentifier: string | number;
  senderUserIds: Array<{ value: number; label: string }>;
  receiverUserIds: Array<{ value: number; label: string }>;
}
