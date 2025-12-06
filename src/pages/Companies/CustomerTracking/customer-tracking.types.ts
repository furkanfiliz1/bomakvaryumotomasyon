// New Customer Tracking types based on actual API response
export interface CustomerTrackingItem {
  Id: number;
  Identifier: string; // VKN/TCKN
  CompanyName: string;
  InsertDatetime: string; // Registration date
  ProductTypes: ProductType[] | null;
  CallResultTypeName: string | null;
}

export interface ProductType {
  ProductType: number;
  ProductTypeDescription: string;
}

export interface CustomerTrackingFilters {
  companyIdentifier?: string; // VKN field
  companyName?: string;
  startDate?: string; // Date range start
  endDate?: string; // Date range end
  trackingTeamId?: string; // Arayan Kişi (Tracking Team)
  callResultType?: string; // Arama Sonucu
  leadStatusType?: string; // Lead Statü
  LeadingChannelId?: string; // Gelir Kanalı
  status?: string; // Durum (1=Active, 0=Passive)
}

export interface CustomerTrackingQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortType?: 'asc' | 'desc';
  // Static values from legacy
  ActivityType?: number; // Always 2
  Type?: number; // Always 1
  // Filter values
  companyIdentifier?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  trackingTeamId?: string;
  callResultType?: string;
  leadStatusType?: string;
  LeadingChannelId?: string;
  status?: string;
}

export interface CustomerTrackingListResponse {
  Items: CustomerTrackingItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

// Dropdown data types
export interface TrackingTeamMember {
  Id: number;
  Name: string;
}

export interface LeadingChannel {
  Id: number;
  Value: string;
  Rate: number | null;
  IsConsensus: boolean;
}

export interface CallResultType {
  Description: string;
  Value: string;
}

export interface LeadStatusType {
  Description: string;
  Value: string;
}

export interface CompanyStatus {
  value: string;
  text: string;
}

// Customer application status types
export interface CustomerApplicationStatus {
  Id: number;
  Status: number;
  StatusDescription: string;
}

// Request type for updating customer status
export interface UpdateCustomerStatusRequest {
  Id: number;
  Status: number;
  Note?: string;
}
