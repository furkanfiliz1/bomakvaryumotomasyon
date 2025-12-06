import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for check report
 * Matches legacy system column structure exactly
 * Note: Removed fixed widths to allow responsive column sizing
 */
export const getCheckReportTableHeaders = (): HeadCell[] => [
  { id: 'SenderIdentifier', label: 'Şirket VKN' },
  { id: 'DrawerIdentifier', label: 'Keşideci', slot: true },

  { id: 'No', label: 'Çek No' },
  { id: 'ChequeAccountNo', label: 'Çek Hesap No' },
  { id: 'PayableAmount', label: 'Çek Tutarı', type: 'currency' },
  { id: 'PlaceOfIssue', label: 'Keşide Yeri' },
  { id: 'InsertDatetime', label: 'Yüklenme Tarihi', type: 'date' },
  { id: 'PaymentDueDate', label: 'Çek Ödeme Tarihi', type: 'date' },
  { id: 'BankName', label: 'Banka Adı', slot: true },
  { id: 'BankEftCode', label: 'Banka Şubesi', slot: true },
];

/**
 * Default sorting configuration
 * Matches legacy system default sorting (Id, Desc)
 */
export const getDefaultSorting = () => ({
  sort: 'Id',
  sortType: 'Desc' as const,
});

/**
 * Default pagination configuration
 * Matches legacy system default page size (50)
 */
export const getDefaultPagination = () => ({
  page: 1,
  pageSize: 50,
});
