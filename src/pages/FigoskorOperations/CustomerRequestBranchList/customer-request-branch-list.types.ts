import type { UseFormReturn } from 'react-hook-form';
import type * as yup from 'yup';

// API Response Types - matching legacy data structure exactly

export interface CustomerRequestBranchItem {
  Id: number;
  TargetCompanyIdentifier: string;
  TargetCompanyTitle: string;
  ContactPerson?: string | null;
  Phone?: string | null;
  MailAddress?: string | null;
  Status: number; // 1=Bilgi Bekleniyor, 2=Devam Ediyor, 3=Tamamlandı, 4=Red
  StatusDescription?: string;
  RequestDate?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
}

export interface CustomerRequestBranchListResponse {
  TargetCompanyItems: CustomerRequestBranchItem[];
  TotalCount: number;
}

// API Request Types - following RTK Query patterns

export interface CustomerRequestBranchListRequest {
  page?: number;
  pageSize?: number;
  TargetCompanyIdentifier?: string;
  TargetCompanyTitle?: string;
  status?: string | number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

// Update Contact Info Types - matching legacy UpdateModal validation

export interface UpdateContactInfoRequest {
  clientCompanyId: number;
  reportRequestId: number;
  targetCompanyIdentifier: string;
  contactPerson: string;
  phone?: string;
  mailAddress: string;
}

export interface UpdateContactFormData {
  contactPerson: string;
  phone?: string;
  mailAddress: string;
}

// Email Management Types - matching legacy EmailModal functionality

export interface EmailItem {
  id?: number | null;
  email: string;
  isActive: boolean;
  isFromServer?: boolean;
  isEmailSent?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

export interface ServerEmailResponse {
  Id: number;
  MailAddress: string;
  IsActive: boolean;
  IsEmailSend: boolean;
  CreatedDate: string;
  UpdatedDate: string;
}

export interface ServerEmailListResponse {
  Mails: ServerEmailResponse[];
}

export interface CreateTargetCompanyMailsRequest {
  clientCompanyId: number;
  targetCompanyIdentifier: string;
  reportRequestId: number;
  sendMails: boolean;
  mails: {
    email: string;
    isActive: boolean;
  }[];
}

// Bulk Email Types

export interface SendBulkEmailRequest {
  clientCompanyId: number;
  reportRequestId: number;
}

// Reject Request Types

export interface RejectRequestRequest {
  targetCompanyId: number;
}

// Delete Target Company Mail Types

export interface DeleteTargetCompanyMailRequest {
  clientCompanyId: number;
  targetCompanyIdentifier: string;
  reportRequestId: number;
  mailAddresses: string[];
}

// Filter Form Types - matching legacy FilterSection

export interface CustomerRequestBranchListFilters {
  TargetCompanyIdentifier: string;
  TargetCompanyTitle: string;
  status: string;
  page: number;
  pageSize: number;
  sort: string;
  sortType: 'Asc' | 'Desc';
}

// Status Options for filter dropdown

export interface StatusOption {
  value: string;
  label: string;
}

// Parent Context Types - for navigation state management

export interface ParentCustomer {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

export interface ParentRequest {
  Id: number;
  RequestDate: string;
  ShowReference: boolean;
  Status: number;
  StatusDescription?: string;
  TargetCompanyCount?: number;
}

// Table Configuration Types

// Component Props Types

export interface CustomerRequestBranchListPageProps {
  // Page-level props if needed
}

export interface CustomerRequestBranchListFiltersProps {
  statusOptions: StatusOption[];
  onFilterChange: (filters: Partial<CustomerRequestBranchListFilters>) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface UpdateContactModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

export interface EmailManagementModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

export interface BulkEmailModalProps {
  open: boolean;
  onClose: () => void;
  requests: CustomerRequestBranchItem[];
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

export interface RejectRequestModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  onSuccess: () => void;
}

export interface CustomerInfoHeaderProps {
  parentCustomer: ParentCustomer | null;
  parentRequest: ParentRequest | null;
  totalCount: number;
}

// Hook Return Types

export interface UseCustomerRequestBranchListFiltersReturn {
  form: UseFormReturn<CustomerRequestBranchListFilters>;
  schema: yup.ObjectSchema<CustomerRequestBranchListFilters>;
  handleSearch: () => void;
}

export interface UseCustomerRequestBranchListDropdownDataReturn {
  statusOptions: StatusOption[];
  isLoading: boolean;
}

export interface UseCustomerRequestBranchListQueryParamsReturn {
  queryParams: CustomerRequestBranchListFilters;
  updateParams: (params: Partial<CustomerRequestBranchListFilters>) => void;
  resetParams: () => void;
}
