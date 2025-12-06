// Helper functions for Score Invoice Transfer Reports
// Following legacy ScoreInvoiceTransferReport.js patterns exactly

/**
 * Generate Excel filename following legacy pattern
 * Format: {identifier}_figoskor_entegrator_fatura_cekim_raporu_{date}.xls
 */
export const generateScoreInvoiceTransferReportsExcelFilename = (identifier?: string): string => {
  const identifierPart = identifier ?? 'Tüm_tedarikciler';
  return `${identifierPart}_figoskor_entegrator_fatura_cekim_raporu`;
  // Note: useServerSideQuery automatically appends the date, so we don't add it here
};
