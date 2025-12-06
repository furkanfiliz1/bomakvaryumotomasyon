import { useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createTtkLimitQuerySchema,
  hasValidTtkLimit,
  transformTtkLimitFormToRequest,
  ttkLimitQueryDefaultValues,
} from '../helpers';
import { useLazyGetTtkLimitStatsQuery, useSearchTtkLimitMutation } from '../ttk-limit-query.api';
import type { TtkLimitQueryFormValues, TtkLimitQueryResponse, TtkLimitStats } from '../ttk-limit-query.types';

export const useTtkLimitQueryForm = () => {
  const notice = useNotice();
  const [searchTtkLimit, { isLoading: isSearching, error: searchTtkLimitError }] = useSearchTtkLimitMutation();
  const [getStats, { error: getStatsError }] = useLazyGetTtkLimitStatsQuery();
  useErrorListener([searchTtkLimitError, getStatsError]);

  const [queryResult, setQueryResult] = useState<TtkLimitQueryResponse | null>(null);
  const [stats, setStats] = useState<TtkLimitStats | null>(null);
  const [tcknSnapshot, setTcknSnapshot] = useState<string>('');
  const [vknSnapshot, setVknSnapshot] = useState<string>('');

  const form = useForm<TtkLimitQueryFormValues>({
    resolver: yupResolver(createTtkLimitQuerySchema()),
    defaultValues: ttkLimitQueryDefaultValues,
    mode: 'onChange',
  });

  const { watch, reset, setValue } = form;
  const watchedValues = watch();
  const { IsExistCustomer, searchType } = watchedValues;

  // Create dynamic schema based on current form values
  const schema = createTtkLimitQuerySchema(watchedValues);

  // Clear validation errors when conditional fields change
  useEffect(() => {
    form.clearErrors(); // Clear existing validation errors when conditions change
  }, [IsExistCustomer, searchType, form]);

  // Handle field clearing when conditions change
  useEffect(() => {
    if (IsExistCustomer === 'YES') {
      setValue('BirthDate', '');
      setValue('PhoneNumber', '');
      // Clear errors for these fields since they're no longer required
      form.clearErrors(['BirthDate', 'PhoneNumber']);
    }
  }, [IsExistCustomer, setValue, form]);

  useEffect(() => {
    if (searchType === 'PERSON') {
      setValue('TaxNumber', '');
      // Clear error for TaxNumber since it's no longer required
      form.clearErrors('TaxNumber');
    }
  }, [searchType, setValue, form]);

  // Fetch stats on component mount
  const fetchStats = useCallback(async () => {
    try {
      const response = await getStats().unwrap();
      if (response?.Data) {
        setStats(response.Data);
      }
    } catch (error) {
      console.error('Failed to fetch TTK limit stats:', error);
    }
  }, [getStats]);

  // Custom validation function for conditional fields
  const validateConditionalFields = useCallback((values: TtkLimitQueryFormValues) => {
    const errors: Record<string, string> = {};

    // VKN is required when searchType is COMPANY
    if (values.searchType === 'COMPANY' && !values.TaxNumber?.trim()) {
      errors.TaxNumber = 'VKN zorunludur';
    }

    // Phone and Birth Date are required when IsExistCustomer is NO
    if (values.IsExistCustomer === 'NO') {
      if (!values.PhoneNumber?.trim()) {
        errors.PhoneNumber = 'Telefon numarası zorunludur';
      }
      if (!values.BirthDate?.trim()) {
        errors.BirthDate = 'Doğum tarihi zorunludur';
      }
    }

    return errors;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: TtkLimitQueryFormValues) => {
      try {
        // Validate conditional fields
        const validationErrors = validateConditionalFields(values);
        if (Object.keys(validationErrors).length > 0) {
          // Set form errors
          Object.entries(validationErrors).forEach(([field, message]) => {
            form.setError(field as keyof TtkLimitQueryFormValues, {
              type: 'manual',
              message,
            });
          });
          return;
        }
        setQueryResult(null);
        const requestData = transformTtkLimitFormToRequest(values);
        const response = await searchTtkLimit(requestData).unwrap();

        if (!hasValidTtkLimit(response)) {
          notice({
            variant: 'error',
            title: 'Başarısız',
            message: 'Limit Bulunamadı.',
            buttonTitle: 'Tamam',
          });
          return;
        }

        // Success - set results and snapshots
        setQueryResult(response);
        setTcknSnapshot(values.NationalIdentityNumber);
        setVknSnapshot(values.TaxNumber);

        // Refresh stats after successful query
        await fetchStats();
      } catch (error) {
        console.error('TTK limit search error:', error);
      }
    },
    [validateConditionalFields, searchTtkLimit, fetchStats, form, notice],
  );

  // Handle customer type change
  const handleCustomerTypeChange = useCallback(
    (value: string) => {
      setValue('IsExistCustomer', value);
      if (value === 'YES') {
        setValue('BirthDate', '');
        setValue('PhoneNumber', '');
      }
    },
    [setValue],
  );

  // Handle search type change
  const handleSearchTypeChange = useCallback(
    (value: string) => {
      setValue('searchType', value as 'COMPANY' | 'PERSON');
      if (value === 'PERSON') {
        setValue('TaxNumber', '');
      }
    },
    [setValue],
  );

  // Reset form
  const handleReset = useCallback(() => {
    reset(ttkLimitQueryDefaultValues);
    setQueryResult(null);
    setTcknSnapshot('');
    setVknSnapshot('');
  }, [reset]);

  // Computed values
  const isFigoParaCustomer = IsExistCustomer === 'YES';
  const isCompanyType = searchType === 'COMPANY';

  return {
    form,
    schema,
    isSearching,
    queryResult,
    stats,
    tcknSnapshot,
    vknSnapshot,
    isFigoParaCustomer,
    isCompanyType,
    handleSubmit,
    handleCustomerTypeChange,
    handleSearchTypeChange,
    handleReset,
    fetchStats,
  };
};
