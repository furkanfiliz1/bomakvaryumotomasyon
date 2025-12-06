import { useEffect } from 'react';
import {
  useLazyGetAllAllowanceStatusQuery,
  useLazyGetAllowancePaymentStatusQuery,
  useLazyGetBankListForAllowanceQuery,
  useLazyGetBuyerListForAllowanceQuery,
  useLazyGetCustomerManagerListQuery,
} from '../discount-operations.api';

export const useDropdownData = () => {
  const [getBuyerList, { data: buyerListData }] = useLazyGetBuyerListForAllowanceQuery();
  const [getBankList, { data: bankListData }] = useLazyGetBankListForAllowanceQuery();
  const [getCustomerManagerList, { data: customerManagerListData }] = useLazyGetCustomerManagerListQuery();
  const [getAllAllowanceStatus, { data: allowanceStatusData }] = useLazyGetAllAllowanceStatusQuery();
  const [getAllowancePaymentStatus, { data: allowancePaymentStatusData }] = useLazyGetAllowancePaymentStatusQuery();
  const buyerList = buyerListData || [];
  const bankList = bankListData?.Items || [];
  const customerManagerList = customerManagerListData?.Items || [];
  const allowanceStatuses = allowanceStatusData || [];
  const allowancePaymentStatuses = allowancePaymentStatusData || [];

  useEffect(() => {
    getBuyerList();
    getBankList({});
    getCustomerManagerList();
    getAllAllowanceStatus();
    getAllowancePaymentStatus();
  }, [getBuyerList, getBankList, getCustomerManagerList, getAllAllowanceStatus, getAllowancePaymentStatus]);

  return {
    buyerList,
    bankList,
    customerManagerList,
    allowanceStatuses,
    allowancePaymentStatuses,
  };
};
