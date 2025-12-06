import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ConsensusOption } from '../customer-arrival-channels.types';
import { parseConsensusFromForm } from '../helpers';

interface FilterFormData {
  value: string;
  rate: number | null;
  isConsensus: string; // "all", "true", "false"
}

interface UseCustomerArrivalChannelsFilterFormProps {
  consensusOptions: ConsensusOption[];
  onSearch: (filters: { value?: string; rate?: number | null; isConsensus?: boolean | null }) => void;
}

/**
 * Hook for managing filter form with Form and Schema
 * Following OperationPricing filter form patterns
 */
export const useCustomerArrivalChannelsFilterForm = ({
  consensusOptions,
  onSearch,
}: UseCustomerArrivalChannelsFilterFormProps) => {
  // Add \"Tümü\" option to consensus options
  const filterConsensusOptions = useMemo(
    () => [{ label: 'Tümü', value: 'all' }, ...consensusOptions],
    [consensusOptions],
  );

  // Form schema
  const schema = useMemo(
    () =>
      yup.object({
        value: fields.text.label('Kanal Adı').meta({ col: 4 }),
        rate: fields.number.nullable().label('Oran').meta({ col: 4 }),
        isConsensus: fields
          .select(filterConsensusOptions, 'string', ['value', 'label'])
          .label('Mutabakat Yapılacak mı?')
          .meta({ col: 4 }),
      }),
    [filterConsensusOptions],
  );

  // Form initialization
  const form = useForm<FilterFormData>({
    defaultValues: {
      value: '',
      rate: null,
      isConsensus: 'all',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  // Handle search - transform form data to API filter format
  const handleSearch = () => {
    const formData = form.getValues();

    const filters: { value?: string; rate?: number | null; isConsensus?: boolean | null } = {};

    if (formData.value && formData.value.trim() !== '') {
      filters.value = formData.value.trim();
    }

    if (formData.rate !== null && formData.rate !== undefined) {
      filters.rate = formData.rate;
    }

    if (formData.isConsensus && formData.isConsensus !== 'all') {
      filters.isConsensus = parseConsensusFromForm(formData.isConsensus);
    }

    onSearch(filters);
  };

  return {
    form,
    schema,
    handleSearch,
  };
};

export default useCustomerArrivalChannelsFilterForm;
