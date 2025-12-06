/**
 * Individual Buyer Limit Form Hook
 * Following OperationPricing form patterns for inline editing
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { BuyerLimitFormData, BuyerLimitItem, UpdateBuyerLimitRequest } from '../company-buyer-limits-tab.types';
import {
  transformBuyerLimitToFormData,
  transformFormDataToBuyerLimitRequest,
  validateBuyerLimitFormData,
} from '../helpers';

interface UseBuyerLimitFormProps {
  /** Original buyer limit data */
  buyerLimit: BuyerLimitItem;

  /** Callback when form is submitted */
  onSubmit?: (updateRequest: UpdateBuyerLimitRequest) => void;

  /** Whether the form is in loading state */
  isLoading?: boolean;
}

/**
 * Hook for managing individual buyer limit row editing
 * Matches legacy inline editing behavior exactly
 */
export const useBuyerLimitForm = ({ buyerLimit, onSubmit, isLoading = false }: UseBuyerLimitFormProps) => {
  const form = useForm<BuyerLimitFormData>({
    defaultValues: transformBuyerLimitToFormData(buyerLimit),
    mode: 'onChange',
  });

  // Reset form when buyer limit changes
  useEffect(() => {
    const formData = transformBuyerLimitToFormData(buyerLimit);
    form.reset(formData);
  }, [buyerLimit, form]);

  // Handle form submission
  const handleSubmit = form.handleSubmit((formData) => {
    // Validate form data
    const validation = validateBuyerLimitFormData(formData);

    if (!validation.isValid) {
      // Set field errors
      for (const error of validation.errors) {
        // Set generic error for now, could be improved with field-specific errors
        form.setError('root', { message: error });
      }
      return;
    }

    // Transform and submit
    const updateRequest = transformFormDataToBuyerLimitRequest(formData, buyerLimit);
    onSubmit?.(updateRequest);
  });

  // Get current form values
  const watchedValues = form.watch();

  // Check if form has changes
  const hasChanges = form.formState.isDirty;

  // Get form errors
  const errors = form.formState.errors;

  return {
    form,
    handleSubmit,
    hasChanges,
    errors,
    isLoading,
    values: watchedValues,
  };
};
