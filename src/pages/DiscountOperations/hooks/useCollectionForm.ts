import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { CollectionPaymentDetail } from '../discount-operations.types';

interface CollectionFormData {
  chargedAmount: number;
  chargedAmountDate: string;
}

/**
 * Hook for managing collection form state and validation
 * Following OperationPricing form patterns with React Hook Form + Yup validation
 */
export const useCollectionForm = () => {
  // Initial values - stable defaults
  const initialValues: CollectionFormData = {
    chargedAmount: 0,
    chargedAmountDate: new Date().toISOString().split('T')[0],
  };

  // Form schema following OperationPricing pattern exactly - memoized for stability
  const schema = useMemo(() => {
    return yup.object({
      chargedAmountDate: fields.date.required('Tahsilat tarihi zorunludur').label('Tahsilat Tarihi').meta({ col: 6 }),

      chargedAmount: fields.currency
        .required('Tahsilat tutarı zorunludur')
        .min(0.01, "Tahsilat tutarı 0'dan büyük olmalıdır")
        .label('Tahsilat Tutarı')
        .meta({ col: 6, currency: 'TRY' }), // Default currency, will be updated via form
    });
  }, []); // Empty deps for stable schema

  const form = useForm<CollectionFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form when selected detail changes
  const resetForm = (detail?: CollectionPaymentDetail | null) => {
    const newValues: CollectionFormData = {
      chargedAmount: detail ? detail.PayableAmount - detail.ChargedAmount : 0,
      chargedAmountDate: new Date().toISOString().split('T')[0],
    };
    form.reset(newValues);
  };

  return {
    form,
    schema,
    resetForm,
  };
};
