import type { SpotLoanLimitsFormValues, SpotLoanLimitsRequest } from '../spot-loan-limits.types';

/**
 * Transform form values to API request - matches legacy logic exactly
 */
export const transformSpotLoanFormToRequest = (values: SpotLoanLimitsFormValues): SpotLoanLimitsRequest => {
  return {
    ...values,
    PhoneNumber: values.PhoneNumber.replace(/\s/g, ''), // Remove spaces from phone
    IsExistCustomer: values.IsExistCustomer === 'YES', // Convert string to boolean
  };
};

/**
 * Default form values - matches legacy initialValues exactly
 */
export const spotLoanLimitsDefaultValues: SpotLoanLimitsFormValues = {
  NationalIdentityNumber: '',
  TaxNumber: '',
  BirthDate: '',
  PhoneNumber: '',
  searchType: 'PERSON',
  IsExistCustomer: 'YES',
};

/**
 * Validation helper - matches legacy validation logic exactly
 */
export const hasValidSpotLoanSearch = (values: SpotLoanLimitsFormValues): boolean => {
  const { NationalIdentityNumber, TaxNumber, searchType, IsExistCustomer, PhoneNumber, BirthDate } = values;

  if (!NationalIdentityNumber) return false;
  if (searchType === 'COMPANY' && !TaxNumber) return false;
  if (IsExistCustomer === 'NO' && !PhoneNumber) return false;
  if (IsExistCustomer === 'NO' && !BirthDate) return false;

  return true;
};

/**
 * Format currency for display - matches legacy FormattedNumber display
 */
export const formatSpotLoanCurrency = (amount: number | undefined): string => {
  if (!amount) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};
