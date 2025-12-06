import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { BuyerCompany, FinancerCompany } from '../bank-buyer-rates.types';

/**
 * Hook for managing bank buyer rates create form
 * Following OperationPricing pattern exactly
 */

interface UseBankBuyerRatesCreateFormProps {
  buyerList: BuyerCompany[];
  financerList: FinancerCompany[];
}

export const useBankBuyerRatesCreateForm = ({ buyerList, financerList }: UseBankBuyerRatesCreateFormProps) => {
  // Create schema with dynamic dropdown options
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      receiverCompanyId: fields
        .select(buyerList || [], 'number', ['Id', 'CompanyName'])
        .nullable()
        .label('Alıcı Şirket')
        .meta({ col: 6 }),
      financerCompanyId: fields
        .select(financerList || [], 'number', ['Id', 'CompanyName'])
        .nullable()
        .label('Finansör Şirket')
        .meta({ col: 6 }),
      rate: fields.text.nullable().label('Gelir Oranı').meta({ col: 6 }),
      amount: fields.text.nullable().label('Gelir Tutarı').meta({ col: 6 }),
      isConsensus: fields
        .select(
          [
            { value: 1, label: 'Evet' },
            { value: 0, label: 'Hayır' },
          ],
          'number',
          ['value', 'label'],
        )
        .required('Mutabakat seçimi zorunludur')
        .label('Mutabakat Yapılacak mı?')
        .meta({ col: 12 }),
    };

    return yup.object(baseFields);
  }, [buyerList, financerList]);

  // Initialize form
  const form = useForm({
    defaultValues: {
      receiverCompanyId: null,
      financerCompanyId: null,
      rate: '',
      amount: '',
      isConsensus: 1,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  return {
    form,
    schema,
  };
};

export default useBankBuyerRatesCreateForm;
