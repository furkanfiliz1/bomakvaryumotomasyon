import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrenciesQuery } from '../../companies.api';
import type { FinancerRatioModel } from '../financial-settings.types';

interface InvoiceFinanceSettingsFormData {
  MinInvoiceDay: number;
  MaxInvoiceDay: number | null;
  MaxInvoiceDueDayForEasyFinancing: number | null;
  IsWorkingDayRuleApply: boolean;
}

interface UseInvoiceFinanceSettingsFormProps {
  initialData?: Partial<FinancerRatioModel>;
}

/**
 * Custom hook for Invoice Finance Settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useInvoiceFinanceSettingsForm = ({ initialData }: UseInvoiceFinanceSettingsFormProps) => {
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
  const initialValues: InvoiceFinanceSettingsFormData = useMemo(
    () => ({
      MinInvoiceDay: initialData?.MinInvoiceDay || 0,
      MaxInvoiceDay: initialData?.MaxInvoiceDay || null,
      MaxInvoiceDueDayForEasyFinancing: initialData?.MaxInvoiceDueDayForEasyFinancing || null,
      IsWorkingDayRuleApply: initialData?.IsWorkingDayRuleApply || false,
    }),
    [initialData],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        MinInvoiceDay: fields.number
          .required('Zorunlu alan')
          .min(0, 'Minimum 0 olabilir')
          .label('Fatura Kesim Tarihi Bekleme Süresi')
          .meta({ col: 6, subText: 'Fatura kesim tarihinden itibaren minimum geçmesi gereken gün sayısı' }),

        MaxInvoiceDay: fields.number
          .nullable()
          .min(0, 'Minimum 0 olabilir')
          .label('Maksimum Fatura Kesim Tarihi')
          .meta({ col: 6, subText: 'Fatura kesim tarihinden itibaren maksimum geçmesi gereken gün sayısı' }),

        MaxInvoiceDueDayForEasyFinancing: fields.number
          .nullable()
          .min(0, 'Minimum 0 olabilir')
          .label('Maksimum Genel Vade Gün Sayısı')
          .meta({ col: 12 }),

        IsWorkingDayRuleApply: fields.switchField
          .label('Minimum vade iş günleri ile hesaplansın mı?')
          .meta({ col: 12 }),
      }),
    [],
  );

  // Create form instance
  const form = useForm<InvoiceFinanceSettingsFormData>({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  return {
    form,
    schema,
    currencyOptions,
  };
};
