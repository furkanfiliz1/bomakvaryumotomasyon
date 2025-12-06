import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';
import type { CompanySearchResult, GuaranteeProtocolFilterFormValues } from '../guarantee-protocol.types';

/**
 * Form management hook for Guarantee Protocol filters
 * Following OperationPricing pattern exactly with React Hook Form + Yup validation
 */

interface FormData {
  FinancerIdentifier: string | number;
  SenderIdentifier: string | number;
  StartDate: string;
  EndDate: string;
}

interface UseGuaranteeProtocolFilterFormProps {
  onFilterChange: (filters: Partial<GuaranteeProtocolFilterFormValues>) => void;
  // Async search props
  financiersCompanySearchResults: CompanySearchResult[];
  sendersCompanySearchResults: CompanySearchResult[];
  searchFinanciersByCompanyNameOrIdentifier: (query: string) => Promise<void>;
  searchSendersByCompanyNameOrIdentifier: (query: string) => Promise<void>;
  isFinanciersSearchLoading: boolean;
  isSendersSearchLoading: boolean;
}

export const useGuaranteeProtocolFilterForm = ({
  onFilterChange,
  financiersCompanySearchResults,
  sendersCompanySearchResults,
  searchFinanciersByCompanyNameOrIdentifier,
  searchSendersByCompanyNameOrIdentifier,
  isFinanciersSearchLoading,
  isSendersSearchLoading,
}: UseGuaranteeProtocolFilterFormProps) => {
  // Validation schema with async autocomplete fields
  const schema = useMemo(() => {
    return yup.object({
      FinancerIdentifier: fields
        .asyncAutoComplete(
          financiersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchFinanciersByCompanyNameOrIdentifier,
          isFinanciersSearchLoading,
          3,
        )
        .required('Finansör VKN zorunludur')
        .meta({ label: 'Finansör VKN', placeholder: 'Ara', col: 3 }),

      SenderIdentifier: fields
        .asyncAutoComplete(
          sendersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchSendersByCompanyNameOrIdentifier,
          isSendersSearchLoading,
          3,
        )
        .meta({ label: 'Tedarikçi VKN', col: 3, placeholder: 'Ara' }),

      StartDate: fields.date.required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({ col: 3 }),

      EndDate: fields.date.required('Bitiş tarihi zorunludur').label('Bitiş Tarihi').meta({ col: 3 }),
    }) as yup.ObjectSchema<FormData>;
  }, [
    financiersCompanySearchResults,
    sendersCompanySearchResults,
    searchFinanciersByCompanyNameOrIdentifier,
    searchSendersByCompanyNameOrIdentifier,
    isFinanciersSearchLoading,
    isSendersSearchLoading,
  ]);

  // Default values - previous day to today (matching legacy behavior)
  const defaultValues: FormData = useMemo(
    () => ({
      FinancerIdentifier: '',
      SenderIdentifier: '',
      StartDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      EndDate: new Date().toISOString().split('T')[0], // Today
    }),
    [],
  );

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Form submission handler
  const handleSubmit = useCallback(
    (data: FormData) => {
      const filters: GuaranteeProtocolFilterFormValues = {
        FinancerIdentifier: data.FinancerIdentifier ? String(data.FinancerIdentifier).trim() : '',
        SenderIdentifier: data.SenderIdentifier ? String(data.SenderIdentifier).trim() : undefined,
        StartDate: new Date(data.StartDate),
        EndDate: new Date(data.EndDate),
      };

      onFilterChange(filters);
    },
    [onFilterChange],
  );

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    onFilterChange({
      FinancerIdentifier: '',
      SenderIdentifier: '',
      StartDate: new Date(defaultValues.StartDate),
      EndDate: new Date(defaultValues.EndDate),
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
