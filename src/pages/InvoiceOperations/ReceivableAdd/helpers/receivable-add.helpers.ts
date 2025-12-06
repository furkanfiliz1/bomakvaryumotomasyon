// Receivable Add Helper Functions

import type { CreateReceivableFormData, CreateReceivableRequest } from '../receivable-add.types';

/**
 * Header field keys for receivable Excel import and table display
 * Based on API requirements for receivable creation
 */
export const invoiceHeaderFieldKeys = [
  { id: 'OrderNo', label: 'RECEIVABLE_NO', required: true },
  { id: 'ReceiverIdentifier', label: 'RECEIVER_ID', required: true },
  { id: 'ReceiverName', label: 'RECEIVER_NAME', required: false },
  { id: 'SenderIdentifier', label: 'SENDER_ID', required: true },
  { id: 'SenderName', label: 'SENDER_IDENTIFIER', required: false },
  { id: 'PayableAmount', label: 'RECEIVABLE_AMOUNT', required: true },
  { id: 'CurrencyCode', label: 'RECEIVABLE_CURRENCY', required: true },
  { id: 'PaymentDueDate', label: 'DUE_DATE', required: true },
  { id: 'IssueDate', label: 'RECEIVABLE_CREATE_DATE', required: true },
];

/**
 * Transforms form data to API request format
 * Following Portal pattern for data transformation
 */
export const transformFormDataToRequest = (
  formData: CreateReceivableFormData,
  userIdentifier?: string,
): CreateReceivableRequest => {
  return {
    OrderNo: formData.ReceivableNumber ?? '',
    PayableAmount: formData.ReceivableAmount ?? 0,
    ReceiverIdentifier: formData.ReceiverIdentifier || userIdentifier || '',
    SenderIdentifier: formData.SenderIdentifier || userIdentifier || '',
    PaymentDueDate: formData.ReceivableDueDate ?? '',
    CurrencyCode: 'TRY', // Fixed currency following Portal pattern
    ProductType: 10, // RECEIVABLE_FINANCING product type
    IssueDate: formData.ReceivableIssueDate ?? '',
  };
};

/**
 * Validates Excel file format and size
 */
export const validateExcelFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Sadece Excel dosyaları (.xlsx, .xls) kabul edilir',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Dosya boyutu 10MB'ı aşamaz",
    };
  }

  return { isValid: true };
};

/**
 * Gets file download URL for template
 */
export const getTemplateDownloadUrl = (): string => {
  return '/assets/files/AlacakYukleme.xlsx';
};

/**
 * Maps Excel column headers to field keys
 * Following Portal pattern for Excel field mapping
 */
export const getExcelFieldKey = (key: string): string => {
  let result = '';

  switch (key) {
    case 'Fatura No':
    case 'Alacak_Numarası':
      result = 'OrderNo';
      break;
    case 'Düzenleme Tarihi':
    case 'Alacak_Olusturma_Tarihi':
      result = 'IssueDate';
      break;
    case 'Vade Tarihi':
    case 'Alacak_Vade_Tarihi':
      result = 'PaymentDueDate';
      break;
    case 'Tutar':
    case 'Alacak_Tutarı':
      result = 'PayableAmount';
      break;
    case 'Para Birimi':
    case 'Alacak_Para_Birimi':
      result = 'CurrencyCode';
      break;
    case 'Alıcı Adı':
    case 'Alıcı_Unvanı':
      result = 'ReceiverName';
      break;
    case 'Alıcı Vergi No':
    case 'Alıcı_VKN/TCKN':
      result = 'ReceiverIdentifier';
      break;
    case 'Satıcı Adı':
    case 'Satıcı_Unvanı':
      result = 'SenderName';
      break;
    case 'Satıcı Vergi No':
    case 'Satıcı_VKN/TCKN':
      result = 'SenderIdentifier';
      break;
  }

  return result;
};
