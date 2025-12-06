import { ProductTypesList } from '../constants';
import type {
  CreateOperationChargeRequest,
  GetOperationChargeByIdResponse,
  OperationChargeFormData,
} from '../operation-charge.types';

/**
 * Check if score fields should be disabled based on product type
 * Matches legacy logic: isNotifyBuyerEqualToOne
 */
export const isScoreDisabled = (productType: string | number): boolean => {
  const numericProductType = typeof productType === 'string' ? parseInt(productType, 10) : productType;
  return (
    numericProductType === ProductTypesList.SUPPLIER_FINANCING ||
    numericProductType === ProductTypesList.RECEIVER_FINANCING
  );
};

/**
 * Format company search result for display
 * Matches legacy customValueContainer pattern
 */
export const formatCompanyOption = (company: { CompanyName?: string; Identifier?: string }): string => {
  const name = company.CompanyName ?? '-';
  const identifier = company.Identifier ?? '-';
  return `${name} / ${identifier}`;
};

/**
 * Transform API response to form data
 * In edit mode, VKN/Ünvan fields will show "VKN - NAME" format when both are available
 * For empty values, shows appropriate fallback text (matching legacy behavior)
 */
export const transformApiResponseToFormData = (apiData: GetOperationChargeByIdResponse): OperationChargeFormData => {
  // Helper function to format VKN/Ünvan display text with fallback for empty values
  const formatVknUnvan = (
    identifier: string | null | undefined,
    name: string | null | undefined,
    fallbackText: string = '',
  ): string => {
    if (!identifier) return fallbackText;
    if (name) return `${identifier} - ${name}`;
    return identifier;
  };

  return {
    ProductType: String(apiData.ProductType ?? ''),
    SenderIdentifier: formatVknUnvan(apiData.SenderIdentifier, apiData.SenderName, 'Tüm Satıcılar'),
    ReceiverIdentifier: formatVknUnvan(apiData.ReceiverIdentifier, apiData.ReceiverName),
    FinancerIdentifier: apiData.FinancerIdentifier
      ? [formatVknUnvan(apiData.FinancerIdentifier, apiData.FinancerName, 'Tüm Finansörler')]
      : [], // Changed to array format for multiple selection
    TransactionType: String(apiData.TransactionType ?? '2'),
    PaymentType: apiData.PaymentType ?? 1,
    OperationChargeDefinitionType: apiData.OperationChargeDefinitionType
      ? String(apiData.OperationChargeDefinitionType)
      : '',
    ChargeCompanyType: apiData.ChargeCompanyType ?? 1,
    IsDaily: apiData.IsDaily ?? false,
  };
};

/**
 * Transform form data to API request format
 * Uses extractIdentifierFromFormValue to handle fallback texts properly
 * For FinancerIdentifier (now array), takes the first item or empty string
 */
export const transformFormDataToApiRequest = (formData: OperationChargeFormData): CreateOperationChargeRequest => ({
  FinancerIdentifier: extractIdentifierFromArrayFormValue(formData.FinancerIdentifier),
  ReceiverIdentifier: extractIdentifierFromFormValue(formData.ReceiverIdentifier),
  SenderIdentifier: extractIdentifierFromFormValue(formData.SenderIdentifier),
  TransactionType: formData.TransactionType,
  PaymentType: formData.PaymentType,
  OperationChargeDefinitionType: formData.OperationChargeDefinitionType,
  ChargeCompanyType: formData.ChargeCompanyType,
  IsDaily: formData.IsDaily,
  ProductType: formData.ProductType,
  OperationChargeAmounts: [], // Will be filled separately
});

/**
 * Extract identifier from form value
 * Form fields can contain formatted strings like "10101010102 - Company Name"
 * We need to extract just the identifier part for API calls
 * Handles fallback texts like "Tüm Satıcılar", "Tüm Alıcılar", "Tüm Finansörler"
 */
export const extractIdentifierFromFormValue = (formValue: string | null | undefined): string => {
  if (!formValue) return '';

  // Handle fallback texts - return empty string for "Tüm..." values (matching legacy behavior)
  if (formValue === 'Tüm Satıcılar' || formValue === 'Tüm Alıcılar' || formValue === 'Tüm Finansörler') {
    return '';
  }

  // If it contains " - ", extract the part before it (VKN)
  const parts = formValue.split(' - ');
  return parts[0].trim();
};

/**
 * Extract identifier from array form value (for multiple select)
 * Takes the first selected identifier or returns empty string
 * Used for FinancerIdentifier which is now a multiple select
 */
export const extractIdentifierFromArrayFormValue = (formValues: string[] | null | undefined): string => {
  if (!formValues || !Array.isArray(formValues) || formValues.length === 0) return '';

  // Take the first selected identifier and ensure it's treated as string to preserve leading zeros
  const firstValue = String(formValues[0]);
  return extractIdentifierFromFormValue(firstValue);
};

/**
 * Validate amount helper matching legacy maxAmountHelper from formValidationHelper.js
 * Enforces maximum amount of 99999999999.99
 */
export const maxAmountHelper = (value: number | string): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 0;

  // Enforce max limit from legacy formValidationHelper.js
  const MAX_AMOUNT = 99999999999.99;
  return numValue > MAX_AMOUNT ? MAX_AMOUNT : numValue;
};

/**
 * Check if form has unsaved changes
 */
export const hasUnsavedChanges = (
  formData: OperationChargeFormData,
  originalData: OperationChargeFormData | null,
): boolean => {
  if (!originalData) return true;

  // Compare key fields
  const fieldsToCompare = [
    'ProductType',
    'TransactionType',
    'PaymentType',
    'OperationChargeDefinitionType',
    'ChargeCompanyType',
    'IsDaily',
  ];

  for (const field of fieldsToCompare) {
    const key = field as keyof OperationChargeFormData;
    if (formData[key] !== originalData[key]) {
      return true;
    }
  }

  // Compare company identifiers (now strings)
  if (formData.SenderIdentifier !== originalData.SenderIdentifier) {
    return true;
  }
  if (formData.ReceiverIdentifier !== originalData.ReceiverIdentifier) {
    return true;
  }
  if (formData.FinancerIdentifier !== originalData.FinancerIdentifier) {
    return true;
  }

  return false;
};
