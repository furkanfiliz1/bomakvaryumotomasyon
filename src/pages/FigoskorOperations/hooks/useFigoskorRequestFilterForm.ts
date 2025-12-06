import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FigoskorClientRequestListRequest } from '../figoskor-operations.types';

interface RequestFormData {
  StartDate: string;
  EndDate: string;
  status: string;
}

interface UseFigoskorRequestFilterFormProps {
  requestStatusOptions: Array<{ value: string; label: string }>;
  onFilterChange: (filters: Partial<FigoskorClientRequestListRequest & { customerId: string }>) => void;
  initialValues?: Partial<FigoskorClientRequestListRequest>;
}

/**
 * Hook for managing Figoskor request filter form
 * Follows CustomerTracking pattern for form management with URL parameters
 */
export const useFigoskorRequestFilterForm = ({
  requestStatusOptions,
  onFilterChange,
  initialValues: urlParams,
}: UseFigoskorRequestFilterFormProps) => {
  const initialValues: RequestFormData = useMemo(
    () => ({
      StartDate: urlParams?.StartDate || '',
      EndDate: urlParams?.EndDate || '',
      status: urlParams?.status || '',
    }),
    [urlParams],
  );

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    const baseFields = {
      status: fields
        .select(requestStatusOptions || [], 'string', ['value', 'label'])
        .label('Durum')
        .meta({ col: 4, showSelectOption: true })
        .optional()
        .nullable(),
      StartDate: fields.date.label('Başlangıç Tarihi').meta({ col: 4 }),
      EndDate: fields.date.label('Bitiş Tarihi').meta({ col: 4 }),
    };

    return yup.object().shape(baseFields);
  }, [requestStatusOptions]);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const handleSearch = useMemo(
    () => () => {
      const formData = form.getValues();
      const filters: Partial<FigoskorClientRequestListRequest> = {};

      // Map form values to filter object
      if (formData.StartDate) {
        filters.StartDate = formData.StartDate;
      }
      if (formData.EndDate) {
        filters.EndDate = formData.EndDate;
      }
      if (formData.status) {
        filters.status = String(formData.status);
      }

      // Notify parent component
      onFilterChange(filters);
    },
    [form, onFilterChange],
  );

  return {
    form,
    schema,
    handleSearch,
  };
};
