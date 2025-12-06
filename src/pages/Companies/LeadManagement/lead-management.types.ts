/**
 * Lead Management Types
 * Following OperationPricing patterns for type definitions
 * Aligned with API specifications (PascalCase from BE)
 */

// Lead List Item (for table display) - Using BE field names directly (PascalCase)
export interface LeadListItem {
  Id: number;
  TaxNumber: string | null;
  CompanyName: string | null;
  Telephone: string | null;
  EmailAddress: string | null;
  FirstName: string | null;
  LastName: string | null;
  MobilePhone: string | null;
  ProductType: number | null;
  CustomerManagerName: string | null;
  RegistrationDate: string | null;
  ChannelCode: string | null;
  LastCallResult: string | null;
  MembershipCompleted: boolean | null;
  CreatedAt: string | null;
}

// Lead Detail (full information) - Using BE field names directly from LeadResponseModel (PascalCase)
export interface LeadDetail {
  Id: number;
  TaxNumber: string | null;
  CompanyName: string | null;
  Telephone: string | null;
  EmailAddress: string | null;
  FirstName: string | null;
  LastName: string | null;
  MobilePhone: string | null;
  CompanyPhone: string | null;
  ProductType: number | null;
  CustomerManagerName: string | null;
  RegistrationDate: string | null;
  ChannelCode: string | null;
  LastCallResult: string | null;
  MembershipCompleted: boolean | null;
  CreatedAt: string | null;
  // New fields
  WebsiteUrl: string | null;
  SectorCode: string | null;
  CustomerManagerId: number | null;
  ReceiverCompanyId: number | null;
  CompanyActivityType: number | null;
  EstablishmentYear: string | null;
  DocumentSendStatus: number | null;
  Country: string | null;
  City: number | null;
  District: number | null;
}

// Call History Entity (Based on LeadPhoneCallResponseModel from Swagger) - PascalCase from BE
export interface CallHistory {
  Id: number;
  LeadId: number;
  CallerName: string | null;
  CallResult: number; // Enum number value
  CallResultText: string | null;
  SalesScenario: number; // Enum number value
  SalesScenarioText: string | null;
  FollowUpDate: string | null;
  Notes: string | null;
  CallDate: string;
}

// Form Data Types
export interface LeadAddManuelFormData {
  taxNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  products: number[];
}

export interface LeadDetailFirmaFormData {
  TaxNumber: string;
  CompanyName: string;
  CompanyPhone?: string;
  EmailAddress?: string;
  ProductType?: number;
  CustomerManagerName?: string;
  // New fields
  WebsiteUrl?: string;
  SectorCode?: string;
  CustomerManagerId?: number;
  ReceiverCompanyId?: number;
  CompanyActivityType?: number;
  EstablishmentYear?: string;
  DocumentSendStatus?: number;
  Country?: string;
  City?: number;
  District?: number;
}

export interface LeadDetailUserFormData {
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  MobilePhone: string;
}

export interface CallHistoryFormData {
  callResult: number | null; // Enum value from API (LeadCallResultStatus)
  salesScenario: number | null; // Enum value from API (LeadStatusTypes)
  followUpDate?: string; // API field name
  notes?: string;
  callDate: string; // Added from API
  customerManagerId?: number | null; // Customer Manager ID for caller
}

// Filter Form Data - Matches LeadSearchRequestModel from API
export interface LeadFilterFormData {
  companyName?: string; // API field: companyName
  taxNumber?: string; // API field: taxNumber
  customerManagerId?: number; // API field: customerManagerId (int64)
  channelCode?: string; // API field: channelCode (string)
  productType?: number; // API field: productType (ProductTypes enum)
  callResult?: number; // API field: callResult (LeadSearchResultStatus enum)
  membershipCompleted?: boolean | null; // API field: membershipCompleted (boolean)
  startDate?: string; // API field: startDate (date-time)
  endDate?: string; // API field: endDate (date-time)
}

// API Request/Response Types - Matches LeadSearchRequestModel
export interface GetLeadsApiArgs {
  // Pagination
  page?: number;
  pageSize?: number;
  sortType?: string; // Can be 'asc' | 'desc' - using undefined for optional (compatible with ServerSideQueryArgs)
  sort?: string;
  totalCount?: number;
  isExport?: boolean;
  extensionData?: string;
  // Filters - matches LeadSearchRequestModel exactly
  companyName?: string;
  taxNumber?: string;
  customerManagerId?: number;
  startDate?: string;
  endDate?: string;
  channelCode?: string;
  productType?: number; // ProductTypes enum
  callResult?: number; // LeadSearchResultStatus enum
  membershipCompleted?: boolean;
}

export interface GetLeadsApiResponse {
  // Response wrapper fields (PascalCase from BE)
  Items: LeadListItem[];
  IsSuccess: boolean;
  Page: number;
  PageSize: number;
  SortType: string | null;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

export interface GetLeadDetailApiArgs {
  id: number;
}

export interface GetLeadDetailApiResponse extends LeadDetail {
  // Response is LeadDetail directly (no wrapper)
}

export interface CreateLeadApiArgs {
  data: LeadAddManuelFormData;
}

export interface CreateLeadApiResponse {
  Data: {
    id: number;
    message: string;
  };
}

export interface CreateLeadsApiArgs {
  data: LeadAddManuelFormData[];
}

export interface CreateLeadsApiResponse {
  Data: {
    successCount: number;
    errorCount: number;
    errors?: string[];
  };
}

export interface CreateLeadsExcelApiArgs {
  data: LeadAddManuelFormData[];
}

export interface CreateLeadsExcelApiResponse {
  Data: {
    successCount: number;
    errorCount: number;
    errors?: string[];
  };
}

export interface UpdateLeadApiArgs {
  id: number;
  data: Partial<LeadDetail>;
}

export interface UpdateLeadApiResponse {
  Data: {
    success: boolean;
    message: string;
  };
}

// Phone Calls API Types (Based on Swagger)
export interface GetCallHistoryApiArgs {
  leadId: number;
}

export interface GetCallHistoryApiResponse {
  Data: CallHistory[]; // Array of LeadPhoneCallResponseModel
}

export interface SearchCallHistoryApiArgs {
  page?: number;
  pageSize?: number;
  leadId?: number;
  callerId?: number;
  callResult?: number; // Enum value from API (LeadCallResultStatus)
  salesScenario?: number; // Enum value from API (LeadStatusTypes)
  startDate?: string;
  endDate?: string;
}

export interface SearchCallHistoryApiResponse {
  Items: CallHistory[];
  TotalCount: number;
}

export interface CreateCallApiArgs {
  data: {
    leadId: number;
    callResult: number; // Enum value from API (LeadCallResultStatus)
    salesScenario: number; // Enum value from API (LeadStatusTypes)
    followUpDate?: string;
    notes?: string;
    callDate: string;
    customerManagerId?: number;
  };
}

export interface CreateCallApiResponse {
  Data: {
    success: boolean;
    message: string;
  };
}

export interface UpdateCallApiArgs {
  id: number;
  data: {
    leadId: number;
    callResult: number; // Enum value from API (LeadCallResultStatus)
    salesScenario: number; // Enum value from API (LeadStatusTypes)
    followUpDate?: string;
    notes?: string;
    callDate: string;
    customerManagerId?: number;
  };
}

export interface UpdateCallApiResponse {
  Data: {
    success: boolean;
    message: string;
  };
}

export interface DeleteCallApiArgs {
  id: number;
}

export interface DeleteCallApiResponse {
  Data: {
    success: boolean;
    message: string;
  };
}

export interface DeleteLeadApiArgs {
  id: number;
}

export interface DeleteLeadApiResponse {
  Data: {
    success: boolean;
    message: string;
  };
}

export interface LeadSalesScenario {
  Description: string;
  Value: string;
}
