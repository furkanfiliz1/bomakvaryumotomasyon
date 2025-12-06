import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { fields } from '../../../components/common/Form';
import { useGetPassiveReasonsQuery } from '../companies.api';

export interface PassiveStatusReasonFormData {
  PassiveStatusReason: string;
}

export const usePassiveStatusReasonForm = (onSubmit: (reasonValue: string) => void, onClose?: () => void) => {
  // Fetch passive reasons
  const { data: passiveReasons = [], isLoading: isLoadingReasons } = useGetPassiveReasonsQuery();

  const schema = useMemo(() => {
    return yup.object({
      PassiveStatusReason: fields
        .select(
          passiveReasons.map((reason) => ({
            value: reason.Value,
            label: reason.Description,
          })),
          'string',
          ['value', 'label'],
        )
        .required('Pasif olma nedeni zorunludur')
        .label('Pasif Olma Nedeni')
        .meta({ col: 12 }),
    });
  }, [passiveReasons]);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      PassiveStatusReason: '',
    } as PassiveStatusReasonFormData,
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const values = form.getValues();
      onSubmit(values.PassiveStatusReason);
      // Modal'ı kapat
      if (onClose) {
        onClose();
      }
    }
  }, [form, onSubmit, onClose]);

  const handleReset = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    form,
    schema,
    handleSubmit,
    handleReset,
    isLoadingReasons,
  };
};
