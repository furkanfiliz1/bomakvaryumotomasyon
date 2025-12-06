export interface InvoiceTransactionFilters {
  OrderNumber?: string;
  InvoiceNumber?: string;
  ReferenceId?: string;
  ReceiverIdentifier?: string;
  StartDate?: string;
  EndDate?: string;
  page?: number;
  pageSize?: number;
}

export interface InvoiceTransactionItem {
  Id: number;
  PaymentId: number;
  ReceiverCompanyId: number;
  ReceiverCompanyName: string;
  ReceiverIdentifier: string;
  Profile: number;
  SendingType: number;
  Type: number;
  IssuedDate: string;
  Status: number;
  InvoiceNumber: string | null;
  CurrencyId: number;
  PaymentDate: string | null;
  TotalAmount: number;
  TotalTaxAmount: number;
  Uuid: string;
  ErrorMessage: string | null;
  DetailMessage: string | null;
  ExceptionType: string | null;
  TotalDiscountAmount: number;
  ReturnInvoiceNumber: string | null;
  ReturnInvoiceDate: string | null;
  ReturnInvoiceAmount: number | null;
}

export interface InvoiceTransactionResponse {
  Items: InvoiceTransactionItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

export interface InvoiceTransactionQueryParams extends InvoiceTransactionFilters {
  isExport?: boolean;
}

export interface ReturnInvoiceRequest {
  ReturnInvoiceNumber?: string | null;
  ReturnInvoiceDate?: string | null;
  ReturnInvoiceAmount?: number | null;
}

export interface UpdateInvoiceRequest extends ReturnInvoiceRequest {
  Id: number;
  PaymentId: number;
  ReceiverCompanyId: number;
  ReceiverCompanyName: string;
  ReceiverIdentifier: string;
  Profile: number;
  SendingType: number;
  Type: number;
  IssuedDate: string;
  Status: number;
  InvoiceNumber: string | null;
  CurrencyId: number;
  PaymentDate: string | null;
  TotalAmount: number;
  TotalTaxAmount: number;
  Uuid: string;
  ErrorMessage: string | null;
  DetailMessage: string | null;
  ExceptionType: string | null;
  TotalDiscountAmount: number;
}
