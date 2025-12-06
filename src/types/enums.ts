export enum AllowanceStatusEnum {
  FaturaDogrulamaBekliyor = 0,
  YetkiliOnayBekliyor = 1,
  AlıcıIlkOnyBekliyor = 10,
  TeklifSurecinde = 30,
  AliciSonOnayiBekliyor = 40,
  FinansAsamasi = 70,
  YetkiliOnayiRedEdildi = 2,
  AliciIlkOnayRed = 20,
  AliciSonOnayRed = 50,
  IptalEdildi = 60,
  ZamanAsimi = 61,
  FinansSirketiGeriCekildi = 72,
  FinansSirketiIptalEtti = 80,
  OdemeAlindi = 71,
}

export enum AllowanceFinancerStatusEnum {
  OdemeYapıldı = 910,
  FinansAsamasi = 870,
  TeklifBekliyor = 800,
  TeklifOnayiBekliyor = 810,
  TeklifVerildi = 840,
  TeklifIptalEdildi = 830,
  TeklifRedEdildi = 820,
  SonOnayRed = 860,
  Kaybedildi = 880,
  IptalEdildi = 890,
  FinansSirketiGeriCekildi = 900,
  ZamanAsimi = 892,
}

export enum UserTypes {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  FINANCER = 'FINANCER',
}

export enum ProductTypes {
  SUPPLIER_FINANCING = 2,
  SME_FINANCING = 3,
  CHEQUES_FINANCING = 4,
  FIGO_KART = 5,
  SPOT_LOAN_FINANCING_WITH_INVOICE = 6,
  RECEIVABLE_FINANCING = 7,
  SPOT_LOAN_FINANCING_WITHOUT_INVOICE = 8,
  ROTATIVE_LOAN = 9,
  FIGO_SKOR = 10,
  COMMERCIAL_LOAN = 11,
  FIGO_SKOR_PRO = 12,
  INSTANT_BUSINESS_LOAN = 13,
}

export enum DocumentLabelID {
  VERGI_LEVHASI_LABEL_ID = 4,
  ABF_LABEL_ID = 20,
  TALIMAT_FORMU_LABEL_ID = 27,
  E_DEFTER_KEBIR = 30,
  E_DEFTER_BERAT = 31,
  YILLIK_BEYANNAME_LABEL_ID = 32,
  GECICI_BEYANNAME_LABEL_ID = 33,
  MIZAN_LABEL_ID = 34,
  FINDEKS_LABEL_ID = 35,
  FAALIYET_RAPORU_LABEL_ID = 37,
}

export enum OperationChargeStatus {
  IADE = 6,
  ODEME_BEKLIYOR = 4,
  ODENDI = 1,
  IPTAL_EDILDI = 2,
  HATALI_ISLEM = 3,
  PASIF = 0,
}

export enum InvoiceTypes {
  EFATURA = 1,
  KAGITFATURA = 2,
}

export enum EInvoiceTypes {
  E_FATURA = 1,
  E_ARSIV = 2,
  E_MUSTAHSIL = 3,
}

export enum DocumentStatus {
  WaitingControl = 0,
  Approved = 1,
  Declined = 3,
  WaitingApprove = 4,
  WaitingProcess = 5,
  ConfirmedAndProcessed = 6,
  NotConfirmed = 7,
  NotProcess = 8,
  NotProcessedByPapirus = 9,
}

export enum AllowanceKind {
  INVOICE = 1,
  CHEQUE = 2,
  SPOT_WITH_INVOICE = 4,
  RECEIVABLE = 5,
  SPOT_WITHOUT_INVOICE = 6,
  ROTATIVE_LOAN = 7,
  COMMERCIAL_LOAN = 8,
  INSTANT_BUSINESS_LOAN = 9,
}

export enum NotifyBuyer {
  FKF_KOBI = 0,
  AG_TEDARIKCI = 1,
}

export enum CompanyActivityType {
  ALICI = 1,
  SATICI = 2,
  FINANSOR = 3,
}

export enum PaymentStatus {
  ODEME_BASARILI = 1,
  ODEME_BASARISIZ = 2,
  BEKLENIYOR = 3,
}

export enum RateTypes {
  GENERAL_RATES = 1,
  BUYER_RATES = 2,
  BUYER_CATEGORY_RATES = 3,
  BUYER_OF_SENDER_RATES = 4,
  SME_RATES = 5,
  SIMULATION_RATES = 6,
  CHEQUE_RATES = 7,
  SPOT_RATES = 8,
  SIMULATION_RATES_SPOT = 9,
  SPOT_RATES_WITHOUT_INVOICE = 10,
  SIMULATION_RATES_SPOT_WITHOUT_INVOICE = 11,
  RECEIVABLES_FINANCING_GENERALRATES = 12,
  RECEIVABLES_FINANCING_RECEIVERRATES = 13,
  RECEIVABLES_FINANCING_RECEIVERSENDERSRATES = 14,
}

export enum ChequeDocumentType {
  FRONT_IMAGE = 1,
  BACK_IMAGE = 2,
  INVOICE_IMAGE = 3,
}

export enum UsedInvoicesTabsType {
  ALL_INVOICES = 0,
  UPCOMING_PAYMENTS = 1,
  COMPLETED_PAYMENTS = 2,
}

export enum BillTimeTypes {
  GENERAL = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  THREEMONTHLY = 4,
  YEARLY = 5,
}

export enum BillPaymentType {
  TAHSILAT_CEKI = 1,
  ODEME_CEKI = 2,
}

export enum ProfileIdEnum {
  TEMELFATURA = 'TEMELFATURA',
  TICARIFATURA = 'TICARIFATURA',
  EARSIVFATURA = 'EARSIVFATURA',
  EMUSTAHSIL = 'EMUSTAHSIL',
}

export enum LoginErrorCodes {
  PasswordBlocked = '4001',
  EmailNotVerified = '4002',
  PasswordExpired = '4003',
}

export enum AllowanceErrorCodes {
  TimeoutAllowanceBlocked = '5001',
}

export enum CrossSellAbTest {
  Bill = 1,
  Limit = 2,
}

export enum TaskStatusRobomotion {
  Pending = 0,
  InProgress = 1,
  Success = 2,
  Failed = 3,
}

export enum TaskInfoStatus {
  Positive = 'positive',
  Negative = 'negative',
  Neutral = 'neutral',
}

export enum RiskGroupEnum {
  RISK_BULUNDU = 'RISK_BULUNDU',
  RISK_BULUNAMADI = 'RISK_BULUNAMADI',
}

export enum OldRiskGroupEnum {
  DUSUK_RISK = 'DUSUK_RISK',
  ORTA_RISK = 'ORTA_RISK',
  YUKSEK_RISK = 'YUKSEK_RISK',
}

export enum FinancialSkorGroupEnum {
  GIVE_CREDIT = '1',
  NOT_GIVE_CREDIT = '2',
}

export enum TourEvents {
  TOUR_NEXT = 'TOUR_NEXT',
  TOUR_PREV = 'TOUR_PREV',
  TOUR_SKIP = 'TOUR_SKIP',
  TOUR_FINISH = 'TOUR_FINISH',
  TOUR_CLOSE = 'TOUR_CLOSE',
}

export enum AccessRequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum AccessRequestType {
  FindexAtFigo = 0,
  FinancialScore = 1,
  InvoiceScore = 2,
  Findex = 3,
}

export enum FindeksRequestSteps {
  SEND_REQUEST = 'SEND_REQUEST',
  FIGO_COMPANY_APPROVE = 'FIGO_COMPANY_APPROVE',
  INFO_SHARE_PERMISSION = 'INFO_SHARE_PERMISSION',
  SHOW_FINDEKS = 'SHOW_FINDEKS',
}

export enum FinancialAndInvoiceRequestSteps {
  SEND_REQUEST = 'SEND_REQUEST',
  INFO_SHARE_PERMISSION = 'INFO_SHARE_PERMISSION',
  UPLOAD_DOCUMENT_OR_CONNECT_INTEGRATOR = 'UPLOAD_DOCUMENT_OR_CONNECT_INTEGRATOR',
  PROCESS_DOCUMENT = 'PROCESS_DOCUMENT',
  SHOW_DATA = 'SHOW_DATA',
}

export enum FindeksTargetSteps {
  NO_DEMAND = 'NO_DEMAND',
  APPROVE_SMS = 'APPROVE_SMS',
  SHARE_PERMISSION = 'SHARE_PERMISSION',
  DOWNLOAD_FINDEKS = 'DOWNLOAD_FINDEKS',
}

export enum FinancialAndInvoiceTargetSteps {
  NO_DEMAND = 'NO_DEMAND',
  SHARE_PERMISSION = 'SHARE_PERMISSION',
  SHOW_DATA = 'SHOW_DATA',
}

export enum RequestTypes {
  SORGULAMA = '0',
  GENEL_BILGILER = '1',
  MALI_SKOR = '2',
  FATURA_SKOR = '3',
  FINDEKS = '4',
}

export enum PackageTypes {
  STANDART = '1',
  COUPON = '2',
  PERSONAL = '3',
}
