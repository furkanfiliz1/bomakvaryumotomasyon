import yup from '@validation';
import { fields } from '@components';

// Document update form schema
export const createDocumentUpdateFormSchema = (
  documentStatusOptions: Array<{ Value: number; Description: string }>,
) => {
  return yup.object({
    message: fields.name.label('Yorum').nullable().meta({ col: 6 }),
    status: fields
      .select(documentStatusOptions || [], 'number', ['Value', 'Description'])
      .label('Durum')
      .required('Durum seçimi zorunludur')
      .meta({ col: 6 }),
  });
};

export type DocumentUpdateFormData = {
  message: string | null;
  status: number | null;
};
