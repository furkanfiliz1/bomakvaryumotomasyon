import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type {
  EusFormulaType,
  EusStatusType,
  EusTrackingFilterChangeHandler,
  MonthYearOption,
} from '../eus-tracking-reports.types';
import { transformFormToFilters } from '../helpers';

/**
 * Hook for managing EUS Tracking filter form
 * Following OperationPricing useOperationPricingFilterForm pattern exactly
 */

interface UseEusTrackingFilterFormProps {
  eusFormulaTypes: EusFormulaType[];
  eusStatusTypes: EusStatusType[];
  monthOptions: MonthYearOption[];
  yearOptions: MonthYearOption[];
  onFilterChange: EusTrackingFilterChangeHandler;
}

export const useEusTrackingFilterForm = ({
  eusFormulaTypes,
  eusStatusTypes,
  monthOptions,
  yearOptions,
  onFilterChange,
}: UseEusTrackingFilterFormProps) => {
  // Default form values - memoized to prevent re-renders
  const initialValues = useMemo(
    () => ({
      companyIdentifier: '',
      companyName: '',
      eusFormulaTypes: '', // Default to "Tümü" option
      eusStatusTypes: '', // Default to "Tümü" option
      companyStatus: '', // Default to "Tümü" option
      month: new Date().getMonth() + 1 + '', // Current month as string
      year: new Date().getFullYear() + '', // Current year as string
    }),
    [],
  );

  // Form schema following BuyerLimitReports and other Form component patterns exactly
  const schema = useMemo(() => {
    // Add "Tümü" option to dropdown lists following established patterns

    return yup.object({
      companyIdentifier: fields.text.label('VKN').meta({ col: 3 }),
      companyName: fields.text.label('Şirket Adı').meta({ col: 3 }),
      eusFormulaTypes: fields
        .select(eusFormulaTypes, 'string', ['Value', 'Description'])
        .label('EUS Formülü')
        .nullable()
        .optional()
        .meta({ col: 3, showSelectOption: true }),
      eusStatusTypes: fields
        .select(eusStatusTypes, 'string', ['Value', 'Description'])
        .label('Erken Uyarı Durumu')
        .nullable()
        .optional()
        .meta({ col: 3, showSelectOption: true }),
      companyStatus: fields
        .select(eusStatusTypes, 'string', ['Value', 'Description'])
        .label('Şirket Durumu')
        .meta({ col: 3, showSelectOption: true }),
      month: fields
        .select(monthOptions, 'string', ['value', 'label'])
        .label('Ay')
        .meta({ col: 3, showSelectOption: true }),
      year: fields
        .select(yearOptions, 'string', ['value', 'label'])
        .label('Yıl')
        .meta({ col: 3, showSelectOption: true }),
    });
  }, [eusFormulaTypes, eusStatusTypes, monthOptions, yearOptions]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSubmit = useCallback(() => {
    const formData = form.getValues() as {
      companyIdentifier: string;
      companyName: string;
      eusFormulaTypes: string;
      eusStatusTypes: string;
      companyStatus: string;
      month: string;
      year: string;
    };
    const filters = transformFormToFilters(formData);
    onFilterChange(filters);
  }, [form, onFilterChange]);

  const handleReset = useCallback(() => {
    form.reset(initialValues);
    const filters = transformFormToFilters(initialValues);
    onFilterChange(filters);
  }, [form, initialValues, onFilterChange]);

  return {
    form,
    handleSearch: handleSubmit, // Alias for compatibility with component
    handleSubmit,
    handleReset,
    schema,
  };
};
