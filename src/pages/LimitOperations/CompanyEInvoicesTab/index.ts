/**
 * Company E-Invoices Tab Feature Module
 * Following OperationPricing pattern for feature exports
 */

// Main component export for tab integration
export { CompanyEInvoicesTabPage as CompanyEInvoicesTab } from './components';

// API exports for external use
export { companyEInvoicesTabApi } from './company-einvoices-tab.api';

// Type exports for external consumption
export type {
  CompanyEInvoicesData,
  CompanyEInvoicesParams,
  CompanyEInvoicesResponse,
  CurrencyInvoices,
  InvoiceAmount,
} from './company-einvoices-tab.types';
