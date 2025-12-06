import type { SupplierQueryFormValues, SupplierQueryRequest } from '../supplier-query.types';

/**
 * Transform form values to API request - matches legacy logic exactly
 */
export const transformSupplierQueryFormToRequest = (values: SupplierQueryFormValues): SupplierQueryRequest => {
  return {
    buyerCode: values.buyerCode.trim(), // Trim whitespace like legacy
  };
};

/**
 * Default form values - matches legacy initialValues exactly
 */
export const supplierQueryDefaultValues: SupplierQueryFormValues = {
  buyerCode: '',
};

/**
 * Validation helper - matches legacy validation logic exactly
 */
export const hasValidSupplierQuery = (values: SupplierQueryFormValues): boolean => {
  const { buyerCode } = values;
  return !!buyerCode.trim(); // Must have non-empty buyer code
};
