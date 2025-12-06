// Difference Entry Types based on legacy implementation
export interface DifferenceEntry {
  Id?: number;
  CompanyId: number;
  CompanyIdentifier?: string;
  CompanyName?: string;
  ProductType: number;
  ProductTypeDescription?: string;
  DeficiencyType: number;
  DeficiencyTypeDescription?: string;
  DeficiencyStatus: number;
  DeficiencyStatusDescription?: string;
  ExpectedDueDate: string | null;
  Description: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface DifferenceEntryFilters {
  page?: number;
  pageSize?: number;
  DeficiencyStatus?: number;
  CompanyIdentifier?: string;
  CompanyName?: string;
  ProductType?: number;
  DeficiencyType?: number;
  StartDate?: string;
  EndDate?: string;
  isExport?: boolean;
}

export interface DifferenceEntrySearchResponse {
  Items: DifferenceEntry[];
  TotalCount: number;
  ExtensionData?: string; // For Excel export
}

export interface DifferenceEntryType {
  Value: number;
  Description: string;
}

export interface DifferenceEntryStatus {
  Value: number;
  Description: string;
}

export interface ProcessType {
  Value: number;
  Description: string;
}

export interface SearchedCompany {
  Id: number;
  Identifier: string;
  CompanyName: string;
  text?: string; // For autocomplete display
  value?: number; // For form handling
}
