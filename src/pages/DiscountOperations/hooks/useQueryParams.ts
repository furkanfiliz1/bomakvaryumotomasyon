import { RESPONSE_DATE } from '@constant';
import { ProductTypes } from '@types';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DiscountOperationFilters } from '../discount-operations.types';
import { getKindFromProductType, shouldUseSenderEndpoint } from '../helpers/product-type.helpers';

interface UseQueryParamsProps {
  productType: ProductTypes;
  additionalFilters: Partial<DiscountOperationFilters>;
}

export const useQueryParams = ({ productType, additionalFilters }: UseQueryParamsProps) => {
  const shouldUseSender = shouldUseSenderEndpoint(productType);
  const baseQueryParams = useMemo(
    () => ({
      // kind parameter should not be sent for SME_FINANCING (Fatura Finansmanı)
      ...(productType !== ProductTypes.SME_FINANCING && { kind: getKindFromProductType(productType) as number }),
      productType: productType,
      endpoint: shouldUseSender ? ('sender' as const) : ('receiver' as const),
      page: 1,
      pageSize: 50,
      allowanceId: additionalFilters.allowanceId ? Number(additionalFilters.allowanceId) : undefined,
      senderCompanyId: additionalFilters.senderCompanyId,
      receiverCompanyId: additionalFilters.receiverCompanyId,
      financerCompanyId: additionalFilters.financerCompanyId ? Number(additionalFilters.financerCompanyId) : undefined,
      invoiceNumber: additionalFilters.invoiceNumber,
      status: additionalFilters.status ? Number(additionalFilters.status) : undefined,
      customerManagerUserId: additionalFilters.customerManagerUserId
        ? Number(additionalFilters.customerManagerUserId)
        : undefined,
      senderName: additionalFilters.senderName,
      receiverName: additionalFilters.receiverName,
      companyNameOrAllowanceNoFilter: additionalFilters.companyNameOrAllowanceNoFilter,
      startDate: additionalFilters.startDate
        ? additionalFilters.startDate instanceof Date
          ? dayjs(additionalFilters.startDate).format(RESPONSE_DATE)
          : additionalFilters.startDate
        : dayjs(new Date()).format(RESPONSE_DATE),
      endDate: additionalFilters.endDate
        ? additionalFilters.endDate instanceof Date
          ? dayjs(additionalFilters.endDate).format(RESPONSE_DATE)
          : additionalFilters.endDate
        : dayjs(new Date()).format(RESPONSE_DATE),
      PaymentStatus: additionalFilters.PaymentStatus,
      drawerName: additionalFilters.drawerName,
      senderIdentifier: additionalFilters.senderIdentifier,
      receiverIdentifier: additionalFilters.receiverIdentifier,
      senderCompanyName: additionalFilters.senderCompanyName,
      isPartialBid: additionalFilters.isPartialBid,
    }),
    [productType, shouldUseSender, additionalFilters],
  );

  return { baseQueryParams };
};
