import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLazyGetOperationChargeHistoryDetailsQuery, useLazyGetPaymentDetailsQuery } from '../operation-pricing.api';
import { OperationPricingItem } from '../operation-pricing.types';
import { FigoSkorPaymentDetails } from './FigoSkorPaymentDetails';
import { RegularPaymentDetails } from './RegularPaymentDetails';

interface PaginationParams {
  Page: number;
  PageSize: number;
}

interface OperationPricingCollapseDetailsProps {
  row: OperationPricingItem;
  refetch: () => void;
}

export const OperationPricingCollapseDetails: React.FC<OperationPricingCollapseDetailsProps> = ({ row, refetch }) => {
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    Page: 1,
    PageSize: 25,
  });

  // API call for FigoSkor payment details (no pagination needed)
  const [
    fetchPaymentDetails,
    {
      data: paymentDetailsResponse,
      isLoading: isFigoSkorLoading,
      isFetching: isFigoSkorFetching,
      error: figoSkorError,
    },
  ] = useLazyGetPaymentDetailsQuery();

  console.log('paymentDetailsResponse', paymentDetailsResponse);

  // API call for regular charge history details (with pagination)
  const [
    fetchChargeHistoryDetails,
    {
      data: chargeHistoryResponse,
      isLoading: isChargeHistoryLoading,
      isFetching: isChargeHistoryFetching,
      error: chargeHistoryError,
    },
  ] = useLazyGetOperationChargeHistoryDetailsQuery();

  console.log('chargeHistoryResponse', chargeHistoryResponse?.TotalCount);

  // Determine if this is a FigoSkor charge based on the first payment detail
  // We need to fetch initial data first to determine the type
  const [isFigoSkorCharge, setIsFigoSkorCharge] = useState<boolean | null>(null);

  // Combined loading state - true during initial load and subsequent fetches
  const isLoadingOrFetching =
    isFigoSkorLoading || isFigoSkorFetching || isChargeHistoryLoading || isChargeHistoryFetching;

  // Handle payment details response (simple array)
  const figoSkorPaymentDetails = Array.isArray(paymentDetailsResponse) ? paymentDetailsResponse : [];
  const figoSkorDetail = figoSkorPaymentDetails[0];

  // Handle regular charge history response
  const chargeHistoryItems = chargeHistoryResponse?.Items || [];

  // Create payment detail object for FigoSkor charges
  const figoSkorPaymentDetail = isFigoSkorCharge
    ? figoSkorDetail || {
        Id: row.Id,
        AllowanceId: 0,
        AllowanceKind: 0,
        AllowanceKindDescription: null,
        TransactionFee: 0,
        MinAmount: 0,
        MaxAmount: 0,
        PaymentDate: null,
        Status: 0,
        Description: '',
        ChargeCompanyId: 0,
        ChargeCompanyIdentifier: null,
        ChargeCompanyName: null,
        OperationPaymentType: 0,
        FinancerCompanyId: null,
        ReturnedAmount: 0,
        PaymentStatus: 0,
        Details: null,
        DiscountAmount: 0,
        PaidAmount: 0,
        FigoscorePaymentDetailId: 0,
        FigoscorePaymentDetailDescription: '',
        FigoscoreAmount: 0,
        FigoscoreDiscountAmount: 0,
        FigoscorePaymentStatus: 0,
      }
    : null;

  // Create payment detail object for regular charges
  const regularPaymentDetail = !isFigoSkorCharge
    ? {
        Id: row.Id,
        AllowanceId: figoSkorDetail?.AllowanceId || 0,
        AllowanceKind: figoSkorDetail?.AllowanceKind || 0, // Get AllowanceKind from payment details response
        AllowanceKindDescription: figoSkorDetail?.AllowanceKindDescription || null,
        TransactionFee: figoSkorDetail?.TransactionFee || 0,
        MinAmount: figoSkorDetail?.MinAmount || 0,
        MaxAmount: figoSkorDetail?.MaxAmount || 0,
        PaymentDate: figoSkorDetail?.PaymentDate || null,
        Status: figoSkorDetail?.Status || 0,
        Description: figoSkorDetail?.Description || '',
        ChargeCompanyId: figoSkorDetail?.ChargeCompanyId || 0,
        ChargeCompanyIdentifier: figoSkorDetail?.ChargeCompanyIdentifier || null,
        ChargeCompanyName: figoSkorDetail?.ChargeCompanyName || null,
        OperationPaymentType: figoSkorDetail?.OperationPaymentType || 0,
        FinancerCompanyId: figoSkorDetail?.FinancerCompanyId || null,
        ReturnedAmount: figoSkorDetail?.ReturnedAmount || 0,
        PaymentStatus: figoSkorDetail?.PaymentStatus || 0,
        Details: chargeHistoryItems.map((item) => ({
          Id: item.Id,
          InvoiceNumber: item.InvoiceNumber,
          BillNumber: item.BillNumber,
          OrderNo: item.OrderNo,
          InvoicePayableAmount: item.InvoicePayableAmount,
          CurrencyName: item.CurrencyName,
          MinAmountInfo: item.MinAmountInfo?.toString() || null,
          MaxAmountInfo: item.MaxAmountInfo?.toString() || null,
          PercentFeeInfo: item.PercentFeeInfo?.toString() || null,
          TransactionFeeInfo: item.TransactionFeeInfo,
          PaidAmount: item.PaidAmount,
          DiscountAmount: item.DiscountAmount,
          PaymentStatus: item.PaymentStatus,
          RefundTypeDescription: item.RefundTypeDescription,
          AllowanceInvoiceStatusDescription: item.AllowanceInvoiceStatusDescription,
          AllowanceBillStatusDescription: item.AllowanceBillStatusDescription,
          AllowanceOrderStatusDescription: item.AllowanceOrderStatusDescription,
        })),
        DiscountAmount: figoSkorDetail?.DiscountAmount || 0,
        PaidAmount: figoSkorDetail?.PaidAmount || 0,
        FigoscorePaymentDetailId: figoSkorDetail?.FigoscorePaymentDetailId || 0,
        FigoscorePaymentDetailDescription: figoSkorDetail?.FigoscorePaymentDetailDescription || '',
        FigoscoreAmount: figoSkorDetail?.FigoscoreAmount || 0,
        FigoscoreDiscountAmount: figoSkorDetail?.FigoscoreDiscountAmount || 0,
        FigoscorePaymentStatus: figoSkorDetail?.FigoscorePaymentStatus || 0,
      }
    : null;

  // Fetch initial data when component mounts - always call details first
  useEffect(() => {
    const initialHistoryFilters = {
      Page: 1,
      PageSize: 25,
      Sort: 'Id',
      SortType: 'Desc',
    };

    // Always fetch payment details first (simple GET without pagination)
    fetchPaymentDetails({ paymentId: row.Id })
      .unwrap()
      .then((response) => {
        const items = Array.isArray(response) ? response : [];
        const firstItem = items[0];

        // Determine if it's FigoSkor based on Details property
        const isFigoSkor = firstItem?.Details === null;
        setIsFigoSkorCharge(isFigoSkor);

        // If it's not FigoSkor, fetch regular charge history details using the Id from details response
        if (!isFigoSkor && firstItem?.Id) {
          fetchChargeHistoryDetails({
            operationChargeHistoryId: firstItem.Id,
            filters: initialHistoryFilters,
          });
        }
      })
      .catch(() => {
        // If details API fails, still try to fetch charge history using row.Id as fallback
        setIsFigoSkorCharge(false);
        fetchChargeHistoryDetails({
          operationChargeHistoryId: row.Id,
          filters: initialHistoryFilters,
        });
      });
  }, [fetchPaymentDetails, fetchChargeHistoryDetails, row.Id]); // Handle search filters from child components
  const handleSearch = (apiFilters: Record<string, unknown>) => {
    const newFilters = {
      Page: 1,
      PageSize: 25,
      Sort: 'Id',
      SortType: 'Desc',
      ...apiFilters,
    };
    setCurrentFilters(newFilters);
    setPagination((prev: PaginationParams) => ({ ...prev, Page: 1 }));

    // For FigoSkor charges, no need to call history API
    if (isFigoSkorCharge) {
      // FigoSkor charges don't need additional API calls for filtering
      return;
    } else {
      // For regular charges, get the operation charge history ID from current payment details
      const items = Array.isArray(paymentDetailsResponse) ? paymentDetailsResponse : [];
      const firstItem = items[0];
      const operationChargeHistoryId = firstItem?.Id || row.Id;

      fetchChargeHistoryDetails({
        operationChargeHistoryId,
        filters: newFilters,
      });
    }
  };

  // Handle reset filters from child components
  const handleReset = () => {
    const resetFilters = {
      Page: 1,
      PageSize: 25,
      Sort: 'Id',
      SortType: 'Desc',
    };
    setCurrentFilters(resetFilters);
    setPagination((prev: PaginationParams) => ({ ...prev, Page: 1 }));

    // For FigoSkor charges, no need to call history API
    if (isFigoSkorCharge) {
      // FigoSkor charges don't need additional API calls for reset
      return;
    } else {
      // For regular charges, get the operation charge history ID from current payment details
      const items = Array.isArray(paymentDetailsResponse) ? paymentDetailsResponse : [];
      const firstItem = items[0];
      const operationChargeHistoryId = firstItem?.Id || row.Id;

      fetchChargeHistoryDetails({
        operationChargeHistoryId,
        filters: resetFilters,
      });
    }
  };

  // Handle pagination change from child components
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    const newPagination = { ...pagination, Page: page };
    setPagination(newPagination);
    const updatedFilters = {
      ...currentFilters,
      Page: page,
      PageSize: 25,
      Sort: 'Id',
      SortType: 'Desc',
    };
    setCurrentFilters(updatedFilters);

    // For FigoSkor charges, no pagination needed
    if (isFigoSkorCharge) {
      // FigoSkor charges don't need pagination
      return;
    } else {
      // For regular charges, get the operation charge history ID from current payment details
      const items = Array.isArray(paymentDetailsResponse) ? paymentDetailsResponse : [];
      const firstItem = items[0];
      const operationChargeHistoryId = firstItem?.Id || row.Id;

      fetchChargeHistoryDetails({
        operationChargeHistoryId,
        filters: updatedFilters,
      });
    }
  };

  // Handle refetch for refund operations
  const handleRefetch = () => {
    const refetchFilters = currentFilters.Page
      ? currentFilters
      : {
          Page: 1,
          PageSize: 25,
          Sort: 'Id',
          SortType: 'Desc',
        };

    // Always refetch payment details first (simple GET)
    fetchPaymentDetails({ paymentId: row.Id })
      .unwrap()
      .then((response) => {
        const items = Array.isArray(response) ? response : [];
        const firstItem = items[0];

        // If it's not FigoSkor, also refetch charge history details
        if (!isFigoSkorCharge && firstItem?.Id) {
          fetchChargeHistoryDetails({
            operationChargeHistoryId: firstItem.Id,
            filters: refetchFilters,
          });
        }
      })
      .catch(() => {
        // If refetch fails and it's not FigoSkor, try with row.Id as fallback
        if (!isFigoSkorCharge) {
          fetchChargeHistoryDetails({
            operationChargeHistoryId: row.Id,
            filters: refetchFilters,
          });
        }
      });
  };

  // Handle error state
  if (figoSkorError || chargeHistoryError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="error">
          Ödeme detayları yüklenirken hata oluştu
        </Typography>
      </Box>
    );
  }

  // Show loading state while determining charge type
  if (isFigoSkorCharge === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Yükleniyor...
        </Typography>
      </Box>
    );
  }

  const Body = isFigoSkorCharge ? (
    <FigoSkorPaymentDetails paymentDetail={figoSkorPaymentDetail!} />
  ) : (
    <RegularPaymentDetails
      paymentDetail={regularPaymentDetail!}
      allowanceKind={regularPaymentDetail?.AllowanceKind || 0}
      pagination={{ ...pagination, Sort: 'Id', SortType: 'Desc' }}
      totalCount={chargeHistoryResponse?.TotalCount || 0}
      allowanceStatuses={[
        { value: '', label: 'Tümü' },
        { value: '0', label: 'Fatura Doğrulama Bekliyor' },
        { value: '1', label: 'Yetkili Onay Bekliyor' },
        { value: '2', label: 'Yetkili Onayı Red Edildi' },
        { value: '10', label: 'Alıcı İlk Onay Bekliyor' },
        { value: '20', label: 'Alıcı İlk Onay Red' },
        { value: '30', label: 'Teklif Sürecinde' },
        { value: '40', label: 'Alıcı Son Onayı Bekliyor' },
        { value: '50', label: 'Alıcı Son Onay Red' },
        { value: '60', label: 'İptal Edildi' },
        { value: '61', label: 'Zaman Aşımı' },
        { value: '70', label: 'Finans Aşaması' },
        { value: '71', label: 'Ödeme Alındı' },
        { value: '72', label: 'Finans Şirketi Geri Çekildi' },
        { value: '80', label: 'Finans Şirketi İptal Etti' },
      ]}
      onSearch={handleSearch}
      onReset={handleReset}
      onPageChange={handlePageChange}
      onRefetch={handleRefetch}
      refetchParent={refetch}
      isLoading={isLoadingOrFetching}
      hasNoResults={!isFigoSkorCharge && chargeHistoryItems.length === 0}
    />
  );

  return <Box sx={{ p: 2 }}>{Body}</Box>;
};
