import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnyObject } from 'yup';

import { CompanySearchResponse, CompensationTransactionFilters } from '../compensation-transactions.types';

interface FormData {
  identifier: string;
  type: string;
  startTransactionDate: string;
  endTransactionDate: string;
}

interface UseCompensationTransactionsFilterFormProps {
  transactionTypeList: Array<{ Value: string; Description: string }>;
  companySearchResults: CompanySearchResponse[];
  isCompanySearchLoading: boolean;
  searchCompaniesByNameOrIdentifier: (CompanyNameOrIdentifier?: string) => Promise<void>;
  onFilterChange: (filters: Partial<CompensationTransactionFilters>) => void;
}

function useCompensationTransactionsFilterForm({
  transactionTypeList,
  companySearchResults,
  isCompanySearchLoading,
  searchCompaniesByNameOrIdentifier,
  onFilterChange,
}: UseCompensationTransactionsFilterFormProps) {
  // Initialize with default date range (today)

  const initialValues: FormData = {
    identifier: '',
    type: '',
    startTransactionDate: '',
    endTransactionDate: '',
  };

  // Form validation schema following OperationPricing pattern
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      identifier: fields
        .asyncAutoComplete(
          companySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchCompaniesByNameOrIdentifier,
          isCompanySearchLoading,
          3, // minimum search length
        )
        .label('Ünvan / VKN')
        .meta({ col: 3, placeholder: 'Ara' }),
      type: fields
        .select(transactionTypeList, 'string', ['Value', 'Description'])
        .label('İşlem Tipi')
        .meta({ col: 3, showSelectOption: true }),
      startTransactionDate: fields.date.label('Başlangıç Tarihi').meta({ col: 3 }),
      endTransactionDate: fields.date.label('Bitiş Tarihi').meta({ col: 3 }),
    };

    return yup.object(baseFields);
  }, [transactionTypeList, companySearchResults, isCompanySearchLoading, searchCompaniesByNameOrIdentifier]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    const filters: Partial<CompensationTransactionFilters> = {
      identifier: formData.identifier || undefined,
      type: formData.type || undefined,
      startTransactionDate: formData.startTransactionDate,
      endTransactionDate: formData.endTransactionDate,
    };

    onFilterChange(filters);
  };

  return {
    form,
    schema,
    handleSearch,
  };
}

export { useCompensationTransactionsFilterForm };
