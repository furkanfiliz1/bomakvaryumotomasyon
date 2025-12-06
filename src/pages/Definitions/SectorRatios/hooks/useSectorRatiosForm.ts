/**
 * Sector Ratios Form Hook
 * Form management for add/edit ratio tally modals
 * Follows OperationPricing pattern using Form component
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Ratio, RatioTally, RatioTallyFormData } from '../sector-ratios.types';

interface UseSectorRatiosFormProps {
  ratioList: Ratio[];
  initialData?: RatioTally | null;
  isEdit?: boolean;
}

export const useSectorRatiosForm = ({ ratioList, initialData, isEdit = false }: UseSectorRatiosFormProps) => {
  // Transform ratio list for select field
  const ratioOptions = useMemo(
    () =>
      ratioList.map((ratio) => ({
        value: String(ratio.id),
        label: ratio.name,
      })),
    [ratioList],
  );

  // Initial form values
  const initialValues: RatioTallyFormData = useMemo(
    () => ({
      ratioId: initialData ? String(initialData.ratioId) : '',
      point: initialData ? String(initialData.point) : '',
      min: initialData ? String(initialData.min) : '',
      max: initialData ? String(initialData.max) : '',
    }),
    [initialData],
  );

  // Form schema with validation
  const schema = useMemo(() => {
    return yup.object({
      ratioId: fields
        .select(ratioOptions, 'string', ['value', 'label'])
        .required('Rasyo seçimi zorunludur')
        .label('Rasyo Adı')
        .meta({ col: 12, disabled: isEdit }),
      point: fields.text.required('Puan zorunludur').label('Puan').meta({ col: 4 }),
      min: fields.text.required('Min değeri zorunludur').label('Min').meta({ col: 4 }),
      max: fields.text.required('Max değeri zorunludur').label('Max').meta({ col: 4 }),
    });
  }, [isEdit, ratioOptions]);

  const form = useForm<RatioTallyFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form with new data - memoized to prevent infinite loops
  const resetForm = useCallback(
    (data?: RatioTally | null) => {
      if (data) {
        form.reset({
          ratioId: String(data.ratioId),
          point: String(data.point),
          min: String(data.min),
          max: String(data.max),
        });
      } else {
        form.reset({
          ratioId: '',
          point: '',
          min: '',
          max: '',
        });
      }
    },
    [form],
  );

  return {
    form,
    schema,
    resetForm,
    ratioOptions,
  };
};

export default useSectorRatiosForm;
