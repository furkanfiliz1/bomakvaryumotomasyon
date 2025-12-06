import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { fields } from 'src/components/common/Form/schemas/_common';
import * as yup from 'yup';

import { INTEGRATOR_OPTIONS } from '../constants';
import { ScoreInvoiceReportsFilterForm } from '../score-invoice-reports.types';

// Default form values matching legacy implementation
const DEFAULT_FORM_VALUES: ScoreInvoiceReportsFilterForm = {
  companyIdentifier: '',
  integratorIdentifier: '',
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
};

// Form schema exactly matching legacy form fields
const scoreInvoiceReportsFilterSchema = yup.object({
  companyIdentifier: fields.text.optional().label('Tedarikçi VKN').meta({
    col: 4,
    placeholder: 'Tedarikçi VKN giriniz...',
  }),
  integratorIdentifier: fields
    .select(INTEGRATOR_OPTIONS, 'string', ['identifier', 'name'])
    .optional()
    .label('Entegratör VKN')
    .meta({
      col: 4,
      showSelectOption: true,
      showSelectOptionText: 'Hepsi',
    }),
  date: fields.date.required().label('Tarih').meta({
    col: 4,
  }),
}) as yup.ObjectSchema<ScoreInvoiceReportsFilterForm>;

interface UseScoreInvoiceReportsFilterFormOptions {
  onFilterChange?: (data: Partial<ScoreInvoiceReportsFilterForm>) => void;
}

export const useScoreInvoiceReportsFilterForm = (options?: UseScoreInvoiceReportsFilterFormOptions) => {
  const form = useForm<ScoreInvoiceReportsFilterForm>({
    resolver: yupResolver(scoreInvoiceReportsFilterSchema as yup.ObjectSchema<ScoreInvoiceReportsFilterForm>),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const handleSearch = (data: ScoreInvoiceReportsFilterForm) => {
    // Transform form data to API filters - date is already in YYYY-MM-DD format
    const filters = {
      startDate: data.date,
      endDate: data.date, // Legacy uses same date for both start and end
      companyIdentifier: data.companyIdentifier || undefined,
      integratorIdentifier: data.integratorIdentifier || undefined,
    };

    if (options?.onFilterChange) {
      options.onFilterChange(filters);
    }
  };

  const handleReset = () => {
    form.reset(DEFAULT_FORM_VALUES);
    if (options?.onFilterChange) {
      options.onFilterChange({});
    }
  };

  return {
    form,
    schema: scoreInvoiceReportsFilterSchema,
    handleSearch,
    handleReset,
  };
};
