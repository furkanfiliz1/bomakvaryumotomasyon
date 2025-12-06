export interface AutoCompleteOptionType {
  id: string | number;
  name: string;
  value?: string | number;
}

export interface BuyerListItem {
  Id: number;
  Identifier: string;
  CompanyName: string;
}

export interface ReceivableReportFilterFormData extends Record<string, unknown> {
  senderIdentifier: string | null; // Satıcı VKN
  receiverIdentifier: string | number | null | undefined; // Alıcı VKN
  orderNo: string | null; // Alacak No
  startDate: string | null; // Başlangıç Tarihi
  endDate: string | null; // Bitiş Tarihi
  isCharged: string | number | null | undefined; // Kullanım Durumu
  isDeleted: string | number | null | undefined; // Silinmiş mi? (0: Hayır, 1: Evet)
  PayableAmountCurrency: string | number | null | undefined; // Para Birimi
  productType: number | null; // Ürün Tipi
  status: number | null; // Durum
}

export interface ReceivableReportFilterProps {
  onFilterChange: (filters: Partial<ReceivableReportFilters>) => void;
  onExport: () => void; // Excel export işlevi
  buyerList?: Array<{ Identifier: string; CompanyName: string }>; // Alıcı firma listesi
  currencyList?: Array<{ Id: number; Code: string }>; // Para birimi listesi
  isLoading?: boolean;
}

export interface ReceivableReportFiltersRef {
  reset: () => void;
  getValues: () => ReceivableReportFilterFormData;
}

export interface ReceivableReportFilters {
  senderIdentifier?: string; // Seller VKN
  receiverIdentifier?: string; // Buyer VKN
  orderNo?: string; // Receivable number
  isCharged?: string | null; // Using status (0 = used, 1 = suitable)
  isDeleted?: string; // Delete status (0 = no, 1 = yes)
  startDate?: string; // Start date
  endDate?: string; // End date
  status?: number; // Status
  PayableAmountCurrency?: string; // Currency
  productType?: number; // Product type
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
  notifyBuyer?: number; // Notify buyer flag
  profileId?: number | null; // Profile ID
}

export interface ReceivableReportQueryParams extends ReceivableReportFilters {
  IsExport?: boolean; // Excel export flag
}

export interface ReceivableReportItem {
  Id: number;
  OrderNo: string;
  SenderIdentifier: string;
  SenderCompanyId: number;
  SenderName: string;
  ReceiverIdentifier: string;
  ReceiverCompanyId: number;
  ReceiverName: string;
  PayableAmount: number;
  ApprovedPayableAmount: number;
  CurrencyId: number;
  CurrencyCode: string;
  PaymentDueDate: string;
  IssueDate: string;
  CreatedAt: string;
  Status: number;
  AllowanceStatus: number | null;
  AllowanceStatusDesc: string;
  ProductType: number;
  FinancerCompanyName: string | null;
}

export interface ReceivableReportResponse {
  Orders: ReceivableReportItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null; // Base64 encoded Excel data when IsExport=true
}

// Status enum for receivables
export enum ReceivableStatus {
  Pending = 1,
  // Add other status values as needed
}

// Create receivable request payload interface
export interface CreateReceivableRequest {
  Id?: number; // Optional for create, required for update
  OrderNo: string;
  SenderIdentifier: string;
  SenderCompanyId: number;
  SenderName: string;
  ReceiverIdentifier: string;
  ReceiverCompanyId: number;
  ReceiverName: string;
  PayableAmount: number;
  ApprovedPayableAmount: number;
  CurrencyId: number;
  CurrencyCode: string;
  PaymentDueDate: string; // ISO date string
  IssueDate: string; // ISO date string
  Status: number;
  AllowanceStatus?: number;
  ProductType: number;
}

// Form data interface for add receivable modal
export interface AddReceivableFormData {
  OrderNo: string;
  SenderIdentifier: string;
  SenderName: string;
  ReceiverIdentifier: string;
  ReceiverName: string;
  PayableAmount: number;
  ApprovedPayableAmount: number;
  CurrencyId: string | number; // Allow both string and number for select field compatibility
  PaymentDueDate: string;
  IssueDate: string;
  ProductType: number;
}

// Using status enum
export enum ReceivableUsingStatus {
  All = '',
  Used = '0',
  Suitable = '1',
}

// Delete status enum
export enum ReceivableDeleteStatus {
  No = '0',
  Yes = '1',
}

// Product types enum (from the legacy code)
export enum ProductTypesList {
  RECEIVER_FINANCING = 7, // From the example API call
}

// Receivable history item type matching API response
export interface ReceivableHistoryItem {
  Id: number;
  SenderCompanyId: number;
  ReceiverCompanyId: number;
  AllowanceDueDate: string;
  TotalPayableAmount: number;
  PayableAmountCurrency: string;
  TotalInvoiceCount: number;
  TotalApprovedPayableAmount: number;
  NotifyBuyer: number;
  Type: number;
  Status: number;
  StatusDescription: string;
  StatusDate: string;
  InsertDatetime: string;
  UserId: number;
  SenderCompanyName: string;
  SenderCompanyIdentifier: string;
  ReceiverCompanyName: string;
  ReceiverCompanyIdentifier: string;
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
  FinancerCompanyName: string | null;
  AllowanceOrderStatus: string;
  MarginRatio: number | null;
  LeadingChannelName: string | null;
  LeadingChannelId: number | null;
  UserFullName: string | null;
  UseExpenseRate: boolean | null;
  UserInfo: string | null;
}
