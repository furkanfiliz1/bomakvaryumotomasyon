/**
 * Company Limit Helpers
 * Business logic and utility functions for Company Limit Tab
 * Following OperationPricing pattern with pure functions
 */

import type {
  CompaniesLimitResponse,
  CompanyLimitInfo,
  EnumOption,
  FibabankaGuaranteeRateOption,
  GuarantorCompanyListItem,
} from '../company-limit-tab.types';

/**
 * Fibabanka guarantee rate options - matches legacy hardcoded values
 */
export const FIBABANKA_GUARANTEE_RATES: FibabankaGuaranteeRateOption[] = [
  { id: 1, Description: '0%', Value: '0' },
  { id: 2, Description: '50%', Value: '50' },
  { id: 3, Description: '100%', Value: '100' },
];

/**
 * Initialize empty company limit info with default values
 * Matches legacy companyLimitInfos initial state
 */
export const getDefaultCompanyLimitInfo = (): CompanyLimitInfo => ({
  InsertedDate: null,
  MaxInvoiceAmount: 0,
  InvoiceScore: 0,
  FinancialScore: 0,
  IsRisk: false,
  IsVDMK: false,
  IsActive: false,
  LimitRejectReasonType: null,
  CreditTerms: '',
  CreditRiskLoanDecision: null,
  FigoScoreLoanDecision: null,
  FibabankaGuaranteeRate: null,
  CreditDeskLoanDecision: null,
  FinalLoanDecision: null,
});

/**
 * Process companies limit API response to match legacy data format
 * Handles null/undefined values with proper defaults
 */
export const processCompaniesLimitResponse = (response: CompaniesLimitResponse): CompanyLimitInfo => {
  const item = response?.Items?.[0];
  if (!item) return getDefaultCompanyLimitInfo();

  return {
    ...item,
    InsertedDate: item.InsertedDate || null,
    MaxInvoiceAmount: item.MaxInvoiceAmount || 0,
    InvoiceScore: item.InvoiceScore || 0,
    FinancialScore: item.FinancialScore || 0,
    IsRisk: item.IsRisk || false,
    IsVDMK: item.IsVDMK || false,
    IsActive: item.IsActive || false,
    LimitRejectReasonType: item.LimitRejectReasonType || null,
    CreditTerms: item.CreditTerms || null,
    CreditRiskLoanDecision: item.CreditRiskLoanDecision || null,
    FigoScoreLoanDecision: item.FigoScoreLoanDecision || null,
    FibabankaGuaranteeRate: item.FibabankaGuaranteeRate,
    CreditDeskLoanDecision: item.CreditDeskLoanDecision || null,
    FinalLoanDecision: item.FinalLoanDecision || null,
  };
};

/**
 * Find enum description by value
 * Used for displaying readable text for dropdown values
 */
export const findEnumDescription = (enumOptions: EnumOption[], value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '-';

  const option = enumOptions.find((option) => Number(option.Value) === Number(value));

  return option?.Description || '-';
};

/**
 * Get product type name by ID
 * Matches legacy translateProductTypeName functionality
 */
export const getProductTypeName = (productTypes: EnumOption[], productTypeId: number): string => {
  return findEnumDescription(productTypes, productTypeId);
};

/**
 * Translate product type name by ID using API data
 * Matches legacy translateProductTypeName helper exactly
 * Now uses API data instead of hardcoded values
 */
export const translateProductTypeName = (
  productType: number | null | undefined,
  productTypes?: EnumOption[],
): string => {
  if (!productType) return '-';

  // If productTypes array is provided, use it for lookup
  if (productTypes && productTypes.length > 0) {
    return findEnumDescription(productTypes, productType);
  }

  // Fallback to hardcoded names for backwards compatibility
  // These match the API response values exactly
  const PRODUCT_TYPE_NAMES: Record<number, string> = {
    2: 'Tedarikçi Finansmanı',
    3: 'Fatura Finansmanı',
    4: 'Çek Finansmanı',
    5: 'Figo-Kart',
    6: 'Faturalı Spot Kredi',
    7: 'Alacak Finansmanı',
    8: 'Faturasız Spot Kredi',
    9: 'Rotatif Kredi',
    10: 'Figo Skor',
    11: 'Taksitli Ticari Kredi',
    12: 'Figo Skor Pro',
    13: 'Anında Ticari Kredi',
  };

  return PRODUCT_TYPE_NAMES[productType] || '-';
};

/**
 * Check if company has valid scores for limit operations
 * Matches legacy controlScore logic
 */
export const checkScoreValidation = (
  creditRiskLoanDecision: number | null,
  figoScoreLoanDecision: number | null,
): {
  canProceed: boolean;
  requiresConfirmation: boolean;
  warningMessage?: string;
  modalType?: string;
  activityType?: string;
} => {
  // Case 1: Has credit risk decision but no figo score
  if (creditRiskLoanDecision !== null && figoScoreLoanDecision === null) {
    return {
      canProceed: false,
      requiresConfirmation: true,
      warningMessage: 'Figo skor bilgisi bulunmamaktadır. Devam etmek istiyor musunuz?',
    };
  }

  // Case 2: No scores at all
  if (creditRiskLoanDecision === null && figoScoreLoanDecision === null) {
    return {
      canProceed: false,
      requiresConfirmation: true,
      modalType: 'notHaveScore',
      activityType: '10',
    };
  }

  // Case 3: Negative figo score (rejection)
  if (figoScoreLoanDecision === 2) {
    return {
      canProceed: false,
      requiresConfirmation: true,
      modalType: 'negativeScore',
      activityType: '11',
    };
  }

  // Case 4: Can proceed without confirmation
  return {
    canProceed: true,
    requiresConfirmation: false,
  };
};

/**
 * Calculate total limits and usage statistics
 * Used for dashboard data processing
 */
export const calculateLimitStatistics = (
  limitData: GuarantorCompanyListItem[],
): {
  totalAmount: number;
  totalUsedLimit: number;
  totalRemainingLimit: number;
} => {
  return limitData.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + (item.Amount || 0),
      totalUsedLimit: acc.totalUsedLimit + (item.UsedLimit || 0),
      totalRemainingLimit: acc.totalRemainingLimit + (item.RemainingLimit || 0),
    }),
    { totalAmount: 0, totalUsedLimit: 0, totalRemainingLimit: 0 },
  );
};

/**
 * Format currency value for display
 * Matches legacy FormattedNumber formatting
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '₺0,00';
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Format date for display
 * Matches legacy moment formatting pattern
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '';

  try {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

/**
 * Validate form field values
 * Matches legacy validation logic
 */
export const validateField = (fieldName: string, value: unknown): string | null => {
  switch (fieldName) {
    case 'MaxInvoiceAmount':
      if (typeof value === 'number' && value < 0) {
        return "Tutar 0'dan küçük olamaz";
      }
      break;

    case 'InvoiceScore':
    case 'FinancialScore':
      if (typeof value === 'number' && (value < 0 || value > 100)) {
        return 'Skor 0-100 arasında olmalıdır';
      }
      break;

    case 'FibabankaGuaranteeRate':
      if (value !== null && typeof value === 'number' && ![0, 50, 100].includes(value)) {
        return 'Geçersiz garanti oranı';
      }
      break;

    default:
      break;
  }

  return null;
};

/**
 * Check if limit operation has validation errors
 * Matches legacy form validation
 */
export const validateLimitOperation = (data: {
  selectedProduct?: number | null;
  selectedFinancer?: number | null;
  totalLimit?: number | null;
  roofLimitData?: GuarantorCompanyListItem[];
}): {
  isValid: boolean;
  errorMessage?: string;
} => {
  const { selectedProduct, selectedFinancer, totalLimit, roofLimitData } = data;

  // Check roof limit validation
  if (!roofLimitData || roofLimitData.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Tavan limit tanımı yapılması gerekmektedir.',
    };
  }

  // Check required fields
  if (!selectedProduct || !selectedFinancer || !totalLimit) {
    return {
      isValid: false,
      errorMessage: 'Tüm alanlar doldurulmalıdır.',
    };
  }

  return { isValid: true };
};

/**
 * Clean object by removing null/empty values
 * Matches legacy emptyOrNullRemoveQuery functionality
 */
export const cleanObjectForSubmission = (obj: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
};
