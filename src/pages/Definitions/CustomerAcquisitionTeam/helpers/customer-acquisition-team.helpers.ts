/**
 * Customer Acquisition Team Helper Functions
 * Business logic and validation utilities
 */

import type { CustomerAcquisitionTeamFormData } from '../customer-acquisition-team.types';

/**
 * Get initial form values
 */
export const getInitialFormValues = (): CustomerAcquisitionTeamFormData => {
  return {
    Name: '',
  };
};

/**
 * Validate create form data
 * Matches legacy validation: Name required (not empty)
 */
export const validateCreateForm = (
  formData: CustomerAcquisitionTeamFormData,
): { isValid: boolean; errorMessage: string | null } => {
  if (!formData.Name || formData.Name.trim() === '') {
    return { isValid: false, errorMessage: 'Müşteri Kazanım Ekibi Üye Adı boş bırakılamaz' };
  }
  return { isValid: true, errorMessage: null };
};

/**
 * Validate update item data
 * Matches legacy validation for update
 */
export const validateUpdateItem = (name: string): { isValid: boolean; errorMessage: string | null } => {
  if (!name || name.trim() === '') {
    return { isValid: false, errorMessage: 'Müşteri Kazanım Ekibi Üye Adı boş bırakılamaz' };
  }
  return { isValid: true, errorMessage: null };
};
