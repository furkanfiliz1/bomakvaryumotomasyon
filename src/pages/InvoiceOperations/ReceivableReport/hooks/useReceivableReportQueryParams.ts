import { useMemo } from 'react';
import { ReceivableReportFilters, ReceivableStatus, ProductTypesList } from '../receivable-report.types';
import dayjs from 'dayjs';

interface UseReceivableReportQueryParamsProps {
  additionalFilters: Partial<ReceivableReportFilters>;
}

export const useReceivableReportQueryParams = ({ additionalFilters }: UseReceivableReportQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      // Default pagination and sorting
      page: additionalFilters.page || 1,
      pageSize: additionalFilters.pageSize || 50,
      sort: additionalFilters.sort || 'Id',
      sortType: additionalFilters.sortType || 'Desc',

      // Default values from API example
      notifyBuyer: additionalFilters.notifyBuyer || 1,
      status: additionalFilters.status || ReceivableStatus.Pending,
      PayableAmountCurrency: additionalFilters.PayableAmountCurrency || 'TRY',
      productType: additionalFilters.productType || ProductTypesList.RECEIVER_FINANCING,

      // Optional filter fields (only include if they have values)
      ...(additionalFilters.senderIdentifier && { senderIdentifier: additionalFilters.senderIdentifier }),
      ...(additionalFilters.receiverIdentifier && { receiverIdentifier: additionalFilters.receiverIdentifier }),
      ...(additionalFilters.orderNo && { orderNo: additionalFilters.orderNo }),
      ...(additionalFilters.isCharged && { isCharged: additionalFilters.isCharged }),
      ...(additionalFilters.isDeleted &&
        additionalFilters.isDeleted !== '0' && { isDeleted: additionalFilters.isDeleted }),
      ...(additionalFilters.profileId && { profileId: additionalFilters.profileId }),

      // Date filters (format as YYYY-MM-DD)
      ...(additionalFilters.startDate && {
        startDate: dayjs(additionalFilters.startDate).format('YYYY-MM-DD'),
      }),
      ...(additionalFilters.endDate && {
        endDate: dayjs(additionalFilters.endDate).format('YYYY-MM-DD'),
      }),
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useReceivableReportQueryParams;
