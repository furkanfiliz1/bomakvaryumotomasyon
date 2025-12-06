import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FinancerRatioSpotModel } from '../financial-settings.types';

interface SpotLoanSettingsFormData {
  MinInvoiceDay: number | null;
  MaxInvoiceDayForSpotLoan: number | null;
  MaxInvoiceDueDayForSpotLoan: number | null;
}

interface UseSpotLoanSettingsFormProps {
  initialData?: Partial<FinancerRatioSpotModel>;
}

/**
 * Custom hook for Spot Loan Settings form management (first form section)
 * Following OperationPricing patterns with Form component integration
 */
export const useSpotLoanSettingsForm = ({ initialData }: UseSpotLoanSettingsFormProps) => {
  // Initial form values
  const initialValues: SpotLoanSettingsFormData = useMemo(
    () => ({
      MinInvoiceDay: initialData?.MinInvoiceDay || null,
      MaxInvoiceDayForSpotLoan: initialData?.MaxInvoiceDayForSpotLoan || null,
      MaxInvoiceDueDayForSpotLoan: initialData?.MaxInvoiceDueDayForSpotLoan || null,
    }),
    [initialData],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        MinInvoiceDay: fields.number.nullable().label('Fatura Kesim Tarihi Bekleme Süresi').meta({
          col: 6,
          endAdornmentText: 'GÜN',
          subText: 'Fatura kesim tarihinden itibaren minimum geçmesi gereken gün sayısı',
        }),

        MaxInvoiceDayForSpotLoan: fields.number.nullable().label('Maksimum Fatura Kesim Tarihi').meta({
          col: 6,
          endAdornmentText: 'GÜN',
          subText: 'Fatura kesim tarihinden itibaren maksimum geçmesi gereken gün sayısı',
        }),

        MaxInvoiceDueDayForSpotLoan: fields.number.nullable().label('Maksimum Genel Vade Gün Sayısı').meta({
          col: 12,
          endAdornmentText: 'GÜN',
        }),
      }),
    [],
  );

  // Create form instance
  const form = useForm<SpotLoanSettingsFormData>({
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
