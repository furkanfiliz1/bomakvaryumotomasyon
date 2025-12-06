import dayjs from 'dayjs';
import { useMemo } from 'react';
import { SupplierReportsFilters } from '../supplier-reports.types';

interface UseSupplierReportsQueryParamsProps {
  additionalFilters: Partial<SupplierReportsFilters>;
}

export const useSupplierReportsQueryParams = ({ additionalFilters }: UseSupplierReportsQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      startDate: additionalFilters.startDate
        ? dayjs(additionalFilters.startDate).format('YYYY-MM-DD').toString()
        : dayjs().subtract(30, 'day').format('YYYY-MM-DD').toString(),
      endDate: additionalFilters.endDate
        ? dayjs(additionalFilters.endDate).format('YYYY-MM-DD').toString()
        : dayjs().format('YYYY-MM-DD').toString(),
      receiverIdentifier: additionalFilters.receiverIdentifier ?? undefined,
      senderIdentifier: additionalFilters.senderIdentifier ?? undefined,
      IsActive: additionalFilters.IsActive,
      ...additionalFilters,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useSupplierReportsQueryParams;
