import type { HeadCell } from 'src/components/common/Table/types';

type ColumnDef = HeadCell;

/**
 * Table configuration helpers for Figoskor Operations
 * Following OperationPricing patterns with exact legacy column matching
 */

// Customer List Table Headers - matches legacy CustomerList exactly
// Customer table headers configuration - matches legacy table structure exactly
export const getCustomerTableHeaders = (): ColumnDef[] => {
  return [
    {
      id: 'CompanyName',
      label: 'Ünvan',
      width: 200,
      isSortDisabled: false,
    },
    {
      id: 'Identifier',
      label: 'VKN',
      width: 150,
      isSortDisabled: false,
    },
    {
      id: 'Status',
      label: 'Durum',
      width: 120,
      slot: true,
      isSortDisabled: true,
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 150,
      isSortDisabled: true,
      slot: true,
    },
  ];
};

// Request table headers configuration - matches legacy CustomerRequestList table structure
export const getRequestTableHeaders = (): ColumnDef[] => {
  return [
    {
      id: 'RequestDate',
      label: 'Talep Tarihi',
      width: 150,
      type: 'date',
      isSortDisabled: false,
    },
    {
      id: 'TargetCompanyCount',
      label: 'Toplam Talep (Firma Sayısı)',
      width: 200,
      slot: true,
    },
    {
      id: 'ShowReference',
      label: 'Referans Türü',
      width: 150,
      slot: true,
    },
    {
      id: 'Status',
      label: 'Durum',
      width: 120,
      slot: true,
      isSortDisabled: false,
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 150,
      isSortDisabled: true,
      slot: true,
    },
  ];
};

// Customer Request List Table Headers - matches legacy CustomerRequestList exactly
export const getCustomerRequestTableHeaders = (): HeadCell[] => [
  {
    id: 'RequestDate',
    label: 'Talep Tarihi',
    width: 140,
    type: 'date',
  },
  {
    id: 'TargetCompanyCount',
    label: 'Toplam Talep (Firma Sayısı)',
    width: 200,
  },
  {
    id: 'ShowReference',
    label: 'Referans Türü',
    width: 150,
    slot: true, // Custom reference type badge
  },
  {
    id: 'Status',
    label: 'Durum',
    width: 150,
    slot: true, // Custom status with icon
  },
  {
    id: 'actions',
    label: 'İşlemler',
    width: 120,
    slot: true,
    isSortDisabled: true,
  },
];

// Target Company List Table Headers - matches legacy CustomerRequestBranchList exactly
export const getTargetCompanyTableHeaders = (): HeadCell[] => [
  {
    id: 'TargetCompanyTitle',
    label: 'Firma Ünvanı',
    width: 250,
  },
  {
    id: 'TargetCompanyIdentifier',
    label: 'VKN',
    width: 150,
  },
  {
    id: 'ContactPerson',
    label: 'Yetkili Kişi',
    width: 180,
  },
  {
    id: 'MailAddress',
    label: 'E-posta',
    width: 200,
  },
  {
    id: 'Phone',
    label: 'Telefon',
    width: 150,
  },
  {
    id: 'Status',
    label: 'Durum',
    width: 120,
    slot: true, // Custom status rendering
  },
  {
    id: 'actions',
    label: 'İşlemler',
    width: 150,
    slot: true,
    isSortDisabled: true,
  },
];

// Status options matching legacy implementation exactly
export const getCustomerStatusOptions = () => [
  { value: '1', label: 'Aktif' },
  { value: '0', label: 'Pasif' },
];

export const getRequestStatusOptions = () => [
  { value: '1', label: 'Bekleniyor' },
  { value: '2', label: 'Devam ediyor' },
  { value: '3', label: 'Tamamlandı' },
];

// Status colors for chips - matching legacy exactly
export const getCustomerStatusColor = (status: number): 'success' | 'error' | 'default' => {
  switch (status) {
    case 1:
      return 'success';
    case 0:
      return 'error';
    default:
      return 'default';
  }
};

// Removed getRequestStatusColor - using the one from figoskor-operations.helpers.ts to avoid duplication

// Status icons matching legacy exactly
export const getRequestStatusIcon = (status: number) => {
  switch (status) {
    case 1:
      return 'clock-01'; // Bekleniyor
    case 2:
      return 'loading-01'; // Devam ediyor
    case 3:
      return 'check-circle'; // Tamamlandı
    case 4:
      return 'check-circle'; // Tamamlandı
    case 5:
      return 'alert-triangle'; // Hata
    default:
      return 'clock-01';
  }
};

// Reference type badge helper - matches legacy ShowReference logic
export const getReferenceTypeBadge = (showReference: boolean) => ({
  label: showReference ? 'Açık Referans' : 'Kapalı Referans',
  color: showReference ? 'success' : 'default',
});

// Default pagination settings matching legacy
export const getDefaultPaginationConfig = () => ({
  page: 1,
  pageSize: 20,
});

// Sort options matching legacy implementation
export const getDefaultSortConfig = () => ({
  sort: 'Id',
  sortType: 'Desc' as const,
});

// Excel template columns for company upload - matches legacy CompanyExcelUpload
export const getExcelTemplateColumns = () => ['VKN', 'Unvan', 'Telefon', 'E-mail', 'yetkiliKisiAd', 'yetkiliKisiSoyad'];

// Validation helpers matching legacy patterns
export const validateVKN = (vkn: string): boolean => {
  if (!vkn) return false;
  // Remove non-numeric characters
  const cleanVkn = vkn
    .split('')
    .filter((char) => /\d/.test(char))
    .join('');
  // VKN should be 10 or 11 digits
  return cleanVkn.length === 10 || cleanVkn.length === 11;
};

export const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCompanyName = (name: string): boolean => {
  return Boolean(name && name.trim().length >= 2);
};
