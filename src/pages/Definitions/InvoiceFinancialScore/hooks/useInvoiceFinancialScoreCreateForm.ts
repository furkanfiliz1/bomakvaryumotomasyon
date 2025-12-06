/**
 * Invoice Financial Score Create Form Hook
 * Manages form state and validation for creating new concentration metrics
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import type { InvoiceFinancialScoreCreateFormData } from '../invoice-financial-score.types';

interface UseInvoiceFinancialScoreCreateFormReturn {
  form: UseFormReturn<InvoiceFinancialScoreCreateFormData>;
  schema: yup.ObjectSchema<InvoiceFinancialScoreCreateFormData>;
}

export const useInvoiceFinancialScoreCreateForm = (): UseInvoiceFinancialScoreCreateFormReturn => {
  // Define validation schema with Form.* field types
  const schema: yup.ObjectSchema<InvoiceFinancialScoreCreateFormData> = yup.object({
    minFinancialScore: fields.number
      .nullable()
      .required('Bu alan zorunludur')
      .min(0, "Değer 0'dan küçük olamaz")
      .integer('Tam sayı olmalıdır')
      .label('Min Finansal Skor')
      .meta({ col: 3, inputType: 'number' }),
    maxFinancialScore: fields.number
      .nullable()
      .required('Bu alan zorunludur')
      .min(0, "Değer 0'dan küçük olamaz")
      .integer('Tam sayı olmalıdır')
      .label('Max Finansal Skor')
      .meta({ col: 3, inputType: 'number' }),
    minInvoiceScore: fields.number
      .nullable()
      .required('Bu alan zorunludur')
      .min(0, "Değer 0'dan küçük olamaz")
      .integer('Tam sayı olmalıdır')
      .label('Minimum Fatura Skoru')
      .meta({ col: 4, inputType: 'number' }),
  });

  // Initialize form with default values
  const form = useForm<InvoiceFinancialScoreCreateFormData>({
    defaultValues: {
      minFinancialScore: null,
      maxFinancialScore: null,
      minInvoiceScore: null,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
};
