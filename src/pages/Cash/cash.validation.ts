import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';
import { User } from '../../types/user';

export const createCashTransactionSchema = (users: User[]) => {
  const userOptions = users.map((user) => ({
    value: user.id!,
    label: user.username,
  }));

  const typeOptions = [
    { value: 'income', label: 'Gelir' },
    { value: 'expense', label: 'Gider' },
  ];

  return yup.object({
    userId: fields
      .select(userOptions, 'string', ['value', 'label'])
      .label('Kullanıcı')
      .required('Kullanıcı seçimi zorunludur'),
    type: fields
      .select(typeOptions, 'string', ['value', 'label'])
      .label('İşlem Türü')
      .required('İşlem tipi zorunludur'),
    amount: fields.currency
      .label('Tutar')
      .required('Tutar zorunludur')
      .positive('Tutar pozitif olmalıdır')
      .typeError('Geçerli bir tutar giriniz'),
    description: fields.text
      .label('Açıklama')
      .required('Açıklama zorunludur')
      .meta({ maxRows: 3 }),
  });
};

export type CashTransactionFormData = {
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
};
