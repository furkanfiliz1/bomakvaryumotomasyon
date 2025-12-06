import { useMemo } from 'react';
import { getCustomerStatusOptions, getRequestStatusOptions } from '../helpers';

/**
 * Hook for dropdown data used in Figoskor Operations
 * Follows OperationPricing pattern for dropdown data management
 */
export const useFigoskorOperationsDropdownData = () => {
  const customerStatusOptions = useMemo(() => getCustomerStatusOptions(), []);
  const requestStatusOptions = useMemo(() => getRequestStatusOptions(), []);

  return {
    customerStatusOptions,
    requestStatusOptions,
  };
};
