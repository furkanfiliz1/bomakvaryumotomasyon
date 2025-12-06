import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { BankBuyerRatesFilters, BuyerCompany, FinancerCompany } from '../bank-buyer-rates.types';

/**
 * Hook for managing bank buyer rates filter form
 * Following OperationPricing pattern exactly
 */

interface UseBankBuyerRatesFilterFormProps {
  buyerList: BuyerCompany[];
  financerList: FinancerCompany[];
  initialFilters?: Partial<BankBuyerRatesFilters>;
  onFilterChange?: (filters: BankBuyerRatesFilters) => void;
}

export const useBankBuyerRatesFilterForm = ({
  buyerList,
  financerList,
  initialFilters = {},
  onFilterChange,
}: UseBankBuyerRatesFilterFormProps) => {
  // Create schema with dynamic dropdown options
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      ReceiverCompanyId: fields
        .select(buyerList || [], 'number', ['Id', 'CompanyName'])
        .nullable()
        .label('Alıcı Şirket')
        .meta({ col: 6 }),
      FinancerCompanyId: fields
        .select(financerList || [], 'number', ['Id', 'CompanyName'])
        .nullable()
        .label('Finansör Şirket')
        .meta({ col: 6 }),
    };

    return yup.object(baseFields);
  }, [buyerList, financerList]);

  // Initialize form with initial filters
  const form = useForm({
    defaultValues: {
      ReceiverCompanyId: initialFilters.ReceiverCompanyId || null,
      FinancerCompanyId: initialFilters.FinancerCompanyId || null,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  // Handle search button click
  const handleSearch = () => {
    const values = form.getValues();
    const filters: BankBuyerRatesFilters = {
      ReceiverCompanyId: values.ReceiverCompanyId || undefined,
      FinancerCompanyId: values.FinancerCompanyId || undefined,
    };

    onFilterChange?.(filters);
  };

  return {
    form,
    schema,
    handleSearch,
  };
};

export default useBankBuyerRatesFilterForm;
