import dayjs from 'dayjs';
import type { HeadCell } from 'src/components/common/Table/types';
import type {
  CustomerRequestBranchItem,
  ParentCustomer,
  ParentRequest,
  StatusOption,
} from '../customer-request-branch-list.types';

/**
 * Get table headers for customer request branch list
 * Matches legacy RequestTable.js column configuration exactly
 */
export function getCustomerRequestBranchListTableHeaders(): HeadCell[] {
  return [
    {
      id: 'TargetCompanyIdentifier',
      label: 'VKN',
      width: 90,
    },
    {
      id: 'TargetCompanyTitle',
      label: 'Ünvan',
      width: 180,
    },
    {
      id: 'RequestDate',
      label: 'Talep Tarihi',
      width: 100,
      slot: true,
    },
    {
      id: 'Status',
      label: 'Durum',
      width: 130,
      slot: true,
    },
    {
      id: 'ContactPerson',
      label: 'Yetkili İsim',
      width: 140,
    },
    {
      id: 'Phone',
      label: 'Telefon',
      width: 120,
    },
    {
      id: 'MailAddress',
      label: 'Email',
      width: 180,
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 140,
      slot: true,
      isSortDisabled: true,
    },
  ];
}

/**
 * Get status options for filter dropdown
 * Matches legacy statusOptions exactly
 */
export function getStatusOptions(): StatusOption[] {
  return [
    { value: '', label: 'Tümü' },
    { value: '1', label: 'Bilgi Bekleniyor' },
    { value: '2', label: 'Devam Ediyor' },
    { value: '3', label: 'Tamamlandı' },
    { value: '4', label: 'Red' },
  ];
}

/**
 * Get status chip color based on status value
 * Matches legacy getStatusColor function exactly
 */
export function getStatusChipColor(status: number): 'info' | 'secondary' | 'success' | 'error' {
  switch (status) {
    case 1:
      return 'info';
    case 2:
      return 'secondary';
    case 3:
      return 'success';
    case 4:
      return 'error';
    default:
      return 'secondary';
  }
}

/**
 * Get status description from status value
 */
export function getStatusDescription(status: number): string {
  switch (status) {
    case 1:
      return 'Bilgi Bekleniyor';
    case 2:
      return 'Devam Ediyor';
    case 3:
      return 'Tamamlandı';
    case 4:
      return 'Red';
    default:
      return 'Bilinmiyor';
  }
}

/**
 * Format request date for display
 * Matches legacy date formatting exactly
 */
export function formatRequestDate(dateString?: string): string {
  if (!dateString) return '-';
  return dayjs(dateString).format('DD.MM.YYYY');
}

/**
 * Format display value with fallback
 * Matches legacy null/undefined handling
 */
export function formatDisplayValue(value?: string | null): string {
  // format phone numbers to standard format

  return value || 'Bulunamadı';
}

/**
 * Filter companies that have valid email addresses
 * Used for bulk email operations
 */
export function filterCompaniesWithEmails(companies: CustomerRequestBranchItem[]): CustomerRequestBranchItem[] {
  return companies.filter(
    (company) => company.MailAddress && company.MailAddress.trim() !== '' && company.MailAddress !== 'Bulunamadı',
  );
}

/**
 * Build navigation path to company detail view
 * Matches legacy navigation patterns
 */
export function buildCompanyDetailPath(customerId: string, requestId: string, companyId: string): string {
  return `/figoskor-operations/customer-requests/${customerId}/${requestId}/${companyId}`;
}

/**
 * Get parent customer from sessionStorage
 * Matches legacy session storage handling
 */
export function getParentCustomerFromStorage(): ParentCustomer | null {
  try {
    const parentCustomerString = sessionStorage.getItem('parentCustomer');
    return parentCustomerString ? JSON.parse(parentCustomerString) : null;
  } catch {
    return null;
  }
}

/**
 * Get parent request from sessionStorage
 * Matches legacy session storage handling
 */
export function getParentRequestFromStorage(): ParentRequest | null {
  try {
    const parentRequestString = sessionStorage.getItem('parentRequest');
    return parentRequestString ? JSON.parse(parentRequestString) : null;
  } catch {
    return null;
  }
}

/**
 * Store parent branch for navigation persistence
 * Matches legacy sessionStorage usage
 */
export function storeParentBranch(branch: CustomerRequestBranchItem): void {
  try {
    sessionStorage.setItem('parentBranch', JSON.stringify(branch));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get URL parameters for table filters
 * Matches legacy URL parameter management
 */
export function getTableFiltersFromURL(): Partial<{
  page: number;
  pageSize: number;
  TargetCompanyIdentifier: string;
  TargetCompanyTitle: string;
  status: string;
  sort: string;
  sortType: 'Asc' | 'Desc';
}> {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    page: urlParams.get('page') ? Number(urlParams.get('page')) : 1,
    pageSize: urlParams.get('pageSize') ? Number(urlParams.get('pageSize')) : 20,
    TargetCompanyIdentifier: urlParams.get('TargetCompanyIdentifier') || '',
    TargetCompanyTitle: urlParams.get('TargetCompanyTitle') || '',
    status: urlParams.get('status') || '',
    sort: urlParams.get('sort') || 'Id',
    sortType: (urlParams.get('sortType') as 'Asc' | 'Desc') || 'Desc',
  };
}

/**
 * Update URL parameters without navigation
 * Matches legacy URL management exactly
 */
export function updateURLParameters(params: Record<string, string | number | undefined>): void {
  const urlParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== '' && value !== null && value !== undefined) {
      urlParams.set(key, String(value));
    }
  });

  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.pushState({}, '', newUrl);
}
