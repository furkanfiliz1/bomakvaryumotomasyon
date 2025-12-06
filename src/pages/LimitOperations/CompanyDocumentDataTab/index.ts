/**
 * Company Document Data Tab Module Exports
 * Following OperationPricing pattern for module exports
 */

// Main component export
export { CompanyDocumentDataTabPage as CompanyDocumentDataTab } from './components';

// Type exports
export type {
  DocumentDataState,
  FinancialDataItem,
  FindeksData,
  FindeksReportOption,
  InvoiceIntegrator,
  LedgerIntegrator,
} from './company-document-data-tab.types';

// API exports
export { companyDocumentDataTabApi } from './company-document-data-tab.api';

// Hook exports
export { useDocumentDataSections, useFindeksReportForm } from './hooks';

// Helper exports
export * from './helpers';
