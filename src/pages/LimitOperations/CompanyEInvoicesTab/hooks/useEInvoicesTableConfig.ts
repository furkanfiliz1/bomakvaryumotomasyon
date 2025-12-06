/**
 * E-Invoices Table Configuration Hook
 * Following OperationPricing pattern for table management
 */

import { useMemo } from 'react';
import type { EInvoicesTableColumn } from '../company-einvoices-tab.types';
import { getEInvoicesTableColumns, getEmptyStateConfig, getTableStyling } from '../helpers';

/**
 * Hook for managing e-invoices table configuration
 * Returns memoized table columns and styling
 */
export const useEInvoicesTableConfig = () => {
  const columns = useMemo<EInvoicesTableColumn[]>(() => getEInvoicesTableColumns(), []);

  const tableStyling = useMemo(() => getTableStyling(), []);

  const emptyStateConfig = useMemo(() => getEmptyStateConfig(), []);

  return {
    columns,
    tableStyling,
    emptyStateConfig,
  };
};
