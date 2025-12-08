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
    quantity: fields.number.required('Adet zorunludur').min(1, 'Adet en az 1 olmalıdır').label('Adet'),
  });

// Default schema with empty options
export const tankStockSchema = createTankStockSchema([], [], []);

export type TankStockFormData = yup.InferType<typeof tankStockSchema>;
