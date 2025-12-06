import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery } from '../../companies.api';
import type { FinancerRatioTFSModel } from '../financial-settings.types';

interface SupplierFinanceSettingsFormData {
  Currencies: number[];
  IsAutoReturned: boolean;
  IsIbanRequired: boolean;
  IsOnlyBankIbanAccepted: boolean;
}

interface UseSupplierFinanceSettingsFormProps {
  initialData?: Partial<FinancerRatioTFSModel>;
  initialCurrencies?: number[];
}

/**
 * Custom hook for Supplier Finance Settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useSupplierFinanceSettingsForm = ({
  initialData,
  initialCurrencies = [],
}: UseSupplierFinanceSettingsFormProps) => {
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
  const initialValues: SupplierFinanceSettingsFormData = useMemo(
    () => ({
      Currencies: initialCurrencies,
      IsAutoReturned: initialData?.IsAutoReturned || false,
      IsIbanRequired: initialData?.IsIbanRequired || false,
      IsOnlyBankIbanAccepted: initialData?.IsOnlyBankIbanAccepted || false,
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

        IsAutoReturned: fields.switchField.label('Otomatik iade aktif mi ?').meta({ col: 6 }),

        IsIbanRequired: fields.switchField.label('IBAN girişi zorunlu mu?').meta({ col: 6 }),

        IsOnlyBankIbanAccepted: fields.switchField.label('IBAN Bankaya ait olmalı mı?').meta({ col: 12 }),
      }),
    [currencyOptions],
  );

  // Create form instance
  const form = useForm<SupplierFinanceSettingsFormData>({
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
