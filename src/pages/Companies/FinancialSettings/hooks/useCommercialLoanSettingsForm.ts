import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery } from '../../companies.api';
import type { FinancerRatioTTKModel } from '../financial-settings.types';

interface CommercialLoanSettingsFormData {
  Currencies: number[];
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
}

interface UseCommercialLoanSettingsFormProps {
  initialData?: Partial<FinancerRatioTTKModel>;
  initialCurrencies?: number[];
}

/**
 * Custom hook for Commercial Loan Settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useCommercialLoanSettingsForm = ({
  initialData,
  initialCurrencies = [],
}: UseCommercialLoanSettingsFormProps) => {
  // Fetch currencies for dropdown
  const { data: currenciesData = [] } = useGetCurrenciesQuery();

  // Transform currencies data for select field
  const currencyOptions = useMemo(() => {
    return currenciesData.map((currency) => ({
      value: currency.Id,
      label: currency.Code,
    }));
  }, [currenciesData]);

  // Initial form values
  const initialValues: CommercialLoanSettingsFormData = useMemo(
    () => ({
      Currencies: initialCurrencies,
      IsAutoReturned: initialData?.IsAutoReturned || false,
      IsManuelCharged: initialData?.IsManuelCharged || false,
    }),
    [initialData, initialCurrencies],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        Currencies: fields
          .multipleSelect(currencyOptions, 'number', ['value', 'label'])
          .label('Para Birimi')
          .meta({ col: 12 }),

        IsAutoReturned: fields.switchField.label('Otomatik iade aktif mi ?').meta({ col: 12 }),

        IsManuelCharged: fields.switchField.label('Manuel tahsilat girişi aktif mi ?').meta({ col: 12 }),
      }),
    [currencyOptions],
  );

  // Create form instance
  const form = useForm<CommercialLoanSettingsFormData>({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
};
