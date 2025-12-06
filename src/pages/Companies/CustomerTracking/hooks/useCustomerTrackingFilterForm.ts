import { fields } from '@components';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { CustomerTrackingFilters } from '../customer-tracking.types';
import { clearEmptyFilters, getFilterDefaults } from '../helpers';
import { useCustomerTrackingDropdownData } from './useCustomerTrackingDropdownData';

// Filter form schema matching legacy NewCustomerList structure
export function createCustomerTrackingFilterSchema(dropdownData: {
  leadingChannelOptions: Array<{ value: string; label: string }>;
  trackingTeamOptions: Array<{ value: string; label: string }>;
  callResultOptions: Array<{ value: string; label: string }>;
  leadStatusOptions: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;
}) {
  return yup.object({
    // Row 1: VKN, Unvan, Gelir Kanalı, Üyelik Tarih Aralığı
    companyIdentifier: fields.text.optional().label('VKN').meta({ col: 2 }),

    companyName: fields.text.optional().label('Unvan').meta({ col: 2 }),

    LeadingChannelId: fields
      .select(dropdownData.leadingChannelOptions || [], 'string', ['value', 'label'])
      .optional()
      .label('Geliş Kanalı')
      .meta({ col: 2 }),

    startDate: fields.date.optional().label('Üyelik Başlangıç Tarihi').meta({ col: 2 }),

    endDate: fields.date.optional().label('Üyelik Bitiş Tarihi').meta({ col: 2 }),

    // Row 2: Arayan Kişi, Arama Sonucu, Lead Statü, Durum
    trackingTeamId: fields
      .select(dropdownData.trackingTeamOptions || [], 'string', ['value', 'label'])
      .optional()
      .label('Arayan Kişi')
      .meta({ col: 2 }),

    callResultType: fields
      .select(dropdownData.callResultOptions || [], 'string', ['value', 'label'])
      .optional()
      .label('Arama Sonucu')
      .meta({ col: 2 }),

    leadStatusType: fields
      .select(dropdownData.leadStatusOptions || [], 'string', ['value', 'label'])
      .optional()
      .label('Lead Statü')
      .meta({ col: 2 }),

    status: fields
      .select(dropdownData.statusOptions || [], 'string', ['value', 'label'])
      .optional()
      .label('Durum')
      .meta({ col: 2 }),
  });
}

interface UseCustomerTrackingFilterFormProps {
  onFilterChange: (filters: CustomerTrackingFilters) => void;
  onReset: () => void;
}

export const useCustomerTrackingFilterForm = ({ onFilterChange, onReset }: UseCustomerTrackingFilterFormProps) => {
  const [searchParams] = useSearchParams();
  const dropdownData = useCustomerTrackingDropdownData();

  const schema = useMemo(() => createCustomerTrackingFilterSchema(dropdownData), [dropdownData]);

  // Initialize form with URL params or defaults - matching legacy parameter names
  const initialValues = useMemo(() => {
    const defaults = getFilterDefaults();

    return {
      ...defaults,
      companyIdentifier: searchParams.get('companyIdentifier') || '',
      companyName: searchParams.get('companyName') || '',
      LeadingChannelId: searchParams.get('LeadingChannelId') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      trackingTeamId: searchParams.get('trackingTeamId') || '',
      callResultType: searchParams.get('callResultType') || '',
      leadStatusType: searchParams.get('leadStatusType') || '',
      status: searchParams.get('status') || '1', // Default to active
    };
  }, [searchParams]);

  const form = useForm<CustomerTrackingFilters>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const handleSearch = useCallback(
    (data: CustomerTrackingFilters) => {
      // Clean empty filters and transform to params format
      const cleanedFilters = clearEmptyFilters(data);
      const transformedParams = {
        // Reset pagination when filtering
        page: 1,
        pageSize: 50,
        sort: 'InsertDatetime',
        sortType: 'desc' as const,
        // Static values
        ActivityType: 2,
        Type: 1,
        // Include filter values
        ...cleanedFilters,
      };
      onFilterChange(transformedParams);
    },
    [onFilterChange],
  );

  const handleReset = useCallback(() => {
    const resetValues = getFilterDefaults();
    form.reset(resetValues);
    onReset();
  }, [form, onReset]);

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    isLoading: dropdownData.isLoading,
  };
};
