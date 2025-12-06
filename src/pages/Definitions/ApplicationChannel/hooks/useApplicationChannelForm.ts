/**
 * Hook for application channel create form
 * Following CustomerAcquisitionTeam pattern exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  Name: string;
}

function useApplicationChannelForm() {
  const initialValues: FormData = {
    Name: '',
  };

  // Form schema following CustomerAcquisitionTeam pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      Name: fields.text.required('Başvuru Kanalı Adı boş bırakılamaz').label('Başvuru Kanalı Adı').meta({ col: 8 }),
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

export default useApplicationChannelForm;
