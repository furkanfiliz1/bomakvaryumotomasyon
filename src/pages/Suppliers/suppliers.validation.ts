import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Supplier Schema
export const supplierSchema = (fishOptions: { value: string; label: string }[]) =>
  yup.object({
    name: fields.text.required('Tedarikçi adı zorunludur').label('Tedarikçi Adı'),
    fishIds: fields
      .multipleSelect(fishOptions, 'string', ['value', 'label'])
      .required('En az bir balık türü seçmelisiniz')
      .label('Ürettiği Balık Türleri'),
    phone: fields.text.label('Telefon'),
    address: fields.textarea.label('Adres').meta({ maxRows: 2 }),
    notes: fields.textarea.label('Notlar').meta({ maxRows: 3 }),
  });

export type SupplierFormData = yup.InferType<ReturnType<typeof supplierSchema>>;

// Supplier Filter Schema
export const supplierFilterSchema = (fishOptions: { value: string; label: string }[]) =>
  yup.object({
    name: fields.text.label('Tedarikçi Adı').meta({ col: 6 }),
    fishId: fields
      .select([{ value: '', label: 'Tümü' }, ...fishOptions], 'string', ['value', 'label'])
      .label('Balık Türü')
      .meta({ col: 6 }),
  });

export type SupplierFilterFormData = yup.InferType<ReturnType<typeof supplierFilterSchema>>;
