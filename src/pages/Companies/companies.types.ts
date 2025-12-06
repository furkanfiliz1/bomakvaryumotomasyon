export interface Company {
  Id: number;
  Identifier: string;
  Type: number;
  CompanyName: string;
  Status: number;
  InsertDateTime: string;
  ActivityType: number;
  companyStatus?: string;
  Address: string;
  Phone: string;
  Verify: number;
  MailAddress: string;
  CustomerManagerName: string;
  CustomerName: string;
  CustomerMail: string;
  // Additional fields from old form
  SignedContract?: number;
  SignedScoreContract?: number;
  IsTest?: boolean;
  TaxOffice?: string;
  Utm?: string;
  CustomerNumber?: string;
  IsCustomerNoVisible?: boolean;
  PassiveStatusReason?: { Value: string; Description: string };
  CityId?: number;
  DistrictId?: number;
  CityName?: string;
  CitySubdivisionName?: string;
  GroupStatus?: number;
  CompanyGroupStatus?: number;
}

// Company creation request type matching the curl data
export interface CompanyCreateRequest {
  ActivityType: number;
  CompanyName: string;
  Type: string;
  Identifier: string;
  TaxOffice: string;
  Address: string;
  Phone: string;
  MailAddress: string;
  Status: number;
  CityId: number;
  CityName: string;
  DistrictId: number;
  CitySubdivisionName: string;
}

// Form data type for company creation form
export interface CompanyCreateFormData {
  CompanyName: string;
  Type: string;
  Identifier: string;
  TaxOffice: string;
  Address: string;
  CityId: number | null;
  DistrictId: number | null;
  Phone: string;
  MailAddress: string;
  ActivityType: number;
  Status: boolean; // Using boolean for switch component
}

export interface CompanyFilters {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'Asc' | 'Desc';
  type?: number;
  status?: number;
  companyIdentifier?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  onboardingStatusTypes?: string;
  signedContract?: string;
  activityType?: string;
  userIds?: number[];
  UserMail?: string;
  UserPhone?: string;
  UserName?: string;
  NameSurname?: string;
  LeadingChannelId?: string;
  CityId?: number;
  CityLabel?: string;
  GetByIntegrators?: boolean;
  isExport?: boolean;
}

export interface CompanyType {
  Value: string;
  Description: string;
}

export interface CompanyStatus {
  value: string;
  text: string;
}

export interface ActivityType {
  Value: string;
  Description: string;
}

export interface OnboardingStatus {
  Value: string;
  Description: string;
}

export interface CompanyStatusUpdateRequest {
  OnboardingStatusTypes: string;
  LoanDecisionTypes?: string;
  OperationalLimit?: number;
  commentText?: string;
}

export interface LeadingChannel {
  Id: string;
  Value: string;
}

export type ApplicationSubChannel = number;

// Notification types
export interface NotificationType {
  Id: number;
  Type: number;
  Content: string | null;
  Description: string;
  CompanyType: number;
  IsDeleted: number;
}

export interface UserNotification {
  Id: number;
  MailTypeId: number;
  UserId: number;
  CompanyId: number;
  IsDeleted: number;
}

export interface NotificationItem {
  MailTypeId: number;
  TypeId: number;
  UserId: string;
  CompanyId: string;
}

export interface NotificationUpdateRequest extends Array<NotificationItem> {}

export interface City {
  Id: number;
  Name: string;
}

export interface District {
  Id: number;
  Name: string;
}

export interface PassiveReason {
  Value: string;
  Description: string;
}

// Product type from API response
export interface ProductTypeDetail {
  ProductType: number;
  ProductTypeDescription: string;
}

// Detay sekmesi için yeni type'lar
export interface CompanyDetail {
  Id?: number;
  CompanySizeType?: number;
  CompanySizeTypeDescription?: string;
  FoundationYear?: number;
  ProductTypes?: ProductTypeDetail[];
  RevenueType?: number;
  RevenueTypeDescription?: string;
  IntegratorId?: number;
  CompanyKind?: number;
  AffiliateStructure?: string;
  Bail?: string;
  Activity?: string;
  RequestedLimit?: number;
  LimitAllocations?: LimitAllocation[];
}

export interface CompanyDetailUpdateRequest {
  Id?: number;
  CompanySizeType?: number;
  CompanySizeTypeDescription?: string;
  FoundationYear?: number;
  ProductTypes?: number[];
  RevenueType?: number;
  RevenueTypeDescription?: string;
  IntegratorId?: number;
  CompanyKind?: number;
  AffiliateStructure?: string;
  Bail?: string;
  Activity?: string;
  RequestedLimit?: number;
  LimitAllocations?: LimitAllocation[];
}

// Form data type for company detail form
export interface CompanyDetailFormData {
  CompanySizeType?: number | null;
  FoundationYear?: number | null;
  ProductTypes?: number[] | null;
  RevenueType?: number | null;
  IntegratorId?: number | null;
  CompanyKind?: number | null;
  AffiliateStructure?: string | null;
  Bail?: string | null;
  Activity?: string | null;
  RequestedLimit?: number | null;
}

// Limit allocation structure from API response
export interface LimitAllocation {
  Id: number;
  CompanyDetailId: number;
  FinancierCompanyId: number;
  FinancierCompany: string;
  ProductType: number;
  ProductTypeDescription: string | null;
  Type: number;
  TypeDescription: string;
  RequestedLimit: number;
  OwnerId: number;
  AcceptedLimit: number;
  Description: string;
}

export interface TFSUsedAmountItem {
  Receiver: string;
  Amount: number;
}

export interface BankInformationItem {
  BankName: string;
  Amount?: number;
  [key: string]: unknown; // For additional properties that might exist
}

export interface TransactionHistory {
  TotalNumberOfUploadedInvoice: number;
  TotalNumberOfTransaction: number;
  SumOfReceivedTransactionFee: number;
  TFS_UsedAmount?: TFSUsedAmountItem[];
  FKF_UsedAmount: number;
  LastTransactionDate: string | null;
  FirstTransactionDate: string | null;
  TFS_BankInformation?: BankInformationItem[];
  FKF_BankInformation?: BankInformationItem[];
  ReceiverNames?: Record<string, unknown>[];
}

export interface WalletInfo {
  Id: number;
  MemberId: number;
  WalletId: number;
  Amount: number;
  Currency: string;
  RefundToWallet: boolean;
  WithdrawalAmount: number;
}

export interface GroupCompany {
  Id: number;
  CompanyName: string;
  Identifier: string;
  Type?: string;
  RelationshipType?: 'Parent' | 'Subsidiary' | 'Sister';
  AddedDate?: string;
}

export interface ProductType {
  Value: string;
  Description: string;
}

export interface CompanyKind {
  Value: string;
  Description: string;
}

export interface CompanySizeType {
  Value: string;
  Description: string;
}

export interface RevenueType {
  Value: string;
  Description: string;
}

export interface Integrator {
  value: number;
  label: string;
}

export interface CompanyCustomerManager {
  Id: number;
  CompanyCustomerManagerId: number;
  CompanyName: string;
  CompanyIdentifier: string;
  StartDate: string;
  InsertDateTime: string | null;
  ManagerUserId: number;
  ManagerName: string;
  CompanyId: number;
  ProductType: number;
  ProductTypeDescription: string;
  FinancerCompanyId: number | null;
  FinancerCompanyName: string | null;
  BuyerCompanyId: number | null;
  BuyerCompanyName: string | null;
}

export interface CompanyCustomerManagerFilters {
  companyIdentifier: string;
  isManagerAssigned: boolean;
  page?: number;
  pageSize?: number;
}

export interface CompanyCustomerManagerResponse {
  CompanyList: CompanyCustomerManager[];
  TotalCount?: number;
}

export interface CompanyCustomerManagerCreateRequest {
  Id?: number;
  CompanyName: string;
  CompanyIdentifier: string;
  StartDate: string;
  ManagerUserId: string;
  CompanyId: number;
  ProductType: string;
  FinancerCompanyId?: number;
  BuyerCompanyId?: number;
}

export interface CompanyCustomerManagersUpdateRequest {
  CompanyCustomerManagers: CompanyCustomerManagerCreateRequest[];
}

export interface CompanyUser {
  Id: number;
  Name?: string;
  Mail?: string;
  UserName?: string;
  Type?: number;
  IsLocked?: number;
  LanguageId?: number;
  // Additional properties from form data
  UserPositionId?: number;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PasswordStatusType?: number;
  Phone?: string;
  BirthDate?: string;
  Identifier?: string;
  Title?: string;
}

// Customer Acquisition types
export interface CustomerAcquisitionDetailResponse {
  Id: string;
  TrackingTeamId?: number;
  CallResultType?: number;
  LeadStatusType?: number;
  CustomerSourceType?: number;
  ApplicationChannelId?: number;
  ApplicationSubChannelId?: number;
  CampaignName?: string;
}

export interface CallerDataResponse {
  Id: number;
  Name: string;
}

export interface StatusDataResponse {
  Value: number;
  Description: string;
}

export interface LeadCallResultStatus {
  Value: string;
  Description: string;
}

export interface ReferralChannelResponse {
  Id: number;
  Name: string;
}

export interface SubChannelResponse {
  Id: number;
  Name: string;
}

export interface PutCustomerAcquisitionDetailRequest {
  id: string | number;
  Id: string;
  TrackingTeamId?: number;
  CallResultType?: number;
  LeadStatusType?: number;
  CustomerSourceType?: number;
  ApplicationChannelId?: number;
  ApplicationSubChannelId?: number;
  CampaignName?: string;
}

export interface UserFormData {
  UserPositionId: number | string;
  FirstName: string;
  LastName: string;
  Email: string;
  PasswordStatusType: number;
  Phone: string;
  BirthDate: string;
  Identifier: string;
  UserName: string;
  Type: number | string;
  IsLocked: number;
  LanguageId: number | string;
}

export interface CreateUserRequest {
  UserPositionId?: number | string;
  FirstName: string;
  LastName: string;
  Email: string;
  PasswordStatusType: number;
  Phone: string;
  BirthDate: string;
  Identifier: string;
  UserName: string;
  Type: string;
  IsLocked: number;
  LanguageId?: number | null; // Can be null when no language is selected
  Title?: string;
  companyId: string | number;
}

// Company Roles types
export interface CompanyRole {
  Id: number;
  Name: string;
  CompanyId: number | null;
  Description?: string;
  selected?: boolean;
}

// Authority types
export interface Authority {
  Id: number;
  Code: string;
  Description: string;
  CompanyTypes: number[];
  selected?: boolean;
}

export interface AuthorityGroup {
  GroupName: string;
  Authorities: Authority[];
}

export interface AuthorityProject {
  ProjectName: string;
  Items: AuthorityGroup[];
}

export interface RoleAuthority {
  AuthorityId: number;
}

// Processed authority types for UI
export interface ProcessedAuthorityGroup {
  projectName: string;
  groupName: string;
  authorities: Authority[];
}

export interface SelectedAuthorities {
  CompanyRoleId: number;
  AuthorityIds: number[];
}

// User Roles types
export interface UserRolesRequest {
  UserId: string;
  CompanyRoleIds: number[];
}

export interface UserRolesResponse {
  Id: number;
  Name: string;
  CompanyId: number | null;
}

// Password change request types
export interface PasswordChangeRequest {
  Identifier: string;
  UserName: string;
  Email: string;
  SendSMS: string;
  SendEMail: string;
}

// Password creation request types
export interface PasswordCreationRequest {
  Identifier: string;
  UserName: string;
  Email: string;
}

// Company System Settings types
export interface CompanySystemSettings {
  Id: number;
  IsTwoFactorAuthenticationPassive: boolean;
  OnboardingStatusName: string;
  FinancerWorkingType: number;
  LanguageId: number | null;
  ChequeAllowed: number;
  OrderAllowed: number;
  LeadingChannelId: number | null;
  OnboardingStatusType: number | null;
  IsInvoicesBlockedForOtherProducts: boolean;
  TheBuyerIsSeller: boolean;
}

// System Settings Update Request (for PUT operation)
export interface CompanySystemSettingsUpdateRequest {
  Id: number;
  IsTwoFactorAuthenticationPassive: number; // 0 or 1
  FinancerWorkingType: number;
  LanguageId: number | null;
  ChequeAllowed: number;
  IsInvoicesBlockedForOtherProducts: number; // 0 or 1
  TheBuyerIsSeller: number; // 0 or 1
  OrderAllowed: number;
}

// Language option type for dropdown
export interface LanguageOption {
  Id: number;
  Name: string;
  IsDefault: boolean;
}

// Company Limitation Types
export interface CompanyLimitation {
  Id: number;
  InvoiceAmount: number;
  InvoiceCount: number;
  Day: number;
}

// Update request type for PUT operation
export interface CompanyLimitationUpdateRequest {
  Id: number;
  InvoiceAmount: number;
  InvoiceCount: number;
  Day: number;
}

// Score Company types
export interface CompanySector {
  id: number;
  sectorName: string;
}

export interface ScoreCompany {
  id: number;
  companySectorId: number;
  companySector: string;
  identifier: string;
  createdDate: string;
  nextIncomingDate: string;
  nextOutgoingDate: string;
  nextOutgoingFirstDate: string;
  requestCurrentLimit: number;
  requestLimit: number;
  requestLimitDate: string;
  firstDownloadComplete: boolean;
}

// Company Codes Types
export interface CompanyCode {
  Id: number;
  Code: string;
  SenderIdentifier: string;
  SenderCompanyName: string;
  ReceiverIdentifier: string;
  ReceiverCompanyName?: string;
  FinancerCompanyId?: number | null;
  FinancerCompanyName?: string | null;
  CurrencyId?: number | null;
  CurrencyCode?: string | null;
}

export interface CompanyCodeFilters {
  ReceiverCompanyId: number;
  page?: number;
  pageSize?: number;
  Code?: string;
  CompanyName?: string;
  SenderIdentifier?: string;
  isExport?: boolean;
}

export interface CompanyCodeCreateRequest {
  code: string;
  SenderIdentifier: string;
  ReceiverIdentifier: string;
  FinancerCompanyId?: number | null;
  CurrencyId?: number | null;
}

export interface CompanyCodeUpdateRequest extends CompanyCode {
  code: string;
}

export interface CompanyCodeFormData {
  Code: string;
  SenderIdentifier: string;
  FinancerCompanyId?: number | null;
  CurrencyId?: number | null;
  CurrencyCode?: string | null;
}

export interface Currency {
  Id: number;
  Code: string;
  Name?: string;
}

// Company Rules types
export interface CompanyRule {
  Id: number;
  SenderIdentifier: string | null;
  SenderCompanyName: string | null;
  ReceiverCompanyId: number;
  ProductType: number;
  NotifyBuyer: number;
}

export interface CompanyRuleFilters {
  notifyBuyer?: number;
  ReceivercompanyId: number;
  productType?: number;
}

export interface CompanyRuleFinancer {
  Id: number;
  CompanyDefinitionId: number;
  FinancerCompanyId: number;
  FinancerIdentifier: string;
  BidProcess?: number | null;
  IntegrationType?: number | null;
  IntegrationModel?: string | null;
  Urf?: number | null;
  ProductType?: number | null;
}

export interface CompanyRuleFinancerUpdateRequest {
  CompanyDefinitionId: string;
  FinancerIdentifier: string;
  ProductType: number;
}
