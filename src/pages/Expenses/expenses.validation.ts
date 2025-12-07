import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Expense Category Options
const categoryOptions = [
  { id: 'kira', name: 'Kira' },
  { id: 'elektrik', name: 'Elektrik' },
  { id: 'yem', name: 'Yem' },
  { id: 'malzeme', name: 'Malzeme' },
  { id: 'kargo', name: 'Kargo' },
  { id: 'diğer', name: 'Diğer' },
];

// Payment Type Options
const paymentTypeOptions = [
  { id: 'nakit', name: 'Nakit' },
  { id: 'kart', name: 'Kart' },
  { id: 'havale', name: 'Havale' },
];

// Expense Schema
export const expenseSchema = yup.object({
  date: fields.date.required('Tarih zorunludur').label('Tarih'),
  category: fields
    .select(categoryOptions, 'string', ['id', 'name'])
    .required('Kategori zorunludur')
    .label('Kategori'),
  amount: fields.number.required('Tutar zorunludur').label('Tutar (₺)'),
  paymentType: fields.select(paymentTypeOptions, 'string', ['id', 'name']).label('Ödeme Tipi'),
  description: fields.textarea.label('Açıklama').meta({ maxRows: 3 }),
});

export type ExpenseFormData = yup.InferType<typeof expenseSchema>;
