import * as yup from 'yup';
import * as fields from '../components/common/Form/schemas/_common';

// Operation Charge Form Schema following OperationPricing patterns
export const operationChargeFormSchema = yup.object({
  ProductType: fields.text.required('Ürün tipi seçiniz'),
  SenderIdentifier: yup.object().nullable().notRequired(),
  ReceiverIdentifier: yup.object().nullable().notRequired(),
  FinancerIdentifier: yup.object().nullable().notRequired(),
  TransactionType: fields.text.required('İşlem tipi seçiniz'),
  PaymentType: fields.number.required('Ödeme tipi gereklidir'),
  OperationChargeDefinitionType: fields.text.required('Ücret tanım tipi seçiniz'),
  ChargeCompanyType: fields.number.required('Ücret şirket tipi gereklidir'),
  IsDaily: yup.boolean().default(false),
});

// New Operation Charge Amount Schema
export const newOperationChargeAmountSchema = yup.object({
  MinDueDay: yup
    .number()
    .min(0, "Min. vade günü 0'dan küçük olamaz")
    .when('$transactionType', {
      is: '3', // Invoice Expiry
      then: (schema) => schema.required('Min. vade günü gereklidir'),
      otherwise: (schema) => schema.notRequired(),
    }),
  MaxDueDay: yup
    .number()
    .min(0, "Max. vade günü 0'dan küçük olamaz")
    .when(['MinDueDay', '$transactionType'], {
      is: (minDueDay: number, transactionType: string) => transactionType === '3' && minDueDay !== undefined,
      then: (schema) =>
        schema
          .required('Max. vade günü gereklidir')
          .min(yup.ref('MinDueDay'), 'Max. vade günü min. vade gününden küçük olamaz'),
      otherwise: (schema) => schema.notRequired(),
    }),
  MinAmount: yup
    .number()
    .min(0, "Min. tutar 0'dan küçük olamaz")
    .when('$transactionType', {
      is: '2', // Invoice Amount
      then: (schema) => schema.required('Min. tutar gereklidir'),
      otherwise: (schema) => schema.notRequired(),
    }),
  MaxAmount: yup
    .number()
    .min(0, "Max. tutar 0'dan küçük olamaz")
    .when(['MinAmount', '$transactionType'], {
      is: (minAmount: number, transactionType: string) => transactionType === '2' && minAmount !== undefined,
      then: (schema) =>
        schema.required('Max. tutar gereklidir').min(yup.ref('MinAmount'), 'Max. tutar min. tutardan küçük olamaz'),
      otherwise: (schema) => schema.notRequired(),
    }),
  TransactionFee: yup.number().min(0, "İşlem ücreti 0'dan küçük olamaz").required('İşlem ücreti gereklidir'),
  PercentFee: yup
    .number()
    .min(0, "Yüzde ücret 0'dan küçük olamaz")
    .max(100, "Yüzde ücret 100'den büyük olamaz")
    .required('Yüzde ücret gereklidir'),
  MinScore: yup
    .number()
    .nullable()
    .min(0, "Min. skor 0'dan küçük olamaz")
    .max(100, "Min. skor 100'den büyük olamaz")
    .when('$isScoreDisabled', {
      is: true,
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
  MaxScore: yup
    .number()
    .nullable()
    .min(0, "Max. skor 0'dan küçük olamaz")
    .max(100, "Max. skor 100'den büyük olamaz")
    .when(['MinScore', '$isScoreDisabled'], {
      is: (minScore: number | null, isScoreDisabled: boolean) =>
        !isScoreDisabled && minScore !== null && minScore !== undefined,
      then: (schema) => schema.min(yup.ref('MinScore'), 'Max. skor min. skordan küçük olamaz'),
      otherwise: (schema) => schema.nullable(),
    }),
  ProrationDays: yup.number().nullable().min(0, "Prorate günü 0'dan küçük olamaz"),
});

export type OperationChargeFormData = yup.InferType<typeof operationChargeFormSchema>;
export type NewOperationChargeAmountFormData = yup.InferType<typeof newOperationChargeAmountSchema>;
