import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelResponseModel } from '@store';
import { UseFormReturn, useForm } from 'react-hook-form';
import yup from '@validation';
import { DocumentLabelID } from '@types';
import { MONTHS } from '@constant';

const initialValues = {
  periodQuarter: undefined,
  periodYear: undefined,
  periodMonth: undefined,
  labelId: null as null | DocumentLabelID,
  file: null,
};

export type DocumentFormValues = Partial<typeof initialValues>;

export const useDocumentForm = (
  labels: LabelResponseModel[],
  labelId: DocumentLabelID | null,
  isDisabledAutoComplete: boolean,
) => {
  const yearSchema = fields.number
    .required('Bu alan zorunludur')
    .label('Yıl')
    .validYear('Geçerli bir yıl giriniz')
    .nullable();

  const geciciBeyannameQuarter = fields.number
    .required('Bu alan zorunludur')
    .label('Dönem')
    .meta({ col: 6, maxLength: 1, inputType: 'number' })
    .validQuarter('Geçerli bir dönem giriniz', 3)
    .nullable();
  const mizanQuarter = fields.number
    .required('Bu alan zorunludur')
    .label('Dönem')
    .meta({ col: 6, maxLength: 1, inputType: 'number' })
    .validQuarter('Geçerli bir dönem giriniz', 4)
    .nullable();

  const monthSchema = fields
    .select(MONTHS || [], 'number', ['id', 'name'])
    .label('Ay')
    .meta({ col: 6 })
    .required();

  const fileSchema = yup.mixed().required('Lütfen doküman yükleyiniz');

  const getFormSchema = (): yup.AnyObject => {
    switch (labelId) {
      case DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID:
        return {
          periodYear: yearSchema.meta({ col: 12 }),
          file: fileSchema,
        };
      case DocumentLabelID.GECICI_BEYANNAME_LABEL_ID:
        return {
          periodYear: yearSchema.meta({ col: 6 }),
          periodQuarter: geciciBeyannameQuarter,
          file: fileSchema,
        };
      case DocumentLabelID.MIZAN_LABEL_ID:
        return {
          periodYear: yearSchema.meta({ col: 6 }),
          periodQuarter: mizanQuarter,
          file: fileSchema,
        };
      case DocumentLabelID.E_DEFTER_BERAT:
      case DocumentLabelID.E_DEFTER_KEBIR:
        return {
          periodYear: yearSchema.meta({ col: 6 }),
          periodMonth: monthSchema,
          file: fileSchema,
        };
      default:
        return {
          file: fileSchema,
        };
    }
  };

  const getDynamicallyMeta = () => {
    if (isDisabledAutoComplete) {
      if (labelId === DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID)
        return { disabled: true, defaultTitle: 'Yıllık Beyanname' };
      if (labelId === DocumentLabelID.GECICI_BEYANNAME_LABEL_ID)
        return { disabled: true, defaultTitle: 'Geçici Beyanname' };
      if (labelId === DocumentLabelID.MIZAN_LABEL_ID) return { disabled: true, defaultTitle: 'Mizan' };
      if (labelId === DocumentLabelID.FINDEKS_LABEL_ID) return { disabled: true, defaultTitle: 'Findeks' };
    }
    return { disabled: false };
  };

  const schema = yup.object({
    labelId: fields
      .autoComplete(labels, 'number', ['Id', 'Name'])
      .meta({ col: 12 })
      .required('Bu alan zorunludur')
      .label('Doküman Tipi')
      .meta(getDynamicallyMeta()) as unknown as yup.NumberSchema<DocumentLabelID | null, yup.AnyObject, undefined, ''>,
    ...getFormSchema(),
  });

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  }) as UseFormReturn<DocumentFormValues>;

  return { form, schema };
};
