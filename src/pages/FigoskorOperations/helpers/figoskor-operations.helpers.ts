/**
 * Business logic helpers for Figoskor Operations
 * Following OperationPricing patterns with exact legacy functionality matching
 */

import dayjs from 'dayjs';
import type {
  CreateFigoskorReportRequest,
  FigoskorCustomerFilters,
  FigoskorExcelCompany,
  FigoskorRequestFilters,
} from '../figoskor-operations.types';

// URL parameter management - matches legacy implementation exactly
export const updateUrlParams = (params: Record<string, unknown>) => {
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== null && value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        urlParams.set(key, JSON.stringify(value));
      } else {
        urlParams.set(key, String(value));
      }
    }
  }

  const newUrl = `${globalThis.location.pathname}?${urlParams.toString()}`;
  globalThis.history.pushState({}, '', newUrl);
};

// Load parameters from URL - matches legacy loadParamsFromUrl
export const loadParamsFromUrl = (): Record<string, string> => {
  const urlParams = new URLSearchParams(globalThis.location.search);
  const params: Record<string, string> = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
};

// Transform Excel company data to API format - matches legacy handleCompanyDataSubmit
export const transformExcelCompaniesToApiFormat = (
  companyData: FigoskorExcelCompany[],
): CreateFigoskorReportRequest['TargetCompanies'] => {
  return companyData.map((company, index) => {
    const identifier = company.VKN || company.vkn || '';
    const title = company.Unvan || company.unvan || '';

    if (!identifier) {
      throw new Error(`${index + 1}. satırda VKN bilgisi eksik.`);
    }

    if (!title) {
      throw new Error(`${index + 1}. satırda Ünvan bilgisi eksik.`);
    }

    return {
      TargetCompanyIdentifier: identifier,
      TargetCompanyTitle: title,
      Phone: company.Telefon || company.telefon || '',
      MailAddress: company['E-mail'] || company.email || company['e-mail'] || '',
      ContactPerson: `${company.yetkiliKisiAd || ''} ${company.yetkiliKisiSoyad || ''}`.trim(),
    };
  });
};

// Create request body for figoskor report - matches legacy API call structure
export const createFigoskorReportRequestBody = (
  clientCompanyId: number,
  requestDate: string,
  showReference: boolean,
  targetCompanies: CreateFigoskorReportRequest['TargetCompanies'],
  updateId?: number,
): CreateFigoskorReportRequest => {
  const requestBody: CreateFigoskorReportRequest = {
    ClientCompanyId: clientCompanyId,
    RequestDate: dayjs(requestDate).format('YYYY-MM-DDTHH:mm:ss[Z]'),
    ShowReference: showReference,
    TargetCompanies: targetCompanies,
  };

  // Add ID for update mode
  if (updateId) {
    requestBody.Id = updateId;
  }

  return requestBody;
};

// Session storage helpers - matches legacy sessionStorage usage patterns
export const storeParentCustomer = (customer: unknown) => {
  try {
    sessionStorage.setItem('parentCustomer', JSON.stringify(customer));
  } catch (error) {
    console.error('Failed to store parent customer:', error);
  }
};

export const getParentCustomer = () => {
  try {
    const stored = sessionStorage.getItem('parentCustomer');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get parent customer:', error);
    return null;
  }
};

export const storeParentRequest = (request: unknown) => {
  try {
    sessionStorage.setItem('parentRequest', JSON.stringify(request));
  } catch (error) {
    console.error('Failed to store parent request:', error);
  }
};

export const getParentRequest = () => {
  try {
    const stored = sessionStorage.getItem('parentRequest');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get parent request:', error);
    return null;
  }
};

export const validateRequestFilters = (filters: FigoskorRequestFilters): boolean => {
  // Date range validation if provided
  if (filters.StartDate && filters.EndDate) {
    const start = dayjs(filters.StartDate);
    const end = dayjs(filters.EndDate);
    return start.isValid() && end.isValid() && (start.isBefore(end) || start.isSame(end));
  }
  return true;
};

// Date formatting helpers - matches legacy moment usage
export const formatDisplayDate = (dateString: string): string => {
  return dayjs(dateString).format('DD.MM.YYYY');
};

export const formatApiDate = (date: Date | string): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatApiDateTime = (date: Date | string): string => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss[Z]');
};

// Error message helpers - matches legacy Swal usage patterns
export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && error !== null) {
    // Handle RTK Query error format
    if ('data' in error) {
      const rtkError = error as { data?: { message?: string; error?: string } };
      if (rtkError.data?.message) {
        return rtkError.data.message;
      }
      if (rtkError.data?.error) {
        return rtkError.data.error;
      }
    }

    // Handle axios error format
    if ('response' in error) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }
    }

    // Handle standard Error object
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }

  return 'Bilinmeyen bir hata oluştu.';
};

// Navigation helpers - matches legacy routing patterns
export const buildCustomerRequestPath = (customerId: string | number) => {
  return `/figoskor-operations/customer-requests/${customerId}`;
};

export const buildBranchListPath = (customerId: string | number, requestId: string | number) => {
  return `/figoskor-operations/customer-requests/${customerId}/${requestId}`;
};

export const buildBranchDetailPath = (
  customerId: string | number,
  requestId: string | number,
  branchId: string | number,
) => {
  return `/figoskor-operations/customer-requests/${customerId}/${requestId}/${branchId}`;
};

// Excel validation helpers - matches legacy CompanyExcelUpload validation
export const validateExcelCompany = (company: FigoskorExcelCompany, index: number): string[] => {
  const errors: string[] = [];
  const rowNumber = index + 1;

  // VKN validation
  const vkn = company.VKN || company.vkn || '';
  if (!vkn) {
    errors.push(`${rowNumber}. satır: VKN bilgisi eksik`);
  } else if (
    !/^\d{10,11}$/.test(
      vkn
        .split('')
        .filter((char) => /\d/.test(char))
        .join(''),
    )
  ) {
    errors.push(`${rowNumber}. satır: VKN formatı hatalı (10-11 haneli sayı olmalı)`);
  }

  // Unvan validation
  const unvan = company.Unvan || company.unvan || '';
  if (!unvan || unvan.trim().length < 2) {
    errors.push(`${rowNumber}. satır: Ünvan bilgisi eksik veya çok kısa`);
  }

  // Email validation (optional but if provided should be valid)
  const email = company['E-mail'] || company.email || company['e-mail'] || '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push(`${rowNumber}. satır: E-posta formatı hatalı`);
  }

  return errors;
};

export const validateExcelData = (companies: FigoskorExcelCompany[]): string[] => {
  if (!companies || companies.length === 0) {
    return ['Excel dosyası boş veya geçersiz'];
  }

  const allErrors: string[] = [];
  for (const [index, company] of companies.entries()) {
    const errors = validateExcelCompany(company, index);
    allErrors.push(...errors);
  }

  return allErrors;
};

// Sort configuration helpers - matches legacy sorting behavior
export const getNextSortState = (currentSort: string, currentSortType: string, column: string) => {
  if (currentSort === column) {
    if (currentSortType === 'Asc') {
      return { sort: column, sortType: 'Desc' };
    } else if (currentSortType === 'Desc') {
      return { sort: '', sortType: '' };
    }
  }
  return { sort: column, sortType: 'Asc' };
};

// Company count formatting - matches legacy display
export const formatCompanyCount = (count: number): string => {
  return `${count} Firma`;
};

// Reference type formatting - matches legacy badge display
export const formatReferenceType = (showReference: boolean): string => {
  return showReference ? 'Açık Referans' : 'Kapalı Referans';
};

// Excel export URL generation - matches legacy functionality
export const generateExcelExportUrl = (filters: Partial<FigoskorCustomerFilters>): string => {
  const params = new URLSearchParams();

  // Add non-empty filter values to params
  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  }

  // Return the export URL with current filters
  return `/api/figoskor/customers/export?${params.toString()}`;
};

// Request date formatting - matches legacy display
export const formatRequestDate = (dateString: string): string => {
  return dayjs(dateString).format('DD.MM.YYYY');
};

// Request status color mapping - matches legacy status colors
export const getRequestStatusColor = (status: number): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 1:
      return 'info'; // Bekleniyor
    case 2:
      return 'warning'; // Devam ediyor
    case 3:
      return 'success'; // Tamamlandı
    case 4:
      return 'success'; // Tamamlandı
    case 5:
      return 'error'; // Hata
    default:
      return 'default';
  }
};

// Build request branch path - matches legacy routing
export const buildRequestBranchPath = (customerId: string, requestId: string): string => {
  return `/figoskor-operations/customer-requests/${customerId}/${requestId}`;
};

// Get parent customer from session storage - matches legacy persistence
export const getParentCustomerFromStorage = (): unknown => {
  try {
    const storedCustomer = sessionStorage.getItem('parentCustomer');
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  } catch (error) {
    console.error('Error parsing parent customer from storage:', error);
    return null;
  }
};
