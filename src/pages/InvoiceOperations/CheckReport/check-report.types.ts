export interface CheckReportFilters {
  senderIdentifier?: string; // Now used as company search field
  drawerIdentifier?: string;
  drawerName?: string;
  PlaceOfIssue?: string;
  bankEftCode?: string;
  bankBranchEftCode?: string;
  no?: string;
  chequeAccountNo?: string;
  minPayableAmount?: number;
  maxPayableAmount?: number;
  minPaymentDate?: string;
  maxPaymentDate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

export interface BillReferenceEndorserItem {
  EndorserIdentifier: string;
}

export interface ReferenceEndorser {
  Id: number;
  EndorserIdentifier: string;
  EndorserName?: string | null;
  BillId: number;
  UserId: number;
}

export interface CheckReportItem {
  Id: number;
  Type: number;
  SenderIdentifier?: string;
  DrawerIdentifier: string;
  DrawerName: string;
  No: string;
  ChequeAccountNo: string;
  PayableAmount: number;
  PayableAmountCurrency: string;
  PlaceOfIssue: string;
  InsertDatetime: string;
  PaymentDueDate: string;
  BankName: string;
  BankEftCode: string;
  BankBranchEftCode?: string;
  BankBranchName?: string;
  EndorserName?: string;
  EndorserIdentifier?: string;
  ReferenceEndorserName?: string;
  ReferenceEndorserIdentifier?: string;
  BillReferenceEndorsers?: BillReferenceEndorserItem[];
  ReferenceEndorsers?: ReferenceEndorser[];
  CompanyId?: number;
  Status?: number;
  UserId?: number;
  BillPaymentType?: number;
}

export interface CheckReportResponse {
  Bills: CheckReportItem[];
  TotalCount: number;
  ExtensionData?: string;
}

export interface CheckReportQueryParams extends CheckReportFilters {
  isExport?: boolean;
}

export interface AllowanceItem {
  Id: number;
  SenderCompanyId: number;
  ReceiverCompanyId: number | null;
  AllowanceDueDate: string;
  TotalPayableAmount: number;
  PayableAmountCurrency: string;
  TotalInvoiceCount: number;
  TotalApprovedPayableAmount: number | null;
  NotifyBuyer: number;
  Type: number | null;
  Status: number;
  StatusDescription: string;
  StatusDate: string;
  InsertDatetime: string;
  UserId: number;
  SenderCompanyName: string;
  SenderCompanyIdentifier: string;
  ReceiverCompanyName: string | null;
  ReceiverCompanyIdentifier: string | null;
  Kind: number;
  AvgDueDayCount: number;
  CompanyBankAccountId: number | null;
  CompanyBankAccountIban: string | null;
  IsQuarantee: boolean | null;
  TransactionFee: number | null;
  AllInvoiceIsPaymentApproved: boolean;
  InterestRate: number | null;
  TotalInterestRate: number | null;
  PackageNo: string | null;
  UserName: string | null;
  Phone: string | null;
  FinancerCompanyName: string;
  AllowanceOrderStatus: number | null;
  MarginRatio: number | null;
  LeadingChannelName: string;
  LeadingChannelId: number;
  UserFullName: string;
  UseExpenseRate: number | null;
  UserInfo: string | null;
}

export interface CheckUpdateRequest {
  drawerName: string;
  drawerIdentifier: string;
  placeOfIssue: string;
  bankEftCode: string;
  bankBranchEftCode: string;
  bankName?: string;
  bankBranchName?: string;
  no: string;
  chequeAccountNo: string;
  payableAmount: number;
  paymentDueDate: string | null;
  endorserName?: string;
  endorserIdentifier?: string;
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  billReferenceEndorsersList?: Array<{ endorserIdentifier: string }>;
  id: number;
  userId: number;
}

export interface BankOption {
  Id: string;
  Name: string;
  Code: string;
}

export interface BranchOption {
  Id: string;
  Name: string;
  Code: string;
  BankId: string;
}

export interface DocumentItem {
  Id: number;
  BillId: number;
  UserId: number;
  Name: string;
  Type: string;
  DocumentType: number;
  Data: string | null;
}

export interface DocumentUploadRequest {
  DocumentType: number;
  data: string; // base64 encoded data
  billId: string;
  name: string;
  type: string;
}

export interface DocumentDownloadResponse {
  Type: string;
  Data: string;
  Name: string;
}

/** Company search result for async autocomplete */
export interface CompanySearchResult {
  Id: number;
  Identifier: string;
  CompanyName: string;
}

/** Company search API response wrapper */
export interface CompanySearchResponse {
  Items: CompanySearchResult[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}
