/**
 * İş Bankası Oranları (Is Bank Rates) Type Definitions
 * Matches legacy Rates.js exactly
 */

/**
 * İş Bankası rate item from GET /currencies/monthlyAverage response
 */
export interface IsBankRateItem {
  Id: number;
  Year: number;
  Month: number;
  CurrencyId: number;
  BuyingRate: number;
}

/**
 * Create İş Bankası rate request payload for POST /currencies
 */
export interface CreateIsBankRateRequest {
  Year: number;
  Month: number;
  BuyingRate: number;
  CurrencyId: number;
}

/**
 * Update İş Bankası rate request payload for PUT /currencies/{id}
 */
export interface UpdateIsBankRateRequest {
  Id: number;
  Year: number;
  Month: number;
  BuyingRate: number;
  CurrencyId: number;
}

/**
 * Form data for create İş Bankası rate form
 */
export interface IsBankRateFormData {
  Year: string;
  Month: string;
  BuyingRate: string;
}

/**
 * Year option for dropdown
 */
export interface YearOption {
  value: string;
  label: string;
}
