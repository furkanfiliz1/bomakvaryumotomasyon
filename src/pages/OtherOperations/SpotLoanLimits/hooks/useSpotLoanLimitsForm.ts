import { useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSpotLoanLimitsSchema, spotLoanLimitsDefaultValues, transformSpotLoanFormToRequest } from '../helpers';
import { useLazyGetSpotLoanLimitsStatsQuery, useSearchSpotLoanLimitMutation } from '../spot-loan-limits.api';
import type { SpotLoanLimitsFormValues, SpotLoanLimitsResponse, SpotLoanLimitsStats } from '../spot-loan-limits.types';

export const useSpotLoanLimitsForm = () => {
  const notice = useNotice();
  const [searchSpotLoan, { isLoading: isSearching, error: searchSpotLoanError }] = useSearchSpotLoanLimitMutation();
  const [getStats, { error: getStatsError }] = useLazyGetSpotLoanLimitsStatsQuery();

  useErrorListener([searchSpotLoanError, getStatsError]);

  const [queryResult, setQueryResult] = useState<SpotLoanLimitsResponse | null>(null);
  const [stats, setStats] = useState<SpotLoanLimitsStats | null>(null);
  const [tcknSnapshot, setTcknSnapshot] = useState<string>('');
  const [vknSnapshot, setVknSnapshot] = useState<string>('');

  const form = useForm<SpotLoanLimitsFormValues>({
    resolver: yupResolver(createSpotLoanLimitsSchema()),
    defaultValues: spotLoanLimitsDefaultValues,
    mode: 'onChange',
  });

  const { watch, reset, setValue } = form;
  const watchedValues = watch();
  const { IsExistCustomer, searchType } = watchedValues;

  // Create dynamic schema based on current form values - matches TtkLimitQuery pattern
  const schema = createSpotLoanLimitsSchema(watchedValues);

  // Clear validation errors when conditional fields change
  useEffect(() => {
    form.clearErrors(); // Clear existing validation errors when conditions change
  }, [IsExistCustomer, searchType, form]);

  // Handle field clearing when conditions change - matches legacy behavior exactly
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
      // Clear VKN error since it's not required for PERSON
      form.clearErrors(['TaxNumber']);
    }
  }, [searchType, setValue, form]);

  // Fetch stats - matches legacy getStats function
  const fetchStats = useCallback(async () => {
    try {
      const response = await getStats().unwrap();
      if (response?.Data) {
        setStats(response.Data);
      }
    } catch (error) {
      console.error('Failed to fetch spot loan stats:', error);
    }
  }, [getStats]);

  // Submit handler - matches legacy formik.onSubmit exactly
  const handleSubmit = async (values: SpotLoanLimitsFormValues) => {
    try {
      setQueryResult(null);

      // Transform to API format
      const requestData = transformSpotLoanFormToRequest(values);

      // Make API call
      const response = await searchSpotLoan(requestData).unwrap();

      if (response) {
        if (!response.IsSuccess) {
          // Show error message like legacy
          notice({
            variant: 'error',
            title: 'Başarısız',
            message: 'İşlem tamamlanamadı',
            buttonTitle: 'Tamam',
          });
        } else {
          const companyLimitExist = (response.AvailableLimit || 0) > 0;
          if (!companyLimitExist) {
            // Show no limit found message like legacy
            notice({
              variant: 'error',
              title: 'Başarısız',
              message: 'İşlem tamamlanamadı',
              buttonTitle: 'Tamam',
            });
          } else {
            // Success - save result and snapshots like legacy
            setQueryResult(response);
            setTcknSnapshot(values.NationalIdentityNumber);
            setVknSnapshot(values.TaxNumber);

            // Refresh stats after successful search
            fetchStats();
          }
        }
      }
    } catch (error) {
      console.error('Spot loan search error:', error);
    }
  };

  // Reset handler - matches legacy reset behavior
  const handleReset = () => {
    reset(spotLoanLimitsDefaultValues);
    setQueryResult(null);
    setTcknSnapshot('');
    setVknSnapshot('');
  };

  return {
    form,
    schema,
    isSearching,
    queryResult,
    stats,
    tcknSnapshot,
    vknSnapshot,
    handleSubmit,
    handleReset,
    fetchStats,
  };
};
