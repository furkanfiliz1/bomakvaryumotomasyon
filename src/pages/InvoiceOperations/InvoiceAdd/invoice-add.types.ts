// Invoice Add Types
export interface CreateInvoiceFormData {
  hashCode?: string;
  invoiceNumber?: string;
  issueDate?: string;
  payableAmount?: number;
  paymentDueDate?: string;
  receiverIdentifier?: string;
  receiverName?: string;
  remainingAmount?: number;
  senderIdentifier?: string;
  senderName?: string;
  sequenceNumber?: string;
  serialNumber?: string;
  taxFreeAmount?: number;
  payableAmountCurrency?: string;
  uuId?: string;
  invoiceTypeCode?: string;
  approvedPayableAmount?: number;
  profileId?: string;
  issueTimex?: number;
  type?: number;
  eInvoiceType?: number;
}

export interface CreateInvoiceRequest {
  hashCode: string;
  invoiceNumber: string;
  issueDate: string;
  payableAmount: number;
  paymentDueDate: string;
  receiverIdentifier: string;
  receiverName: string;
  remainingAmount: number;
  senderIdentifier: string;
  senderName: string;
  sequenceNumber?: string;
  serialNumber?: string;
  taxFreeAmount: number;
  payableAmountCurrency: string;
  uuId: string;
  invoiceTypeCode: string;
  approvedPayableAmount: number;
  profileId: string;
  issueTimex: number;
  type: number;
  eInvoiceType: number;
}

export interface CreateInvoiceResponse {
  success: boolean;
  message?: string;
  invoiceId?: string;
}

// Export types for Excel import
export interface ExcelInvoiceData extends CreateInvoiceFormData {
  [key: string]: string | number | undefined;
}

// XML invoice types
export interface XmlInvoiceData {
  invoices: CreateInvoiceFormData[];
}

// Invoice Type Code enum
export enum InvoiceTypeCode {
  SATIS = 'SATIS',
  IADE = 'IADE',
  TEVKIFAT = 'TEVKIFAT',
  ISTISNA = 'ISTISNA',
}

// Profile ID enum
export enum ProfileId {
  TEMELFATURA = 'TEMELFATURA',
  TICARIFATURA = 'TICARIFATURA',
  EARSIVFATURA = 'EARSIVFATURA',
}

// Currency codes
export enum CurrencyCode {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
}

// E-Invoice Type enum
export enum EInvoiceType {
  STANDART = 1,
  TICARI = 2,
  EARSIV = 3,
}
