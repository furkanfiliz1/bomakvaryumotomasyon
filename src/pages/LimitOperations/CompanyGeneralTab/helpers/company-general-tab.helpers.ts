import dayjs from 'dayjs';
import type { LimitAllocation, ScoreCompanyData, TransferListItem } from '../company-general-tab.types';

/**
 * Company General Tab Helper Functions
 * Following OperationPricing pattern for business logic separation
 */

/**
 * Format currency amount with Turkish locale
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (!amount) return '-';
  return `${amount.toLocaleString('tr-TR')} ₺`;
};

/**
 * Format date with Turkish locale
 */
export const formatDate = (date: string | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format('DD.MM.YYYY');
};

/**
 * Format date-time with Turkish locale
 */
export const formatDateTime = (date: string | undefined): string => {
  if (!date) return '-';
  return dayjs(date).format('DD.MM.YYYY HH:mm');
};

/**
 * Get transfer status text
 */
export const getTransferStatusText = (isActive: boolean | undefined): string => {
  return isActive ? 'Aktif' : 'Pasif';
};

/**
 * Get E-Invoice status text based on integrator being active
 */
export const getEInvoiceStatusText = (currentIntegrator: TransferListItem | null): string => {
  return currentIntegrator?.IsActive ? 'Aktif' : 'Pasif';
};

/**
 * Get Figo Transfer status text based on config IsActive
 */
export const getFigoTransferStatusText = (currentIntegrator: TransferListItem | null): string => {
  return currentIntegrator?.Config?.IsActive ? 'Aktif' : 'Pasif';
};

/**
 * Get Aktarım (Transfer) status text - same as Figo transfer
 */
export const getTransferOperationStatusText = (currentIntegrator: TransferListItem | null): string => {
  return currentIntegrator?.Config?.IsActive ? 'Aktif' : 'Pasif';
};

/**
 * Get proper start transfer date from API response or default
 */
export const getStartTransferDateFromAPI = (currentIntegrator: TransferListItem | null): dayjs.Dayjs | null => {
  if (
    !currentIntegrator?.Config?.StartTransferDate ||
    currentIntegrator.Config.StartTransferDate === '0001-01-01T00:00:00'
  ) {
    return null; // Should be empty when no valid date from API
  }
  return dayjs(currentIntegrator.Config.StartTransferDate);
};

/**
 * Get withdrawal start date - following legacy logic
 * If StartTransferDate is '0001-01-01T00:00:00', use 90 days ago, otherwise use the actual date
 */
export const getWithdrawalStartDate = (currentIntegrator: TransferListItem | null): dayjs.Dayjs | null => {
  if (!currentIntegrator?.Config?.StartTransferDate) {
    return dayjs().subtract(90, 'day'); // Default to 90 days ago like legacy
  }

  if (currentIntegrator.Config.StartTransferDate === '0001-01-01T00:00:00') {
    return dayjs().subtract(90, 'day'); // Legacy behavior: 90 days ago for default date
  }

  return dayjs(currentIntegrator.Config.StartTransferDate);
};

/**
 * Get entegrator name or fallback text
 */
export const getIntegratorDisplayName = (transferList: TransferListItem[]): string => {
  const currentIntegrator = transferList.length > 0 ? transferList[0] : null;

  // If there's no integrator at all
  if (!currentIntegrator) {
    return 'Entegratör Yok';
  }

  // If integrator exists, show its name regardless of active status
  return currentIntegrator.Name || currentIntegrator.IntegratorName || 'Entegratör Bağlı';
};

/**
 * Check if company has any integrator (not necessarily active)
 */
export const hasActiveIntegrator = (transferList: TransferListItem[]): boolean => {
  return transferList.length > 0 && !!transferList[0];
};

/**
 * Get current integrator from transfer list
 */
export const getCurrentIntegrator = (transferList: TransferListItem[]): TransferListItem | null => {
  return transferList.length > 0 ? transferList[0] : null;
};

/**
 * Check if transfer is possible based on invoice check
 */
export const isTransferPossible = (invoiceCheck: { IsAvailable?: boolean } | undefined): boolean => {
  return invoiceCheck?.IsAvailable || false;
};

/**
 * Get initial transfer date (90 days ago)
 */
export const getInitialTransferDate = (): string => {
  return dayjs().subtract(90, 'day').toISOString();
};

/**
 * Prepare update payload for company transfer
 */
export const prepareCompanyTransferUpdatePayload = (
  currentIntegrator: TransferListItem,
  transferActive: boolean,
  startTransferDate: string | null,
) => {
  const finalStartTransferDate =
    currentIntegrator.Config?.StartTransferDate === '0001-01-01T00:00:00'
      ? getInitialTransferDate()
      : startTransferDate;

  return {
    Id: currentIntegrator.Id,
    StartTransferDate: finalStartTransferDate,
    LastTransferDate: currentIntegrator.Config?.LastTransferDate,
    CreatedDate: currentIntegrator.Config?.CreatedDate,
    IsActive: transferActive,
  };
};

/**
 * Prepare update payload for score company
 */
export const prepareScoreCompanyUpdatePayload = (scoreCompany: ScoreCompanyData, nextOutgoingDate: string | null) => {
  return {
    ...scoreCompany,
    nextOutgoingDate,
  };
};

/**
 * Group company display text formatter
 */
export const formatGroupCompanyText = (identifier?: string, companyName?: string): string => {
  return `${identifier || ''} / ${companyName || ''}`;
};

/**
 * Validate form data before submission
 */
export const validateGeneralInformationForm = (
  transferActive: boolean,
  startTransferDate: string | null,
): { isValid: boolean; error?: string } => {
  if (transferActive && !startTransferDate) {
    return { isValid: false, error: 'Transfer aktifken başlangıç tarihi gereklidir' };
  }
  return { isValid: true };
};

/**
 * Validate score form data before submission
 */
export const validateScoreInformationForm = (nextOutgoingDate: string | null): { isValid: boolean; error?: string } => {
  if (!nextOutgoingDate) {
    return { isValid: false, error: 'Entegratör son transfer tarihi gereklidir' };
  }
  return { isValid: true };
};

/**
 * Check if limit allocations exist and should be displayed
 */
export const hasLimitAllocations = (allocations?: LimitAllocation[]): boolean => {
  return !!(allocations && allocations.length > 0);
};

/**
 * Get alert severity based on transfer availability
 */
export const getTransferCheckAlertSeverity = (isAvailable?: boolean): 'success' | 'warning' => {
  return isAvailable ? 'success' : 'warning';
};

/**
 * Default form values
 */
export const getDefaultGeneralFormValues = (currentIntegrator: TransferListItem | null) => ({
  transferActive: currentIntegrator?.Config?.IsActive || false,
  startTransferDate: currentIntegrator?.Config?.StartTransferDate
    ? dayjs(currentIntegrator.Config.StartTransferDate).toISOString()
    : getInitialTransferDate(),
});

export const getDefaultScoreFormValues = (scoreCompany: ScoreCompanyData | undefined) => ({
  nextOutgoingDate: scoreCompany?.nextOutgoingDate ? dayjs(scoreCompany.nextOutgoingDate).toISOString() : null,
});
