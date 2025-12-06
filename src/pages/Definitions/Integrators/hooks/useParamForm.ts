/**
 * Param Form Hook
 * Form management for adding integrator parameters
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { ParamFormData } from '../integrators.types';

interface UseParamFormProps {
  dataTypeOptions: Array<{ value: string; label: string }>;
  inputDataTypeOptions: Array<{ value: string; label: string }>;
}

export const useParamForm = ({ dataTypeOptions, inputDataTypeOptions }: UseParamFormProps) => {
  // Initial form values
  const initialValues: ParamFormData = useMemo(
    () => ({
      Key: '',
      SubKey: '',
      Description: '',
      DataType: '1', // Default: Metin
      InputDataType: '0', // Default: Giriş
      OrderIndex: '',
      Detail: '',
    }),
    [],
  );

  // Form schema with validation
  const schema = useMemo(() => {
    return yup.object({
      Key: fields.text.required('Key zorunludur').label('Key').meta({ col: 2 }),
      SubKey: fields.text.label('Sub Key').meta({ col: 2 }),
      Description: fields.text.required('Tanım zorunludur').label('Tanım').meta({ col: 2 }),
      DataType: fields.select(dataTypeOptions, 'string', ['value', 'label']).label('Tip').meta({ col: 2 }),
      InputDataType: fields
        .select(inputDataTypeOptions, 'string', ['value', 'label'])
        .label('Kullanım')
        .meta({ col: 2 }),
      OrderIndex: fields.text.required('Sıra zorunludur').label('Sıra').meta({ col: 1, inputType: 'number' }),
      Detail: fields.text.label('Detay').meta({ col: 12 }),
    });
  }, [dataTypeOptions, inputDataTypeOptions]);

  const form = useForm<ParamFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form
  const resetForm = useCallback(() => {
    form.reset({
      Key: '',
      SubKey: '',
      Description: '',
      DataType: '1',
      InputDataType: '0',
      OrderIndex: '',
      Detail: '',
    });
  }, [form]);

  return {
    form,
    schema,
    resetForm,
  };
};

export default useParamForm;
