/**
 * Company Representative Query Parameters Hook
 * Handles URL parameter synchronization for filters
 * Following OperationPricing query parameters patterns
 */

import { useMemo } from 'react';
import type { CompanyRepresentativeFilters } from '../company-representative-settings.types';

interface UseCompanyRepresentativeQueryParamsProps {
  additionalFilters: Partial<CompanyRepresentativeFilters>;
}

export const useCompanyRepresentativeQueryParams = ({
  additionalFilters,
}: UseCompanyRepresentativeQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      page: 1, // Always start from page 1 when filters change
      pageSize: 100, // Match legacy page size exactly
      ...additionalFilters,

      // Transform boolean isManagerAssigned to match API expectations
      isManagerAssigned:
        typeof additionalFilters.isManagerAssigned === 'boolean' ? additionalFilters.isManagerAssigned : true, // Default to true (Temsilci Atanmış) matching legacy

      // Clean up undefined values to prevent them from being sent to API
      companyIdentifier: additionalFilters.companyIdentifier || undefined,
      userId: additionalFilters.userId || undefined,
      productType: additionalFilters.productType || undefined,
      financerCompanyId: additionalFilters.financerCompanyId || undefined,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useCompanyRepresentativeQueryParams;
