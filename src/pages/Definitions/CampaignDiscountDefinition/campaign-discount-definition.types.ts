/**
 * Campaign Discount Definition Type Definitions
 * Matches legacy CampaignDiscountDef.js exactly
 */

/**
 * Campaign discount item from GET /campaign/search response
 */
export interface CampaignDiscountItem {
  Year: number;
  Month: number;
  Ratio: number;
}

/**
 * Campaign discount list response from GET /campaign/search
 * Extends ServerSideQueryResult for useServerSideQuery compatibility
 */
export interface CampaignDiscountListResponse {
  Items: CampaignDiscountItem[];
  Data?: CampaignDiscountItem[] | null;
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData?: string | null;
}

/**
 * Create campaign discount request payload for POST /campaign
 */
export interface CreateCampaignDiscountRequest {
  Month: string;
  Year: string;
  Ratio: number;
  campaignType: number;
}

/**
 * Campaign discount search params
 */
export interface CampaignDiscountSearchParams {
  page: number;
  pageSize: number;
  sortType: string;
  Month?: string | null;
  Year?: string | null;
  campaignType: number;
}

/**
 * Form data for create campaign discount form
 */
export interface CampaignDiscountFormData {
  Month: string;
  Year: string;
  Ratio: string;
  campaignType: string;
}

/**
 * Campaign type option
 */
export interface CampaignTypeOption {
  value: number;
  label: string;
}

/**
 * Month option for dropdown
 */
export interface MonthOption {
  id: number;
  name: string;
}

/**
 * Year option for dropdown
 */
export interface YearOption {
  value: string;
  label: string;
}
