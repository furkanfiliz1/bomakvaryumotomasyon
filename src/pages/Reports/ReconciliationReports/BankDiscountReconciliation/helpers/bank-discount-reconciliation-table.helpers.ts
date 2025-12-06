import { HeadCell } from 'src/components/common/Table/types';
import type { MonthOption, YearOption } from '../bank-discount-reconciliation.types';

/**
 * Table configuration for Bank Discount Reconciliation report
 * Following BuyerReconciliation and OperationPricing patterns exactly
 * Columns ordered exactly as in old project: Satıcı Adı, Finansör Adı, İskonto No, Tarih, Ortalama Vade, Figo Komisyon, Faiz Oranı, Faiz Tutarı, Fatura Adedi, Ödenen Tutar, Toplam Tutar
 */
export const getBankDiscountReconciliationTableColumns = (): HeadCell[] => [
  {
    id: 'SenderName',
    label: 'Satıcı Adı',
    width: 200,
  },
  {
    id: 'FinancerName',
    label: 'Finansör Adı',
    width: 180,
  },
  {
    id: 'AllowanceId',
    label: 'İskonto No',
    width: 120,
  },
  {
    id: 'Month',
    label: 'Tarih',
    width: 140,
    slot: true,
  },
  {
    id: 'AverageDueDayCount',
    label: 'Ortalama Vade',
    width: 140,
  },
  {
    id: 'FigoCommissionRate',
    label: 'Figo Komisyon',
    width: 150,
    type: 'currency',
  },
  {
    id: 'InterestRate',
    label: 'Faiz Oranı',
    width: 120,
    type: 'percentage',
  },
  {
    id: 'TotalInterestAmount',
    label: 'Faiz Tutarı',
    width: 120,
    type: 'currency',
  },
  {
    id: 'TotalInvoiceCount',
    label: 'Fatura Adedi',
    width: 120,
  },
  {
    id: 'TotalPaidAmount',
    label: 'Ödenen Tutar',
    width: 130,
    type: 'currency',
  },
  {
    id: 'TotalPayableAmount',
    label: 'Toplam Tutar',
    width: 130,
    type: 'currency',
  },
];

/**
 * Generate month options with Turkish names
 * Matches BankInvoiceReconciliation implementation exactly
 */
export const getMonthOptions = (): MonthOption[] => [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' },
];

/**
 * Generate year options (current year ±5 years)
 * Matches BankInvoiceReconciliation implementation exactly
 */
export const getYearOptions = (): YearOption[] => {
  const currentYear = new Date().getFullYear();
  const years: YearOption[] = [];

  for (let i = -5; i < 5; i++) {
    const year = currentYear + i;
    years.push({ value: year, label: year.toString() });
  }

  return years;
};

/**
 * Generate Excel export filename
 * Following BankInvoiceReconciliation pattern
 */
export const generateExcelFilename = (
  identifier?: string,
  financerIdentifier?: string,
  month?: number,
  year?: number,
): string => {
  const monthPart = month ? `_${month}` : '';
  const yearPart = year ? `_${year}` : '';
  const identifierPart = identifier ? `_${identifier}` : '';
  const financerPart = financerIdentifier ? `_${financerIdentifier}` : '';

  return `banka_alici_iskonto_raporu${identifierPart}${financerPart}${monthPart}${yearPart}`;
};
