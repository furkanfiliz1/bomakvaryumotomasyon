import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Purchase Filter Schema
export const createPurchaseFilterSchema = (
  categoryOptions: { value: string; label: string }[],
  fishOptions: { value: string; label: string }[]
) =>
  yup.object({
    categoryId: fields
      .select([{ value: '', label: 'Tümü' }, ...categoryOptions], 'string', ['value', 'label'])
      .label('Kategori'),
    fishTypeId: fields
      .select([{ value: '', label: 'Tümü' }, ...fishOptions], 'string', ['value', 'label'])
      .label('Balık'),
    startDate: fields.date.label('Başlangıç Tarihi'),
    endDate: fields.date.label('Bitiş Tarihi'),
  });

export const purchaseFilterSchema = createPurchaseFilterSchema([], []);

export type PurchaseFilterFormData = yup.InferType<ReturnType<typeof createPurchaseFilterSchema>>;
