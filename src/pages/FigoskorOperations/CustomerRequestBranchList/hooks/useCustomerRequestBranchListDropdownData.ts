import { useMemo } from 'react';
import type { UseCustomerRequestBranchListDropdownDataReturn } from '../customer-request-branch-list.types';
import { getStatusOptions } from '../helpers';

/**
 * Hook to get dropdown data for customer request branch list filters
 * Following OperationPricing dropdown data pattern
 */
export const useCustomerRequestBranchListDropdownData = (): UseCustomerRequestBranchListDropdownDataReturn => {
  // Status options are static, no API call needed
  const statusOptions = useMemo(() => getStatusOptions(), []);

  return {
    statusOptions,
    isLoading: false,
  };
};
