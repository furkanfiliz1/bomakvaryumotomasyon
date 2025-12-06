/**
 * Opportunity Query Parameters Hook
 * Following LeadManagement pattern (useLeadQueryParams.ts)
 *
 * Transforms filter state into API query parameters for useServerSideQuery
 * Handles proper type conversion and default values
 */

import { useMemo } from 'react';
import type { GetOpportunitiesApiArgs, OpportunityFilterFormData } from '../opportunity-management.types';

interface UseOpportunityQueryParamsProps {
  additionalFilters: Partial<OpportunityFilterFormData>;
}

/**
 * Transforms filter state into query parameters for the opportunities API
 * Ensures proper type conversion and excludes empty values
 */
function useOpportunityQueryParams({ additionalFilters }: UseOpportunityQueryParamsProps) {
  const baseQueryParams = useMemo(() => {
    // Always return all filter properties (with undefined for cleared values)
    // This ensures useServerSideQuery properly clears old filter values
    const params: GetOpportunitiesApiArgs = {
      subject: additionalFilters.subject?.trim() || undefined,
      receiverName: additionalFilters.receiverName?.trim() || undefined,
      createdAtStart: additionalFilters.createdAtStart?.trim() || undefined,
      createdAtEnd: additionalFilters.createdAtEnd?.trim() || undefined,
      statusDescription: additionalFilters.statusDescription ?? undefined,
      productType: additionalFilters.productType ?? undefined,
      receiverId: additionalFilters.receiverId ?? undefined,
      customerManagerId: additionalFilters.customerManagerId ?? undefined,
      winningStatus: additionalFilters.winningStatus ?? undefined,
      salesScenario: additionalFilters.salesScenario ?? undefined,
    };

    return params;
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
}

export default useOpportunityQueryParams;
