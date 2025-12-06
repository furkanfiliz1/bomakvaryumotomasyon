import { AllowanceKind, AllowanceStatusEnum, NotifyBuyer, ProductTypes } from '@types';

export enum Currencies {
  TRY = 1,
  USD = 2,
  EUR = 3,
  GBP = 4,
}

export interface AllowanceResponseModel {
  Id: number;
  AllowanceStatus: number;
  Status: number;
  StatusDesc?: string;
  AllowanceStatusDescription?: string;
  SenderCompanyName: string;
  ReceiverCompanyName?: string;
  FinancerName?: string;
  WinnerFinancerCompanyName?: string;
  CustomerManagerName?: string;
  TotalPayableAmount: number;
  TotalApprovedPayableAmount?: number;
  TotalPaidAmount?: number;
  PayableAmountCurrency: string;
  TotalInvoiceCount?: number;
  AllowanceInvoiceCount?: number;
  AllowanceBillCount?: number;
  AvgDueDayCount?: number;
  AllowanceDueDate?: string;
  InsertDatetime?: string;
  RemainingChargedAmount?: number;
  IntegratorName?: string;
  IsManualPaymentApproved?: boolean;
  RejectedBidCount?: number;
  IsGivingBid?: number;
}

export interface AllowanceListResponseModel {
  Allowances: AllowanceResponseModel[];
  TotalCount: number;
  ExtensionData?: string;
}

export interface AllowancePaymentGetResponseModel {
  Id: number;
  PaymentDate: string;
  TotalPaidAmount: number;
  PayableAmountCurrency: string;
}

export interface AllowancePaymentInfoResponseModel {
  TotalInvoiceCount: number;
  TotalPaidAmount: number;
  TotalAmount: number;
  TotalPaidInvoiceCount: number;
  CurrencyName: string;
  TotalBillCount: number;
  TotalBillAmount: number;
  TotalPaidBillCount: number;
  TotalOrderCount: number;
  TotalOrderAmount: number;
  TotalPaidOrderCount: number;
}

export interface AllowanceFinancerResponseModel {
  FinancerName: string;
  BidAmount: number;
  InterestRate: number;
  TotalInterestAmount: number;
  TotalBsmvAmount: number;
  PaymentDate: string;
  AdditionalDueDayCount: number;
  ExtraDueDayCount: number;
  ReceiverInterestRate: number;
  RebateAmount: number;
  Libor: number;
  TotalPayableAmount: number;
  TotalBidAmount: number;
  PayableAmountCurrency: string;
}

// Allowance Bids Response Model - Based on actual API response from curl
export interface AllowanceBidsResponseModel {
  Id: number;
  AllowanceId: number;
  CompanyId: number;
  TotalPayableAmount: number;
  TotalBidAmount: number;
  PayableAmountCurrency: string;
  ValueDate: number;
  InvoiceValueDate: number;
  InterestRate: number;
  TotalInterestAmount: number;
  TotalKKDFAmount: number;
  TotalBsmvAmount: number;
  TotalKdvAmount: number;
  InterestMethodType: number;
  CostAmount: number;
  CostRate: number;
  CommissionAmount: number;
  CommissionRate: number;
  BidAmountCurrency: string;
  BidDueDate: string | null;
  TotalPaidAmount: number;
  IsWinner: number;
  Status: number;
  StatusDescription: string;
  CompanyIdentifier: string;
  CompanyName: string;
  CompanyLogo: string;
  RebateAmount: number | null;
  ExtraDueDayCount: number;
  ReceiverInterestRate: number | null;
  ReceiverInterestType: number | null;
  AllowanceDueTime: string | null;
  Kdv: number | null;
  AvgDueDay: number;
  BidAvgDueDay: number;
  CompanyFinancerTemplateId: number | null;
  IsIbanRequired: boolean | null;
  Bids: Array<{
    Id: number;
    AllowanceFinancerId: number;
    AllowanceId: number;
    AllowanceInvoiceId: number;
    AllowanceBillId: number | null;
    AllowanceOrderId: number | null;
    PayableAmount: number;
    PayableAmountCurrency: string;
    BidAmount: number;
    BidAmountCurrency: string;
    InterestRate: number;
    InterestAmount: number;
    BsmvAmount: number;
    KdvAmount: number;
    PaidAmount: number;
    UserId: number;
    InsertDateTime: string;
    Status: number;
    InvoiceNumber: string;
    SerialNumber: string | null;
    SequenceNumber: string | null;
    BillNo: string | null;
    DueDayCount: number;
    ExtraDueDayCount: number;
    KdvRate: number | null;
    InvoiceId: number;
    IsPartiallyFounded: boolean;
    ReceiverCompanyName: string | null;
    InvoiceIssueDate: string | null;
    PaymentDueDate: string | null;
    OriginalInvoiceAmount: number;
    RequestedAmount: number;
    KKDFAmount: number | null;
    KKDFRate: number | null;
    RemainingAmount: number | null;
  }>;
  TotalFinancerLimit: number | null;
  RemainingFinancerLimit: number | null;
  AllowanceTotalPayableAmount: number;
  AllowancePaymentDate: string | null;
  IsGuarantor: boolean | null;
  HasOverduePayment: boolean | null;
  IsBidViewable: boolean;
  IsHold: boolean | null;
  IsFinancerEnabled: boolean;
  PaymentTotalPaidAmount: number;
  PaymentTotalPayableAmount: number | null;
  FinancerUnsecuredLimit: number | null;
  CompanyFinancerConfirmationTextTemplateId: number | null;
  TotalSuccessfullBidAmount: number;
  TotalSuccessfullInterestAmount: number;
  TotalSuccessfullPayableAmount: number;
  TotalSuccessfullBSMVAmount: number;
  IsVatRateVisible: boolean;
}

export interface AllowancePaymentRequestModel {
  AdditionalDueDayCount: number;
  AllowanceId: number;
  ExtraDueDayCount: number;
  InterestRate: number;
  Libor: number;
  PayableAmountCurrency: string;
  PaymentDate: Date | string;
  ReceiverInterestRate: number;
  TotalBsmvAmount: number;
  TotalInterestAmount: number;
  TotalPaidAmount: number;
  TotalPayableAmount: number;
  RebateAmount: number;
}

// Collections (Payments) API Response Types
export interface CollectionDetailLine {
  Id: number;
  AllowancePaymentDetailId: number;
  ChargedAmount: number;
  CreatedAt: string;
  ChargedAmountDate: string;
}

export interface CollectionPaymentDetail {
  Id: number;
  AllowancePaymentId: number;
  PayableAmount: number;
  PayableAmountCurrency: string;
  InterestAmount: number;
  PaidAmount: number;
  ChargedAmount: number;
  InterestRate: number;
  PaymentDate: string;
  RebateAmount: number;
  BsmvAmount: number;
  DeductionAmount: number;
  Libor: number;
  ExtraDueDayCount: number;
  AdditionalDueDayCount: number | null;
  ExchangeRate: number | null;
  InvoiceNumber: string | null;
  SerialNumber: string | null;
  SequenceNumber: string | null;
  BillNumber: string | null;
  ReceiverInterestRate: number | null;
  AllowanceInvoiceId: number | null;
  AllowanceBillId: number | null;
  AllowanceOrderInvoiceId: number | null;
  InvId: number | null;
  SequenceNo: string | null;
  SerialNo: string | null;
  BillNo: string | null;
  GetInvoiceNumber: string;
  InvoiceId: number | null;
  BillId: number | null;
  OverDueInterestAmount: number;
  OverDueInterestRate: number;
  ChargedAmountDate: string | null;
  InvoicePayableAmount: number;
  AllowancePaymentDetailLines: CollectionDetailLine[];
  AllowanceOrderId: number | null;
  OrderNumber: string | null;
}

export interface CollectionsResponseModel {
  Id: number;
  AllowanceId: number;
  TotalPayableAmount: number;
  PayableAmountCurrency: string;
  TotalInterestAmount: number;
  TotalPaidAmount: number;
  TotalChargedAmount: number;
  InterestRate: number;
  PaymentDate: string;
  TotalRebateAmount: number | null;
  TotalBSMVAmount: number;
  TotalDeductionAmount: number;
  Libor: number;
  ExtraDueDayCount: number;
  AdditionalDueDayCount: number;
  ExchangeRate: number | null;
  ReceiverInterestRate: number | null;
  UserId: number;
  AllowancePaymentDetails: CollectionPaymentDetail[];
  TotalFundedAmount: number;
  ChargedAmountDate: string | null;
}

export interface UpdateCollectionDetailRequest {
  PayableAmount: number;
  PayableAmountCurrency: string;
  InterestAmount: number;
  PaidAmount: number;
  ChargedAmount: number;
  InterestRate: number;
  PaymentDate: string;
  RebateAmount: number;
  BsmvAmount: number;
  DeductionAmount: number;
  Libor: number;
  ExtraDueDayCount: number;
  AdditionalDueDayCount: number | null;
  ExchangeRate: number | null;
  InvoiceNumber: string | null;
  SerialNumber: string | null;
  SequenceNumber: string | null;
  BillNumber: string | null;
  ReceiverInterestRate: number | null;
  AllowanceInvoiceId: number | null;
  AllowanceBillId: number | null;
  AllowanceOrderInvoiceId: number | null;
  InvId: number | null;
  SequenceNo: string | null;
  SerialNo: string | null;
  BillNo: string | null;
  GetInvoiceNumber: string;
  InvoiceId: number | null;
  BillId: number | null;
  OverDueInterestAmount: number;
  OverDueInterestRate: number;
  ChargedAmountDate: string | null;
  InvoicePayableAmount: number;
  AllowanceOrderId: number | null;
  OrderNumber: string | null;
}

export interface DiscountType {
  title: string;
  text: string;
  link: string;
  linkId: string;
  productType: ProductTypes;
}

export interface DiscountOperation {
  Id: number;
  AllowanceStatus: AllowanceStatusEnum;
  Status: AllowanceStatusEnum;
  StatusDesc: string;
  SenderCompanyName: string;
  ReceiverCompanyName: string;
  FinancerName: string;
  WinnerFinancerCompanyName?: string;
  CustomerManagerName: string;
  TotalPayableAmount: number;
  TotalPaidAmount: number;
  PayableAmountCurrency: string;
  AllowanceInvoiceCount: number;
  AllowanceBillCount: number;
  AvgDueDayCount: number;
  AllowanceDueDate: string;
  InsertDatetime: string;
  RemainingChargedAmount?: number;
  IntegratorName?: string;
  IsManualPaymentApproved?: boolean;
  RejectedBidCount?: number;
  IsGivingBid?: number;
}

export interface DiscountOperationFilters {
  allowanceId?: string;
  senderIdentifier?: string;
  receiverIdentifier?: string;
  senderCompanyName?: string;
  financerCompanyId?: string | number;
  status?: string | number[];
  customerManagerUserId?: string;
  PaymentStatus?: string;
  drawerName?: string;
  kind?: number | number[];
  startDate?: Date | string;
  endDate?: Date | string;
  page: number;
  pageSize: number;
  isPartialBid?: boolean;

  senderCompanyId?: number;
  receiverCompanyId?: number;
  invoiceNumber?: string;
  billNo?: string;
  senderName?: string;
  receiverName?: string;
  startAllowanceDueDate?: string;
  endAllowanceDueDate?: string;
  companyNameOrAllowanceNoFilter?: string;
  isOperationChargePayable?: boolean;
  notifyBuyer?: number;
  isLoanAvailable?: boolean;

  sortType?: string;
  sort?: string;
  totalCount?: number;
  isExport?: boolean;
  extensionData?: string;

  productType?: number;
}

export interface PaginatedResponse<T> {
  Allowances: T[];
  TotalCount: number;
}

export interface CompanyListItem {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

export interface CustomerManager {
  Id: number;
  FullName: string;
}

export interface PaymentStatus {
  Value: string;
  Description: string;
}

export interface AllowanceStatusOption {
  Value: number;
  Description: string;
}

export interface AllowanceDetailResponseModel {
  Id: number;
  Kind: AllowanceKind;
  NotifyBuyer: NotifyBuyer;
  Status: AllowanceStatusEnum;
  PaymentStatusValue: number;
  IsCreatedWithTransactionFee: boolean;
  FinancerRetreatReason?: ReasonItem[];
  AllowanceCancelReason?: ReasonItem[];
}

export interface ReasonItem {
  Value: number;
  Description: string;
}

export interface ReasonSelectionData {
  value: number;
  label: string;
}

export interface AllowanceLog {
  Id: number;
  Type: number;
  TypeDescription: string;
  Description: string;
  InsertDateTime: string;
  InsertedBy?: string;
}

export interface AllowanceLogsResponse {
  Logs: AllowanceLog[];
  TotalCount?: number;
}

export interface AllowanceLogsParams {
  AllowanceId: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
  page?: number;
  pageSize?: number;
}

export enum AllowanceLogType {
  ISKONTO_OLUSTURMA = 3,
  YETKILI_KABULU = 4,
  ALICI_ILK_ONAYI = 7,
  ALICI_SON_ONAYI = 9,
  YENI_TEKLIF = 11,
  TEDARIKCI_TEKLIF_KABULU = 16,
  TEDARIKCI_ABF_ONAYLAMA = 22,
  ODEME_BILGISI_AKTARMA = 40,
  ODEME_BILGISI_GUNCELLEME = 42,
  ISKONTOYA_AIT_FINANSORLER = 141,
}

export interface AllowanceLogResponseModel {
  Id: number;
  Type: AllowanceLogType;
  AllowanceId: number;
  ShortDescription: string;
  Description: string;
  CompanyId: number;
  UserId: number;
  Data: string | null;
  TypeDescription: string;
  InsertDatetime: string;
  SysLastUpdate: string;
  InsertedBy?: string;
}

export interface AllowanceLogsResponseModel {
  Logs: AllowanceLogResponseModel[];
}

export interface FundingInvoice {
  Id: number;
  InvoiceNumber: string;
  FinancerRate: number;
  FinancerAmount: number;
  SystemRate: number;
  SystemAmount: number;
  CurrencyName: string;
}

export interface FundingBill {
  Id: number;
  Number: string;
  FinancerRate: number;
  FinancerAmount: number;
  SystemRate: number;
  SystemAmount: number;
  CurrencyName: string;
}

export interface AllowanceFundingData {
  Id: number;
  FinancerName: string;
  Invoices?: FundingInvoice[];
  Bills?: FundingBill[];
}

export interface SpotFundingOrder {
  Id: number;
  FinancerRate: number;
  FinancerAmount: number;
  SystemRate: number;
  SystemAmount: number;
  CurrencyName: string;
}

export interface SpotFundingData {
  Id: number;
  CompanyName: string;
  FinancerIdentifier: string;
  Orders?: SpotFundingOrder[];
}

export interface DiscountFeeDetail {
  Id: number;
  OrderId?: number;
  InvoiceId?: number;
  InvoiceNumber: string;
  MinAmountInfo: number;
  MaxAmountInfo: number;
  InvoicePayableAmount: number;
  DiscountedAmount: number;
}

export interface DiscountFeeData {
  Id: number;
  ChargeCompanyIdentifier: string;
  ChargeCompanyName: string;
  TotalInvoicePayableAmount: number;
  DiscountedAmount: number;
  CurrencyName: string;
  Details: DiscountFeeDetail[];
}

export interface CreateTransactionFeeRequest {
  allowanceId: number;
}

export interface SetAllowanceIsCompleteRequest {
  allowanceId: number;
}

export interface OfferBidDetail {
  Id: number;
  FinancerName: string;
  BidAmount: number;
  BidAvgDueDayCount: number;
  BsmvAmount: number;
  BidAmountCurrency: string;
  InterestAmount: number;
  InterestRate: number;
  ComissionAmount: number;
  CommissionRate: number;
  Rebate: number;
  ExtraDueDayCount: number;
  ReceiverInterestRate: number;
  CostAmount: number;
  CostRate: number;
  TotalKKDFAmount: number;
  InstallmentAmount: number;
  TotalPaymentAmount: number;
  IsWinner: number;
  CreditInsuranceFee?: number;
}

export interface OffersResponseModel {
  Details: OfferBidDetail[];
}

export interface GetSenderUsageDetailRequest {
  AllowanceId: number;
}

export interface ReferenceEndorser {
  EndorserIdentifier: string;
  EndorserName: string;
  BillId: number;
  Bill: BillData;
  Id: number;
  VersionNumber: number;
  DeletedBy?: number;
  UpdatedBy?: number;
  CreatedBy: number;
  DeletedAt?: string;
  UpdatedAt?: string;
  CreatedAt: string;
  CreatedSource?: string;
  UpdatedSource?: string;
  DeletedSource?: string;
}

export interface ChequeData {
  Id: number;
  BillNo: string;
  ChequeAccountNo: string;
  PayableAmount: number;
  PayableAmountCurrency: string;
  PaymentDueDate: string;
  BankEftCode: string;
  EndorserName: string;
  EndorserIdentifier: string;
  ReferenceEndorserName?: string;
  ReferenceEndorserIdentifier?: string;
  DrawerName: string;
  DrawerIdentifier?: string;
  DrawerTaxNumber?: string;
  StatusDescription: string;
  ReferenceEndorsers?: ReferenceEndorser[];
}

export interface GetAllowanceChequesRequest {
  AllowanceId: number;
}

export interface InvoiceData {
  Id: number;
  InvoiceId: number;
  AllowanceId: number;
  InvoiceNumber: string;
  SerialNumber?: string;
  SequenceNumber?: string;
  IssueDate: string;
  PaymentDueDate: string;
  PayableAmount: number;
  PayableAmountCurrency: string;
  Status: number;
  StatusDescription?: string;
  DueDayCount?: number;
  DueDate: string;
  InsertDatetime: string;
  ReceiverName: string;
  ReceiverIdentifier?: string;
  InvoiceType?: number;
  EInvoiceType?: number;
  ExtraValueDay?: number;
  StatusDesc?: string;
}

export interface GetAllowanceInvoicesRequest {
  AllowanceId: number;
  invoiceNumber?: string;
  invoicePayableAmount?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface InvoicesResponseModel {
  Items: InvoiceData[];
  TotalCount: number;
}

export interface ReceivableData {
  Id: number;
  OrderNo: string;
  PayableAmount: number;
  PayableAmountCurrency: string;
  Status: number;
  StatusDescription?: string;
  DueDayCount?: number;
  DueDate?: string;
  InsertDatetime: string;
  ReceiverName?: string;
  ReceiverIdentifier?: string;
  StatusDesc?: string;
  OrderId: number;
}

export interface GetAllowanceReceivablesRequest {
  AllowanceId: number;
  OrderNo?: string;
  PayableAmount?: number;
  status?: string;
  page?: number;
  pageSize?: number;
  IsExport?: boolean;
}

export interface ReceivablesResponseModel {
  Items: ReceivableData[];
  TotalCount: number;
  ExtensionData?: string;
}

// Document-related types for DocumentsTab
export interface DocumentData {
  Id: number;
  BillId?: number;
  UserId?: number;
  Name: string;
  Type: string;
  DocumentType?: number;
  Data?: string | null;
}

export interface BillData {
  Id: number;
  BillId: number;
  AllowanceId: number;
  PayableAmount: number;
  PayableAmountCurrency: string;
  PaymentDueDate: string;
  BillNo: string;
  DrawerName: string;
  EndorserName?: string | null;
  DrawerIdentifier: string;
  EndorserIdentifier?: string | null;
  BankEftCode: string;
  BankName?: string | null;
  BankBranchEftCode: string;
  BankBranchName?: string | null;
  ChequeAccountNo: string;
  PlaceOfIssue: string;
  Documents: DocumentData[];
  ReferenceEndorserName?: string | null;
  ReferenceEndorserIdentifier?: string | null;
  StatusDescription: string;
}

export interface CompanyDocumentData {
  Id: number;
  LabelId: number;
  LabelDescription: string;
  SenderCompanyId: number;
  ReceiverCompanyId: number;
  AllowanceId: number;
  Name: string;
  Type: string;
  IsSigned: number;
  InsertDatetime: string;
  LabelName: string;
  ReceiverCompanies?: null;
  ReceiverCompanyName: string;
  SenderCompanyName: string;
  Status?: null;
  Message?: null;
  PeriodYear?: null;
  PeriodMonth?: null;
  PeriodQuarter?: null;
  SenderIdentifier: string;
  ExpireDate?: null;
  OriginalFileName?: null;
  Data?: string;
}

export interface DocumentDownloadResponse {
  Data: string;
  Type: string;
  Name: string;
}

export interface GetAllowanceChecksRequest {
  allowanceId: number;
}

export interface GetCompanyDocumentsRequest {
  allowanceId: number;
}

export interface DownloadBillDocumentRequest {
  billId: number;
  documentId: number;
}

export interface ShowCompanyDocumentRequest {
  documentId: number;
}

// Simple Wizard Modal Types
export interface CreateOfferWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Create Company for Bill Operation Types
export interface CreateCompanyForBillOperationRequest {
  company: {
    identifier: string;
    companyName: string;
    address: string;
    taxOffice: string;
    phone: string;
    cityId: number;
    email: string;
    MailAddress: string;
    districtId: number;
  };
  user: {
    identifier: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    userName: string;
    email: string;
    phone: string;
  };
}

export interface CreateCompanyForBillOperationResponse {
  CompanyId: number;
}

// Address Types
export interface City {
  Id: number;
  Name: string;
}

export interface District {
  Id: number;
  Name: string;
  CityId: number;
}

// Company Search Types
export interface CompanySearchItem {
  Id: number;
  Identifier: string;
  CompanyName: string;
}

// Cheque/Bill Data Types
export interface ChequeItem {
  Id: number;
  Type: number;
  SenderIdentifier?: string;
  DrawerIdentifier: string;
  DrawerName: string;
  No: string;
  ChequeAccountNo?: string;
  PayableAmount: number;
  PayableAmountCurrency: string;
  PlaceOfIssue?: string;
  InsertDatetime: string;
  PaymentDueDate: string;
  BankName?: string;
  BankEftCode?: string;
  BankBranchEftCode?: string;
  BankBranchName?: string;
  EndorserName?: string;
  EndorserIdentifier?: string;
  ReferenceEndorserName?: string;
  ReferenceEndorserIdentifier?: string;
  CompanyId?: number;
  Status?: number;
  UserId?: number;
  BillPaymentType?: number;
}

export interface GetBillsCompanyResponse {
  Bills: ChequeItem[];
  TotalCount?: number;
}

export interface GetBillsCompanyRequest {
  companyId: number;
  status?: number;
  pageSize?: number;
  page?: number;
  sort?: string;
  sortType?: 'asc' | 'desc';
}

export interface SelectedCheque {
  billId: number;
  companyId: number;
  payableAmount: number;
  payableAmountCurrency: string;
  drawerName: string;
  no: string;
  paymentDueDate: string;
}

export interface ChequeFilters {
  drawerName: string;
  chequeNumber: string;
  amount: string;
  paymentDueDate: string;
}

// ChequeDetailsStep Props
export interface ChequeDetailsStepProps {
  onNext: (data: { selectedCheques: SelectedCheque[] }) => void;
  onBack: () => void;
  initialData?: {
    selectedCheques?: SelectedCheque[];
    companyId?: number;
  };
  companyId?: number;
}

// Financial Settings Types
export interface FinancerOption {
  CompanyId: number;
  Identifier?: string;
  CompanyName?: string;
}

export interface FinancialSettingsData {
  AllowanceFinancers: number[]; // Array of financer IDs for multi-select
  IsCreatedWithTransactionFee: boolean;
}

export interface GetFinancersRequest {
  sort?: string;
  sortType?: 'Asc' | 'Desc';
  type?: number;
  page?: number;
  pageSize?: number;
}

export interface FinancerCompany {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  Address: string;
  Phone: string;
  Verify: number;
  MailAddress: string;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
}

export interface GetFinancersResponse {
  Items: FinancerCompany[];
  TotalCount?: number;
}

export interface FinancialSettingsStepProps {
  onNext: (data: FinancialSettingsData) => void;
  onBack: () => void;
  onSubmit: (finalData: CreateAllowanceRequest) => void;
  initialData?: Partial<FinancialSettingsData>;
  formData: WizardFormData;
  onSuccess?: () => void;
}

// Create Allowance Request (based on curl payload)
export interface CreateAllowanceRequest {
  AllowanceBills: {
    billId: number;
    payableAmount: number;
    payableAmountCurrency: string;
    paymentDueDate: string;
  }[];
  AllowanceDueDate: string;
  AllowanceFinancers: FinancerOption[];
  IsCreatedWithTransactionFee: boolean;
  NotifyBuyer: number;
  AllowanceInvoices: unknown[]; // Empty array in the example
  SenderCompanyId: number;
  Kind: number;
}

export interface CreateAllowanceResponse {
  Id?: number;
  Success?: boolean;
  Message?: string;
}

// Wizard Form Data Types
export interface WizardFormData {
  step0?: {
    companyId?: number;
    companyName?: string;
    selectedCompanyData?: {
      Id: number;
      Identifier: string;
      CompanyName: string;
    };
  };
  step1?: {
    transactionFee?: number;
  };
  step2?: {
    selectedCheques?: SelectedCheque[];
  };
  step3?: FinancialSettingsData;
}

// PDF Extraction Types - matching legacy documents/extract-pdf-page endpoint
export interface ExtractPdfPageRequest {
  base64File: string;
  pageIndex: number;
}

export interface ExtractPdfPageResponse {
  ErrorMessage: string | null;
  File: string; // Base64 encoded extracted page image
}

// Bank and Bank Branch Types (for single cheque form dropdowns)
export interface BankOption {
  Id: number;
  Code: string;
  Name: string;
}

export interface BankBranchOption {
  Id: number;
  Code: string;
  Name: string;
  Bank: string;
  City: string | null;
  District: string | null;
}

// Financer Retreat Types (for Change Process tab)
export interface FinancerRetreatData {
  Id?: number;
  AllowanceId: number;
  Description: string;
  Status: number; // 0 = Request Created, 1 = Approved, 2 = Rejected
  CreatedDate?: string;
  UpdatedDate?: string;
}

export interface CreateFinancerRetreatRequest {
  Description: string;
}

export interface UpdateFinancerRetreatRequest {
  Status: number; // 1 = Approve, 2 = Reject
}
