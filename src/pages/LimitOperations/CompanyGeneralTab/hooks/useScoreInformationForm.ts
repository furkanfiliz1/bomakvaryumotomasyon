import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ScoreCompanyData, ScoreInformationFormData } from '../company-general-tab.types';
import { createScoreInformationSchema } from '../helpers';

/**
 * Hook for managing score information form
 * Following OperationPricing pattern for form management
 */
export const useScoreInformationForm = (scoreCompany: ScoreCompanyData | undefined) => {
  const schema = createScoreInformationSchema();

  const form = useForm<ScoreInformationFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nextOutgoingDate: dayjs().toISOString(),
    },
  });

  // Update form values when scoreCompany changes
  useEffect(() => {
    if (scoreCompany?.LastScoreDate) {
      form.reset({
        nextOutgoingDate: dayjs(scoreCompany.LastScoreDate).toISOString(),
      });
    }
  }, [scoreCompany, form]);

  return {
    form,
    schema,
  };
};
