import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { AnyObject } from 'yup';
import { BankDiscountReconciliationFilters } from '../bank-discount-reconciliation.types';
import { useBankDiscountReconciliationDropdownData } from './useBankDiscountReconciliationDropdownData';

interface UseBankDiscountReconciliationFilterFormProps {
  onFilterChange: (filters: Partial<BankDiscountReconciliationFilters>) => void;
}

/**
 * Custom hook for managing Bank Discount Reconciliation filter form
 * Following BankInvoiceReconciliation pattern exactly with async autocomplete fields
 */
export const useBankDiscountReconciliationFilterForm = ({
  onFilterChange,
}: UseBankDiscountReconciliationFilterFormProps) => {
  const {
    monthOptions,
    yearOptions,
    // Async search data
    buyersCompanySearchResults,
    banksCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchBanksByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isBanksSearchLoading,
  } = useBankDiscountReconciliationDropdownData();

  // Form validation schema following BankInvoiceReconciliation pattern with async autocomplete
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      identifier: fields
        .asyncAutoComplete(
          buyersCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchBuyersByCompanyNameOrIdentifier,
          isBuyersSearchLoading,
          3,
        )
        .required('Alıcı şirket seçimi zorunludur')
        .label('Alıcı Şirket VKN')
        .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' }),
      financerCompanyIdentifier: fields
        .asyncAutoComplete(
          banksCompanySearchResults,
          'string',
          ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
          searchBanksByCompanyNameOrIdentifier,
          isBanksSearchLoading,
          3,
        )
        .required('Finans şirket seçimi zorunludur')
        .label('Finans Şirket VKN')
        .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' }),
      month: fields
        .select(monthOptions, 'number', ['value', 'label'])
        .required('Ay seçimi zorunludur')
        .label('Ay')
        .meta({ col: 3 }),
      year: fields
        .select(yearOptions, 'number', ['value', 'label'])
        .required('Yıl seçimi zorunludur')
        .label('Yıl')
        .meta({ col: 3 }),
    };

    return yup.object(baseFields);
  }, [
    monthOptions,
    yearOptions,
    buyersCompanySearchResults,
    banksCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchBanksByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isBanksSearchLoading,
  ]);

  // Initialize form with default values matching BankInvoiceReconciliation behavior
  const initialValues: BankDiscountReconciliationFilters = {
    identifier: '',
    financerCompanyIdentifier: '',
    month: 1, // Default to January
    year: new Date().getFullYear(), // Default to current year
  };

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = async () => {
    // Validate form before searching - await for async validation to complete
    const isValid = await form.trigger();
    const formData = form.getValues();

    if (!formData.identifier || !formData.financerCompanyIdentifier || !isValid) {
      return;
    }

    const filters: Partial<BankDiscountReconciliationFilters> = {
      identifier: formData.identifier,
      financerCompanyIdentifier: formData.financerCompanyIdentifier,
      month: formData.month,
      year: formData.year,
    };

    onFilterChange(filters);
  };

  // Handle form reset - clear form and filters
  const handleReset = () => {
    form.reset(initialValues);
    onFilterChange({
      month: 1,
      year: new Date().getFullYear(),
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    // Async search loading states
    isBuyersSearchLoading,
    isBanksSearchLoading,
  };
};
