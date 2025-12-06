/**
 * Opportunity Management Types
 * Following LeadManagement patterns for type definitions
 * Aligned with API specifications (camelCase from BE)
 */

import { LeadSalesScenario, OpportunityStatus, OpportunityWinningStatus } from './constants';

// Opportunity List Item (for table display) - from OpportunitySearchItemModel
export interface OpportunityListItem {
  Id: number;
  Subject: string | null;
  CreatedAt: string;
  StatusDescription: OpportunityStatus | null;
  StatusDescriptionText: string | null;
  ProductType: number | null;
  ProductTypeName: string | null;
  ReceiverId: number | null;
  ReceiverName: string | null;
  CustomerManagerName: string | null;
  WinningStatus: OpportunityWinningStatus | null;
  WinningStatusDescription: string | null;
  ClosedDate: string | null;
  SalesScenario: LeadSalesScenario | null;
  SalesScenarioDescription: string | null;
  EstimatedClosingDate: string | null;
  LastMeetingDate: string | null;
  EstimatedLimit: number | null;
  EstimatedMonthlyVolume: number | null;
  SupplierCount: number | null;
  TakeRate: number | null;
  EstimatedMonthlyRevenue: number | null;
  Description: string | null;
}

// Opportunity Detail (full information) - from OpportunityResponseModel
export interface OpportunityDetail {
  id: number;
  subject: string | null;
  isReceiverInPortal: boolean;
  receiverId: number | null;
  receiverName: string | null;
  customerManagerId: number;
  customerManagerName: string | null;
  description: string | null;
  salesScenario: LeadSalesScenario | null;
  salesScenarioDescription: string | null;
  statusDescription: OpportunityStatus | null;
  statusDescriptionText: string | null;
  winningStatus: OpportunityWinningStatus | null;
  winningStatusDescription: string | null;
  closedDate: string | null;
  lastMeetingDate: string | null;
  productType: number | null;
  productTypeName: string | null;
  currency: string | null;
  estimatedLimit: number | null;
  estimatedMonthlyVolume: number | null;
  supplierCount: number | null;
  takeRate: number | null;
  estimatedMonthlyRevenue: number | null;
  estimatedClosingDate: string | null;
  // Offer fields
  offerDate: string | null;
  offerQuantity: number | null;
  offerUnitPrice: number | null;
  offerTotalAmount: number | null;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
}

// Form Data Types - for Create/Edit
export interface OpportunityFormData {
  subject: string;
  isReceiverInPortal: boolean;
  receiverId?: number | null;
  receiverName?: string;
  customerManagerId: number | null;
  description?: string;
  salesScenario?: LeadSalesScenario | null;
  statusDescription?: OpportunityStatus | null;
  lastMeetingDate?: string;
  productType?: number | null;
  currency?: string;
  estimatedLimit?: number | null;
  estimatedMonthlyVolume?: number | null;
  supplierCount?: number | null;
  takeRate?: number | null;
  estimatedMonthlyRevenue?: number | null;
  estimatedClosingDate?: string;
  // Offer fields
  offerDate?: string;
  offerQuantity?: number | null;
  offerUnitPrice?: number | null;
  offerTotalAmount?: number | null;
}

// Filter Form Data - Matches OpportunitySearchRequestModel from API
export interface OpportunityFilterFormData {
  subject?: string;
  receiverName?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  statusDescription?: OpportunityStatus;
  productType?: number;
  receiverId?: number;
  customerManagerId?: number;
  winningStatus?: OpportunityWinningStatus;
  salesScenario?: LeadSalesScenario;
}

// API Request/Response Types

// GET /api/opportunities/search
export interface GetOpportunitiesApiArgs {
  // Pagination
  page?: number;
  pageSize?: number;
  sortType?: string;
  sort?: string;
  totalCount?: number;
  isExport?: boolean;
  extensionData?: string;
  // Filters
  subject?: string;
  receiverName?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  statusDescription?: OpportunityStatus;
  productType?: number;
  receiverId?: number;
  customerManagerId?: number;
  winningStatus?: OpportunityWinningStatus;
  salesScenario?: LeadSalesScenario;
}

export interface GetOpportunitiesApiResponse {
  Items: OpportunityListItem[];
  IsSuccess: boolean;
  Page: number;
  PageSize: number;
  SortType: string | null;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

// GET /api/opportunities/{id}
export interface GetOpportunityDetailApiArgs {
  id: number;
}

export interface GetOpportunityDetailApiResponse extends OpportunityDetail {}

// POST /api/opportunities
export interface CreateOpportunityApiArgs {
  data: OpportunityFormData;
}

export interface CreateOpportunityApiResponse {
  isSuccess: boolean;
  message?: string;
}

// PUT /api/opportunities/{id}
export interface UpdateOpportunityApiArgs {
  id: number;
  data: OpportunityFormData;
}

export interface UpdateOpportunityApiResponse {
  isSuccess: boolean;
  message?: string;
}

// DELETE /api/opportunities/{id}
export interface DeleteOpportunityApiArgs {
  id: number;
}

export interface DeleteOpportunityApiResponse {
  isSuccess: boolean;
  message?: string;
}

// POST /api/opportunities/update-status-bulk
export interface UpdateOpportunityStatusBulkApiArgs {
  ids: number[];
  winningStatus: number;
}

export interface UpdateOpportunityStatusBulkApiResponse {
  isSuccess: boolean;
  message?: string;
}

// Receiver Search Types
export interface ReceiverSearchItem {
  Id: number;
  CompanyName: string;
  Identifier: string;
}

export interface ReceiverSearchApiArgs {
  companyNameOrIdentifier?: string;
}

export interface ReceiverSearchApiResponse {
  Items: ReceiverSearchItem[];
  IsSuccess: boolean;
}
