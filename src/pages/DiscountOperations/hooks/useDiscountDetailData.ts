import { AllowanceKind, AllowanceStatusEnum, NotifyBuyer } from '@types';
import { useEffect, useState } from 'react';
import {
  useGetAllowanceTypeByIdQuery,
  useGetBuyerApprovedDetailQuery,
  useGetEasyFinancingDetailQuery,
} from '../discount-operations.api';
import { AllowanceResponseModel } from '../discount-operations.types';
import { shouldCallBuyerApprovedAPI, shouldCallEasyFinancingAPI } from '../helpers/discount-detail.helpers';

interface UseDiscountDetailDataProps {
  allowanceId: string | undefined;
}

interface AllowanceTypeData {
  Kind: AllowanceKind;
  NotifyBuyer: NotifyBuyer;
  Status?: AllowanceStatusEnum;
  IsCreatedWithTransactionFee?: boolean;
}

export interface UseDiscountDetailDataReturn {
  allowanceTypeData: AllowanceTypeData | undefined;
  allowanceKind: AllowanceKind | null;
  allowanceNotifyBuyer: NotifyBuyer | null;

  allowanceDetail: AllowanceResponseModel | null;

  isLoading: boolean;

  error: unknown;

  refetch: () => void;
}

export const useDiscountDetailData = ({ allowanceId }: UseDiscountDetailDataProps): UseDiscountDetailDataReturn => {
  const [allowanceKind, setAllowanceKind] = useState<AllowanceKind | null>(null);
  const [allowanceNotifyBuyer, setAllowanceNotifyBuyer] = useState<NotifyBuyer | null>(null);
  const [allowanceDetail, setAllowanceDetail] = useState<AllowanceResponseModel | null>(null);

  const {
    data: allowanceTypeData,
    error: typeError,
    isLoading: isTypeLoading,
    refetch: refetchAllowanceType,
  } = useGetAllowanceTypeByIdQuery(Number(allowanceId), {
    skip: !allowanceId,
  });

  const shouldCallEasyFinancing = shouldCallEasyFinancingAPI(allowanceKind, allowanceNotifyBuyer);
  const shouldCallBuyerApproved = shouldCallBuyerApprovedAPI(allowanceKind, allowanceNotifyBuyer);

  const {
    data: easyFinancingData,
    error: easyFinancingError,
    isLoading: isEasyFinancingLoading,
    refetch: refetchEasyFinancing,
  } = useGetEasyFinancingDetailQuery(
    { Kind: allowanceKind!, allowanceId: Number(allowanceId) },
    { skip: !shouldCallEasyFinancing },
  );

  const {
    data: buyerApprovedData,
    error: buyerApprovedError,
    isLoading: isBuyerApprovedLoading,
    refetch: refetchBuyerApproved,
  } = useGetBuyerApprovedDetailQuery(
    { Kind: allowanceKind!, allowanceId: Number(allowanceId) },
    { skip: !shouldCallBuyerApproved },
  );

  useEffect(() => {
    if (allowanceTypeData) {
      setAllowanceKind(allowanceTypeData.Kind);
      setAllowanceNotifyBuyer(allowanceTypeData.NotifyBuyer);
    }
  }, [allowanceTypeData]);

  useEffect(() => {
    if (easyFinancingData?.Allowances?.[0]) {
      setAllowanceDetail(easyFinancingData.Allowances[0]);
    }
  }, [easyFinancingData]);

  useEffect(() => {
    if (buyerApprovedData?.Allowances?.[0]) {
      setAllowanceDetail(buyerApprovedData.Allowances[0]);
    }
  }, [buyerApprovedData]);

  const error = typeError || easyFinancingError || buyerApprovedError;
  const isLoading = isTypeLoading || isEasyFinancingLoading || isBuyerApprovedLoading;

  const refetch = () => {
    refetchAllowanceType();
    if (shouldCallEasyFinancing) {
      refetchEasyFinancing();
    }
    if (shouldCallBuyerApproved) {
      refetchBuyerApproved();
    }
  };

  return {
    allowanceTypeData,
    allowanceKind,
    allowanceNotifyBuyer,
    allowanceDetail,
    isLoading,
    error,
    refetch,
  };
};
