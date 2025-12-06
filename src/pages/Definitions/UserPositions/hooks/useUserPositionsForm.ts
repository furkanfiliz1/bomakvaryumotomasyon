import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';

/**
 * Form data interface for user position
 */
interface UserPositionFormData {
  Name: string;
}

/**
 * User Positions Form Hook
 * Manages form state and validation for creating/updating user positions
 * Following OperationPricing pattern exactly
 */
export function useUserPositionsForm(initialData?: Partial<UserPositionFormData>) {
  // Initial values with defaults
  const initialValues: UserPositionFormData = {
    Name: '',
    ...initialData,
  };

  // Form validation schema - Name is required, cannot be empty
  const schema = yup.object({
    Name: fields.text
      .required('Pozisyon adı gereklidir')
      .min(1, 'Pozisyon adı boş olamaz')
      .label('Pozisyon Adı')
      .meta({ col: 10 }),
  });

  // Initialize form with validation
  const form = useForm<UserPositionFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
}
