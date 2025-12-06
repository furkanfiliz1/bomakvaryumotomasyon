import type { TtkLimitQueryFormValues, TtkLimitQueryRequest } from '../ttk-limit-query.types';

/**
 * Transform form values to API request format
 */
export const transformTtkLimitFormToRequest = (values: TtkLimitQueryFormValues): TtkLimitQueryRequest => ({
  ...values,
  PhoneNumber: values.PhoneNumber.replace(/\s/g, ''), // Remove spaces from phone number
  IsExistCustomer: values.IsExistCustomer === 'YES',
});

/**
 * Format currency for display
 */
export const formatTtkLimitCurrency = (amount: number | undefined): string => {
  if (!amount) return '-';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

/**
 * Validate if company has valid limit
 */
export const hasValidTtkLimit = (response: { Term?: number; AvailableLimit?: number }): boolean => {
  return !!(response?.Term && response?.AvailableLimit && response.AvailableLimit > 0);
};

/**
 * Default form values
 */
export const ttkLimitQueryDefaultValues: TtkLimitQueryFormValues = {
  NationalIdentityNumber: '',
  TaxNumber: '',
  BirthDate: '',
  PhoneNumber: '',
  searchType: 'PERSON',
  IsExistCustomer: 'YES',
};
