/**
 * Document Data Business Logic Helpers
 * Following OperationPricing pattern for helper functions
 * Matches legacy ScoreCompanyDocumentAndInvoices.js business logic exactly
 */

import { ELedgerType, type FinancialDataItem, type FindeksData } from '../company-document-data-tab.types';

/**
 * Maps e-ledger type to human readable string
 * Matches legacy checkEledgerType() function exactly
 */
export const getELedgerTypeDescription = (type: number): string => {
  switch (type) {
    case ELedgerType.MIZAN:
      return 'Mizan';
    case ELedgerType.GECICI_BEYANNAME:
      return 'Geçici Beyanname';
    case ELedgerType.BEYANNAME:
      return 'Beyanname';
    case ELedgerType.DIGER:
      return 'Diğer';
    default:
      return 'Tanımsız Belge';
  }
};

/**
 * Formats financial data for display
 * Matches legacy renderFinancialData() sorting and formatting
 */
export const formatFinancialDataForDisplay = (financialData: FinancialDataItem[]) => {
  const sortedData = [...financialData].sort(
    (a: FinancialDataItem, b: FinancialDataItem) =>
      a.eLedgerType - b.eLedgerType || a.periodYear - b.periodYear || (a.periodQuarter || 0) - (b.periodQuarter || 0),
  );

  return sortedData.map((data: FinancialDataItem) => ({
    ...data,
    typeDescription: getELedgerTypeDescription(data.eLedgerType),
    monthDisplay: data.periodMonth ? `Ay: ${data.periodMonth}` : 'Ay: -',
    quarterDisplay: data.periodQuarter ? `Dönem: ${data.periodQuarter}` : 'Dönem: -',
    yearDisplay: `Yıl: ${data.periodYear}`,
  }));
};

/**
 * Checks if findeks data is empty (all values are "-")
 * Used to determine if we should show empty state
 */
export const isFindeksDataEmpty = (findeksData: FindeksData | null): boolean => {
  // Return true if findeksData is null
  if (!findeksData) return true;
  const fieldsToCheck = [
    'LimitGroup',
    'RiskGroup',
    'LimitCash',
    'RiskCash',
    'LimitNonCash',
    'RiskNonCash',
    'LimitTotal',
    'RiskTotal',
  ] as const;

  return fieldsToCheck.every((field) => !findeksData[field] || findeksData[field] === '-' || findeksData[field] === '');
};

/**
 * Formats currency values for findeks display
 * Handles the "-" case and preserves already formatted values from API
 */
export const formatFindeksValue = (value: string | number | undefined | null): string => {
  if (!value || value === '-' || value === '') {
    return '-';
  }

  // If it's already a number, format directly
  if (typeof value === 'number') {
    return new Intl.NumberFormat('tr-TR').format(value);
  }

  // If it's a string and already contains dots/periods (likely pre-formatted), return as is
  if (typeof value === 'string' && (value.includes('.') || value.includes(','))) {
    return value;
  }

  // If it's a plain string number, try to parse and format
  if (typeof value === 'string') {
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat('tr-TR').format(numericValue);
    }
  }

  return String(value);
};

/**
 * Calculates remaining limit for invoice integrator
 * Matches legacy kalanToplamOran calculation exactly
 */
export const calculateRemainingLimit = (currentLimit: number, totalLimit: number): string => {
  return `${currentLimit || 0} / ${totalLimit || 0}`;
};

/**
 * Formats date values for integrator display
 * Matches legacy date formatting in e-invoice/e-ledger sections
 */
export const formatIntegratorDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR');
  } catch {
    return dateStr;
  }
};

/**
 * Gets integrator status color for active state
 */
export const getIntegratorActiveStatusColor = (): 'success' => 'success';

/**
 * Gets integrator status color for inactive state
 */
export const getIntegratorInactiveStatusColor = (): 'error' => 'error';

/**
 * Gets integrator status text for active state
 */
export const getIntegratorActiveStatusText = (): string => 'Aktif';

/**
 * Gets integrator status text for inactive state
 */
export const getIntegratorInactiveStatusText = (): string => 'Eklenmedi';

/**
 * Validates if financial data item can be deleted
 * Based on business rules (placeholder for future validation logic)
 */
export const canDeleteFinancialData = (): boolean => {
  // Add any validation logic here if needed
  // For now, all items can be deleted matching legacy behavior
  return true;
};

/**
 * Creates confirmation message for financial data deletion
 * Matches legacy delete confirmation behavior
 */
export const getDeleteConfirmationMessage = (item: FinancialDataItem): string => {
  const typeDesc = getELedgerTypeDescription(item.eLedgerType);
  return `${typeDesc} (${item.periodYear}) verilerini silmek istediğinizden emin misiniz?`;
};

/**
 * Determines if integrator section should show update form
 * Based on entry status and active state
 */
export const shouldShowIntegratorUpdateForm = (entry: boolean, active: boolean): boolean => {
  return entry && active;
};

/**
 * Gets default values for update form
 * Matches legacy newNextIncomingParams structure
 */
export const getDefaultUpdateFormValues = () => ({
  newNextIncomingDate: null,
  nextOutgoingDate: null,
  requestLimitDate: null,
  requestCurrentLimit: 30,
});
