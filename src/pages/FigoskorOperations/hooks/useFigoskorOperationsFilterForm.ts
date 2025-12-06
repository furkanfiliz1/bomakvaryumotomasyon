import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FigoskorCustomerFilters } from '../figoskor-operations.types';

interface FormData {
  Identifier: string;
  CompanyName: string;
  status: string;
}

interface UseFigoskorOperationsFilterFormProps {
  customerStatusOptions: Array<{ value: string; label: string }>;
  onFilterChange: (filters: Partial<FigoskorCustomerFilters>) => void;
}

/**
 * Hook for managing Figoskor customer filter form
 * Uses useFilterFormWithUrlSync for URL synchronization
 */
export const useFigoskorOperationsFilterForm = ({
  customerStatusOptions,
  onFilterChange,
}: UseFigoskorOperationsFilterFormProps) => {
  const defaultValues: FormData = useMemo(
    () => ({
      Identifier: '',
      CompanyName: '',
      status: '',
    }),
    [],
  );

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      Identifier: fields.text.label('VKN').meta({ col: 4 }),
      CompanyName: fields.text.label('Ünvan').meta({ col: 4 }),
      status: fields
        .select(customerStatusOptions || [], 'string', ['value', 'label'])
        .label('Durum')
        .meta({ col: 4, showSelectOption: true })
        .optional()
        .nullable(),
    };

    return yup.object(baseFields);
  }, [customerStatusOptions]);

  const form = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form data to API filter format
  const transformToApiFilters = (data: FormData): Partial<FigoskorCustomerFilters> => {
    return {
      Identifier: data.Identifier || undefined,
      CompanyName: data.CompanyName || undefined,
      status: data.status || undefined,
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetFormWithUrlSync } = useFilterFormWithUrlSync({
    form,
    onFilterChange,
    transformToApiFilters,
  });

  const handleReset = () => {
    resetFormWithUrlSync(defaultValues);
  };

  return {
    form,
    schema,
    handleSearch: handleApply,
    handleReset,
  };
};
