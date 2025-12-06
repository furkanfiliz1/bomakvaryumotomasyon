import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { ActivityLogFilters } from '../company-history-tab.types';

interface UseActivityLogFilterFormProps {
  adminUsersList: Array<{ id: number; label: string; value: number }>;
  activityTypesList: Array<{ id: string; label: string; value: string }>;
  statusTypesList: Array<{ id: string; label: string; value: string }>;
  onFilterChange: (filters: Partial<ActivityLogFilters>) => void;
}

/**
 * Hook for managing activity log filter form
 * Matches legacy filter form functionality exactly using Form component pattern
 */
export const useActivityLogFilterForm = ({
  adminUsersList,
  activityTypesList,
  statusTypesList,
  onFilterChange,
}: UseActivityLogFilterFormProps) => {
  // Initial values matching legacy defaults
  const initialValues: ActivityLogFilters = {
    userId: '',
    onboardingStatusType: '',
    ActivityType: '',
  };

  // Form schema using fields pattern like other components
  const schema = useMemo(() => {
    // Add "Seçiniz" option to each dropdown list
    const userOptions = [{ id: '', label: 'Seçiniz', value: '' }, ...adminUsersList];
    const statusOptions = [{ id: '', label: 'Seçiniz', value: '' }, ...statusTypesList];
    const activityOptions = [{ id: '', label: 'Seçiniz', value: '' }, ...activityTypesList];

    return yup.object({
      userId: fields.select(userOptions, 'string', ['value', 'label']).label('Kullanıcı').meta({ col: 3 }),
      onboardingStatusType: fields.select(statusOptions, 'string', ['value', 'label']).label('Durum').meta({ col: 3 }),
      ActivityType: fields
        .select(activityOptions, 'string', ['value', 'label'])
        .label('Aktivite Türü')
        .meta({ col: 3 }),
    });
  }, [adminUsersList, activityTypesList, statusTypesList]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Handle search action - matches legacy searchCompanyComments
  const handleSearch = () => {
    const formData = form.getValues();
    const filters: Partial<ActivityLogFilters> = {
      userId: formData.userId ? String(formData.userId) : '',
      onboardingStatusType: formData.onboardingStatusType ? String(formData.onboardingStatusType) : '',
      ActivityType: formData.ActivityType ? String(formData.ActivityType) : '',
    };
    onFilterChange(filters);
  };

  // Handle reset action - matches legacy behavior
  const handleReset = () => {
    form.reset();
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
    handleReset,
  };
};
