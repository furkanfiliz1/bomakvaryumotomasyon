import type { RevolvingLoanLimitsFormValues, RevolvingLoanLimitsRequest } from '../revolving-loan-limits.types';

/**
 * Transform form values to API request - matches legacy logic exactly (no transformation needed)
 */
export const transformRevolvingLoanFormToRequest = (
  values: RevolvingLoanLimitsFormValues,
): RevolvingLoanLimitsRequest => {
  return {
    ...values, // Simple pass-through, no transformation needed for revolving loan
  };
};

/**
 * Default form values - matches legacy initialValues exactly
 */
export const revolvingLoanLimitsDefaultValues: RevolvingLoanLimitsFormValues = {
  Identifier: '',
};

/**
 * Validation helper - matches legacy validation logic exactly
 */
export const hasValidRevolvingLoanSearch = (values: RevolvingLoanLimitsFormValues): boolean => {
  const { Identifier } = values;
  return !!Identifier; // Must have identifier
};

/**
 * Format currency for display - matches legacy FormattedNumber display
 */
export const formatRevolvingLoanCurrency = (amount: number | undefined): string => {
  if (!amount) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};
