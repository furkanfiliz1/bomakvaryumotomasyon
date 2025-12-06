import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type {
  CustomerManager,
  MonthOption,
  RepresentativeTargetFilters,
  YearOption,
} from '../representative-target-entry.types';

interface FormData {
  userId: string;
  month: string;
  year: string;
}

interface UseRepresentativeTargetFilterFormProps {
  customerManagerList: CustomerManager[];
  monthOptions: MonthOption[];
  yearOptions: YearOption[];
  initialFilters?: Partial<RepresentativeTargetFilters>;
  onFilterChange: (filters: Partial<RepresentativeTargetFilters>) => void;
}

/**
 * Hook for managing representative target filter form
 * Follows OperationPricing pattern exactly
 */
function useRepresentativeTargetFilterForm({
  customerManagerList,
  monthOptions,
  yearOptions,
  initialFilters,
  onFilterChange,
}: UseRepresentativeTargetFilterFormProps) {
  // Initialize with provided filters or defaults
  const initialValues: FormData = {
    userId: initialFilters?.userId || '',
    month: initialFilters?.month || '',
    year: initialFilters?.year || '',
  };

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    const baseFields: yup.AnyObject = {
      userId: fields
        .select(customerManagerList || [], 'string', ['Id', 'FullName'])
        .label('Müşteri Temsilcisi')
        .meta({ col: 4 }),
      month: fields.select(monthOptions, 'string', ['value', 'label']).label('Ay').meta({ col: 4 }),
      year: fields.select(yearOptions, 'string', ['value', 'label']).label('Yıl').meta({ col: 4 }),
    };

    return yup.object(baseFields);
  }, [customerManagerList, monthOptions, yearOptions]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Update form when URL parameters change
  useEffect(() => {
    if (initialFilters) {
      form.reset({
        userId: initialFilters.userId || '',
        month: initialFilters.month || '',
        year: initialFilters.year || '',
      });
    }
  }, [initialFilters, form]);

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format - following OperationPricing pattern exactly
    const filters: Partial<RepresentativeTargetFilters> = {
      userId: formData.userId || undefined,
      month: formData.month || undefined,
      year: formData.year || undefined,
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

export default useRepresentativeTargetFilterForm;
