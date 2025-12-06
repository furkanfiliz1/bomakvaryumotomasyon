/**
 * Roof Limit Form Hook
 * Custom hook for managing roof limit form for adding new peak limits
 * Matches legacy RoofLimit.js form behavior exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useCompanyLimitDropdownData } from './useCompanyLimitDropdownData';

/**
 * Custom hook for Roof Limit form management
 * Provides form for adding new roof limits (product selection + amount)
 */
export const useRoofLimitForm = () => {
  // Get dropdown data for form fields
  const { productTypes } = useCompanyLimitDropdownData();

  // Initial form values with useMemo for performance
  const initialValues = useMemo(
    () => ({
      selectedProduct: '',
      TotalLimit: 0,
    }),
    [],
  );

  // Form validation schema matching legacy validation
  const schema = yup.object({
    // Product Type Selection
    selectedProduct: fields
      .select(productTypes || [], 'number', ['Value', 'Description'])
      .required('Ürün seçimi zorunludur')
      .label('Ürün')
      .meta({ col: 4 }),

    // Total Limit Amount
    TotalLimit: fields.currency
      .required('Toplam limit zorunludur')
      .min(1, "Toplam limit 0'dan büyük olmalıdır")
      .label('Toplam Limit')
      .meta({
        col: 4,
        currency: 'TRY',
      }),
  });

  // Create form with validation
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  // Reset form to initial state
  const resetForm = useCallback(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  return {
    form,
    schema,
    resetForm,
  };
};
