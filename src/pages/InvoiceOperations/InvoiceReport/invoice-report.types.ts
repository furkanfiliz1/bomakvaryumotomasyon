import type { InvoiceItem } from '../invoice-operations.types';
export * from '../invoice-operations.types';

// Additional InvoiceReport specific types can be added here
export interface InvoiceReportTableRow extends InvoiceItem {
  // Computed fields for table display
  formattedInsertedDate?: string;
  formattedPaymentDueDate?: string;
  formattedIssueDate?: string;
  statusDisplayName?: string;
  typeDisplayName?: string;
}

export interface InvoiceReportState {
  selectedInvoices: InvoiceItem[];
  selectAll: boolean;
  showDeleteModal: boolean;
  showBulkUpdateModal: boolean;
}
