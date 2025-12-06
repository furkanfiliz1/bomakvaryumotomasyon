// Enums matching legacy system
export type StepStatus = 'Başlanmadı' | 'Başlandı' | 'Tamamlandı' | 'Opsiyonel' | null;

// Step definition interface
export interface StepDefinition {
  id: string;
  title: string;
  icon: string;
  status: StepStatus;
  componentName: string;
}

// Parent data interfaces from session storage
export interface ParentCustomer {
  Id: number;
  Title: string;
  TaxNumber: string;
}

export interface ParentRequest {
  Id: number;
  RequestDate: string;
  Status: number;
  StatusDescription: string;
}

export interface ParentBranch {
  Id: number;
  TargetCompanyId: number;
  TargetCompanyTitle: string;
  TargetCompanyIdentifier: string;
  Status: number;
  StatusDescription: string;
}

// API Data Interfaces
export interface CompanyInformation {
  CompanyTitle?: string;
  TaxNumber?: string;
  TaxOffice?: string;
  TaxOfficeCity?: string | number;
  Address?: string;
  PhoneNumber?: string;
  Email?: string;
  WebsiteAddress?: string;
}

export interface CommercialOperationalInfo {
  // Basic Information
  ActivityArea?: string;
  EmployeeCount?: number;
  CustomerCount?: number;
  BranchCount?: number;
  DomesticCustomerCount?: number;
  InternationalCustomerCount?: number;

  // NACE and GTIP Codes
  NaceCodes?: Array<{ Value: string; Description: string }>;
  GtipCodes?: string[];

  // Banks
  Banks?: Array<{ Value: string; Description: string }>;

  // Import/Export Information
  ExportRatio?: number;
  ImportRatio?: number;
  TopExportCountries?: Array<{ Value: string; Description: string }>;
  TopImportCountries?: Array<{ Value: string; Description: string }>;

  // Payment Information
  DomesticSalesDueDayCount?: number;
  DomesticPurchaseDueDayCount?: number;
  DomesticSalesPaymentMethods?: string[];
  DomesticPurchasePaymentMethods?: string[];

  // Company Brands and Facilities
  CompanyBrands?: Array<{ Brand: string; Category: string; Type: number }>;
  CompanyFacilities?: Array<{
    FacilityType: string;
    FacilityPropertyStatus: string;
    IsHeadquarter: boolean;
  }>;

  // Legacy fields for backward compatibility
  BusinessLine?: string;
  MainProducts?: string;
  CustomerBase?: string;
  MarketPosition?: string;
  CompetitiveAdvantages?: string;
  OperationalCapacity?: number;
  ProductionFacilities?: string;
  QualityCertificates?: string;
}

export interface RegistrationInformation {
  RegistrationAddress?: string;
  TradeRegisterNumber?: string;
  ChamberOfCommerceNumber?: string;
  RegistrationOffice?: string;
  RegistrationCity?: string | number;
  RegistrationDate?: string;
  MersisNumber?: string;
  RegistryNumber?: string;
  RegistryOffice?: string;
  LegalStructure?: string;
  AuthorizedCapital?: number;
  PaidCapital?: number;
  ShareholderStructure?: string;
}

export interface CompanyHistory {
  // Foundation Information
  FoundingDate?: string;
  FoundationCapital?: number;
  CorporationType?: string | number;
  FoundingTitle?: string;

  // Company Founders
  CompanyFounders?: Array<{
    FirstName: string;
    LastName: string;
  }>;

  // Change History
  TitleChanges?: Array<{
    Title: string;
    ChangeDate: string;
  }>;

  AddressChanges?: Array<{
    Address: string;
    ChangeDate: string;
  }>;

  // Mergers and Acquisitions
  MergersAndAcquisitions?: Array<{
    CompanyTitle: string;
    AcquisitionYear: string | number;
    CorporationType: string | number;
  }>;

  // Legacy fields for backward compatibility
  EstablishmentDate?: string;
  FounderInformation?: string;
  ImportantMilestones?: string;
  BusinessChanges?: string;
  ExpansionHistory?: string;
}

export interface ManagementStaff {
  FirstName?: string;
  LastName?: string;
  Role?: string;
  AuthorizedSignatory?: boolean;
  // Legacy fields for backward compatibility
  Name?: string;
  Title?: string;
  Experience?: string;
  Education?: string;
  ResponsibilityArea?: string;
}

export interface CurrentManagement {
  ManagementStaff?: ManagementStaff[];
  OrganizationalStructure?: string;
  DecisionMakingProcess?: string;
  BoardOfDirectors?: string;
}

export interface StructuralInformation {
  // Capital Information
  Capital?: number;
  PaidCapital?: number;
  LatestCapitalIncreaseDate?: string;

  // Shareholding Structure
  ShareholdingStructure?: Array<{
    ShareholderTitle: string;
    ShareRatio: number;
  }>;

  // Legacy fields for backward compatibility
  CompanyStructure?: string;
  OwnershipStructure?: string;
  DepartmentalStructure?: string;
  InternalControlSystem?: string;
  NumberOfEmployees?: number;
  DepartmentStructure?: string;
  PhysicalFacilities?: string;
  TechnologyInfrastructure?: string;
  ITSystems?: string;
}

export interface FinancialDocument {
  Id: number;
  LabelId: number;
  LabelDescription: string;
  SenderCompanyId: number;
  ReceiverCompanyId?: number;
  AllowanceId?: number;
  Name: string;
  Type: string;
  IsSigned: number;
  InsertDatetime: string;
  LabelName: string;
  ReceiverCompanies?: unknown;
  ReceiverCompanyName?: string;
  SenderCompanyName: string;
  Status: number;
  Message?: string;
  PeriodYear?: number;
  PeriodMonth?: number;
  PeriodQuarter?: number;
  SenderIdentifier: string;
  ExpireDate?: string;
  OriginalFileName: string;
}

export interface FinancialInformation {
  LastThreeYearsRevenue?: number[];
  ProfitMargins?: number[];
  DebtToEquityRatio?: number;
  LiquidityRatio?: number;
  DebtStructure?: string;
  LiquidityPosition?: string;
  InvestmentPlans?: string;
  Documents?: FinancialDocument[];
}

export interface GroupCompany {
  CompanyName?: string;
  Relationship?: string;
  BusinessArea?: string;
  OwnershipPercentage?: number;
}

export interface GroupCompanyStructure {
  ParentCompany?: string;
  SubsidiaryCompanies?: GroupCompany[];
  PartnershipStructure?: string;
  ConsolidatedInformation?: string;
  // Legacy fields for comprehensive group structure
  CompanyHierarchies?: Array<{
    Type: number;
    CompanyTitle: string;
    ShareRate: number;
    ActivityArea: string;
    CompanyPartnerName?: string;
  }>;
  CompanyPartnerships?: Array<{
    CompanyTitle: string;
    CountryId: number;
  }>;
}

// Main API response interface - matches actual API response
export interface FigoScoreProFormData {
  TargetCompanyId?: number;
  CompanyInformation?: CompanyInformation;
  CommercialAndOperationalInformation?: CommercialOperationalInfo;
  RegistryInformation?: RegistrationInformation;
  CompanyHistory?: CompanyHistory;
  CurrentManagementStaff?: CurrentManagement;
  StructuralInformation?: StructuralInformation;
  GroupCompanyStructure?: GroupCompanyStructure;
  Stage?: number;
}

// Cities and Countries enums
export interface City {
  Id: number;
  Name: string;
}

export interface Country {
  Value: string;
  Description: string;
}

// API Request/Response types
export interface GetFigoScoreProFormDataRequest {
  companyId: number;
}

// API returns data directly without wrapper
export type GetFigoScoreProFormDataResponse = FigoScoreProFormData;

export interface GetCompanyDocumentsRequest {
  senderCompanyId: number;
}

// API returns data directly without wrapper
export type GetCompanyDocumentsResponse = FinancialDocument[];

// API returns arrays directly without wrapper
export type GetCountriesResponse = Country[];

export type GetCitiesResponse = City[];

// Step Status Context
export interface StepStatusState {
  [stepIndex: number]: StepStatus;
}

// Enum data structure for API responses
export interface EnumData {
  corporationTypes: Array<{ Description: string; Value: string }>;
  facilityTypes: Array<{ Description: string; Value: string }>;
  facilityPropertyStatuses: Array<{ Description: string; Value: string }>;
  paymentMethods: Array<{ Description: string; Value: string }>;
  cities: Array<{ Id: number; Name: string }>;
  countries: Array<{ Value: string; Description: string }>;
}

// Hook return types
export interface UseCustomerRequestDataReturn {
  figoScoreData: FigoScoreProFormData | undefined;
  companyDocuments: FinancialDocument[];
  enumData: EnumData;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseStepNavigationReturn {
  activeStep: string;
  setActiveStep: (stepId: string) => void;
  steps: StepDefinition[];
}

export interface UseStepStatusValidationReturn {
  stepStatuses: StepStatusState;
  getStepStatus: (stepIndex: number) => StepStatus;
  updateStepStatus: (stepIndex: number, status: StepStatus) => void;
}

// Route parameters
export interface CustomerRequestBranchDetailParams {
  customerId: string;
  requestId: string;
  branchId: string;
}
