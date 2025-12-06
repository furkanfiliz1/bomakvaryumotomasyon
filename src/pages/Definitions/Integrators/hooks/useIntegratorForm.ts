/**
 * Integrator Form Hook
 * Form management for add/edit integrator
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { IntegratorDetail, IntegratorFormData } from '../integrators.types';

interface UseIntegratorFormProps {
  integrationTypeOptions: Array<{ value: string; label: string }>;
  parentIntegratorOptions: Array<{ value: string; label: string }>;
  initialData?: IntegratorDetail | null;
  isEdit?: boolean;
}

export const useIntegratorForm = ({
  integrationTypeOptions,
  parentIntegratorOptions,
  initialData,
  isEdit = false,
}: UseIntegratorFormProps) => {
  // Initial form values
  const initialValues: IntegratorFormData = useMemo(
    () => ({
      Identifier: initialData?.Identifier || '',
      Name: initialData?.Name || '',
      IsActive: initialData?.IsActive || false,
      IsBackground: initialData?.IsBackground || false,
      Type: initialData?.Type ? String(initialData.Type) : '',
      ParentId: initialData?.ParentId ? String(initialData.ParentId) : '',
    }),
    [initialData],
  );

  // Form schema with validation
  const schema = useMemo(() => {
    return yup.object({
      Identifier: fields.text
        .required('Vergi numarası zorunludur')
        .matches(/^\d{10,11}$/, 'Vergi numarası 10-11 haneli olmalıdır')
        .label('Vergi No')
        .meta({ col: 12 }),
      Name: fields.text.required('Entegratör adı zorunludur').label('Entegratör Adı').meta({ col: 12 }),
      IsActive: fields.checkbox.label('Aktif').meta({ col: 6, mt: 1 }),
      IsBackground: fields.checkbox.label('Arkaplan').meta({ col: 6, mt: 1 }),
      Type: fields
        .select(integrationTypeOptions, 'string', ['value', 'label'])
        .required('Entegratör tipi zorunludur')
        .label('Entegratör Tipi')
        .meta({ col: 12 }),
      ParentId: fields
        .select(parentIntegratorOptions, 'string', ['value', 'label'])
        .label('Üst Entegratör')
        .meta({ col: 12 }),
    });
  }, [integrationTypeOptions, parentIntegratorOptions]);

  const form = useForm<IntegratorFormData>({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  // Reset form with new data
  const resetForm = useCallback(
    (data?: IntegratorDetail | null) => {
      if (data) {
        form.reset({
          Identifier: data.Identifier,
          Name: data.Name,
          IsActive: data.IsActive,
          IsBackground: data.IsBackground,
          Type: String(data.Type),
          ParentId: data.ParentId ? String(data.ParentId) : '',
        });
      } else {
        form.reset({
          Identifier: '',
          Name: '',
          IsActive: false,
          IsBackground: false,
          Type: '',
          ParentId: '',
        });
      }
    },
    [form],
  );

  return {
    form,
    schema,
    resetForm,
    isEdit,
  };
};

export default useIntegratorForm;
