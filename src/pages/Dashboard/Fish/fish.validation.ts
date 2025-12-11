import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';
import { SelectOptions } from 'src/components/common/Form/types';

// Fish Category Schema
export const fishCategorySchema = yup.object({
  name: fields.text.required('Kategori adı zorunludur').label('Kategori Adı'),
  description: fields.textarea.label('Açıklama').meta({ maxRows: 3 }),
});

// Fish Species Schema with dynamic category options
export const createFishSpeciesSchema = (categories: SelectOptions) =>
  yup.object({
    name: fields.text.required('Balık adı zorunludur').label('Balık Adı'),
    categoryId: fields
      .select(categories, 'string', ['id', 'name'])
      .required('Kategori seçimi zorunludur')
      .label('Kategori'),
    availableSizes: fields
      .multipleSelect(
        [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ],
        'string',
        ['value', 'label'],
      )
      .required('En az bir boy seçimi zorunludur')
      .label('Mevcut Boyutlar')
      .meta({ helperText: 'Bu balık türü için mevcut olan boyutları seçin' }),
  });

export type FishCategoryFormData = yup.InferType<typeof fishCategorySchema>;
export type FishSpeciesFormData = yup.InferType<ReturnType<typeof createFishSpeciesSchema>>;

// Fish Filter Schema
export const createFishFilterSchema = (categories: SelectOptions) =>
  yup.object({
    name: fields.text.label('Balık Adı').meta({ col: 6 }),
    categoryId: fields
      .select([{ id: '', name: 'Tümü' }, ...categories], 'string', ['id', 'name'])
      .label('Kategori').meta({ col: 6 }),
  });

export type FishFilterFormData = yup.InferType<ReturnType<typeof createFishFilterSchema>>;
