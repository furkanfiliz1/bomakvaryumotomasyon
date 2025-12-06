// Single Check Upload Form Types
// Based on legacy ChequeForm.js structure with TypeScript improvements

export interface SingleChequeFormData {
  // Keşideci Bilgileri (Drawer Information)
  drawerName: string | null;
  drawerIdentifier: string;
  placeOfIssue: string;

  // Banka Bilgileri (Bank Information)
  bankEftCode: number | null;
  bankBranchEftCode: number | null;

  // Çek Bilgileri (Check Information)
  no: string;
  billPaymentType: number;
  chequeAccountNo: string;
  payableAmount: number;
  paymentDueDate: string;

  // Ciranta Bilgileri (Endorser Information)
  referenceEndorserName: string | null;
  referenceEndorserIdentifier: string | null;
  endorserName: string | null;
  endorserIdentifier: string | null;

  // Ara Ciranta Bilgileri (Bill Reference Endorsers)
  billReferenceEndorsers: BillReferenceEndorser[];

  payableAmountCurrency: string;
  type: number;

  // File Upload Fields
  frontImageFile: File | null;
  backImageFile: File | null;
  invoiceFile: File | null;
}

export interface SingleChequeUploadRequest {
  drawerName: string | null;
  drawerIdentifier: string;
  placeOfIssue: string;
  bankEftCode: string;
  bankBranchEftCode: string;
  no: string;
  billPaymentType: number;
  chequeAccountNo: string;
  payableAmount: string; // API expects string
  paymentDueDate: string; // YYYY-MM-DD format
  referenceEndorserName: string | null;
  referenceEndorserIdentifier: string | null;
  endorserName: string | null;
  endorserIdentifier: string | null;
  payableAmountCurrency: string;
  type: number;
  companyId: number;
  billDocumentList: ChequeDocument[];
  billReferenceEndorsersList: BillReferenceEndorser[];
  ImageIndex: number;
}

export interface ChequeDocument {
  name: string;
  type: string;
  data: string; // Base64 encoded file data
  documentType: number;
}

export interface BillReferenceEndorser {
  id: string;
  endorserName: string;
  endorserIdentifier: string;
}

export interface BankOption {
  value: string;
  label: string;
  code: string;
}

export interface BranchOption {
  value: string;
  label: string;
  code: string;
  bankId: string;
}

export interface SingleChequeUploadResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Initial values for form
export const SINGLE_CHEQUE_INITIAL_VALUES: SingleChequeFormData = {
  drawerName: null,
  drawerIdentifier: '',
  placeOfIssue: '',
  bankEftCode: null,
  bankBranchEftCode: null,
  no: '',
  billPaymentType: 1,
  chequeAccountNo: '',
  payableAmount: 0,
  paymentDueDate: '',
  referenceEndorserName: null,
  referenceEndorserIdentifier: null,
  endorserName: null,
  endorserIdentifier: null,
  // Initialize with one empty endorser following legacy pattern
  billReferenceEndorsers: [{ id: '1', endorserName: '', endorserIdentifier: '' }],
  payableAmountCurrency: 'TRY',
  type: 1,
  // File fields
  frontImageFile: null,
  backImageFile: null,
  invoiceFile: null,
};

// Supported file types for check images
export const CHEQUE_IMAGE_TYPES = ['png', 'jpeg', 'jpg', 'pdf'];
export const CHEQUE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,application/pdf';

// Bill payment types
export enum BillPaymentType {
  Cheque = 1,
  // Add other types as needed
}

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'TRY', label: 'TRY' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];
