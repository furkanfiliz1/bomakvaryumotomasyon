/**
 * E-Invoice Transfer History Query Parameters Hook
 * Following OperationPricing useOperationPricingQueryParams pattern
 * Based on legacy EInvoiceTransferHistory.js parameter handling
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { EInvoiceTransferHistoryFilters, LocationState } from '../e-invoice-transfer-history.types';

interface UseEInvoiceTransferHistoryQueryParamsProps {
  additionalFilters: Partial<EInvoiceTransferHistoryFilters>;
}

/**
 * Custom hook for generating E-Invoice Transfer History query parameters
 * Following OperationPricing query parameter generation pattern
 */
export const useEInvoiceTransferHistoryQueryParams = ({
  additionalFilters,
}: UseEInvoiceTransferHistoryQueryParamsProps) => {
  const location = useLocation();

  // Get navigation state (identifier, id, transferId) from location
  // Following legacy navigation pattern from ScoreReports
  const locationState: LocationState | null = useMemo(() => {
    try {
      return location.state ? JSON.parse(location.state as string) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  // Base query parameters following legacy pattern
  const baseQueryParams: EInvoiceTransferHistoryFilters = useMemo(
    () => ({
      page: 1,
      pageSize: 50, // Legacy default page size
      transferId: locationState?.transferId || undefined,
      number: additionalFilters.number || undefined,
    }),
    [locationState?.transferId, additionalFilters.number],
  );

  return {
    baseQueryParams,
    locationState,
  };
};
