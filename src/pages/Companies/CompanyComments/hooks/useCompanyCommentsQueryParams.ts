import { useMemo } from 'react';
import type { CompanyCommentsFilters } from '../company-comments.types';

interface UseCompanyCommentsQueryParamsProps {
  filters: Partial<CompanyCommentsFilters>;
  page: number;
  pageSize: number;
}

export const useCompanyCommentsQueryParams = ({ filters, page, pageSize }: UseCompanyCommentsQueryParamsProps) => {
  const queryParams = useMemo((): CompanyCommentsFilters => {
    console.log('useCompanyCommentsQueryParams - Input filters:', filters);
    console.log('useCompanyCommentsQueryParams - Page:', page, 'PageSize:', pageSize);

    const params: CompanyCommentsFilters = {
      page,
      pageSize,
      sort: 'InsertDateTime',
      sortType: 'Dsc',
    };

    // Match working CompanyHistoryTab pattern - always include all filter fields
    if (filters?.onboardingStatusType !== undefined) {
      params.onboardingStatusType = filters.onboardingStatusType;
      console.log('Added onboardingStatusType filter:', params.onboardingStatusType);
    }

    if (filters?.userId !== undefined) {
      params.userId = filters.userId;
      console.log('Added userId filter:', params.userId);
    }

    if (filters?.ActivityType !== undefined) {
      params.ActivityType = filters.ActivityType;
      console.log('Added ActivityType filter:', params.ActivityType);
    }

    console.log('useCompanyCommentsQueryParams - Final params:', params);
    return params;
  }, [filters, page, pageSize]);

  return queryParams;
};
