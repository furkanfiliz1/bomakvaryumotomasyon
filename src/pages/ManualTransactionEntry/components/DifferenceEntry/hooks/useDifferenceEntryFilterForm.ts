import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFilterFormWithUrlSync } from '@hooks';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import type {
  DifferenceEntryFilters,
  DifferenceEntryStatus,
  DifferenceEntryType,
  ProcessType,
} from '../../../difference-entry.types';

export interface DifferenceEntryFilterFormData extends Record<string, unknown> {
  DeficiencyType?: number;
  CompanyIdentifier?: string;
  CompanyName?: string;
  ProductType?: number;
  StartDate?: string;
  EndDate?: string;
  DeficiencyStatus?: number;
}

interface UseDifferenceEntryFilterFormProps {
  differenceEntryTypes: DifferenceEntryType[];
  statusList: DifferenceEntryStatus[];
  processTypes: ProcessType[];
  onFilterChange: (filters: Partial<DifferenceEntryFilters>) => void;
}

/**
 * Hook for managing difference entry filter form state
 * Following OperationPricing pattern exactly with Yup schema validation
 */
export const useDifferenceEntryFilterForm = ({
  differenceEntryTypes,
  statusList,
  processTypes,
  onFilterChange,
}: UseDifferenceEntryFilterFormProps) => {
  const defaultValues: DifferenceEntryFilterFormData = useMemo(
    () => ({
      DeficiencyType: '' as unknown as number,
      CompanyIdentifier: '',
      CompanyName: '',
      ProductType: '' as unknown as number,
      StartDate: '',
      EndDate: '',
      DeficiencyStatus: 1, // Default status from legacy implementation
    }),
    [],
  );

  // Form schema following OperationPricing pattern exactly
  const schema = useMemo(() => {
    // Add default "Seçiniz" option to dropdown lists

    const baseFields: yup.AnyObject = {
      DeficiencyType: fields
        .select(differenceEntryTypes, 'number', ['Value', 'Description'])
        .label('Farklılık Tipi')
        .meta({ col: 3, showSelectOption: true })
        .transform((value) => (value === '' ? undefined : Number(value))),

      CompanyIdentifier: fields.text.label('VKN').meta({ col: 3 }),

      CompanyName: fields.text.label('Ünvan').meta({ col: 3 }),

      ProductType: fields
        .select(processTypes, 'number', ['Value', 'Description'])
        .label('Süreç')
        .meta({ col: 3, showSelectOption: true })
        .transform((value) => (value === '' ? undefined : Number(value))),

      StartDate: fields.date.label('Başlangıç Tarihi').meta({ col: 3 }),

      EndDate: fields.date.label('Bitiş Tarihi').meta({ col: 3 }),

      DeficiencyStatus: fields
        .select(statusList, 'number', ['Value', 'Description'])
        .label('Durum')
        .meta({ col: 3, showSelectOption: true })
        .transform((value) => (value === '' ? undefined : Number(value))),
    };

    return yup.object(baseFields);
  }, [differenceEntryTypes, statusList, processTypes]);

  const form = useForm<DifferenceEntryFilterFormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Transform form data to API filter format - following legacy logic exactly
  const transformToApiFilters = (formData: DifferenceEntryFilterFormData): Partial<DifferenceEntryFilters> => {
    return {
      DeficiencyType: formData.DeficiencyType || undefined,
      CompanyIdentifier: formData.CompanyIdentifier?.trim() || undefined,
      CompanyName: formData.CompanyName?.trim() || undefined,
      ProductType: formData.ProductType || undefined,
      StartDate: formData.StartDate || undefined,
      EndDate: formData.EndDate || undefined,
      DeficiencyStatus: formData.DeficiencyStatus || undefined,
      page: 1, // Reset page when filtering
    };
  };

  // Use the generic useFilterFormWithUrlSync hook for URL sync
  const { handleApply, handleReset: resetForm } = useFilterFormWithUrlSync<
    DifferenceEntryFilterFormData,
    Partial<DifferenceEntryFilters>
  >({
    form,
    onFilterChange,
    transformToApiFilters,
  });

  const handleReset = () => {
    resetForm(defaultValues);
  };

  return {
    form: form as unknown as UseFormReturn<DifferenceEntryFilterFormData, unknown, undefined>,
    schema,
    handleSearch: handleApply,
    handleReset,
    isLoading: false, // No async operations in this hook
  };
};
