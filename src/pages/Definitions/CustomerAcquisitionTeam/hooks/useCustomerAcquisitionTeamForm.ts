/**
 * Hook for customer acquisition team create form
 * Following OperationPricing pattern exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  Name: string;
}

function useCustomerAcquisitionTeamForm() {
  const initialValues: FormData = {
    Name: '',
  };

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      Name: fields.text
        .required('Müşteri Kazanım Ekibi Üye Adı boş bırakılamaz')
        .label('Müşteri Kazanım Ekibi Üyesi Adı')
        .meta({ col: 8 }),
    });
  }, []);

  const form = useForm<FormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const resetForm = () => {
    form.reset(initialValues);
  };

  return {
    form,
    schema,
    resetForm,
  };
}

export default useCustomerAcquisitionTeamForm;
