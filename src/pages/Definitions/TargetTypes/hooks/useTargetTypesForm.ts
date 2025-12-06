import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';

/**
 * Form data interface for target type
 */
interface TargetTypeFormData {
  Name: string;
  Ratio: number;
  Description: string;
}

/**
 * Target Types Form Hook
 * Manages form state and validation for creating target types
 * Following UserPositions pattern exactly
 */
export function useTargetTypesForm(initialData?: Partial<TargetTypeFormData>) {
  // Initial values with defaults
  const initialValues: TargetTypeFormData = {
    Name: '',
    Ratio: 0,
    Description: '',
    ...initialData,
  };

  // Form validation schema - all fields required
  const schema = yup.object({
    Name: fields.text.required('Hedef türü adı gereklidir').label('Hedef Türü').meta({ col: 12 }),
    Ratio: fields.number
      .required('Ağırlık gereklidir')
      .integer('Ağırlık tam sayı olmalıdır')
      .label('Ağırlık')
      .meta({ col: 12 }),
    Description: fields.text.required('Açıklama gereklidir').label('Açıklama').meta({ col: 12 }),
  });

  // Initialize form with validation
  const form = useForm<TargetTypeFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
}
