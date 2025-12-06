// Types for Buyer Limit Reports module
// Based on legacy BuyerLimitReports implementation

import { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';

export interface BuyerLimitReportItem {
  CompanyId: number;
  FinancerId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  AvailableLimit: number;
  UsedLimit: number;
  TotalLimit: number;
  IsSuccess: boolean;
}

export interface BuyerLimitReportsResponse extends BuyerLimitReportItem {
  // API returns the data directly, not wrapped in a data property
}

export interface BuyerLimitReportsFilters {
  CompanyId: number;
  FinancerIdentifier: string;
}

// Form state types - following legacy state structure
export interface BuyerLimitReportsFilterForm {
  financerIdentifier: string;
  companyId: string; // Keep as string for form handling, convert to number for API
}

// API parameters type - after form transformation
export interface BuyerLimitReportsAPIFilters {
  financerIdentifier: string;
  companyId: number;
}

// Bank/Company list item structure - matching getCompanyList API
export interface BankListItem {
  Id: number;
  CompanyName: string;
  Identifier: string;
  CompanyCode?: string;
}

// Buyer list item structure - matching getBuyerListWithBank API
export interface BuyerListItem {
  Id: number;
  Name: string;
  Identifier?: string;
  CompanyId?: number;
}

// Hook return types
export interface UseBuyerLimitReportsDropdownData {
  bankList: BankListItem[];
  buyerList: BuyerListItem[];
  isBankListLoading: boolean;
  isBuyerListLoading: boolean;
  bankListError: unknown;
  buyerListError: unknown;
  loadBuyersForBank: (bankId: number) => void;
}

export interface UseBuyerLimitReportsFilterForm {
  form: UseFormReturn<BuyerLimitReportsFilterForm>;
  schema: ObjectSchema<BuyerLimitReportsFilterForm>;
  handleSearch: () => void;
  handleReset: () => void;
  isValid: boolean;
}

// Filter validation schema keys
export const BUYER_LIMIT_REPORTS_FORM_FIELDS = {
  financerIdentifier: 'financerIdentifier',
  companyId: 'companyId',
} as const;
