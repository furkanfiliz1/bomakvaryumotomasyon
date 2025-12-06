/**
 * Lead Query Parameters Hook
 * Following ScoreInvoiceReports pattern (useScoreInvoiceReportsQueryParams.ts)
 *
 * Transforms filter state into API query parameters for useServerSideQuery
 * Handles proper type conversion and default values
 *
 * Reference Implementation: pages/Reports/OperationReports/ScoreInvoiceReports/hooks/useScoreInvoiceReportsQueryParams.ts
 */

import { useMemo } from 'react';
import type { GetLeadsApiArgs, LeadFilterFormData } from '../lead-management.types';

interface UseLeadQueryParamsProps {
  additionalFilters: Partial<LeadFilterFormData>;
}

/**
 * Transforms filter state into query parameters for the leads API
 * Ensures proper type conversion and excludes empty values
 */
function useLeadQueryParams({ additionalFilters }: UseLeadQueryParamsProps) {
  const baseQueryParams = useMemo(() => {
    // Always return all filter properties (with undefined for cleared values)
    // This ensures useServerSideQuery properly clears old filter values
    const params: GetLeadsApiArgs = {
      companyName: additionalFilters.companyName?.trim() || undefined,
      taxNumber: additionalFilters.taxNumber?.trim() || undefined,
      customerManagerId: additionalFilters.customerManagerId ?? undefined,
      channelCode: additionalFilters.channelCode ?? undefined,
      productType: additionalFilters.productType ?? undefined,
      callResult: additionalFilters.callResult ?? undefined,
      membershipCompleted: additionalFilters.membershipCompleted ?? undefined,
      startDate: additionalFilters.startDate?.trim() || undefined,
      endDate: additionalFilters.endDate?.trim() || undefined,
    };

    return params;
  }, [additionalFilters]);
  return {
    baseQueryParams,
  };
}

export default useLeadQueryParams;
