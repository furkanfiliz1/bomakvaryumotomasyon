/**
 * Limits to Passive Business Logic Helpers
 * Following OperationPricing helper patterns exactly
 */

/**
 * Validates and parses identifiers from input string
 * Matches legacy validation logic exactly
 */
export const parseIdentifiers = (input: string): string[] => {
  if (!input?.trim()) return [];

  const identifiersList: string[] = [];
  const newList = input.trim().split(' ');

  newList.forEach((item) => {
    // Check for 10 or 11 characters (legacy logic)
    if (item.length === 10 || item.length === 11) {
      const reg = new RegExp('^[0-9]+$');
      const numberControl = reg.test(item);

      // Check if it's a number
      if (numberControl) {
        if (!identifiersList.includes(item)) {
          identifiersList.push(item);
        }
      }
    }
  });

  return identifiersList;
};

/**
 * Validates form data before submission
 * Following legacy validation rules
 */
export const validateLimitsToPassiveForm = (
  identifierList: string[],
  financerCompanyId: number | null,
  productType: number | null,
): { isValid: boolean; message?: string } => {
  if (identifierList.length === 0) {
    return { isValid: false, message: 'En az bir geçerli şirket kimlik numarası girmelisiniz' };
  }

  if (!financerCompanyId) {
    return { isValid: false, message: 'Finansörü seçmelisiniz' };
  }

  if (!productType) {
    return { isValid: false, message: 'Ürün tipini seçmelisiniz' };
  }

  return { isValid: true };
};

/**
 * Transforms dropdown data for react-select
 * Following OperationPricing patterns
 */
export const transformFinancerOptions = (financers: Array<{ Id: number; CompanyName: string }>) =>
  financers.map((financer) => ({
    value: financer.Id,
    label: financer.CompanyName,
  }));

export const transformProductTypeOptions = (productTypes: Array<{ Value: string; Description: string }>) =>
  productTypes
    .map((item) => ({
      value: parseInt(item.Value, 10),
      label: item.Description,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Determines status class for identifier display
 * Matches legacy visual feedback
 */
export const getIdentifierStatusClass = (identifier: string, errorList: string[]): string => {
  if (errorList.includes(identifier)) {
    return 'shadow-red'; // Error state
  }
  if (errorList.length > 0) {
    return 'shadow-green'; // Success state (when there are errors but this identifier is not in error list)
  }
  return ''; // Default state
};

/**
 * Creates the API request payload
 * Following legacy request format exactly
 */
export const createLimitsToPassiveRequest = (
  identifiers: string[],
  financerCompanyId: number,
  productType: number,
) => ({
  Identifiers: identifiers,
  FinancerCompanyId: financerCompanyId,
  ProductType: productType,
});
