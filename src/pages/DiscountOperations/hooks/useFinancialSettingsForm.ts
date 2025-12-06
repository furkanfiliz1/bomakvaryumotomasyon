import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';
import type { FinancialSettingsData } from '../discount-operations.types';

export const useFinancialSettingsForm = (
  initialData?: Partial<FinancialSettingsData>,
  financerOptions: { id: number; name: string }[] = [],
) => {
  const initialValues: FinancialSettingsData = {
    AllowanceFinancers: [],
    IsCreatedWithTransactionFee: false,
    ...initialData,
  };

  const schema = yup.object({
    AllowanceFinancers: fields
      .select(financerOptions, 'number', ['id', 'name'])
      .required('Lütfen en az bir finansör seçiniz')
      .label('Finansörler')
      .meta({
        col: 12,
      }),

    IsCreatedWithTransactionFee: fields.checkbox.label('İşlem Ücreti ile Oluştur').meta({
      col: 12,
      mt: 1,
    }),
  });

  const form = useForm<FinancialSettingsData>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  return { form, schema };
};
