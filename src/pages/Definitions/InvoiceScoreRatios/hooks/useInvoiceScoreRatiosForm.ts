import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';
import type { InvoiceScoreMetricDefinition } from '../invoice-score-ratios.types';

export interface InvoiceScoreRatioFormData {
  Min: string;
  Max: string;
  Value: string;
  Percent: string;
}

const useInvoiceScoreRatiosForm = (initialData?: InvoiceScoreMetricDefinition) => {
  const initialValues: InvoiceScoreRatioFormData = {
    Min: initialData?.Min !== null && initialData?.Min !== undefined ? String(initialData.Min) : '',
    Max: initialData?.Max !== null && initialData?.Max !== undefined ? String(initialData.Max) : '',
    Value: initialData?.Value ? String(initialData.Value) : '',
    Percent: initialData?.Percent ? String(initialData.Percent) : '',
  };

  const schema = yup.object({
    Min: fields.text
      .label('Min')
      .transform((value) => (value === '' ? null : value))
      .meta({ col: 6 }),
    Max: fields.text
      .label('Max')
      .transform((value) => (value === '' ? null : value))
      .meta({ col: 6 }),
    Value: fields.text.required('Zorunlu alan').label('Değer').meta({ col: 6 }),
    Percent: fields.text.required('Zorunlu alan').label('Yüzde').meta({ col: 6 }),
  });

  const form = useForm<InvoiceScoreRatioFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return { form, schema };
};

export default useInvoiceScoreRatiosForm;
