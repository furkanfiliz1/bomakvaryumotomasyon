import { useMemo } from 'react';
import type {
  BankInvoiceReconciliationFilterFormValues,
  BankInvoiceReconciliationQueryParams,
} from '../bank-invoice-reconciliation.types';

/**
 * Custom hook for managing query parameters for Bank Invoice Reconciliation
 * Following OperationPricing pattern for useServerSideQuery integration
 */
export const useBankInvoiceReconciliationQueryParams = (
  additionalFilters: Partial<BankInvoiceReconciliationFilterFormValues> = {},
) => {
  const baseQueryParams = useMemo((): BankInvoiceReconciliationQueryParams => {
    return {
      // Filter parameters
      receiverIdentifier: additionalFilters.receiverIdentifier || undefined,
      financerIdentifier: additionalFilters.financerIdentifier || undefined,
      month: additionalFilters.month || 1,
      year: additionalFilters.year || new Date().getFullYear(),

      // Default pagination (will be overridden by useServerSideQuery)
      page: 1,
      pageSize: 25,

      // Export flag (will be set by useServerSideQuery when needed)
      isExport: false,
    };
  }, [
    additionalFilters.receiverIdentifier,
    additionalFilters.financerIdentifier,
    additionalFilters.month,
    additionalFilters.year,
  ]);

  return { baseQueryParams };
};
