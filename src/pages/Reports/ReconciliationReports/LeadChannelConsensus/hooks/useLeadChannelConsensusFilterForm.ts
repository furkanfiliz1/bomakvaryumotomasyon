import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SchemaField } from 'src/components/common/Form/enums';
import { object, string } from 'yup';
import type { LeadChannelConsensusFilters, LeadChannelConsensusFormData } from '../lead-channel-consensus.types';

interface UseLeadChannelConsensusFilterFormProps {
  onFilterChange: (filters: Partial<LeadChannelConsensusFilters>) => void;
  leadChannelOptions: Array<{ value: number; label: string }>;
}

/**
 * Custom hook for Lead Channel Consensus filter form management
 * Following IntegratorConsensus pattern exactly with React Hook Form + Yup
 */
export const useLeadChannelConsensusFilterForm = ({
  onFilterChange,
  leadChannelOptions,
}: UseLeadChannelConsensusFilterFormProps) => {
  // Validation schema with metadata for form generation
  const schema = useMemo(
    () =>
      object({
        LeadChannelId: string()
          .required('Lead kanal seçimi zorunludur')
          .label('Lead Kanal')
          .meta({
            field: SchemaField.InputSelect,
            options: leadChannelOptions,
            entries: ['value', 'label'] as [string, string],
            col: 4,
            showSelectOption: true,
          }),
        StartDate: string().required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({
          field: SchemaField.InputDate,
          col: 4,
        }),
        EndDate: string().required('Bitiş tarihi zorunludur').label('Bitiş Tarihi').meta({
          field: SchemaField.InputDate,
          col: 4,
        }),
      }),
    [leadChannelOptions],
  );

  // Default values - last 30 days (matching legacy behavior)
  const defaultValues: LeadChannelConsensusFormData = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    return {
      LeadChannelId: '',
      StartDate: startDate.toISOString().split('T')[0],
      EndDate: endDate.toISOString().split('T')[0],
    };
  }, []);

  // Form setup with default values
  const form = useForm<LeadChannelConsensusFormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Handle form submission
  const handleSubmit = useCallback(
    (data: LeadChannelConsensusFormData) => {
      const filters: Partial<LeadChannelConsensusFilters> = {
        LeadChannelId: data.LeadChannelId ? Number(data.LeadChannelId) : null,
        StartDate: data.StartDate ? new Date(data.StartDate) : null,
        EndDate: data.EndDate ? new Date(data.EndDate) : null,
      };

      onFilterChange(filters);
    },
    [onFilterChange],
  );

  // Handle form reset
  const handleReset = useCallback(() => {
    form.reset(defaultValues);

    // Clear filters
    onFilterChange({
      LeadChannelId: null,
      StartDate: null,
      EndDate: null,
    });
  }, [form, onFilterChange, defaultValues]);

  return {
    form,
    schema,
    handleSubmit,
    handleReset,
  };
};
