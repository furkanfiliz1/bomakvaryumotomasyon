// Çek türü enum'u
export enum ChequeType {
  KENDI_CEKIMIZ = 1,
  MUSTERIDEN_ALINAN_CEK = 2,
}

// Çek durumu enum'u
export enum ChequeStatus {
  BEKLEMEDE = 'BEKLEMEDE',
  ONAYLANDI = 'ONAYLANDI',
  REDDEDILDI = 'REDDEDILDI',
  IPTAL_EDILDI = 'IPTAL_EDILDI',
}

// Para birimi enum'u
export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
}

// Çek döküman tipi
export interface ChequeDocument {
  id?: number;
  type: string;
  name: string;
  data: string; // Base64 encoded
  documentType: number; // 1: front, 2: back, 3: invoice
}

// Ciranta bilgisi
export interface BillReferenceEndorser {
  id?: string | number;
  endorserName: string;
  endorserIdentifier: string;
}

// Base entity interface
interface BaseEntity {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Ana çek veri yapısı
export interface ChequeData extends BaseEntity {
  // Keşideci Bilgileri
  drawerName?: string | null;
  drawerIdentifier: string;
  placeOfIssue: string;

  // Banka Bilgileri
  bankEftCode: string;
  bankBranchEftCode: string;
  bankName?: string;
  bankBranchName?: string;

  // Çek Bilgileri
  no: string;
  billPaymentType: ChequeType;
  chequeAccountNo: string;
  payableAmount: number;
  paymentDueDate: string; // ISO date string
  payableAmountCurrency: Currency;
  type: ChequeType;

  // Ciranta Bilgileri
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  endorserName?: string;
  endorserIdentifier?: string;
  billReferenceEndorsersList?: BillReferenceEndorser[];

  // Dökümanlar
  billDocumentList?: ChequeDocument[];

  // Şirket bilgisi
  companyId?: number;
}

// Çek formu için form data tipi
export interface ChequeFormData {
  // Keşideci Bilgileri
  drawerName?: string | null;
  drawerIdentifier: string;
  placeOfIssue: string;

  // Banka Bilgileri
  bankEftCode: string;
  bankBranchEftCode: string;

  // Çek Bilgileri
  no: string;
  billPaymentType: ChequeType;
  chequeAccountNo: string;
  payableAmount: number;
  paymentDueDate: Date | null;

  // Ciranta Bilgileri
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  endorserName?: string;
  endorserIdentifier?: string;
  payableAmountCurrency: Currency;
  type: ChequeType;
}

// Excel upload için çek verileri
export interface ExcelChequeData {
  // Excel header keys - referans projeden alınan field isimleri
  bankEftCode: string;
  bankName?: string;
  bankBranchEftCode: string;
  bankBranchName?: string;
  no: string;
  chequeAccountNo: string;
  drawerIdentifier: string;
  drawerName?: string;
  placeOfIssue?: string;
  paymentDueDate: string;
  payableAmount: number;
  payableAmountCurrency: Currency;
  endorserName?: string;
  endorserIdentifier?: string;
  billReferenceEndorsersList?: BillReferenceEndorser[];
}

// Excel validation error tipi
export interface ChequeValidationError {
  index: number;
  name: string;
  errors: string[];
}

// Excel upload response tipi
export interface ExcelUploadResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}

// Dropdown seçenekleri
export interface BankOption {
  value: string;
  label: string;
  code?: string;
}

export interface BranchOption {
  value: string;
  label: string;
  code?: string;
  bankId?: string;
}

// Zorunlu alan bilgisi
export interface RequiredFieldInfo {
  field: string;
  label: string;
  required: boolean;
  description?: string;
}

// Excel template için alan tanımları
export const CHEQUE_REQUIRED_FIELDS: RequiredFieldInfo[] = [
  { field: 'bankEftCode', label: 'Banka Kodu', required: false },
  { field: 'bankName', label: 'Banka Adı', required: false },
  { field: 'bankBranchEftCode', label: 'Şube Kodu', required: false },
  { field: 'bankBranchName', label: 'Şube Adı', required: false },
  { field: 'no', label: 'Çek No', required: true },
  { field: 'chequeAccountNo', label: 'Çek Hesap No', required: true },
  { field: 'placeOfIssue', label: 'Keşide Yeri', required: true },
  { field: 'drawerIdentifier', label: 'Keşideci VKN/TCKN', required: true },
  { field: 'drawerName', label: 'Keşideci Adı', required: false },
  { field: 'paymentDueDate', label: 'Çek Vade Tarihi', required: true },
  { field: 'payableAmountCurrency', label: 'Döviz', required: true },
  { field: 'payableAmount', label: 'Tutar', required: true },
  { field: 'endorserIdentifier', label: 'Borçlu VKN/TCKN', required: false },
];
