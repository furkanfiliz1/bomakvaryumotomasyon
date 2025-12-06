import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ConsensusOption, LeadingChannel } from '../customer-arrival-channels.types';

interface CreateFormData {
  value: string;
  rate: number | null;
  isConsensus: string; // \"true\" or \"false\"
}

interface UpdateFormData {
  Value: string;
  Rate: number | null;
  IsConsensus: string; // \"true\" or \"false\"
}

interface UseCustomerArrivalChannelsFormProps {
  consensusOptions: ConsensusOption[];
  initialData?: LeadingChannel | null;
  isEditing?: boolean;
}

/**
 * Hook for create and update forms
 * Following OperationPricing form patterns with Form and Schema
 */
export const useCustomerArrivalChannelsForm = ({
  consensusOptions,
  initialData,
  isEditing = false,
}: UseCustomerArrivalChannelsFormProps) => {
  // Create form schema
  const createSchema = useMemo(
    () =>
      yup.object({
        value: fields.text.required('Kanal adı zorunludur').label('Kanal Adı').meta({ col: 4 }),
        rate: fields.number.nullable().label('Oran').meta({ col: 4 }),
        isConsensus: fields
          .select(consensusOptions, 'string', ['value', 'label'])
          .required('Mutabakat durumu zorunludur')
          .label('Mutabakat')
          .meta({ col: 4 }),
      }),
    [consensusOptions],
  );

  // Update form schema (keys match API request)
  const updateSchema = useMemo(
    () =>
      yup.object({
        Value: fields.text.required('Kanal adı zorunludur').label('Kanal Adı').meta({ col: 4 }),
        Rate: fields.number.nullable().label('Oran').meta({ col: 4 }),
        IsConsensus: fields
          .select(consensusOptions, 'string', ['value', 'label'])
          .required('Mutabakat durumu zorunludur')
          .label('Mutabakat')
          .meta({ col: 4 }),
      }),
    [consensusOptions],
  );

  // Create form initialization
  const createForm = useForm<CreateFormData>({
    defaultValues: {
      value: '',
      rate: null,
      isConsensus: 'false', // Default to \"Hayır\"
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createSchema) as any,
    mode: 'onChange',
  });

  // Update form initialization
  const updateForm = useForm<UpdateFormData>({
    defaultValues: initialData
      ? {
          Value: initialData.Value,
          Rate: initialData.Rate,
          IsConsensus: initialData.IsConsensus ? 'true' : 'false',
        }
      : {
          Value: '',
          Rate: null,
          IsConsensus: 'false',
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(updateSchema) as any,
    mode: 'onChange',
  });

  return {
    form: isEditing ? updateForm : createForm,
    schema: isEditing ? updateSchema : createSchema,
  };
};

export default useCustomerArrivalChannelsForm;
