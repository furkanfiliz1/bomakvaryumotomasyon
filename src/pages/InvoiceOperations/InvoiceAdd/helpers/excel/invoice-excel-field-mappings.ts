/**
 * Excel Field Mappings for Invoice Import
 * Following Portal pattern and Operation.RD DDD structure
 */

import { CreateInvoiceFormData } from '../../invoice-add.types';

// Excel column to field mappings (from Portal project)
export interface ExcelFieldMapping {
  id: keyof CreateInvoiceFormData;
  label: string; // Turkish display name for table headers
  required: boolean;
  showOnTable: boolean;
  width?: number;
}

// Required fields configuration for Excel validation
export const reviewRequiredFieldsList = [
  { name: 'uuId', value: 'optional' },
  { name: 'hashCode', value: 'mandatory' },
  { name: 'invoiceNumber', value: 'mandatory' },
  { name: 'senderIdentifier', value: 'mandatory' },
  { name: 'senderName', value: 'optional' },
  { name: 'receiverIdentifier', value: 'mandatory' },
  { name: 'receiverName', value: 'optional' },
  { name: 'payableAmountCurrency', value: 'optional' },
  { name: 'approvedPayableAmount', value: 'mandatory' },
  { name: 'payableAmount', value: 'mandatory' },
  { name: 'paymentDueDate', value: 'mandatory' },
  { name: 'serialNumber', value: 'optional' },
  { name: 'sequenceNumber', value: 'optional' },
  { name: 'type', value: 'mandatory' },
  { name: 'eInvoiceType', value: 'mandatory' },
  { name: 'profileId', value: 'optional' },
  { name: 'issueDate', value: 'mandatory' },
  { name: 'taxFreeAmount', value: 'optional' },
];

// Table header configuration for Excel review table
// Using Turkish display names matching Portal project
export const invoiceHeaderFieldKeys: ExcelFieldMapping[] = [
  { id: 'profileId', label: 'Profil', required: true, showOnTable: true },
  { id: 'uuId', label: 'UUID', required: false, showOnTable: false },
  { id: 'hashCode', label: 'Hash Kodu', required: true, showOnTable: false },
  { id: 'invoiceNumber', label: 'E Fatura Numarası', required: false, showOnTable: true },
  { id: 'senderIdentifier', label: 'Satıcı VKN', required: true, showOnTable: true },
  { id: 'receiverIdentifier', label: 'Alıcı VKN', required: true, showOnTable: true },
  { id: 'payableAmount', label: 'Orijinal Fatura Tutarı', required: true, showOnTable: true },
  { id: 'approvedPayableAmount', label: 'Onaylanmış Fatura Tutarı', required: true, showOnTable: true },
  { id: 'payableAmountCurrency', label: 'Fatura Para Birimi', required: true, showOnTable: false, width: 250 },
  { id: 'paymentDueDate', label: 'Fatura Vade Tarihi', required: true, showOnTable: true },
  { id: 'sequenceNumber', label: 'Kağıt Fatura Sıra No', required: false, showOnTable: true },
  { id: 'serialNumber', label: 'Kağıt Fatura Seri No', required: false, showOnTable: true },
  { id: 'type', label: 'Fatura Tipi', required: true, showOnTable: true },
  { id: 'issueDate', label: 'Fatura Kesim Tarihi', required: true, showOnTable: true },
  { id: 'eInvoiceType', label: 'E-Fatura Tipi', required: true, showOnTable: true },
  { id: 'taxFreeAmount', label: 'KDV Hariç Tutar', required: false, showOnTable: true },
];

/**
 * Maps Excel column headers to database field names
 * Based on Portal project pattern
 */
export const getExcelFieldKey = (key: string): keyof CreateInvoiceFormData => {
  const mappings: Record<string, keyof CreateInvoiceFormData> = {
    UUID: 'uuId',
    eFatura_Numarasi: 'invoiceNumber',
    Kagit_Fatura_Seri_No: 'serialNumber',
    Kagit_Fatura_Sira_No: 'sequenceNumber',
    Satici_VKN: 'senderIdentifier',
    Satici_Unvan: 'senderName',
    Alici_VKN: 'receiverIdentifier',
    Alici_Unvan: 'receiverName',
    Fatura_Para_Birimi: 'payableAmountCurrency',
    Onaylanmiş_Fatura_Tutari: 'approvedPayableAmount',
    Orjinal_Fatura_Tutari: 'payableAmount',
    Fatura_Odeme_Para_Birimi: 'payableAmountCurrency',
    Fatura_İcerigi: 'invoiceTypeCode',
    Fatura_Tipi: 'type',
    Profil: 'profileId',
    Fatura_Kesim_Tarihi: 'issueDate',
    Fatura_Vade_Tarihi: 'paymentDueDate',
    Hash_Kodu: 'hashCode',
    KDV_Haric_Tutar: 'taxFreeAmount',
    'E-Fatura_Tipi': 'eInvoiceType',
  };

  return mappings[key] || 'invoiceNumber'; // Default fallback
};
