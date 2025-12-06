/**
 * Banka Şubesi Excel ile Toplu Ekle Type Definitions
 * Matches legacy BankBranchBulkAdd.js exactly
 */

/**
 * Bank item from GET /banks response
 */
export interface BankItem {
  Id: number;
  Code: string;
  Name: string;
}

/**
 * Bank branch item from GET /banks/branch/search response
 */
export interface BankBranchItem {
  Id: number;
  Code: string;
  Name: string;
  Bank: string;
  City: string | null;
  District: string | null;
}

/**
 * Bank branch search response from GET /banks/branch/search
 */
export interface BankBranchSearchResponse {
  Items: BankBranchItem[];
  Page: number;
  PageSize: number;
  SortType: string;
  Sort: string | null;
  TotalCount: number;
  IsExport: boolean;
  ExtensionData: string | null;
}

/**
 * Branch to add (manual or from excel)
 */
export interface BranchToAdd {
  code: string;
  name: string;
  originalCode?: string;
}

/**
 * Create bank branches bulk request payload for POST /banks/branches/bulk
 */
export interface CreateBankBranchesBulkRequest {
  overWrite: boolean;
  bankId: number;
  branches: BranchToAdd[];
}

/**
 * Excel validation error
 */
export interface ExcelValidationError {
  index: number;
  name: string;
  errors: string[];
}

/**
 * Excel parsed data
 */
export interface ExcelParsedData {
  header: string[];
  data: BranchToAdd[];
}

/**
 * Bank option for dropdown
 */
export interface BankOption {
  value: number;
  label: string;
}
