import { useMemo } from 'react';
import { OperationPricingFilters, OperationPricingStatus } from '../operation-pricing.types';
import dayjs from 'dayjs';

interface UseOperationPricingQueryParamsProps {
  additionalFilters: Partial<OperationPricingFilters>;
}

export const useOperationPricingQueryParams = ({ additionalFilters }: UseOperationPricingQueryParamsProps) => {
  const baseQueryParams = useMemo(
    () => ({
      startPaymentDate: additionalFilters.startPaymentDate
        ? dayjs(additionalFilters.startPaymentDate).format('YYYY-MM-DD').toString()
        : dayjs().format('YYYY-MM-DD').toString(),
      endPaymentDate: additionalFilters.endPaymentDate
        ? dayjs(additionalFilters.endPaymentDate).format('YYYY-MM-DD').toString()
        : dayjs().format('YYYY-MM-DD').toString(),
      ...additionalFilters,

      status:
        additionalFilters.status && additionalFilters.status != OperationPricingStatus.All
          ? additionalFilters.status
          : undefined,

      productType:
        additionalFilters.productType && additionalFilters.productType !== '*'
          ? additionalFilters.productType
          : undefined,

      UserIds:
        additionalFilters.UserIds && additionalFilters.UserIds.length > 0 && !additionalFilters.UserIds.includes(0)
          ? additionalFilters.UserIds
          : undefined,
    }),
    [additionalFilters],
  );

  return {
    baseQueryParams,
  };
};

export default useOperationPricingQueryParams;
