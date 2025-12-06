import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { ActivityType, AdminUser, CompanyCommentsFilters, CompanyStatus } from '../company-comments.types';

interface FormData {
  userId: string;
  onboardingStatusType: string;
  ActivityType: string;
}

interface UseCompanyCommentsFilterFormProps {
  users: AdminUser[];
  companyStatuses: CompanyStatus[];
  activityTypes: ActivityType[];
  onFilterChange: (filters: Partial<CompanyCommentsFilters>) => void;
}

export const useCompanyCommentsFilterForm = ({
  users,
  companyStatuses,
  activityTypes,
  onFilterChange,
}: UseCompanyCommentsFilterFormProps) => {
  const initialValues: FormData = {
    userId: '',
    onboardingStatusType: '',
    ActivityType: '',
  };

  // Form schema following OperationPricing pattern
  const schema = useMemo(() => {
    // Add "Seçiniz" option to each dropdown list

    const baseFields: yup.AnyObject = {
      userId: fields
        .select(users, 'string', ['Id', 'FullName'])
        .optional()
        .label('Kullanıcı')
        .meta({ col: 4, showSelectOption: true })
        .optional()
        .nullable(),
      onboardingStatusType: fields
        .select(companyStatuses, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .label('Statü')
        .meta({ col: 4, showSelectOption: true }),
      ActivityType: fields
        .select(activityTypes, 'string', ['Value', 'Description'])
        .optional()
        .nullable()
        .optional()
        .label('Aktivite Tipi')
        .meta({ col: 4, showSelectOption: true }),
    };

    return yup.object(baseFields);
  }, [users, companyStatuses, activityTypes]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();

    // Transform form data to API filter format - matching working CompanyHistoryTab pattern
    const filters: Partial<CompanyCommentsFilters> = {
      userId: formData.userId ? String(formData.userId) : '',
      onboardingStatusType: formData.onboardingStatusType ? String(formData.onboardingStatusType) : '',
      ActivityType: formData.ActivityType ? String(formData.ActivityType) : '',
    };

    onFilterChange(filters);
  };

  const resetFilters = () => {
    form.reset(initialValues);
    onFilterChange({
      userId: '',
      onboardingStatusType: '',
      ActivityType: '',
    });
  };

  return {
    form,
    schema,
    handleSearch,
    resetFilters,
  };
};
