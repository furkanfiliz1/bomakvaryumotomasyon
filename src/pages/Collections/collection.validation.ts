import * as yup from 'yup';

export const collectionSchema = yup.object().shape({
  saleId: yup.string().required('Satış seçimi zorunludur'),
  customerId: yup.string().required('Müşteri seçimi zorunludur'),
  customerName: yup.string().required('Müşteri adı zorunludur'),
  saleTotal: yup.number().required('Satış toplamı zorunludur').positive('Satış toplamı pozitif olmalıdır'),
  collectedAmount: yup
    .number()
    .required('Tahsilat tutarı zorunludur')
    .positive('Tahsilat tutarı pozitif olmalıdır')
    .test('max-amount', 'Tahsilat tutarı satış toplamından fazla olamaz', function (value) {
      const { saleTotal } = this.parent;
      return value <= saleTotal;
    }),
  date: yup.date().required('Tarih zorunludur'),
  notes: yup.string(),
});

export type CollectionFormDataValidation = yup.InferType<typeof collectionSchema>;
