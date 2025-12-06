import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';
import type { ChequeFilters } from '../discount-operations.types';

export const useChequeFilterForm = (initialData?: Partial<ChequeFilters>) => {
  const initialValues: ChequeFilters = {
    drawerName: '',
    chequeNumber: '',
    amount: '',
    paymentDueDate: '',
    ...initialData,
  };

  const schema = yup.object({
    drawerName: fields.text.label('Keşideci Adı').meta({
      col: 3,
      size: 'small',
      placeholder: 'Keşideci adında ara...',
    }),

    chequeNumber: fields.text.label('Çek Numarası').meta({
      col: 3,
      size: 'small',
      placeholder: 'Çek numarasında ara...',
    }),

    amount: fields.text.label('Çek Tutarı').meta({
      col: 3,
      size: 'small',
      placeholder: 'Tutarda ara...',
    }),

    paymentDueDate: fields.date.label('Vade Tarihi').meta({
      col: 3,
      size: 'small',
    }),
  });

  const form = useForm<ChequeFilters>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const clearFilters = () => {
    form.reset(initialValues);
  };

  return { form, schema, clearFilters };
};
