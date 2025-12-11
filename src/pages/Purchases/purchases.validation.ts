import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Purchase Form Schema
export const createPurchaseFormSchema = (
  supplierOptions: { value: string; label: string }[]
) =>
  yup.object({
    date: fields.date.label('Tarih').required('Tarih zorunludur'),
    supplierId: fields
      .select(supplierOptions, 'string', ['value', 'label'])
      .label('Tedarikçi')
      .required('Tedarikçi zorunludur') as yup.StringSchema<string, yup.AnyObject, undefined, "">,
    travelCost: fields.number
      .label('Yol Parası')
      .min(0, 'Yol parası 0 veya daha büyük olmalı')
      .optional(),
    notes: fields.string.label('Notlar').optional(),
  });

export type PurchaseFormData = yup.InferType<ReturnType<typeof createPurchaseFormSchema>>;

// Purchase Item Schema
export const createPurchaseItemSchema = (
  categoryOptions: { value: string; label: string }[],
  fishOptions: { value: string; label: string }[],
  tankOptions: { value: string; label: string }[]
) =>
  yup.object({
    categoryId: fields
      .select(categoryOptions, 'string', ['value', 'label'])
      .label('Kategori')
      .required('Kategori zorunludur'),
    fishTypeId: fields
      .select(fishOptions, 'string', ['value', 'label'])
      .label('Balık Türü')
      .required('Balık türü zorunludur'),
    size: fields
      .select(
        [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        'string',
        ['value', 'label'],
      )
      .label('Balık Boyu')
      .required('Balık boyu zorunludur'),
    qty: fields.number
      .label('Miktar')
      .min(1, 'Miktar en az 1 olmalı')
      .required('Miktar zorunludur'),
    unitPrice: fields.number
      .label('Birim Fiyat')
      .min(0, 'Birim fiyat 0 veya daha büyük olmalı')
      .required('Birim fiyat zorunludur'),
    note: fields.string.label('Not'),
    tankId: fields
      .select(tankOptions, 'string', ['value', 'label'])
      .label('Tank')
      .required('Tank zorunludur'),
  });

export type PurchaseItemFormData = yup.InferType<ReturnType<typeof createPurchaseItemSchema>>;

// Purchase Filter Schema
export const createPurchaseFilterSchema = (
  categoryOptions: { value: string; label: string }[],
  fishOptions: { value: string; label: string }[],
  supplierOptions: { value: string; label: string }[]
) =>
  yup.object({
    supplierId: fields
      .select([{ value: '', label: 'Tümü' }, ...supplierOptions], 'string', ['value', 'label'])
      .label('Tedarikçi'),
    categoryId: fields
      .select([{ value: '', label: 'Tümü' }, ...categoryOptions], 'string', ['value', 'label'])
      .label('Kategori'),
    fishTypeId: fields
      .select([{ value: '', label: 'Tümü' }, ...fishOptions], 'string', ['value', 'label'])
      .label('Balık'),
    startDate: fields.date.label('Başlangıç Tarihi'),
    endDate: fields.date.label('Bitiş Tarihi'),
  });

export const purchaseFilterSchema = createPurchaseFilterSchema([], [], []);

export type PurchaseFilterFormData = yup.InferType<ReturnType<typeof createPurchaseFilterSchema>>;
