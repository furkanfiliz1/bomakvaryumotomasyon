import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { GeneralInformationFormData, TransferListItem } from '../company-general-tab.types';
import { createGeneralInformationSchema } from '../helpers';

/**
 * Hook for managing general information form
 * Following OperationPricing pattern for form management
 */
export const useGeneralInformationForm = (currentIntegrator: TransferListItem | null) => {
  const schema = createGeneralInformationSchema();

  const form = useForm<GeneralInformationFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      transferActive: false,
      startTransferDate: null,
    },
  });

  // Update form values when currentIntegrator changes
  useEffect(() => {
    if (currentIntegrator) {
      const defaultStartDate = currentIntegrator.Config?.StartTransferDate
        ? dayjs(currentIntegrator.Config.StartTransferDate).toISOString()
        : dayjs().subtract(90, 'day').toISOString();

      form.reset({
        transferActive: currentIntegrator.Config?.IsActive || false,
        startTransferDate: defaultStartDate,
      });
    }
  }, [currentIntegrator, form]);

  return {
    form,
    schema,
  };
};
