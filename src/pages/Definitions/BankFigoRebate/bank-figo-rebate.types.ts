/**
 * Bank Figo Rebate Type Definitions
 * Matches legacy BankFigoRebate.js exactly
 */

/**
 * Bank Figo Rebate item from GET /financer/rebate response
 */
export interface BankFigoRebateItem {
  Id: number;
  FinancerCompanyId: number;
  StartDate: string;
  FinishDate: string | null;
  Rate: number;
  FinancerCompanyName: string;
}

/**
 * Create rebate request payload for POST /financer/rebate
 */
export interface CreateBankFigoRebateRequest {
  FinancerCompanyId: number;
  StartDate: string;
  FinishDate: string | null;
  Rate: number;
}

/**
 * Update rebate request payload for PUT /financer/rebate
 */
export interface UpdateBankFigoRebateRequest {
  Id: number;
  FinancerCompanyId: number;
  StartDate: string;
  FinishDate: string | null;
  Rate: number;
  FinancerCompanyName: string;
}

/**
 * Form data for create rebate form
 */
export interface BankFigoRebateFormData {
  FinancerCompanyId: string;
  StartDate: string;
  FinishDate: string;
  Rate: string;
}

/**
 * Financer company option for dropdown
 */
export interface FinancerCompanyOption {
  Id: number;
  CompanyName: string;
}
