import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Create schema with dynamic options
export const createTankStockSchema = (
  tankOptions: Array<{ id: string; name: string }>,
  categoryOptions: Array<{ id: string; name: string }>,
  fishOptions: Array<{ id: string; name: string }>,
  isFishDisabled: boolean = false
) =>
  yup.object({
    tankId: fields
      .select(tankOptions, 'string', ['id', 'name'])
      .required('Tank seçimi zorunludur')
      .label('Tank'),
    categoryId: fields
      .select(categoryOptions, 'string', ['id', 'name'])
      .required('Kategori seçimi zorunludur')
      .label('Balık Kategorisi'),
    fishId: fields
      .select(fishOptions, 'string', ['id', 'name'], isFishDisabled)
      .required('Balık seçimi zorunludur')
      .label('Balık Türü'),
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
      .required('Boy seçimi zorunludur')
      .label('Balık Boyu'),
    quantity: fields.number.required('Adet zorunludur').min(1, 'Adet en az 1 olmalıdır').label('Adet'),
    estimatedPrice: fields.number
      .transform((value) => (isNaN(value) || value === null || value === undefined ? 0 : value))
      .min(0, 'Fiyat negatif olamaz')
      .default(0)
      .label('Tahmini Satış Fiyatı (₺)'),
  });

// Default schema with empty options
export const tankStockSchema = createTankStockSchema([], [], []);

export type TankStockFormData = yup.InferType<typeof tankStockSchema>;
