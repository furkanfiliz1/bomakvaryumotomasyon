import * as yup from 'yup';

export const cashTransactionSchema = yup.object().shape({
  userId: yup.string().required('Kullanıcı seçimi zorunludur'),
  amount: yup
    .number()
    .required('Tutar zorunludur')
    .positive('Tutar pozitif olmalıdır')
    .typeError('Geçerli bir tutar giriniz'),
  type: yup.string().oneOf(['income', 'expense'], 'Geçersiz işlem tipi').required('İşlem tipi zorunludur'),
  description: yup.string().required('Açıklama zorunludur'),
});

export type CashTransactionFormData = yup.InferType<typeof cashTransactionSchema>;
