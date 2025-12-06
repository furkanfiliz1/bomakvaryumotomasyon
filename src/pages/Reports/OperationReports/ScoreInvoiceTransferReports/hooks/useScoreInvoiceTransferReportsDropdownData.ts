import type { UseScoreInvoiceTransferReportsDropdownData } from '../score-invoice-transfer-reports.types';

/**
 * Hook for dropdown data for Score Invoice Transfer Reports
 * Legacy ScoreInvoiceTransferReport.js has no dropdowns - only a text input field
 */
export const useScoreInvoiceTransferReportsDropdownData = (): UseScoreInvoiceTransferReportsDropdownData => {
  // No dropdown data needed - legacy implementation has only a text input for identifier
  return {};
};
