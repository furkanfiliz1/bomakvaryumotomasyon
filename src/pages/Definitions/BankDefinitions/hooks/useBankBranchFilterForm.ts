import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Bank, BankBranchFilters } from '../bank-definitions.types';

interface FormData {
  bankId: string;
  branchCode: string;
}

interface UseBankBranchFilterFormProps {
  bankList: Bank[];
  initialFilters?: Partial<BankBranchFilters>;
  onFilterChange: (filters: Partial<BankBranchFilters>) => void;
}

/**
 * Hook for managing bank branch filter form
 * Follows RepresentativeTarget pattern exactly
 */
function useBankBranchFilterForm({ bankList, initialFilters, onFilterChange }: UseBankBranchFilterFormProps) {
  // Initialize with provided filters or defaults
  const initialValues: FormData = {
    bankId: initialFilters?.bankId || '',
    branchCode: initialFilters?.branchCode || '',
  };

  // Form schema following RepresentativeTarget pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      bankId: fields
        .select(bankList || [], 'string', ['Id', 'Name'])
        .label('Banka Adı')
        .meta({ col: 6 }),
      branchCode: fields.text.label('Şube Kodu').meta({ col: 6 }),
    };

    return yup.object(baseFields);
  }, [bankList]);

  const form = useForm({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange' as const,
  });

  // Update form when URL parameters change
  useEffect(() => {
    if (initialFilters) {
      form.reset({
        bankId: initialFilters.bankId || '',
        branchCode: initialFilters.branchCode || '',
      });
    }
  }, [initialFilters, form]);

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format
    const filters: Partial<BankBranchFilters> = {
      bankId: formData.bankId || undefined,
      branchCode: formData.branchCode || undefined,
      page: 1, // Reset to first page when filtering
    };

    onFilterChange(filters);
  };

  return {
    form,
    schema,
    handleSearch,
  };
}

export default useBankBranchFilterForm;
