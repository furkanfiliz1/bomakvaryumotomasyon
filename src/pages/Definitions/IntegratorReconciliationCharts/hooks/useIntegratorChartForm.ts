/**
 * Integrator Chart Form Hook
 * Manages form state and submission logic using Form component with Yup schema
 * Following forms.instructions.md and OperationPricing patterns
 */

import { fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { validateFeeExclusivity } from '../helpers';
import { useCreateIntegratorChartMutation, useGetIntegratorChartsQuery } from '../integrator-reconciliation-charts.api';
import type { IntegratorChartFormData } from '../integrator-reconciliation-charts.types';

export function useIntegratorChartForm() {
  const notice = useNotice();

  // RTK Query hooks
  const { data, isLoading, error, refetch } = useGetIntegratorChartsQuery();
  const [createChart, { isLoading: isCreating, error: createError }] = useCreateIntegratorChartMutation();

  useErrorListener(createError);
  // Initial form values
  const initialValues: IntegratorChartFormData = {
    minAmount: null,
    maxAmount: null,
    transactionFee: null,
    percentFee: null,
  };

  // Form schema following forms.instructions.md patterns
  const schema = useMemo(
    () =>
      yup.object({
        minAmount: fields.currency
          .nullable()
          .required('Min. Tutar zorunludur')
          .label('Min. Tutar')
          .meta({ col: 3, currency: 'TRY' }),
        maxAmount: fields.currency
          .nullable()
          .required('Max. Tutar zorunludur')
          .label('Max. Tutar')
          .meta({ col: 3, currency: 'TRY' }),
        percentFee: fields.number
          .nullable()
          .label('İşlem Ücreti (%)')
          .meta({ col: 2, inputType: 'number' })
          .min(0, 'Yüzde ücret 0 veya daha büyük olmalıdır')
          .max(100, 'Yüzde ücret 100 veya daha küçük olmalıdır'),
        transactionFee: fields.currency.nullable().label('İşlem Ücreti (Birim)').meta({ col: 2, currency: 'TRY' }),
      }) as yup.ObjectSchema<IntegratorChartFormData>,
    [],
  );

  // React Hook Form setup
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  /**
   * Handle form submission
   * Matches legacy postIntegratorCharts with validation and error handling
   */
  const handleSubmit = async (formData: IntegratorChartFormData) => {
    const requestData = {
      minAmount: formData.minAmount,
      maxAmount: formData.maxAmount,
      transactionFee: formData.transactionFee,
      percentFee: formData.percentFee,
    };

    // Validate fee exclusivity (legacy validation rule)
    const validation = validateFeeExclusivity(requestData.percentFee, requestData.transactionFee);

    if (!validation.isValid) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: validation.errorMessage || 'Geçersiz form verileri',
      });
      return;
    }

    try {
      await createChart(requestData).unwrap();

      // Success notification matching legacy
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Entegratör mutabakat baremi eklendi',
      });

      // Clear form and refetch data (matches legacy behavior)
      form.reset();
      refetch();
    } catch (err: unknown) {
      // Error notification matching legacy
      console.log(err);
    }
  };

  return {
    form,
    schema,
    handleSubmit,
    isCreating,
    data: data?.Items || [],
    isLoading,
    error,
    refetch,
  };
}
