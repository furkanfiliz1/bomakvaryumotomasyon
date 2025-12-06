import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useForm } from 'react-hook-form';

interface CompanyCodeSearchFormData {
  CompanyName: string;
  SenderIdentifier: string;
  Code: string;
}

export const useCompanyCodeSearchForm = (initialData?: Partial<CompanyCodeSearchFormData>) => {
  const schema = yup.object({
    CompanyName: fields.text.label('Şirket Ünvanı').meta({ col: 4 }),
    SenderIdentifier: fields.text.matches(/^\d*$/, 'Sadece rakam girilmelidir').label('Tedarikçi VKN').meta({ col: 4 }),
    Code: fields.text.label('Kod').meta({ col: 4 }),
  });

  const defaultValues: CompanyCodeSearchFormData = {
    CompanyName: initialData?.CompanyName || '',
    SenderIdentifier: initialData?.SenderIdentifier || '',
    Code: initialData?.Code || '',
  };

  const form = useForm<CompanyCodeSearchFormData>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return { form, schema };
};
