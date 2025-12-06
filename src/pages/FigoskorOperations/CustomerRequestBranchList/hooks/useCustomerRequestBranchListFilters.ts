import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { CustomerRequestBranchListFilters, StatusOption } from '../customer-request-branch-list.types';

interface UseCustomerRequestBranchListFiltersProps {
  statusOptions: StatusOption[];
  onFilterChange: (filters: Partial<CustomerRequestBranchListFilters>) => void;
  initialValues?: Partial<CustomerRequestBranchListFilters>;
}

// Filter form data type (subset of full filters)
interface FilterFormData {
  TargetCompanyIdentifier: string;
  TargetCompanyTitle: string;
  status: string;
}

/**
 * Hook for managing customer request branch list filter form
 * Following OperationPricing filter form pattern with Form component integration
 */
export const useCustomerRequestBranchListFilters = ({
  statusOptions,
  onFilterChange,
  initialValues,
}: UseCustomerRequestBranchListFiltersProps) => {
  // Form schema following OperationPricing pattern exactly
  const filterSchema = useMemo(() => {
    return yup.object({
      TargetCompanyIdentifier: fields.text.label('VKN').meta({ col: 4 }),

      TargetCompanyTitle: fields.text.label('UNVAN').meta({ col: 4 }),

      status: fields
        .select(statusOptions, 'string', ['value', 'label'])
        .label('Durum')
        .meta({ col: 4, showSelectOption: true })
        .optional()
        .nullable(),
    });
  }, [statusOptions]);

  // Initial values for the form
  const defaultValues: FilterFormData = {
    TargetCompanyIdentifier: initialValues?.TargetCompanyIdentifier || '',
    TargetCompanyTitle: initialValues?.TargetCompanyTitle || '',
    status: initialValues?.status || '',
  };

  // Form setup with initial values
  const form = useForm({
    resolver: yupResolver(filterSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Handle form submission (filter search)
  const handleSearch = useCallback(() => {
    const formData = form.getValues();

    // Reset to first page when searching and ensure proper types
    const searchParams: Partial<CustomerRequestBranchListFilters> = {
      TargetCompanyIdentifier: formData.TargetCompanyIdentifier,
      TargetCompanyTitle: formData.TargetCompanyTitle,
      status: String(formData.status || ''),
      page: 1,
    };

    onFilterChange(searchParams);
  }, [form, onFilterChange]);

  return {
    form,
    schema: filterSchema,
    handleSearch,
  };
};
