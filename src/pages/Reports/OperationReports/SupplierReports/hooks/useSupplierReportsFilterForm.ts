import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SupplierReportsFilters } from '../supplier-reports.types';

interface FormData {
  startDate: string;
  endDate: string;
  receiverIdentifier?: string; // Alıcı VKN
  senderIdentifier?: string; // Satıcı VKN
  IsActive?: string; // Aktiflik ('1' for active, '0' for passive)
}

interface UseSupplierReportsFilterFormProps {
  onFilterChange: (filters: Partial<SupplierReportsFilters>) => void;
}

function useSupplierReportsFilterForm({ onFilterChange }: UseSupplierReportsFilterFormProps) {
  // Initialize with default date range (last 30 days to today) - matching legacy system
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const initialValues: FormData = {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    receiverIdentifier: '',
    senderIdentifier: '',
    IsActive: '', // Empty for "Tümü" option
  };

  // Form schema - matching legacy system with all filter fields
  const schema = useMemo(() => {
    const isActiveOptions = [
      { label: 'Aktif', value: '1' },
      { label: 'Pasif', value: '0' },
    ];

    const baseFields: yup.AnyObject = {
      receiverIdentifier: fields.text.optional().label('Alıcı VKN').meta({ col: 2 }).nullable().optional(),
      senderIdentifier: fields.text.optional().label('Satıcı VKN').meta({ col: 2 }).nullable().optional(),
      IsActive: fields
        .select(isActiveOptions, 'string', ['value', 'label'])
        .label('Aktiflik')
        .meta({ col: 2, showSelectOption: true })
        .optional()
        .nullable(),
      startDate: fields.date.required('Başlangıç tarihi gerekli').label('Başlangıç Tarihi').meta({ col: 3 }),
      endDate: fields.date.required('Bitiş tarihi gerekli').label('Bitiş Tarihi').meta({ col: 3 }),
    };

    return yup.object(baseFields);
  }, []); // No dependencies needed

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format - matching legacy API exactly
    const filters: Partial<SupplierReportsFilters> = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      receiverIdentifier: formData.receiverIdentifier || undefined,
      senderIdentifier: formData.senderIdentifier || undefined,
      IsActive: formData.IsActive || undefined,
      page: 1, // Reset to first page when filtering
    };

    onFilterChange(filters);
  };

  const handleClear = () => {
    form.reset(initialValues);
    onFilterChange({
      page: 1,
      startDate: initialValues.startDate,
      endDate: initialValues.endDate,
      receiverIdentifier: undefined,
      senderIdentifier: undefined,
      IsActive: undefined,
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleClear,
  };
}

export default useSupplierReportsFilterForm;
