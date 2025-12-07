import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Sale Schema - Sadece genel bilgiler (items ayrı yönetilecek)
export const createSaleSchema = (customerOptions: { value: string; label: string }[]) =>
  yup.object({
    customerId: fields
      .select(customerOptions, 'string', ['value', 'label'])
      .required('Müşteri seçimi zorunludur')
      .label('Müşteri'),
    date: fields.date.required('Tarih zorunludur').label('Tarih'),
    discount: fields.number.label('İndirim (₺)'),
    notes: fields.textarea.label('Notlar').meta({ maxRows: 3 }),
  });

// Default schema with empty options for resolver
export const saleSchema = createSaleSchema([]);

export type SaleFormData = yup.InferType<ReturnType<typeof createSaleSchema>>;
