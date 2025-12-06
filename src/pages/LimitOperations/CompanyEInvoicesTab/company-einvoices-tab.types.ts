/**
 * Company E-Invoices Tab Types
 * Following OperationPricing pattern for type definitions
 * Matches legacy ScoreCompanyEinvoices.js data structure exactly
 */

// Individual invoice record from API response
export interface InvoiceAmount {
  year: number;
  month: number;
  outgoingCount: number;
  outgoingAmount: number;
  outgoingAverage: number;
  incomingCount: number;
  incomingAmount: number;
  incomingAverage: number;
}

// Currency-grouped invoice data
export interface CurrencyInvoices {
  currency: string;
  amounts: InvoiceAmount[];
}

// API Response structure matching legacy _getScoreInvoices response
export interface CompanyEInvoicesResponse {
  currencies: CurrencyInvoices[];
}

// API Request parameters
export interface CompanyEInvoicesParams {
  companyIdentifier: string;
}

// Hook data structure for component consumption
export interface CompanyEInvoicesData {
  invoices: CurrencyInvoices[];
  isLoading: boolean;
  error: string | null;
}

// Table column configuration
export interface EInvoicesTableColumn {
  key: keyof InvoiceAmount | 'dateDisplay';
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: 'currency' | 'number' | 'date';
  currency?: string;
}
