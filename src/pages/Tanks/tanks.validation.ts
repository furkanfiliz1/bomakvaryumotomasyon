import yup from '@validation';
import * as fields from 'src/components/common/Form/schemas/_common';

// Tank Schema
export const tankSchema = yup.object({
  name: fields.text.required('Tank adı zorunludur').label('Tank Adı'),
  code: fields.text.required('Kod zorunludur').label('Kod'),
});

export type TankFormData = yup.InferType<typeof tankSchema>;
