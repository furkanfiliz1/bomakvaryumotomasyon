import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery } from '../../companies.api';
import type { FinancerRatioRCModel } from '../financial-settings.types';

interface RotativeCreditCurrencyAndSettingsFormData {
  Currencies: number[];
  MarginRatio: number | null;
  IsAutoReturned: boolean;
  IsManuelCharged: boolean;
}

interface UseRotativeCreditCurrencyAndSettingsFormProps {
  initialData?: Partial<FinancerRatioRCModel>;
  initialCurrencies?: number[];
}

/**
 * Custom hook for Rotative Credit currency and settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useRotativeCreditCurrencyAndSettingsForm = ({
  initialData,
  initialCurrencies = [],
}: UseRotativeCreditCurrencyAndSettingsFormProps) => {
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
  const initialValues: RotativeCreditCurrencyAndSettingsFormData = useMemo(
    () => ({
      Currencies: initialCurrencies,
      MarginRatio: initialData?.MarginRatio || null,
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

        MarginRatio: fields.number.min(0).max(100).label('Marj Oranı').meta({
          col: 12,
          endAdornmentText: '%',
        }),

        IsAutoReturned: fields.switchField.label('Otomatik iade aktif mi ?').meta({ col: 12 }),

        IsManuelCharged: fields.switchField.label('Manuel tahsilat girişi aktif mi ?').meta({ col: 12 }),
      }),
    [currencyOptions],
  );

  // Create form instance
  const form = useForm<RotativeCreditCurrencyAndSettingsFormData>({
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
