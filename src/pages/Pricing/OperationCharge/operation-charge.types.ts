import { ProductTypeOption } from '@api';

export interface OperationCharge {
  Id: number;
  ReceiverName?: string;
  ReceiverIdentifier?: string;
  SenderName?: string;
  SenderIdentifier?: string;
  FinancerName?: string;
  FinancerIdentifier?: string;
  ProductType: number;
  LastUpdate?: string;
  OperationChargeDefinitionType: number;
  selected?: boolean; // For UI selection state
}

export interface OperationChargeFilters {
  ReceiverIdentifier?: string;
  SenderIdentifier?: string;
  FinancerIdentifier?: string;
  ProductType?: string | number;
  operationChargeDefinitionType?: string | number;
  IsDaily?: string | boolean;
}

export interface IntegratorStatusOption {
  value: number;
  label: string;
}

export interface CompanyFinancierOption {
  value: string;
  label: string;
  Id: number;
  Identifier: string;
  CompanyName: string;
}

export interface CompanyFinancierOption {
  value: string;
  label: string;
  Id: number;
  Identifier: string;
  CompanyName: string;
}

export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
  label: string;
  value: string;
}

// Response structure for searchByCompanyNameOrIdentifier endpoint
export interface CompanySearchByNameOrIdentifierResult {
  Items: CompanySearchResult[];
}

export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

export interface CreateOperationChargeAmountRequest {
  MinAmount?: number | null;
  MaxAmount?: number | null;
  MinDueDay?: number | null;
  MaxDueDay?: number | null;
  PercentFee?: number | null;
  TransactionFee?: number | null;
  MinScore?: number | null;
  MaxScore?: number | null;
  ProrationDays?: number | null;
  OperationChargeDefinitionType: number;
}

export interface DeleteOperationChargesRequest {
  OperationChargeIds: number[];
}

// Form schema types for filters
export interface OperationChargeFilterForm {
  receiverIdentifier: CompanySearchResult | null;
  senderIdentifier: CompanySearchResult | null;
  financerIdentifier: CompanySearchResult | null;
  operationChargeDefinitionType: IntegratorStatusOption | null;
  productType: ProductTypeOption | string;
  isDaily: { value: boolean; label: string } | null;
}

// Operation Charge Amount structure for nested table
export interface OperationChargeAmount {
  Id?: number;
  MinDueDay?: number | null;
  MaxDueDay?: number | null;
  MinAmount?: number | null;
  MaxAmount?: number | null;
  TransactionFee?: number | null;
  PercentFee?: number | null;
  MinScore?: number | null;
  MaxScore?: number | null;
  ProrationDays?: number | null;
  OperationChargeDefinitionType?: number;
  InsertDate?: string;
}

// Full Operation Charge structure for create/edit
export interface OperationChargeDetail {
  Id?: number;
  FinancerIdentifier?: string;
  ReceiverIdentifier?: string;
  SenderIdentifier?: string;
  TransactionType?: string;
  OperationChargeAmounts: OperationChargeAmount[];
  PaymentType?: number;
  OperationChargeDefinitionType?: string;
  ChargeCompanyType?: number;
  IsDaily?: boolean;
  ProductType?: string;
}

// Form structure matching legacy component state
export interface OperationChargeFormData {
  ProductType: string;
  SenderIdentifier: string;
  ReceiverIdentifier: string;
  FinancerIdentifier: string[]; // Changed to string array for multiple selection
  TransactionType: string;
  PaymentType: number;
  OperationChargeDefinitionType: string;
  ChargeCompanyType: number;
  IsDaily: boolean;
}

// Original form with complex types (for future async search implementation)
export interface OperationChargeFormDataWithSearch {
  ProductType: string;
  SenderIdentifier: CompanySearchResult | null;
  ReceiverIdentifier: CompanySearchResult | null;
  FinancerIdentifier: CompanySearchResult | null;
  TransactionType: string;
  PaymentType: number;
  OperationChargeDefinitionType: string;
  ChargeCompanyType: number;
  IsDaily: boolean;
}

// New charge amount entry form
export interface NewOperationChargeAmountFormData {
  MinDueDay: number;
  MaxDueDay: number;
  MinAmount: number;
  MaxAmount: number;
  TransactionFee: number;
  PercentFee: number;
  MinScore: number | null;
  MaxScore: number | null;
  ProrationDays: number | null;
  amountType: number; // 1 = Birim (Unit), 2 = Yüzde (Percentage)
}

// Transaction type options matching legacy
export interface TransactionTypeOption {
  label: string;
  value: string;
}

// API response for getting operation charge by ID (matching actual API response)
export interface GetOperationChargeByIdResponse {
  Id: number;
  ReceiverCompanyId?: number;
  SenderCompanyId?: number | null;
  ChargeCompanyType: number;
  ReceiverIdentifier?: string | null;
  SenderIdentifier?: string | null;
  TransactionType: number;
  OperationChargeAmounts: Array<{
    ID: number;
    MinAmount?: number;
    MaxAmount?: number;
    TransactionFee?: number;
    PercentFee?: number | null;
    OperationChargeId: number;
    MaxDueDay?: number | null;
    MinDueDay?: number | null;
    MinScore?: number | null;
    MaxScore?: number | null;
    ProrationDays?: number | null;
    SysLastUpdate: string;
    InsertDatetime: string;
    UpdatedAt?: string | null;
    CreatedAt: string;
  }>;
  PaymentType: number;
  FinancerCompanyId?: number | null;
  FinancerIdentifier?: string | null;
  ProductType: number;
  OperationChargeDefinitionType?: number | null;
  IsDaily: boolean;
  ReceiverName?: string;
  LastUpdate: string;
  FinancerName?: string | null;
  SenderName?: string | null;
}

// API request for create/update
export interface CreateOperationChargeRequest {
  FinancerIdentifier?: string;
  ReceiverIdentifier?: string;
  SenderIdentifier?: string;
  TransactionType: string;
  OperationChargeAmounts: Omit<OperationChargeAmount, 'Id' | 'InsertDate'>[];
  PaymentType: number;
  OperationChargeDefinitionType: string;
  ChargeCompanyType: number;
  IsDaily: boolean;
  ProductType: string;
}

export interface UpdateOperationChargeRequest extends CreateOperationChargeRequest {
  Id: number;
}

// API response for create operation charge with validation
export interface CreateOperationChargeResponse {
  Id: number;
  ValidationMessage?: string;
  IsSuccess: boolean;
}

// Discount auto-fill API response
// API: GET /companies/discounts/getDiscountAutoFillItems?Identifier={senderIdentifier}&ProductType={productType}
export interface DiscountAutoFillItem {
  OperationChargeDefinitionType: number;
  MaxScore: number;
  MinScore: number;
  MaxAmount: number;
  MinAmount: number;
}

// Company Operation Charge History
export interface CompanyOperationChargeHistoryItem {
  MinAmount: number;
  MaxAmount: number;
  MinDueDay: number;
  MaxDueDay: number;
  MinScore: number;
  MaxScore: number;
  TransactionFee: number;
  PercentFee: number;
  UpdateDate: string;
}

export interface GetCompanyOperationChargeResponse {
  Id: number;
  ReceiverCompanyId: number;
  SenderCompanyId?: number | null;
  ChargeCompanyType: number;
  ReceiverIdentifier?: string;
  SenderIdentifier?: string | null;
  TransactionType: number;
  OperationChargeAmounts: Array<{
    ID: number;
    MinAmount?: number;
    MaxAmount?: number;
    TransactionFee?: number;
    PercentFee?: number | null;
    OperationChargeId: number;
    MaxDueDay?: number | null;
    MinDueDay?: number | null;
    MinScore?: number | null;
    MaxScore?: number | null;
    ProrationDays?: number | null;
    SysLastUpdate: string;
    InsertDatetime: string;
    UpdatedAt?: string | null;
    CreatedAt: string;
  }>;
  PaymentType: number;
  FinancerCompanyId?: number | null;
  FinancerIdentifier?: string | null;
  ProductType: number;
  OperationChargeDefinitionType?: number | null;
  IsDaily: boolean;
  ReceiverName?: string;
  LastUpdate: string;
  FinancerName?: string | null;
  SenderName?: string | null;
}
