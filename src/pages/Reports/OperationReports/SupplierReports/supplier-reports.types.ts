// Supplier Reports type definitions
// Exact match with legacy API response from /reports/receiversSenders

export interface SupplierReportsFilters {
  startDate: string;
  endDate: string;
  receiverIdentifier?: string; // Alıcı VKN
  senderIdentifier?: string; // Satıcı VKN
  IsActive?: string; // Aktiflik ('1' for active, '0' for passive)
  page?: number;
  pageSize?: number;
  isExport?: boolean;
}

export interface SupplierReportItem {
  ReceiverCompanyName: string;
  ReceiverIdentifier: string | null;
  SenderCompanyName: string;
  SenderIdentifier: string | null;
  SenderRegisterDate: string;
  ActiveContract: boolean;
  FirstProcessDate: string | null;
  LastProcessDate: string | null;
  UsableInvoices: number;
  UsableInvoicesCurrency: string;
  UsedInvoices: number;
  SenderEmail: string | null;
  SenderPhone: string | null;
  FirstUserNameSurname: string | null;
  FirstUserEmail: string | null;
  FirstUserPhone: string | null;
  SecondUserNameSurname: string | null;
  SecondUserEmail: string | null;
  SecondUserPhone: string | null;
}

export interface SupplierReportsResponse {
  Items: SupplierReportItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string;
}

// No additional interfaces needed - legacy system only shows the main table
// No transaction details, no status enums, no company search - just the basic table
