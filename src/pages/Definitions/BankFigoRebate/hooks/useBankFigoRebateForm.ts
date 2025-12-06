/**
 * Hook for bank figo rebate create form
 * Following OperationPricing pattern exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { FinancerCompanyOption } from '../bank-figo-rebate.types';

interface UseBankFigoRebateFormProps {
  financerCompanyList: FinancerCompanyOption[];
}

function useBankFigoRebateForm({ financerCompanyList }: UseBankFigoRebateFormProps) {
  const initialValues = {
    FinancerCompanyId: '',
    StartDate: '',
    FinishDate: '',
    Rate: '',
  };

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    return yup.object({
      FinancerCompanyId: fields
        .select(financerCompanyList, 'string', ['Id', 'CompanyName'])
        .required('Finans şirketi zorunludur')
        .label('Finans Şirketi')
        .meta({ col: 3 }),
      StartDate: fields.date.required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({ col: 2 }),
      FinishDate: fields.date.optional().label('Bitiş Tarihi').meta({ col: 2 }),
      Rate: fields.text.required('Oran zorunludur').label('Oran').meta({ col: 2 }),
    });
  }, [financerCompanyList]);

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

export default useBankFigoRebateForm;
