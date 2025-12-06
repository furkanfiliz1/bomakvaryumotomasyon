/**
 * Excel Import Helper Functions
 * Following OperationPricing pattern and Portal project structure
 */

import { CreateInvoiceFormData, InvoiceTypeCode, CurrencyCode } from '../../invoice-add.types';

// Date format constants from Portal
export const EXCEL_ACCEPTED_DATE = 'DD/MM/YYYY';
export const RESPONSE_DATE = 'YYYY-MM-DD';

/**
 * Creates an empty invoice row template
 * Following Portal pattern with default values
 */
export const createEmptyInvoiceRow = (): CreateInvoiceFormData & { id?: number } => ({
  id: Math.random(),
  uuId: '',
  invoiceNumber: '',
  serialNumber: '',
  sequenceNumber: '',
  senderIdentifier: '',
  senderName: '',
  receiverIdentifier: '',
  receiverName: '',
  payableAmountCurrency: CurrencyCode.TRY,
  approvedPayableAmount: 0,
  payableAmount: 0,
  paymentDueDate: '',
  type: 0,
  eInvoiceType: 1,
  profileId: '',
  issueDate: '',
  hashCode: '',
  taxFreeAmount: 0,
  invoiceTypeCode: InvoiceTypeCode.SATIS,
  remainingAmount: 0,
});

/**
 * Validates if all items in array have same value for given field
 * Used for business validation (e.g., same company identifier)
 */
export const isAllColumnsSameValue = <T extends Record<string, unknown>>(
  data: T[],
  fieldName: keyof T,
  expectedValue: unknown,
): boolean => {
  return data.every((item) => item[fieldName] === expectedValue);
};

/**
 * Calculates total amount from invoice list
 * Following Portal pattern for summary calculations
 */
export const calculateTotalInvoiceAmount = (invoices: CreateInvoiceFormData[]): number => {
  return invoices.reduce((acc, invoice) => {
    const amount = invoice?.payableAmount;
    return acc + (typeof amount === 'number' && !isNaN(amount) ? amount : 0);
  }, 0);
};

/**
 * Processes invoice data for submission
 * Following Portal business logic
 */
export const processInvoicesForSubmission = (
  invoices: (CreateInvoiceFormData & { id?: number })[],
): CreateInvoiceFormData[] => {
  return invoices.map((invoice) => {
    const processed = { ...invoice };

    // Set currency if not provided
    processed.payableAmountCurrency = processed.payableAmountCurrency || CurrencyCode.TRY;

    // Set invoice type code
    processed.invoiceTypeCode = InvoiceTypeCode.SATIS;

    // Remove temporary ID
    delete (processed as CreateInvoiceFormData & { id?: number }).id;

    // Calculate remaining amount based on business logic
    if (processed.approvedPayableAmount === 0) {
      processed.remainingAmount = processed.payableAmount ?? 0;
    } else {
      processed.remainingAmount = processed.approvedPayableAmount ?? 0;
    }

    return processed;
  });
};

/**
 * Validates file size before processing
 * Following Portal pattern for file validation
 */
export interface FileSizeValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFileSize = (file: File, maxSizeMB: number = 15): FileSizeValidationResult => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
};
