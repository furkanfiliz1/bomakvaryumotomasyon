import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FinancerRatioSpotWithoutInvoiceModel } from '../financial-settings.types';

interface SpotLoanWithoutInvoiceSettingsFormData {
  MaxInvoiceDueDayForSpotLoanWithoutInvoice: number | null;
}

interface UseSpotLoanWithoutInvoiceSettingsFormProps {
  initialData?: Partial<FinancerRatioSpotWithoutInvoiceModel>;
}

/**
 * Custom hook for Spot Loan Without Invoice Settings form management (first form section)
 * Following OperationPricing patterns with Form component integration
 */
export const useSpotLoanWithoutInvoiceSettingsForm = ({ initialData }: UseSpotLoanWithoutInvoiceSettingsFormProps) => {
  // Initial form values
  const initialValues: SpotLoanWithoutInvoiceSettingsFormData = useMemo(
    () => ({
      MaxInvoiceDueDayForSpotLoanWithoutInvoice: initialData?.MaxInvoiceDueDayForSpotLoanWithoutInvoice || null,
    }),
    [initialData],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        MaxInvoiceDueDayForSpotLoanWithoutInvoice: fields.number
          .nullable()
          .label('Maksimum Genel Vade Gün Sayısı')
          .meta({
            col: 12,
            endAdornmentText: 'GÜN',
          }),
      }),
    [],
  );

  // Create form instance
  const form = useForm<SpotLoanWithoutInvoiceSettingsFormData>({
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
