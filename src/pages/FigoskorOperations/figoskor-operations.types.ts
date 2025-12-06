// Figoskor Operations Type Definitions
// Following OperationPricing pattern with interfaces matching legacy data structures exactly

export interface FigoskorCustomer {
  Id: number;
  CompanyName: string;
  Identifier: string; // VKN
  Status: number;
  StatusDescription: string;
}

export interface FigoskorCustomerListRequest {
  page?: number;
  pageSize?: number;
  Identifier?: string; // VKN filter
  CompanyName?: string; // Ünvan filter
  status?: string; // Status filter
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

export interface FigoskorCustomerListResponse {
  ClientItems: FigoskorCustomer[];
  TotalCount: number;
}

export interface FigoskorClientRequest {
  Id: number;
  RequestDate: string;
  TargetCompanyCount: number;
  ShowReference: boolean;
  Status: number;
  StatusDescription: string;
}

export interface FigoskorClientRequestListRequest {
  page?: number;
  pageSize?: number;
  StartDate?: string;
  EndDate?: string;
  status?: string;
  sort?: string;
  sortType?: string;
}

export interface FigoskorClientRequestListResponse {
  ClientReportRequestItems: FigoskorClientRequest[];
  TotalCount: number;
}

export interface FigoskorTargetCompany {
  Id: number;
  TargetCompanyIdentifier: string;
  TargetCompanyTitle: string;
  Phone?: string;
  MailAddress?: string;
  ContactPerson?: string;
  Status: number;
  StatusDescription: string;
  RequestDate: string;
}

export interface FigoskorTargetCompanyListRequest {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

export interface FigoskorTargetCompanyListResponse {
  Items: FigoskorTargetCompany[];
  TotalCount: number;
}

export interface CreateFigoskorReportRequest {
  ClientCompanyId: number;
  RequestDate: string;
  ShowReference: boolean;
  TargetCompanies: {
    TargetCompanyIdentifier: string;
    TargetCompanyTitle: string;
    Phone?: string;
    MailAddress?: string;
    ContactPerson?: string;
  }[];
  Id?: number; // For update operations
}

// Form data interfaces for multi-step company detail form
export interface FigoskorFormData {
  CompanyInformation?: CompanyInformationData;
  CommercialOperationalInfo?: CommercialOperationalData;
  RegistrationInformation?: RegistrationData;
  CompanyHistory?: CompanyHistoryData;
  CurrentManagement?: CurrentManagementData;
  StructuralInformation?: StructuralData;
  FinancialInformation?: FinancialData;
  GroupCompanyStructure?: GroupCompanyData;
}

export interface CompanyInformationData {
  CompanyName: string;
  TaxNumber: string;
  TradeRegistryNumber: string;
  ActivitySector: string;
  ActivityDescription: string;
  CompanyType: string;
  [key: string]: unknown;
}

export interface CommercialOperationalData {
  NumberOfEmployees: number;
  MonthlyTurnover: number;
  PaymentTerms: string;
  MainCustomers: string;
  MainSuppliers: string;
  [key: string]: unknown;
}

export interface RegistrationData {
  RegistrationDate: string;
  RegistrationPlace: string;
  Address: string;
  City: string;
  District: string;
  PostalCode: string;
  [key: string]: unknown;
}

export interface CompanyHistoryData {
  EstablishmentYear: number;
  FounderInformation: string;
  BusinessHistory: string;
  PreviousNames: string;
  [key: string]: unknown;
}

export interface CurrentManagementData {
  GeneralManager: string;
  BoardMembers: string;
  Shareholders: string;
  AuthorizedPersons: string;
  [key: string]: unknown;
}

export interface StructuralData {
  BranchCount: number;
  WarehouseCount: number;
  FactoryCount: number;
  OfficeCount: number;
  [key: string]: unknown;
}

export interface FinancialData {
  Capital: number;
  LastYearTurnover: number;
  LastYearProfit: number;
  BankRelationships: string;
  CreditRating: string;
  [key: string]: unknown;
}

export interface GroupCompanyData {
  ParentCompany: string;
  SubsidiaryCompanies: string;
  RelatedCompanies: string;
  GroupStructure: string;
  [key: string]: unknown;
}

// Filter interfaces following CustomerTracking pattern with URL parameters
export interface FigoskorCustomerFilters {
  Identifier?: string;
  CompanyName?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

export interface FigoskorRequestFilters {
  status?: string;
  StartDate?: string;
  EndDate?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
}

// Status enums matching legacy implementation
export enum FigoskorCustomerStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum FigoskorRequestStatus {
  WAITING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  ERROR = 5,
}

// Excel upload interface
export interface FigoskorExcelCompany {
  VKN?: string;
  vkn?: string;
  Unvan?: string;
  unvan?: string;
  Telefon?: string;
  telefon?: string;
  'E-mail'?: string;
  email?: string;
  'e-mail'?: string;
  yetkiliKisiAd?: string;
  yetkiliKisiSoyad?: string;
}

// Mail operations interfaces
export interface CreateTargetCompanyMailsRequest {
  targetCompanyIdentifier: string;
  reportRequestId: number;
  clientCompanyId: number;
  emails: string[];
}

export interface SendBulkMailsRequest {
  reportRequestId: number;
  targetCompanyIds: number[];
  emailSubject: string;
  emailBody: string;
}

export interface UpdateTargetCompanyContactRequest {
  Id: number;
  Phone?: string;
  MailAddress?: string;
  ContactPerson?: string;
}
