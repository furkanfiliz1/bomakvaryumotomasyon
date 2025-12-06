import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CONNECTION_STATUS_OPTIONS } from '../helpers';
import type { IntegratorConsensusFilters, IntegratorOption } from '../integrator-consensus.types';

/**
 * Form management hook for Integrator Consensus filters
 * Following OperationPricing pattern exactly with React Hook Form + Yup validation
 */

interface FormData {
  IntegratorId: number | string;
  StartDate: string;
  EndDate: string;
  IsIntegratorConnect: string;
}

interface UseIntegratorConsensusFilterFormProps {
  onFilterChange: (filters: Partial<IntegratorConsensusFilters>) => void;
  integratorOptions: IntegratorOption[];
}

export const useIntegratorConsensusFilterForm = ({
  onFilterChange,
  integratorOptions,
}: UseIntegratorConsensusFilterFormProps) => {
  // Validation schema - following GuaranteeProtocol patterns
  const schema = useMemo(() => {
    // Only create schema when integratorOptions are loaded
    const safeIntegratorOptions =
      integratorOptions.length > 0 ? integratorOptions : [{ value: 0, label: 'Yükleniyor...' }];

    return yup.object({
      IntegratorId: fields
        .select(safeIntegratorOptions, 'number', ['value', 'label'])
        .required('Entegratör seçimi zorunludur')
        .label('Entegratör')
        .meta({ col: 3, showSelectOption: true }),

      StartDate: fields.date.required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({ col: 3 }),

      EndDate: fields.date.required('Bitiş tarihi zorunludur').label('Bitiş Tarihi').meta({ col: 3 }),

      IsIntegratorConnect: fields
        .select(CONNECTION_STATUS_OPTIONS, 'string', ['value', 'label'])
        .label('Entegratör Bağlılık Durumu')
        .meta({ col: 3 }),
    }) as yup.ObjectSchema<FormData>;
  }, [integratorOptions]);

  // Default values - last 30 days (matching legacy behavior)
  const defaultValues: FormData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    return {
      IntegratorId: '',
      StartDate: startDate.toISOString().split('T')[0],
      EndDate: endDate.toISOString().split('T')[0],
      IsIntegratorConnect: 'all', // Default to "Tümü"
    };
  }, []);

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Form submission handler
  const handleSubmit = useCallback(
    (data: FormData) => {
      const filters: IntegratorConsensusFilters = {
        IntegratorId: Number(data.IntegratorId),
        StartDate: new Date(data.StartDate),
        EndDate: new Date(data.EndDate),
        IsIntegratorConnect: data.IsIntegratorConnect === 'all' ? null : data.IsIntegratorConnect === 'true',
      };

      onFilterChange(filters);
    },
    [onFilterChange],
  );

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    onFilterChange({
      IntegratorId: 0,
      StartDate: new Date(defaultValues.StartDate),
      EndDate: new Date(defaultValues.EndDate),
      IsIntegratorConnect: null, // Reset to show all
    });
  }, [form, defaultValues, onFilterChange]);

  return {
    form,
    schema,
    defaultValues,
    handleSubmit,
    handleReset,
  };
};
