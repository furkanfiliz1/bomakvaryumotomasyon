import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerTrackingQueryParams } from '../customer-tracking.types';

export const useCustomerTrackingQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current URL parameters into query params matching legacy structure
  const queryParams = useMemo((): CustomerTrackingQueryParams => {
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '50', 10);
    const sort = searchParams.get('sort') || 'InsertDatetime';
    const sortType = (searchParams.get('sortType') as 'asc' | 'desc') || 'desc';

    // Parse filter parameters directly (not nested in filters object)
    const companyIdentifier = searchParams.get('companyIdentifier') || undefined;
    const companyName = searchParams.get('companyName') || undefined;
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const trackingTeamId = searchParams.get('trackingTeamId') || undefined;
    const callResultType = searchParams.get('callResultType') || undefined;
    const leadStatusType = searchParams.get('leadStatusType') || undefined;
    const LeadingChannelId = searchParams.get('LeadingChannelId') || undefined;

    return {
      page,
      pageSize,
      sort,
      sortType,
      // Static values
      ActivityType: 2,
      Type: 1,
      // Filter values
      companyIdentifier,
      companyName,
      status,
      startDate,
      endDate,
      trackingTeamId,
      callResultType,
      leadStatusType,
      LeadingChannelId,
    };
  }, [searchParams]);

  // Update URL parameters
  const updateParams = useCallback(
    (newParams: Partial<CustomerTrackingQueryParams>) => {
      const params = new URLSearchParams(searchParams);

      // Update pagination and sorting
      if (newParams.page !== undefined) {
        params.set('page', newParams.page.toString());
      }
      if (newParams.pageSize !== undefined) {
        params.set('pageSize', newParams.pageSize.toString());
      }
      if (newParams.sort !== undefined) {
        params.set('sort', newParams.sort);
      }
      if (newParams.sortType !== undefined) {
        params.set('sortType', newParams.sortType);
      }

      // Update direct filter parameters
      const filterKeys = [
        'companyIdentifier',
        'companyName',
        'status',
        'startDate',
        'endDate',
        'trackingTeamId',
        'callResultType',
        'leadStatusType',
        'LeadingChannelId',
      ] as const;

      for (const key of filterKeys) {
        if (newParams[key] !== undefined) {
          if (newParams[key] !== null && newParams[key] !== '') {
            params.set(key, String(newParams[key]));
          } else {
            params.delete(key);
          }
        }
      }

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Reset all parameters
  const resetParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    queryParams,
    updateParams,
    resetParams,
  };
};
