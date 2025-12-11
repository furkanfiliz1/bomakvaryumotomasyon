import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Expense Category Options
const categoryOptions = [
  { id: 'kira', name: 'Kira' },
  { id: 'elektrik', name: 'Elektrik' },
  { id: 'yem', name: 'Yem' },
  { id: 'poşet', name: 'Poşet' },
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

// Expense Schema - userOptions will be set dynamically
export const createExpenseSchema = (userOptions: Array<{ id: string; name: string }>) =>
  yup.object({
    date: fields.date.required('Tarih zorunludur').label('Tarih'),
    category: fields
      .select(categoryOptions, 'string', ['id', 'name'])
      .required('Kategori zorunludur')
      .label('Kategori'),
    amount: fields.number.required('Tutar zorunludur').label('Tutar (₺)'),
    paymentType: fields.select(paymentTypeOptions, 'string', ['id', 'name']).label('Ödeme Tipi'),
    userId: fields
      .select(userOptions, 'string', ['id', 'name'])
      .required('Kullanıcı seçimi zorunludur')
      .label('Kullanıcı'),
    description: fields.textarea.label('Açıklama').meta({ maxRows: 3 }),
  });

// Default schema with empty user options
export const expenseSchema = createExpenseSchema([]);

export type ExpenseFormData = yup.InferType<typeof expenseSchema>;

// Expense Filter Schema
export const createExpenseFilterSchema = (userOptions: Array<{ id: string; name: string }>) =>
  yup.object({
    category: fields
      .select([{ id: '', name: 'Tümü' }, ...categoryOptions], 'string', ['id', 'name'])
      .label('Kategori'),
    paymentType: fields
      .select([{ id: '', name: 'Tümü' }, ...paymentTypeOptions], 'string', ['id', 'name'])
      .label('Ödeme Tipi'),
    userId: fields
      .select([{ id: '', name: 'Tümü' }, ...userOptions], 'string', ['id', 'name'])
      .label('Kullanıcı'),
    startDate: fields.date.label('Başlangıç Tarihi'),
    endDate: fields.date.label('Bitiş Tarihi'),
  });

export const expenseFilterSchema = createExpenseFilterSchema([]);

export type ExpenseFilterFormData = yup.InferType<ReturnType<typeof createExpenseFilterSchema>>;
