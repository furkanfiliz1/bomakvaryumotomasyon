import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { AnyObject } from 'yup';
import { BuyerReconciliationFilters } from '../buyer-reconciliation.types';
import { useBuyerReconciliationDropdownData } from './useBuyerReconciliationDropdownData';

interface UseBuyerReconciliationFilterFormProps {
  onFilterChange: (filters: Partial<BuyerReconciliationFilters>) => void;
}

/**
 * Custom hook for managing Buyer Reconciliation filter form state
 * Follows OperationPricing pattern for form management with validation
 * Matches BankInvoiceReconciliation implementation exactly
 */
export const useBuyerReconciliationFilterForm = ({ onFilterChange }: UseBuyerReconciliationFilterFormProps) => {
  const {
    monthOptions,
    yearOptions,
    buyersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
  } = useBuyerReconciliationDropdownData();

  // Default form values - matching legacy ReceiverInvoiceReconciliation.js
  const initialValues = {
    identifier: '', // Empty string matches legacy default
    month: 1, // January as default (matching legacy)
    year: new Date().getFullYear(), // Current year as number (matching BankInvoiceReconciliation)
  };

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
        .meta({ col: 4, placeholder: 'VKN/Ünvan arayın...' }),
      month: fields
        .select(monthOptions, 'number', ['value', 'label'])
        .required('Ay seçimi zorunludur')
        .label('Ay')
        .meta({ col: 4 }),
      year: fields
        .select(yearOptions, 'number', ['value', 'label'])
        .required('Yıl seçimi zorunludur')
        .label('Yıl')
        .meta({ col: 4 }),
    };

    return yup.object(baseFields);
  }, [
    monthOptions,
    yearOptions,
    buyersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
  ]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Handle search - process form data and trigger filter change
  const handleSearch = async () => {
    // Validate form before searching - await for async validation to complete
    const isValid = await form.trigger();
    const formData = form.getValues();

    if (!formData.identifier || !isValid) {
      return;
    }

    const filters: Partial<BuyerReconciliationFilters> = {
      identifier: formData.identifier,
      month: formData.month,
      year: formData.year,
    };

    onFilterChange(filters);
  };

  // Handle form reset - clear form and filters
  const handleReset = () => {
    form.reset(initialValues);
    onFilterChange({});
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    // Async search loading state
    isBuyersSearchLoading,
  };
};
