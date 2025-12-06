/**
 * Shared Buyer Limit Form Hook using simple state management
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { BuyerLimitFormData, BuyerLimitItem } from '../company-buyer-limits-tab.types';
import { transformBuyerLimitToFormData } from '../helpers';

interface UseBuyerLimitFormProps {
  /** Original buyer limit data */
  buyerLimit: BuyerLimitItem;
}

/**
 * Hook for managing buyer limit form - creates form instance per component
 * Each input component will have its own form but they track the same item
 */
export const useSharedBuyerLimitForm = ({ buyerLimit }: UseBuyerLimitFormProps) => {
  const form = useForm<BuyerLimitFormData>({
    defaultValues: transformBuyerLimitToFormData(buyerLimit),
    mode: 'onChange',
  });

  // Reset form when buyer limit changes
  useEffect(() => {
    const formData = transformBuyerLimitToFormData(buyerLimit);
    form.reset(formData);
  }, [buyerLimit, form]);

  const hasChanges = form.formState.isDirty;

  return {
    form,
    hasChanges,
  };
};
