import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Sale Schema - Sadece genel bilgiler (items ayrı yönetilecek)
export const createSaleSchema = (customerOptions: { value: string; label: string }[]) =>
  yup.object({
    customerId: fields
      .autoComplete(customerOptions, 'string', ['value', 'label'])
      .required('Müşteri seçimi zorunludur')
      .label('Müşteri'),
    date: fields.date.required('Tarih zorunludur').label('Tarih'),
    discount: fields.number.label('İndirim (₺)'),
    notes: fields.textarea.label('Notlar').meta({ maxRows: 3 }),
  });

// Default schema with empty options for resolver
export const saleSchema = createSaleSchema([]);

export type SaleFormData = yup.InferType<ReturnType<typeof createSaleSchema>>;

// Sales Filter Schema
export const createSaleFilterSchema = (
  customerOptions: { value: string; label: string }[],
  categoryOptions: { value: string; label: string }[],
  fishOptions: { value: string; label: string }[]
) =>
  yup.object({
    customerId: fields
      .autoComplete([{ value: '', label: 'Tümü' }, ...customerOptions], 'string', ['value', 'label']).meta({ col: 4 })
      .label('Müşteri'),
    categoryId: fields
      .select([{ value: '', label: 'Tümü' }, ...categoryOptions], 'string', ['value', 'label']).meta({ col: 4 })
      .label('Kategori'),
    fishId: fields
      .select([{ value: '', label: 'Tümü' }, ...fishOptions], 'string', ['value', 'label']).meta({ col: 4 })  
      .label('Balık'),
    startDate: fields.date.label('Başlangıç Tarihi').meta({ col: 6 }),
    endDate: fields.date.label('Bitiş Tarihi').meta({ col: 6 }),
  });

export const saleFilterSchema = createSaleFilterSchema([], [], []);

export type SaleFilterFormData = yup.InferType<ReturnType<typeof createSaleFilterSchema>>;
