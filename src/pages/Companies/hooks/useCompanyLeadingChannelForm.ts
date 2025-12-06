import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import { useGetLeadingChannelListQuery } from '../companies.api';

interface LeadingChannelFormData {
  LeadingChannelId?: number | string | null;
}

export const useCompanyLeadingChannelForm = () => {
  // Get leading channel options
  const { data: leadingChannelsData = [] } = useGetLeadingChannelListQuery();

  const initialValues: LeadingChannelFormData = {
    LeadingChannelId: '',
  };

  const schema = yup.object({
    LeadingChannelId: fields
      .select(leadingChannelsData, 'number', ['Id', 'Value'])
      .label('Geliş Kanalı')
      .nullable()
      .optional()
      .meta({
        col: 12,
        showSelectOption: true,
        showSelectOptionText: 'Kanal Seçiniz',
      }),
  });

  const form = useForm<LeadingChannelFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  return {
    form,
    schema,
    leadingChannelsData,
  };
};
