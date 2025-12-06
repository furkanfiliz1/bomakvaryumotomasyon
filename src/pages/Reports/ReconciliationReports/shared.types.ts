// Shared types for Reconciliation Reports

// Company activity types for search filtering - used across reconciliation reports
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

// Company search result interface for async autocomplete
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
