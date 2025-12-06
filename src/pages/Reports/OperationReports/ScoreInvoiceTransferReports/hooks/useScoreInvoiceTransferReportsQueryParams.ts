import { useMemo } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants';
import type {
  ScoreInvoiceTransferReportsFilters,
  ScoreInvoiceTransferReportsQueryParams,
  UseScoreInvoiceTransferReportsQueryParams,
} from '../score-invoice-transfer-reports.types';

interface UseScoreInvoiceTransferReportsQueryParamsProps {
  additionalFilters: Partial<ScoreInvoiceTransferReportsFilters>;
}

/**
 * Hook for generating query parameters for Score Invoice Transfer Reports
 * Following legacy ScoreInvoiceTransferReport.js patterns exactly
 */
export const useScoreInvoiceTransferReportsQueryParams = ({
  additionalFilters,
}: UseScoreInvoiceTransferReportsQueryParamsProps): UseScoreInvoiceTransferReportsQueryParams => {
  const baseQueryParams: ScoreInvoiceTransferReportsQueryParams = useMemo(() => {
    const params: Partial<ScoreInvoiceTransferReportsQueryParams> = {
      // Required parameters matching legacy ScoreInvoiceTransferReport.js
      type: 1,
      page: additionalFilters.page || 1,
      pageSize: additionalFilters.pageSize || DEFAULT_PAGE_SIZE,
    };

    // Only include identifier if it has a value
    if (additionalFilters.identifier?.trim()) {
      params.identifier = additionalFilters.identifier;
    }

    // Only include sorting if explicitly provided
    if (additionalFilters.sort) {
      params.sort = additionalFilters.sort;
      params.sortType = additionalFilters.sortType || 'desc';
    }

    return params as ScoreInvoiceTransferReportsQueryParams;
  }, [additionalFilters]);

  return {
    baseQueryParams,
  };
};
