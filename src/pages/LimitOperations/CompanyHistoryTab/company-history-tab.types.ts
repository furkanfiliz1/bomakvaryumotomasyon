// =============================================================================
// COMPANY ACTIVITY LOG (TARIHÇE TAB) TYPES
// =============================================================================

// Activity Log Item - matches legacy API response exactly
export interface ActivityLogItem {
  UserName: string;
  CommentText: string;
  ActivityStatus: string;
  InsertDateTime: string;
  OperationalLimit?: number | null;
  CreditRiskLoanDecision?: string | null;
}

// Activity Log Query Parameters - matches legacy API exactly
export interface ActivityLogQueryParams {
  onboardingStatusType?: string; // Status filter
  userId?: string; // User filter
  page?: number; // Page number (1-based)
  pageSize?: number; // Items per page (default 25)
  ActivityType?: string; // Activity type filter
  sort?: string; // Sort field (default 'InsertDateTime')
  sortType?: 'Asc' | 'Desc'; // Sort direction (default 'Desc')
}

// Activity Log Response - matches legacy API response structure
export interface ActivityLogResponse {
  Items: ActivityLogItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: unknown;
}

// Create Activity Log Request - matches legacy POST request exactly
export interface CreateActivityLogRequest {
  activityType: string; // Activity type ID (default "3" for general comment)
  commentText: string; // Comment content
  companyId: number; // Company ID
}

// Admin User - matches legacy /users/admins response
export interface AdminUser {
  Id: number;
  Identifier: string;
  CompanyId: number;
  UserName: string;
  Email: string;
  Phone: string | null;
  FirstName: string;
  LastName: string;
  Consent: number;
  IsLocked: number;
  LockDate: string;
  Type: number;
  LastSessionDate: string | null;
  LastSessionIpAddress: string | null;
  Authorities: unknown;
  FullName: string;
  BirthDate: string;
  LanguageId: number | null;
  UserPositionId: number | null;
  PasswordStatusType: number;
  Verify: number;
  SignedContract: number;
  CompanyType: number;
  CompanyActivityType: number | null;
  ProductTypes: number[];
  Status: number;
  IsEmailVerified: boolean;
  IsPhoneNumberVerified: boolean;
  SignedScoreContract: number | null;
  InsertDateTime: string;
  ConsentKvkk: boolean;
  CommercialConsent: boolean;
  CompanyTaxOffice: string | null;
  CompanyAddress: string | null;
}

// Activity Type - matches legacy /types?EnumName=ActivityType response
export interface ActivityType {
  Description: string;
  Value: string;
}

// Activity Log Filters for form state
export interface ActivityLogFilters {
  userId: string;
  onboardingStatusType: string;
  ActivityType: string;
}

// Onboarding Status Type - matches legacy /types?EnumName=OnboardingStatusTypes response
export interface OnboardingStatusType {
  Description: string;
  Value: string;
}
