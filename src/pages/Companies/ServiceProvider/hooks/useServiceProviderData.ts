import { useMemo } from 'react';
import { useGetNestedIntegratorsQuery, useGetAllIntegratorsQuery } from '../service-provider.api';
import { flattenNestedIntegrators } from '../helpers/service-provider.helpers';
import type { CompanyIntegrator, NestedIntegratorOption } from '../service-provider.types';

/**
 * Hook for fetching all service provider data needed for the company
 * Combines nested integrators and company-specific integrators
 * Following OperationPricing data fetching patterns
 */
export const useServiceProviderData = (companyIdentifier: string) => {
  const {
    data: nestedIntegratorsData = [],
    isLoading: isLoadingNested,
    error: nestedError,
  } = useGetNestedIntegratorsQuery();

  const {
    data: integratorsData = [],
    isLoading: isLoadingIntegrators,
    error: integratorsError,
    refetch: refetchIntegrators,
  } = useGetAllIntegratorsQuery(companyIdentifier, {
    skip: !companyIdentifier,
  });

  // Memoize flattened nested integrators for dropdown
  const nestedIntegrators = useMemo<NestedIntegratorOption[]>(() => {
    return flattenNestedIntegrators(nestedIntegratorsData);
  }, [nestedIntegratorsData]);

  // Filter out already used integrators from dropdown options
  const availableIntegrators = useMemo<NestedIntegratorOption[]>(() => {
    return nestedIntegrators.filter((nested) => !integratorsData.some((existing) => existing.Name === nested.Name));
  }, [nestedIntegrators, integratorsData]);

  const isLoading = isLoadingNested || isLoadingIntegrators;
  const error = nestedError || integratorsError;

  return {
    integrators: integratorsData as CompanyIntegrator[],
    nestedIntegrators: availableIntegrators,
    allNestedIntegrators: nestedIntegrators,
    isLoading,
    error,
    refetch: refetchIntegrators,
  };
};
