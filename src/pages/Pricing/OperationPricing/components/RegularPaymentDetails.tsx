import { fields, Form, LoadingButton } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Box, Button, Chip, Divider, Grid, Pagination, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import yup from '@validation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRefundPaymentTransactionMutation } from '../operation-pricing.api';
import type { PaymentDetail, PaymentDetailItem } from '../operation-pricing.types';
import { RefundDialog } from './RefundDialog';

interface RegularPaymentDetailsProps {
  paymentDetail: PaymentDetail;
  allowanceKind: number;
  pagination: {
    Page: number;
    PageSize: number;
    Sort: string;
    SortType: string;
  };
  totalCount: number;
  allowanceStatuses: Array<{ value: string; label: string }>;
  onSearch: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onRefetch: () => void;
  hasNoResults?: boolean;
  isLoading?: boolean;
  refetchParent: () => void;
}

// AllowanceKind enum values matching the old project
enum AllowanceKind {
  INVOICE = 3,
  CHEQUE = 6,
  RECEIVABLE = 9,
}

// Payment status enum
enum PaymentStatus {
  PAID = 1,
  CANCELED = 2,
  FAILED = 3,
  REFUND = 6,
  PARTIAL_RETURN = 7,
}

interface FilterFormData {
  numberField: string;
  allowanceStatus?: string | number | undefined;
}

/**
 * Regular Payment Details Component
 * Displays regular payment information with filtering capabilities
 */
export const RegularPaymentDetails: React.FC<RegularPaymentDetailsProps> = ({
  paymentDetail,
  allowanceKind,
  pagination,
  totalCount,
  allowanceStatuses,
  onSearch,
  onReset,
  onPageChange,
  onRefetch,
  hasNoResults = false,
  refetchParent,
  isLoading = false,
}) => {
  const [selectedRefundItem, setSelectedRefundItem] = useState<PaymentDetailItem | null>(null);
  const [refundPaymentTransaction, { error }] = useRefundPaymentTransactionMutation();

  useErrorListener(error);
  const formatValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  };

  const formatCurrency = (value: number | null | undefined, currency = 'TRY'): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    return currencyFormatter(value, currency);
  };

  // Get field title based on AllowanceKind
  const getFieldTitle = (allowanceKindValue: number) => {
    switch (allowanceKindValue) {
      case AllowanceKind.CHEQUE:
        return 'Çek No';
      case AllowanceKind.RECEIVABLE:
        return 'Alacak No';
      default:
        return 'Fatura No';
    }
  };

  // Get dynamic form schema based on AllowanceKind
  const getFilterFormSchema = (allowanceKindValue: number) => {
    const numberFieldLabel = getFieldTitle(allowanceKindValue);

    return yup.object({
      numberField: fields.text.label(numberFieldLabel).meta({ col: 6 }),
      allowanceStatus: fields.select(allowanceStatuses, 'string', ['value', 'label']).label('Statü').meta({ col: 6 }),
    });
  };

  const schema = getFilterFormSchema(allowanceKind);

  const form = useForm<FilterFormData>({
    defaultValues: {
      numberField: '',
      allowanceStatus: '',
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSearch = () => {
    const formData = form.getValues();
    const apiFilters: Record<string, unknown> = {
      ...pagination,
      Page: 1, // Reset to first page on search
    };

    // Map the dynamic number field based on AllowanceKind
    if (formData.numberField) {
      switch (allowanceKind) {
        case AllowanceKind.CHEQUE:
          apiFilters.BillNumber = formData.numberField;
          break;
        case AllowanceKind.RECEIVABLE:
          apiFilters.OrderNo = formData.numberField;
          break;
        default:
          apiFilters.InvoiceNumber = formData.numberField;
      }
    }

    // Add status filter if selected
    if (formData.allowanceStatus) {
      apiFilters.AllowanceInvoiceStatus = formData.allowanceStatus;
    }

    onSearch(apiFilters);
  };

  const handleReset = () => {
    form.reset();
    onReset();
  };

  const handleRefundClick = (item: PaymentDetailItem) => {
    setSelectedRefundItem(item);
  };

  const handleRefundConfirm = async (reason: string) => {
    if (!selectedRefundItem) return;

    try {
      const refundData = {
        operationChargeHistoryDetailId: selectedRefundItem.Id,
        refundReason: reason,
      };

      await refundPaymentTransaction(refundData).unwrap();
      setSelectedRefundItem(null);
      onRefetch();
      refetchParent();
    } catch (error) {
      // Error will be handled by the global error handler
    }
  };

  const handleRefundCancel = () => {
    setSelectedRefundItem(null);
  };

  // Get payment status chip component
  const getPaymentStatusChip = (status: number, refundType?: string, paymentType?: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return (
          <Chip
            label={`Ödendi${paymentType ? ` - ${paymentType}` : ''}`}
            color="success"
            variant="filled"
            size="small"
          />
        );
      case PaymentStatus.CANCELED:
        return <Chip label="İptal Edildi" color="error" variant="filled" size="small" />;
      case PaymentStatus.FAILED:
        return <Chip label="Başarısız" color="error" variant="filled" size="small" />;
      case PaymentStatus.REFUND:
        return (
          <Chip label={`İade${refundType ? ` - ${refundType}` : ''}`} color="error" variant="filled" size="small" />
        );
      case PaymentStatus.PARTIAL_RETURN:
        return <Chip label="Kısmi İade" color="warning" variant="filled" size="small" />;
      default:
        return <Chip label="Bilinmeyen" color="default" variant="outlined" size="small" />;
    }
  };

  // Get allowance status description based on AllowanceKind
  const getAllowanceStatusDescription = (detail: PaymentDetailItem, allowanceKindValue: number) => {
    if (allowanceKindValue === AllowanceKind.RECEIVABLE) {
      return detail.AllowanceOrderStatusDescription;
    } else if (allowanceKindValue === AllowanceKind.CHEQUE) {
      return detail.AllowanceBillStatusDescription;
    } else {
      return detail.AllowanceInvoiceStatusDescription;
    }
  };

  // Get number field value based on AllowanceKind
  const getNumberFieldValue = (detail: PaymentDetailItem, allowanceKindValue: number) => {
    if (allowanceKindValue === AllowanceKind.CHEQUE) {
      return detail.BillNumber;
    } else if (allowanceKindValue === AllowanceKind.RECEIVABLE) {
      return detail.OrderNo;
    } else {
      return detail.InvoiceNumber;
    }
  };

  return (
    <>
      {/* Summary Header Section */}
      <Box
        sx={{
          backgroundColor: 'grey.400',
          color: 'white',
          p: 1.5,
          mb: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          İskonto Talebi: #{formatValue(paymentDetail.Id)} - {formatValue(paymentDetail.AllowanceKindDescription)}
        </Typography>
        <Typography variant="body1">İndirim {formatCurrency(paymentDetail.DiscountAmount)}</Typography>
      </Box>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <Box sx={{ flex: 1, pt: 1 }}>
          <Form form={form} schema={schema} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: -2 }}>
          <LoadingButton id="search-button" variant="contained" onClick={handleSearch} loading={isLoading}>
            Uygula
          </LoadingButton>
          <Button variant="outlined" onClick={handleReset} disabled={isLoading}>
            Temizle
          </Button>
        </Box>
      </Box>

      {/* Regular Payment Details */}
      <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 3 }}>
        Ödeme Detayları
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* No Results Message */}
      {hasNoResults ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Arama kriterlerine uygun sonuç bulunamadı
          </Typography>
        </Box>
      ) : (
        <>
          {/* Detail items */}
          {paymentDetail.Details && Array.isArray(paymentDetail.Details) && paymentDetail.Details.length > 0 ? (
            paymentDetail.Details.map((detail: PaymentDetailItem, index: number) => (
              <Box
                key={detail.Id || index}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'white' : 'grey.50',
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {getFieldTitle(allowanceKind)}
                    </Typography>
                    <Typography variant="body2">{formatValue(getNumberFieldValue(detail, allowanceKind))}</Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Fatura Tutarı
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(detail.InvoicePayableAmount, detail.CurrencyName)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Açıklama
                    </Typography>
                    <Typography variant="body2">
                      {detail.MinAmountInfo && detail.MaxAmountInfo
                        ? `${detail.MinAmountInfo}-${detail.MaxAmountInfo}`
                        : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {detail.PercentFeeInfo ? 'Oran' : 'Sabit Ücret'}
                    </Typography>
                    <Typography variant="body2">{detail.PercentFeeInfo || detail.TransactionFeeInfo || '-'}</Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      İşlem Tutarı
                    </Typography>
                    <Typography variant="body2">{formatCurrency(detail.PaidAmount, detail.CurrencyName)}</Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      İndirim Tutarı
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(detail.DiscountAmount, detail.CurrencyName)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Statü
                    </Typography>
                    <Typography variant="body2">
                      {getAllowanceStatusDescription(detail, allowanceKind) || '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Durum
                    </Typography>
                    <Box>{getPaymentStatusChip(detail.PaymentStatus, detail.RefundTypeDescription || undefined)}</Box>
                  </Grid>

                  {/* Refund Action - Show based on conditions from old project */}
                  {detail.PaymentStatus === PaymentStatus.PAID && (
                    <Grid item xs={12} md={1}>
                      <Button
                        sx={{ mt: 2 }}
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRefundClick(detail)}>
                        İade
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))
          ) : (
            // Fallback for when Details array is empty or null
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatValue(paymentDetail.Id)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Açıklama
                </Typography>
                <Typography variant="body2">{formatValue(paymentDetail.Description)}</Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  İşlem Ücreti
                </Typography>
                <Typography variant="body2">{formatCurrency(paymentDetail.TransactionFee)}</Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ödenen Tutar
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {formatCurrency(paymentDetail.PaidAmount)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  İndirim
                </Typography>
                <Typography variant="body2">{formatCurrency(paymentDetail.DiscountAmount)}</Typography>
              </Grid>

              <Grid item xs={12} md={1.5}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  İade Tutar
                </Typography>
                <Typography variant="body2">{formatCurrency(paymentDetail.ReturnedAmount)}</Typography>
              </Grid>
            </Grid>
          )}
          {console.log('paymentDetail.Details', paymentDetail.Details)}
          {/* Pagination - Show if there are multiple pages */}
          {totalCount > pagination.PageSize && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(totalCount / pagination.PageSize)}
                page={pagination.Page}
                onChange={onPageChange}
                size="small"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Refund Dialog */}
      {selectedRefundItem && (
        <RefundDialog
          open={Boolean(selectedRefundItem)}
          item={
            {
              OrderNumber: getNumberFieldValue(selectedRefundItem, allowanceKind) || '',
              CompanyName: '', // PaymentDetailItem doesn't have CompanyName
              NetAmount: selectedRefundItem.PaidAmount || 0,
              CurrencyName: selectedRefundItem.CurrencyName || 'TRY',
            } as import('../operation-pricing.types').OperationPricingItem
          }
          onConfirm={handleRefundConfirm}
          onCancel={handleRefundCancel}
        />
      )}
    </>
  );
};
