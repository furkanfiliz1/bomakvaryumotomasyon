import { useState } from 'react';
import type { LimitsToPassiveFormData } from '../other-operations.types';

/**
 * Custom hook for Limits to Passive form management
 * Following legacy state management patterns exactly
 */
export const useLimitsToPassiveForm = () => {
  // Form state following updated structure with direct VKN/TCKN input
  const [formData, setFormData] = useState<LimitsToPassiveFormData>({
    companyIdentifier: '',
    FinancerCompanyId: null,
    ProductType: null,
  });

  // Identifier list state (parsed from identifiers string)
  const [identifierList, setIdentifierList] = useState<string[]>([]);

  // Error list (failed identifiers from API response)
  const [errorList, setErrorList] = useState<string[]>([]);

  // Update form field
  const updateFormField = <K extends keyof LimitsToPassiveFormData>(field: K, value: LimitsToPassiveFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset all form data and lists
  const resetForm = () => {
    setFormData({
      companyIdentifier: '',
      FinancerCompanyId: null,
      ProductType: null,
    });
    setIdentifierList([]);
    setErrorList([]);
  };

  // Remove identifier from list
  const removeIdentifier = (identifier: string) => {
    setIdentifierList((prev) => prev.filter((id) => id !== identifier));
  };

  return {
    // Form state
    formData,
    identifierList,
    errorList,

    // Form actions
    updateFormField,
    setIdentifierList,
    setErrorList,
    resetForm,
    removeIdentifier,
  };
};
