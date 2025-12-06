/**
 * Hook for İş Bankası rate create form
 * Following CampaignDiscountDefinition pattern exactly
 */

import { fields } from '@components';
import { MONTHS } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { YEARS } from '../helpers';

function useIsBankRatesForm() {
  const initialValues = {
    Year: '',
    Month: '',
    BuyingRate: '',
  };

  // Form schema following CampaignDiscountDefinition pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      Year: fields
        .select(YEARS, 'string', ['value', 'label'])
        .required('Yıl seçimi zorunludur')
        .label('Yıl')
        .meta({ col: 2 }),
      Month: fields
        .select(MONTHS, 'string', ['id', 'name'])
        .required('Ay seçimi zorunludur')
        .label('Ay')
        .meta({ col: 2 }),
      BuyingRate: fields.text.required('Alış Kuru zorunludur').label('Alış Kuru').meta({ col: 2 }),
    });
  }, []);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const resetForm = () => {
    form.reset(initialValues);
  };

  return {
    form,
    schema,
    resetForm,
  };
}

export default useIsBankRatesForm;
