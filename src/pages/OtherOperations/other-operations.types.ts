// Other Operations Domain Types
export interface OtherOperation {
  id: string;
  title: string;
  description: string;
  path: string;
  iconPath?: string;
  isEnabled: boolean;
}

// Company Activity Type enum for search filtering
export enum CompanyActivityType {
  BUYER = 1,
  SELLER = 2,
  FINANCIER = 3,
}

export interface OtherOperationsLandingData {
  operations: OtherOperation[];
  title: string;
  description: string;
  menuTitle: string;
}

// Limits to Passive Types - Updated to match Form component schema with direct input
export interface LimitsToPassiveFormData {
  companyIdentifier: string;
  FinancerCompanyId: number | null;
  ProductType: number | null;
}

export interface LimitToPassiveRequest {
  Identifiers: string[];
  FinancerCompanyId: number;
  ProductType: number;
}

export interface LimitToPassiveResponse {
  IsSuccess: boolean;
  Identifiers?: string[]; // Failed identifiers
}

// Dropdown Data Types
export interface FinancerCompany {
  Id: number;
  CompanyName: string;
}

export interface ProductType {
  Value: string;
  Description: string;
}

// Supplier Query Types
export interface SupplierQueryRequest {
  buyerCode: string;
}

export interface AssociatedSupplier {
  supplierVkn: string;
  supplierTitle: string;
  buyerCode: string;
  isActive: boolean;
  registrationDate: string;
  lastTransactionDate?: string;
  totalTransactionAmount?: number;
  transactionCount?: number;
}

export interface SupplierQueryResponse {
  suppliers: AssociatedSupplier[];
  buyerInfo: {
    buyerCode: string;
    buyerTitle: string;
    totalSuppliers: number;
  };
}

// Spot Loan Limits Types - Legacy Parity Implementation
export interface SpotLoanSearchRequest {
  TaxNumber?: string; // TCKN or VKN based on searchType
  BirthDate?: string; // Format: "YYYY-MM-DD"
  PhoneNumber: string; // Format: "999 999 99 99"
  IsExistCustomer: boolean; // Figopara customer checkbox
}

export interface SpotLoanSearchResponse {
  CompanyName?: string;
  AvailableLimit?: number;
  // Additional fields based on actual API response
}

export interface SpotLoanStatsRequest {
  productType: 'SpotLoan';
}

export interface SpotLoanStatsResponse {
  // Stats response structure based on actual API
  totalSearches?: number;
  todaySearches?: number;
}

// Revolving Loan Limits Types
export interface RevolvingLoanLimit {
  companyVkn: string;
  companyTitle: string;
  limitAmount: number;
  usedAmount: number;
  availableAmount: number;
  currency: string;
  interestRate: number;
  renewalDate?: string;
  status: 'ACTIVE' | 'PASSIVE' | 'HOLD';
  lastUpdateDate: string;
}

export interface RevolvingLoanLimitsQuery {
  companyVkns?: string[];
  status?: 'ACTIVE' | 'PASSIVE' | 'HOLD' | '';
  minAmount?: number;
  maxAmount?: number;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

// Common API Response Types
export interface OtherOperationApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Form Types
export interface OtherOperationFormState {
  isSubmitting: boolean;
  hasErrors: boolean;
  errors: Record<string, string>;
}

// Table Types
export interface OtherOperationTableColumn {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown) => string;
}

export interface OtherOperationTableProps<T = Record<string, unknown>> {
  columns: OtherOperationTableColumn[];
  data: T[];
  loading: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
}
