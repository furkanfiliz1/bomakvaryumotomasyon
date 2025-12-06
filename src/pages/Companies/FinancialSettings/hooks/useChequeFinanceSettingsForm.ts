import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery } from '../../companies.api';
import type { FinancerRatioModel } from '../financial-settings.types';

interface ChequeFinanceSettingsFormData {
  Currencies: number[];
  IsAutoReturnedBill: boolean;
  IsManuelChargedBill: boolean;
  IsMultipleBill: boolean;
}

interface UseChequeFinanceSettingsFormProps {
  initialData?: Partial<FinancerRatioModel>;
  initialCurrencies?: number[];
}

/**
 * Custom hook for Cheque Finance Settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useChequeFinanceSettingsForm = ({
  initialData,
  initialCurrencies = [],
}: UseChequeFinanceSettingsFormProps) => {
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
  const initialValues: ChequeFinanceSettingsFormData = useMemo(
    () => ({
      Currencies: initialCurrencies,
      IsAutoReturnedBill: initialData?.IsAutoReturnedBill || false,
      IsManuelChargedBill: initialData?.IsManuelChargedBill || false,
      IsMultipleBill: initialData?.IsMultipleBill || false,
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

        IsAutoReturnedBill: fields.switchField.label('Otomatik iade aktif mi ?').meta({ col: 6 }),

        IsManuelChargedBill: fields.switchField.label('Manuel tahsilat girişi aktif mi ?').meta({ col: 6 }),

        IsMultipleBill: fields.switchField
          .label('Aynı iskonto talebinde birden fazla çek yer alabilir mi?')
          .meta({ col: 12 }),
      }),
    [currencyOptions],
  );

  // Create form instance
  const form = useForm<ChequeFinanceSettingsFormData>({
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
