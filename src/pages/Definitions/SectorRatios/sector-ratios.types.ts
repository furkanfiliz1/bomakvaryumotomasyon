/**
 * Sector Ratios Types
 * TypeScript interfaces matching legacy API exactly
 * API Base: https://apiscoretest.figopara.com
 */

/**
 * Ratio definition from /ratios endpoint
 * Example: { id: 1, name: "Likidite" }
 */
export interface Ratio {
  id: number;
  name: string;
}

/**
 * Response from GET /ratios
 */
export interface GetRatiosResponse {
  data: Ratio[];
  extensionData: unknown;
  message: string | null;
  success: boolean;
}

/**
 * Ratio Tally (sector ratio mapping) from /ratiotallies endpoint
 * Example: { id: 1574, companySectorId: 21, companySector: "KONAKLAMA VE YİYECEK HİZMETİ", ... }
 */
export interface RatioTally {
  id: number;
  companySectorId: number;
  companySector: string;
  ratioId: number;
  ratio: string;
  min: number;
  max: number;
  point: number;
}

/**
 * Paginated response from GET /ratiotallies
 */
export interface GetRatioTalliesResponse {
  page: {
    page: number;
    pageSize: number;
    sortType: string;
    sort: string;
    totalCount: number;
    isExport: boolean;
    extensionData: unknown;
  };
  data: RatioTally[];
  extensionData: unknown;
  message: string | null;
  success: boolean;
}

/**
 * Request payload for POST /ratiotallies
 */
export interface CreateRatioTallyRequest {
  companySectorId: number;
  ratioId: number;
  min: number;
  max: number;
  point: number;
}

/**
 * Response from POST /ratiotallies
 */
export interface CreateRatioTallyResponse {
  isSuccess: boolean;
  id: number;
  message?: string;
}

/**
 * Request payload for PUT /ratiotallies/{id}
 */
export interface UpdateRatioTallyRequest {
  id: number;
  companySectorId: number;
  ratioId: number;
  min: number;
  max: number;
  point: number;
}

/**
 * Response from PUT /ratiotallies/{id}
 */
export interface UpdateRatioTallyResponse {
  isSuccess: boolean;
  message?: string;
}

/**
 * Response from DELETE /ratiotallies/{id}
 */
export interface DeleteRatioTallyResponse {
  isSuccess: boolean;
  message?: string;
}

/**
 * Form data for add/edit ratio tally modal
 */
export interface RatioTallyFormData {
  ratioId: string | number;
  point: string;
  min: string;
  max: string;
}

/**
 * Sector Ratios page filters (URL params)
 */
export interface SectorRatiosFilters {
  companySectorId?: number | null;
}

/**
 * Company Sector type (reused from companies API)
 */
export interface CompanySector {
  id: number;
  sectorName: string;
}
