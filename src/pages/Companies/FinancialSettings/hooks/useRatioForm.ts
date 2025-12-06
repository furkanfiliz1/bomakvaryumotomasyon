import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductTypes } from '@types';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface RatioFormData {
  SystemRatio: number;
  FinancerRatio: number;
  MinAmount: number | null;
  MaxAmount: number | null;
}

/**
 * Custom hook for Ratio form management
 * Following OperationPricing patterns with Form component integration
 * Supports product-type specific field visibility (like AddRatio.js)
 */
export const useRatioForm = (productType: ProductTypes) => {
  // Initial form values
  const initialValues: RatioFormData = useMemo(
    () => ({
      SystemRatio: 0,
      FinancerRatio: 0,
      MinAmount: null,
      MaxAmount: null,
    }),
    [],
  );

  // Form schema with validation
  // Hide limit fields for CHEQUES_FINANCING like in AddRatio.js
  const showLimitFields = productType !== ProductTypes.CHEQUES_FINANCING;

  const schema = useMemo(
    () =>
      yup.object({
        SystemRatio: fields.number
          .required('Zorunlu alan')
          .min(0, 'Minimum 0 olabilir')
          .max(100, 'Maximum 100 olabilir')
          .label('Figo Oranı')
          .meta({ col: showLimitFields ? 3 : 6, endAdornmentText: '%' }),

        FinancerRatio: fields.number
          .required('Zorunlu alan')
          .min(0, 'Minimum 0 olabilir')
          .max(100, 'Maximum 100 olabilir')
          .label('Banka Oranı')
          .meta({ col: showLimitFields ? 3 : 6, endAdornmentText: '%' }),

        MinAmount: fields.currency
          .nullable()
          .label('En Düşük Tutar')
          .meta({ col: 3, currency: 'TRY', visible: showLimitFields }),

        MaxAmount: fields.currency
          .nullable()
          .label('En Yüksek Tutar')
          .meta({ col: 3, currency: 'TRY', visible: showLimitFields }),
      }),
    [showLimitFields],
  );

  // Create form instance
  const form = useForm<RatioFormData>({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  // Reset form to initial values
  const resetForm = () => {
    form.reset(initialValues);
  };

  return {
    form,
    schema,
    resetForm,
  };
};
