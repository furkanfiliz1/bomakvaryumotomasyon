import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { BankInvoiceReconciliationFilterFormValues } from '../bank-invoice-reconciliation.types';
import { useBankInvoiceReconciliationDropdownData } from './useBankInvoiceReconciliationDropdownData';

interface UseBankInvoiceReconciliationFilterFormProps {
  onFilterChange: (filters: Partial<BankInvoiceReconciliationFilterFormValues>) => void;
}

/**
 * Custom hook for managing Bank Invoice Reconciliation filter form
 * Following OperationPricing pattern for form management with React Hook Form + Yup
 */
export const useBankInvoiceReconciliationFilterForm = ({
  onFilterChange,
}: UseBankInvoiceReconciliationFilterFormProps) => {
  const { buyers, banks, monthOptions, yearOptions } = useBankInvoiceReconciliationDropdownData();

  // Form validation schema following OperationPricing pattern
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      receiverIdentifier: fields
        .autoComplete(buyers, 'string', ['value', 'label'])
        .required('Alıcı şirket seçimi zorunludur')
        .label('Alıcı Şirket VKN')
        .meta({ col: 3 }),
      financerIdentifier: fields
        .autoComplete(banks, 'string', ['value', 'label'])
        .required('Finans şirket seçimi zorunludur')
        .label('Finans Şirket VKN')
        .meta({ col: 3 }),
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
  }, [buyers, banks, monthOptions, yearOptions]);

  // Initialize form with default values matching legacy behavior
  const initialValues: BankInvoiceReconciliationFilterFormValues = {
    receiverIdentifier: '',
    financerIdentifier: '',
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

    // Check if required VKN fields are selected - don't send request if not
    if (!formData.receiverIdentifier || !formData.financerIdentifier || !isValid) {
      return; // Don't proceed if required fields are empty or form is invalid
    }

    // Transform form data to API filter format
    const filters: Partial<BankInvoiceReconciliationFilterFormValues> = {
      receiverIdentifier: formData.receiverIdentifier,
      financerIdentifier: formData.financerIdentifier,
      month: formData.month,
      year: formData.year,
    };

    onFilterChange(filters);
  };

  return {
    form,
    schema,
    handleSearch,
  };
};

// Already exported as named export above
