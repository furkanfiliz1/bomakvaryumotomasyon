import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FinancerRatioRCModel } from '../financial-settings.types';

interface RotativeCreditDateSettingsFormData {
  MinInvoiceDay: number | null;
  MaxInvoiceDayForRevolvingCredit: number | null;
  MaxInvoiceDueDayForRevolvingCredit: number | null;
}

interface UseRotativeCreditDateSettingsFormProps {
  initialData?: Partial<FinancerRatioRCModel>;
}

/**
 * Custom hook for Rotative Credit date settings form management
 * Following OperationPricing patterns with Form component integration
 */
export const useRotativeCreditDateSettingsForm = ({ initialData }: UseRotativeCreditDateSettingsFormProps = {}) => {
  // Initial form values
  const initialValues: RotativeCreditDateSettingsFormData = useMemo(
    () => ({
      MinInvoiceDay: initialData?.MinInvoiceDay || null,
      MaxInvoiceDayForRevolvingCredit: initialData?.MaxInvoiceDayForRevolvingCredit || null,
      MaxInvoiceDueDayForRevolvingCredit: initialData?.MaxInvoiceDueDayForRevolvingCredit || null,
    }),
    [initialData],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        MinInvoiceDay: fields.number.label('Fatura Kesim Tarihi Bekleme Süresi').meta({
          col: 6,
          endAdornmentText: 'GÜN',
          subText: 'Fatura kesim tarihinden itibaren minimum geçmesi gereken gün sayısı',
        }),

        MaxInvoiceDayForRevolvingCredit: fields.number.label('Maksimum Fatura Kesim Tarihi').meta({
          col: 6,
          endAdornmentText: 'GÜN',
          subText: 'Fatura kesim tarihinden itibaren maksimum geçmesi gereken gün sayısı',
        }),

        MaxInvoiceDueDayForRevolvingCredit: fields.number.label('Maksimum Genel Vade Gün Sayısı').meta({
          col: 12,
          endAdornmentText: 'GÜN',
        }),
      }),
    [],
  );

  // Create form instance
  const form = useForm<RotativeCreditDateSettingsFormData>({
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
