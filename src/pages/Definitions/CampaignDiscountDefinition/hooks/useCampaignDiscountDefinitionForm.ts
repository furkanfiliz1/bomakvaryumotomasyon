/**
 * Hook for campaign discount definition create form
 * Following BankFigoRebate pattern exactly
 */

import { fields } from '@components';
import { MONTHS } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CAMPAIGN_TYPES, DEFAULT_CAMPAIGN_TYPE, YEARS } from '../helpers';

function useCampaignDiscountDefinitionForm() {
  const initialValues = {
    Month: '',
    Year: '',
    Ratio: '',
    campaignType: String(DEFAULT_CAMPAIGN_TYPE),
  };

  // Form schema following BankFigoRebate pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      Month: fields
        .select(MONTHS, 'string', ['id', 'name'])
        .required('Ay seçimi zorunludur')
        .label('Ay')
        .meta({ col: 2 }),
      Year: fields
        .select(YEARS, 'string', ['value', 'label'])
        .required('Yıl seçimi zorunludur')
        .label('Yıl')
        .meta({ col: 2 }),
      Ratio: fields.text.required('İndirim oranı zorunludur').label('İndirim Oranı (%)').meta({ col: 2 }),
      campaignType: fields
        .select(CAMPAIGN_TYPES, 'string', ['value', 'label'], true)
        .label('Kampanya Tipi')
        .meta({ col: 2 }),
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

export default useCampaignDiscountDefinitionForm;
