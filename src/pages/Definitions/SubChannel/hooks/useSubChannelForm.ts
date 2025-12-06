/**
 * Hook for sub channel create form
 * Following BankFigoRebate pattern exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { ApplicationChannelItem } from '../../ApplicationChannel/application-channel.types';

interface UseSubChannelFormProps {
  channels: ApplicationChannelItem[];
}

function useSubChannelForm({ channels }: UseSubChannelFormProps) {
  const initialValues = {
    Name: '',
    ChannelId: '',
  };

  // Form schema following BankFigoRebate pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      ChannelId: fields
        .select(channels, 'string', ['Id', 'Name'])
        .required('Başvuru Kanalı seçimi zorunludur')
        .label('Başvuru Kanalı')
        .meta({ col: 4 }),
      Name: fields.text.required('Alt Kanal Adı boş bırakılamaz').label('Alt Kanal Adı').meta({ col: 4 }),
    });
  }, [channels]);

  const form = useForm({
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

export default useSubChannelForm;
