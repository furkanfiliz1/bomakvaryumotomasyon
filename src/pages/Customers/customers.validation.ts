import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Customer Type Options
const customerTypeOptions = [
  { id: 'arabacı', name: 'Arabacı' },
  { id: 'petshop', name: 'Petshop' },
  { id: 'bireysel', name: 'Bireysel' },
  { id: 'toptancı', name: 'Toptancı' },
];

// Customer Schema
export const customerSchema = yup.object({
  name: fields.text.required('Müşteri adı zorunludur').label('Müşteri Adı'),
  type: fields
    .select(customerTypeOptions, 'string', ['id', 'name'])
    .required('Müşteri tipi zorunludur')
    .label('Müşteri Tipi'),
  phone: fields.text.label('Telefon'),
  city: fields.text.label('Şehir'),
  notes: fields.textarea.label('Notlar').meta({ maxRows: 3 }),
});

export type CustomerFormData = yup.InferType<typeof customerSchema>;

// Customer Filter Schema
export const customerFilterSchema = yup.object({
  name: fields.text.label('Müşteri Adı').meta({ col : 4}),
  type: fields
    .select([...customerTypeOptions, { id: '', name: 'Tümü' }], 'string', ['id', 'name'])
    .label('Müşteri Tipi').meta({ col : 4}),
  city: fields.text.label('Şehir').meta({ col : 4}),
});

export type CustomerFilterFormData = yup.InferType<typeof customerFilterSchema>;
