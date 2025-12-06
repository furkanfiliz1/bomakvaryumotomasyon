import { ServerSideQueryArgs } from 'src/hooks/useServerSideQuery';

// Company activity types for search filtering
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Status enum for transaction fee discount filter - following OperationPricing pattern
export enum TransactionFeeDiscountStatus {
  All = 3,
  Active = 1,
  Inactive = 2,
}

// Company search result interface
export interface CompanySearchResult {
  Id: number;
  CompanyName: string;
  Identifier: string;
  label: string;
  value: string;
}

export interface CompanySearchResponse {
  Items: CompanySearchResult[];
}

export interface CompanyDiscount {
  Id: number;
  ReceiverCompanyIdentifier: string | null;
  SenderCompanyIdentifier: string | null;
  StartDate: string;
  ExpireDateTime: string;
  Percent: number;
  Amount: number;
  TypeName: string;
  IsActive: boolean;
  Type: number;
}

export interface CompanyDiscountFilters {
  senderCompanyIdentifier?: string;
  receiverCompanyIdentifier?: string;
  isActive?: string | boolean;
  page?: number;
  pageSize?: number;
}

export interface CompanyDiscountListResponse {
  Items: CompanyDiscount[];
  TotalCount: number;
}

export interface DiscountType {
  Description: string;
  Value: string;
}

export interface CreateCompanyDiscountRequest {
  Percent?: number | null;
  Amount?: number | null;
  Type: number;
  ReceiverCompanyIdentifier?: string | null;
  SenderCompanyIdentifier?: string | null;
  StartDate: string;
  ExpireDateTime?: string | null;
}

export interface UpdateCompanyDiscountRequest extends CreateCompanyDiscountRequest {
  Id: number;
}

export interface TransactionFeeDiscountServerSideQueryArgs extends ServerSideQueryArgs {
  senderCompanyIdentifier?: string;
  receiverCompanyIdentifier?: string;
  isActive?: string | boolean;
}

export interface TransactionFeeDiscountFormData {
  Type: number | null;
  ReceiverCompanyIdentifier: string | null;
  SenderCompanyIdentifier: string | null;
  Percent: number | null;
  Amount: number | null;
  StartDate: string;
  ExpireDateTime: string | null;
}
