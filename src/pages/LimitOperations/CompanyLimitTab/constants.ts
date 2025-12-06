/**
 * Company Limit Tab Constants
 * Product types and related constants for limit operations
 * Matches legacy ProductTypesList from /types/index.js
 */

/**
 * Product Types List - Matches API response exactly
 * Updated to match https://apitest.figopara.com/types?EnumName=ProductTypes
 */
export const PRODUCT_TYPES = {
  SUPPLIER_FINANCING: 2,
  SME_FINANCING: 3,
  CHEQUES_FINANCING: 4,
  FIGO_KART: 5,
  SPOT_LOAN_FINANCING: 6,
  RECEIVER_FINANCING: 7,
  SPOT_LOAN_FINANCING_WITHOUT_INVOICE: 8,
  REVOLVING_CREDIT: 9,
  FIGO_SKOR: 10,
  COMMERCIAL_LOAN: 11,
  FIGO_SKOR_PRO: 12,
  INSTANT_BUSINESS_LOAN: 13,
} as const;

/**
 * Product Type Names (Turkish) - Matches API response exactly
 * Updated to match https://apitest.figopara.com/types?EnumName=ProductTypes
 */
export const PRODUCT_TYPE_NAMES: Record<number, string> = {
  [PRODUCT_TYPES.SUPPLIER_FINANCING]: 'Tedarikçi Finansmanı',
  [PRODUCT_TYPES.SME_FINANCING]: 'Fatura Finansmanı',
  [PRODUCT_TYPES.CHEQUES_FINANCING]: 'Çek Finansmanı',
  [PRODUCT_TYPES.FIGO_KART]: 'Figo-Kart',
  [PRODUCT_TYPES.SPOT_LOAN_FINANCING]: 'Faturalı Spot Kredi',
  [PRODUCT_TYPES.RECEIVER_FINANCING]: 'Alacak Finansmanı',
  [PRODUCT_TYPES.SPOT_LOAN_FINANCING_WITHOUT_INVOICE]: 'Faturasız Spot Kredi',
  [PRODUCT_TYPES.REVOLVING_CREDIT]: 'Rotatif Kredi',
  [PRODUCT_TYPES.FIGO_SKOR]: 'Figo Skor',
  [PRODUCT_TYPES.COMMERCIAL_LOAN]: 'Taksitli Ticari Kredi',
  [PRODUCT_TYPES.FIGO_SKOR_PRO]: 'Figo Skor Pro',
  [PRODUCT_TYPES.INSTANT_BUSINESS_LOAN]: 'Anında Ticari Kredi',
};

/**
 * Fibabanka Guarantee Rate Options
 * Hardcoded values from legacy CompanyLimitInfos
 */
export const FIBABANKA_GUARANTEE_RATES = [
  { id: 1, Description: '0%', Value: '0' },
  { id: 2, Description: '50%', Value: '50' },
  { id: 3, Description: '100%', Value: '100' },
] as const;

/**
 * Score Validation Modal Types
 * Used in score validation logic
 */
export const SCORE_MODAL_TYPES = {
  NOT_HAVE_SCORE: 'notHaveScore',
  NEGATIVE_SCORE: 'negativeScore',
} as const;

/**
 * Activity Types for Score Validation
 */
export const SCORE_ACTIVITY_TYPES = {
  NOT_HAVE_SCORE: '10',
  NEGATIVE_SCORE: '11',
} as const;

/**
 * Loan Decision Values - Matches API enum values
 */
export const LOAN_DECISIONS = {
  APPROVED: 1,
  REJECTED: 2,
} as const;
