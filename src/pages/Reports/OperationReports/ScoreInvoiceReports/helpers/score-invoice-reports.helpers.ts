import type { HeadCell } from 'src/components/common/Table/types';
import type {
  ScoreInvoiceReportItem,
  ScoreInvoiceReportsFilterForm,
  ScoreInvoiceReportsFilters,
} from '../score-invoice-reports.types';

/**
 * Format date to YYYY-MM-DD string (handles both Date objects and strings)
 */
const formatDateToString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If already in YYYY-MM-DD format, return as is
    return date;
  }
  // Handle Date objects
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate table headers for Score Invoice Reports
 * Matches legacy table headers exactly
 */
export const getScoreInvoiceReportsTableHeaders = (): HeadCell[] => [
  {
    id: 'companyIdentifier',
    label: 'Tedarikçi VKN',
    width: 200,
  },
  {
    id: 'integratorIdentifier',
    label: 'Entegratör VKN',
    width: 200,
  },
  {
    id: 'totalOutGoingEInvoice',
    label: 'Toplam Kesilen Efatura',
    width: 180,
    props: { align: 'right' },
  },
  {
    id: 'totalIncomingEInvoice',
    label: 'Toplam Gelen Efatura',
    width: 180,
    props: { align: 'right' },
  },
  {
    id: 'totalOutGoingEArchive',
    label: 'Toplam Kesilen Earşiv',
    width: 180,
    props: { align: 'right' },
  },
];

/**
 * Transform form data to API filters
 * Matches legacy data transformation exactly
 */
export const transformFormToFilters = (formData: ScoreInvoiceReportsFilterForm): ScoreInvoiceReportsFilters => {
  const dateStr = formatDateToString(formData.date);

  return {
    startDate: dateStr,
    endDate: dateStr, // Legacy uses same date for both start and end
    companyIdentifier: formData.companyIdentifier || undefined,
    integratorIdentifier: formData.integratorIdentifier || undefined,
  };
};

/**
 * Generate Excel filename following legacy pattern
 * Format: {companyName}-{integratorName}_figoskor_fatura_cekim_raporu_{date}.xls
 */
export const generateExcelFilename = (formData: ScoreInvoiceReportsFilterForm): string => {
  const companyName = formData.companyIdentifier || 'Tüm_sirketler_';
  const integratorName = formData.integratorIdentifier || 'Tüm_entegratorler';
  const fileDate = formatDateToString(formData.date);

  // Match legacy filename format exactly
  return `${companyName}-${integratorName}_figoskor_fatura_cekim_raporu_${fileDate}.xls`;
};

/**
 * Sort invoice data by integrator identifier (matching legacy behavior)
 */
export const sortInvoiceData = (data: ScoreInvoiceReportItem[]): ScoreInvoiceReportItem[] => {
  return [...data].sort((a, b) => {
    if (!a.integratorIdentifier) return 1;
    if (!b.integratorIdentifier) return -1;
    return a.integratorIdentifier.localeCompare(b.integratorIdentifier);
  });
};
