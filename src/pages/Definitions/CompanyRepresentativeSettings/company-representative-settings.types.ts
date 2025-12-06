/**
 * Company Representative Settings Types
 * Matches legacy CustomerManagerList data structures and API contracts
 */

// Base company customer manager item from API
export interface CompanyCustomerManagerItem extends Record<string, unknown> {
  Id: number;
  CompanyCustomerManagerId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  StartDate: string;
  InsertDateTime: string | null;
  ManagerUserId: number;
  ManagerName: string;
  CompanyId: number;
  ProductType: number;
  ProductTypeDescription: string;
  FinancerCompanyId: number | null;
  FinancerCompanyName: string;
  BuyerCompanyId: number | null;
  BuyerCompanyName: string;
  checked?: boolean; // For UI state
}

// API query parameters - matches legacy filter structure exactly
export interface CompanyCustomerManagerFilters {
  companyIdentifier?: string;
  userId?: number;
  productType?: string | number;
  FinancerCompanyId?: number;
  isManagerAssigned?: boolean | string;
  page?: number;
  pageSize?: number;
}

// API response structure - matches legacy _getCompanyCustomerManager response
export interface CompanyCustomerManagerResponse {
  CompanyList: CompanyCustomerManagerItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
  // Add ServerSideQueryResult compatibility
  Data?: CompanyCustomerManagerItem[];
  Items?: CompanyCustomerManagerItem[];
}

// Customer Manager from _getCustomerManagerList API
export interface CustomerManagerItem {
  Id: number;
  FullName: string;
}

// Customer Manager List Response
export interface CustomerManagerListResponse {
  Items: CustomerManagerItem[];
  IsSuccess: boolean;
}

// Financer Company item from getCompanyList API
export interface FinancerCompanyItem {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string | null;
  Phone: string | null;
  Verify: unknown;
  MailAddress: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

// Financer Company List Response
export interface FinancerCompanyListResponse {
  Items: FinancerCompanyItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

// Buyer Company item from /companies/activityType/1 API
export interface BuyerCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string | null;
  Phone: string | null;
  Verify: number;
  MailAddress: string | null;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

// Product Type item from _getProductTypes API
export interface ProductTypeItem {
  Description: string;
  Value: string;
}

// Update request structure - matches legacy _putCompanyCustomerManager body
export interface UpdateCompanyCustomerManagerRequest {
  CompanyCustomerManagers: Array<{
    companyId: number;
    startDate: string;
    managerUserId: number;
    productType: number;
    financerCompanyId: number | null;
    companyCustomerManagerId: number;
    buyerCompanyId: number | null;
  }>;
}

// Filter form data structure for React Hook Form
export interface CompanyRepresentativeFilters {
  companyIdentifier?: string;
  userId?: number;
  productType?: string;
  financerCompanyId?: number;
  isManagerAssigned?: boolean;
}

// Bulk update form data structure for modal
export interface BulkUpdateFormData {
  startDate: string;
  managerUserId: number | null;
  productType: number | null;
  financerCompanyId?: number | null;
  buyerCompanyId?: number | null;
}

// Editable row data for inline editing
export interface EditableCompanyRepresentativeItem extends CompanyCustomerManagerItem {
  isEditing?: boolean;
  originalData?: Partial<CompanyCustomerManagerItem>;
}

// Customer Manager Status options for filter dropdown
export interface CustomerManagerStatusOption {
  value: string;
  text: string;
}

// Form option interfaces for dropdowns
export interface CustomerManagerOption {
  Id: number;
  FullName: string;
}

export interface ProductTypeOption {
  Value: string;
  Description: string;
}

export interface FinancerOption {
  Id: number;
  CompanyName: string;
}

// History navigation parameters
export interface HistoryNavigationParams {
  companyId: number;
  companyCustomerManagerId: number;
}

// Company Customer Manager History Item - matches legacy history response
export interface CompanyCustomerManagerHistoryItem {
  Id: number;
  CompanyName: string;
  CompanyIdentifier: string;
  ManagerName: string;
  ProductTypeDescription: string;
  FinancerCompanyName: string | null;
  BuyerCompanyName: string | null;
  StartDate: string | null;
  EndDate: string | null;
}
