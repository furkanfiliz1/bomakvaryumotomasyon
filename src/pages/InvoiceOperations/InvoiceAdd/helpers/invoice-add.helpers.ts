// Invoice Add Helper Functions

import type { CreateInvoiceFormData, CreateInvoiceRequest } from '../invoice-add.types';

/**
 * Header field keys for invoice Excel import and table display
 * Based on API requirements for invoice creation from curl data
 */
export const invoiceHeaderFieldKeys = [
  { id: 'invoiceNumber', label: 'INVOICE_NUMBER', required: true },
  { id: 'hashCode', label: 'HASH_CODE', required: true },
  { id: 'uuId', label: 'UUID', required: true },
  { id: 'receiverIdentifier', label: 'RECEIVER_IDENTIFIER', required: true },
  { id: 'receiverName', label: 'RECEIVER_NAME', required: true },
  { id: 'senderIdentifier', label: 'SENDER_IDENTIFIER', required: true },
  { id: 'senderName', label: 'SENDER_NAME', required: true },
  { id: 'payableAmount', label: 'PAYABLE_AMOUNT', required: true },
  { id: 'payableAmountCurrency', label: 'CURRENCY', required: true },
  { id: 'issueDate', label: 'ISSUE_DATE', required: true },
  { id: 'paymentDueDate', label: 'PAYMENT_DUE_DATE', required: true },
  { id: 'remainingAmount', label: 'REMAINING_AMOUNT', required: true },
  { id: 'approvedPayableAmount', label: 'APPROVED_PAYABLE_AMOUNT', required: true },
  { id: 'invoiceTypeCode', label: 'INVOICE_TYPE_CODE', required: true },
  { id: 'profileId', label: 'PROFILE_ID', required: true },
  { id: 'eInvoiceType', label: 'E_INVOICE_TYPE', required: true },
  { id: 'type', label: 'TYPE', required: true },
  { id: 'issueTimex', label: 'ISSUE_TIMEX', required: true },
  { id: 'taxFreeAmount', label: 'TAX_FREE_AMOUNT', required: false },
  { id: 'sequenceNumber', label: 'SEQUENCE_NUMBER', required: false },
  { id: 'serialNumber', label: 'SERIAL_NUMBER', required: false },
];

/**
 * Transforms form data to API request format
 * Following ReceivableAdd pattern for data transformation
 * Based on the curl request structure
 */
export const transformFormDataToRequest = (formData: CreateInvoiceFormData): CreateInvoiceRequest => {
  return {
    hashCode: formData.hashCode ?? '',
    invoiceNumber: formData.invoiceNumber ?? '',
    issueDate: formData.issueDate ?? '',
    payableAmount: formData.payableAmount ?? 0,
    paymentDueDate: formData.paymentDueDate ?? '',
    receiverIdentifier: formData.receiverIdentifier ?? '',
    receiverName: formData.receiverName ?? '',
    remainingAmount: formData.remainingAmount ?? formData.payableAmount ?? 0,
    senderIdentifier: formData.senderIdentifier ?? '',
    senderName: formData.senderName ?? '',
    sequenceNumber: formData.sequenceNumber ?? '',
    serialNumber: formData.serialNumber ?? '',
    taxFreeAmount: formData.taxFreeAmount ?? 0,
    payableAmountCurrency: formData.payableAmountCurrency ?? 'TRY',
    uuId: formData.uuId ?? '',
    invoiceTypeCode: formData.invoiceTypeCode ?? 'SATIS',
    approvedPayableAmount: formData.approvedPayableAmount ?? formData.payableAmount ?? 0,
    profileId: formData.profileId ?? 'TEMELFATURA',
    issueTimex: formData.issueTimex ?? 1,
    type: formData.type ?? 1,
    eInvoiceType: formData.eInvoiceType ?? 1,
  };
};

/**
 * Validates required fields for invoice creation
 * Returns array of missing required field labels
 */
export const validateRequiredFields = (formData: CreateInvoiceFormData): string[] => {
  const missingFields: string[] = [];

  const requiredFields = invoiceHeaderFieldKeys.filter((field) => field.required);

  requiredFields.forEach((field) => {
    const value = formData[field.id as keyof CreateInvoiceFormData];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field.label);
    }
  });

  return missingFields;
};

/**
 * Generates a default UUID for invoice
 */
export const generateInvoiceUUID = (): string => {
  return crypto.randomUUID();
};

/**
 * Generates a default hash code for invoice
 */
export const generateInvoiceHashCode = (invoiceNumber: string, senderIdentifier: string): string => {
  // Simple hash generation - in real implementation this should follow business rules
  return `${senderIdentifier}_${invoiceNumber}_${Date.now()}`;
};

/**
 * Formats currency amount for display
 */
export const formatCurrencyAmount = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formats date for API request (YYYY-MM-DD format)
 */
export const formatDateForApi = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
};

/**
 * Parses Excel data to invoice form data
 * Following Portal pattern for Excel data processing
 */
export const parseExcelDataToInvoiceData = (excelData: Record<string, unknown>[]): CreateInvoiceFormData[] => {
  return excelData.map((row) => ({
    hashCode: String(row.hashCode || generateInvoiceHashCode(String(row.invoiceNumber), String(row.senderIdentifier))),
    invoiceNumber: String(row.invoiceNumber || ''),
    issueDate: formatDateForApi(String(row.issueDate || '')),
    payableAmount: Number(row.payableAmount) || 0,
    paymentDueDate: formatDateForApi(String(row.paymentDueDate || '')),
    receiverIdentifier: String(row.receiverIdentifier || ''),
    receiverName: String(row.receiverName || ''),
    remainingAmount: Number(row.remainingAmount) || Number(row.payableAmount) || 0,
    senderIdentifier: String(row.senderIdentifier || ''),
    senderName: String(row.senderName || ''),
    sequenceNumber: String(row.sequenceNumber || ''),
    serialNumber: String(row.serialNumber || ''),
    taxFreeAmount: Number(row.taxFreeAmount) || 0,
    payableAmountCurrency: String(row.payableAmountCurrency || 'TRY'),
    uuId: String(row.uuId || generateInvoiceUUID()),
    invoiceTypeCode: String(row.invoiceTypeCode || 'SATIS'),
    approvedPayableAmount: Number(row.approvedPayableAmount) || Number(row.payableAmount) || 0,
    profileId: String(row.profileId || 'TEMELFATURA'),
    issueTimex: Number(row.issueTimex) || 1,
    type: Number(row.type) || 1,
    eInvoiceType: Number(row.eInvoiceType) || 1,
  }));
};
