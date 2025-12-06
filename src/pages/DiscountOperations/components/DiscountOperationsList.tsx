import { Box, Card, Chip, Grid, Pagination, Skeleton, Typography } from '@mui/material';
import { AllowanceStatusEnum, ProductTypes } from '@types';
import React from 'react';
import { PagingConfig } from 'src/components/common/Table/types';
import { currencyFormatter } from 'src/utils/currency';
import { DiscountOperation } from '../discount-operations.types';
import { IntegratorReportsIcon } from './IntegratorReportsDialog';
import { TableRowActions } from './TableRowActions';

interface DiscountOperationsListProps {
  data: DiscountOperation[];
  loading?: boolean;
  error?: string;
  productType: ProductTypes;
  pagingConfig?: PagingConfig;
  onCancelAllowance: (allowanceId: number) => void;
  onBidPayment: (allowanceId: number) => void;
  onViewDetails: (allowanceId: number) => void;
}

const DiscountOperationsList: React.FC<DiscountOperationsListProps> = ({
  data,
  loading,
  error,
  productType,
  pagingConfig,
  onCancelAllowance,
  onBidPayment,
  onViewDetails,
}) => {
  // Product type flags
  const isCheque = productType === ProductTypes.CHEQUES_FINANCING;
  const isSpot = productType === ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE;
  const isSupplier = productType === ProductTypes.SUPPLIER_FINANCING;
  const isSME = productType === ProductTypes.SME_FINANCING;
  const isReceiver = productType === ProductTypes.RECEIVABLE_FINANCING;
  const isSpotWithoutInvoice = productType === ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE;
  const isCommercialLoan = productType === ProductTypes.COMMERCIAL_LOAN;
  const isRevolvingCredit = productType === ProductTypes.ROTATIVE_LOAN;
  const isInstantBusinessLoan = productType === ProductTypes.INSTANT_BUSINESS_LOAN;

  const getTotalText = () => {
    switch (productType) {
      case ProductTypes.CHEQUES_FINANCING:
        return 'Toplam Çek';
      case ProductTypes.RECEIVABLE_FINANCING:
        return 'Toplam Alacak';
      default:
        return 'Toplam Fatura';
    }
  };

  const getDiscountInitiatedAmountText = () => {
    switch (productType) {
      case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
        return 'Kredi Başlatılan Tutar';
      case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      case ProductTypes.INSTANT_BUSINESS_LOAN:
      case ProductTypes.COMMERCIAL_LOAN:
        return 'Kredi Başlatılan Tutar ';
      case ProductTypes.RECEIVABLE_FINANCING:
        return 'Alacak Talep Tutarı';
      default:
        return 'Toplam Fatura';
    }
  };

  const getRequestDate = (allowance: DiscountOperation) => {
    const date = isSpot ? allowance.InsertDatetime : allowance.AllowanceDueDate;
    return date ? new Date(date).toLocaleDateString('tr-TR') : '-';
  };

  const getStatusChip = (status: number, statusDesc: string) => {
    const color = status === AllowanceStatusEnum.OdemeAlindi ? 'success' : 'default';
    return <Chip label={statusDesc} color={color} size="small" sx={{ fontWeight: 'bold' }} />;
  };

  const SkeletonCard = () => {
    // Calculate number of skeleton fields based on product type
    const getSkeletonFieldCount = () => {
      if (isCheque) return 7;
      if (isSpotWithoutInvoice || isCommercialLoan) return 6;
      if (isSpot) return 7;
      return 7; // Default for other types
    };

    return (
      <Card sx={{ boxShadow: 1, p: 2 }}>
        {/* Header Section */}
        <Box sx={{ p: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Skeleton variant="text" width={80} height={32} />
                <Skeleton variant="rounded" width={120} height={24} />
              </Box>
              <Skeleton variant="text" width="70%" height={20} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Skeleton variant="rounded" width={70} height={32} />
                <Skeleton variant="rounded" width={100} height={32} />
                <Skeleton variant="rounded" width={80} height={32} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Details Grid */}
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Grid container>
            {/* Create skeleton boxes for the detail fields based on product type */}
            {Array.from({ length: getSkeletonFieldCount() }).map((_, index) => {
              // Vary the grid sizes to match actual layout
              let mdSize = 1.5;
              if (index === 0) mdSize = isCheque || isSpotWithoutInvoice || isCommercialLoan ? 2 : 1.5;
              if (index === 1 && (isSpotWithoutInvoice || isCommercialLoan)) mdSize = 2;
              if (index === 1 && isSpot) mdSize = 2;
              if (index === 4 && !isCheque && !isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan)
                mdSize = 2;
              if (index === 5 && (isCheque || isSpotWithoutInvoice || isCommercialLoan || isSpot)) mdSize = 2;

              return (
                <Grid key={index} item xs={6} sm={4} md={mdSize}>
                  <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '80px' }}>
                    <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                    {/* Add second line for some fields */}
                    {index === 6 && isSpotWithoutInvoice && (
                      <Skeleton variant="text" width="50%" height={14} sx={{ mt: 0.5 }} />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Bir hata oluştu: {error}</Typography>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <img width={100} alt="not-found" src="/assets/icons/search.png" />
          <Typography variant="h6" color="text.secondary">
            Sonuç bulunamadı
          </Typography>
        </Box>
      </Card>
    );
  }
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.map((allowance) => (
          <Card key={allowance.Id} sx={{ p: 0 }}>
            {/* Header Section */}
            <Box sx={{ p: 2 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {allowance.Id}
                    </Typography>
                    {getStatusChip(allowance.Status, allowance.StatusDesc)}

                    {isCheque &&
                      allowance?.RejectedBidCount !== undefined &&
                      allowance.Status !== AllowanceStatusEnum.FinansSirketiGeriCekildi &&
                      allowance.Status !== AllowanceStatusEnum.FinansSirketiIptalEtti &&
                      allowance.Status !== AllowanceStatusEnum.ZamanAsimi &&
                      allowance.Status !== AllowanceStatusEnum.IptalEdildi &&
                      allowance.IsGivingBid && (
                        <>
                          {console.log('allowance.IsGivingBid', allowance.IsGivingBid)}

                          {allowance.RejectedBidCount === 0 ? (
                            <Chip label="Tam Teklif" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                          ) : (
                            <Chip
                              label={`Kısmı Teklif ${allowance.AllowanceBillCount - allowance.RejectedBidCount}/${allowance.AllowanceBillCount}`}
                              color="warning"
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          )}
                        </>
                      )}
                    {isCheque && <IntegratorReportsIcon allowanceId={allowance.Id} />}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {`${allowance.SenderCompanyName}${allowance.IntegratorName ? ' - ' + allowance.IntegratorName : ''}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
                  <TableRowActions
                    row={allowance}
                    onCancelAllowance={onCancelAllowance}
                    onBidPayment={onBidPayment}
                    onViewDetails={onViewDetails}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Details Grid */}
            <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
              <Grid container>
                {/* Request Date */}
                <Grid item xs={6} sm={4} md={isCheque || isSpotWithoutInvoice || isCommercialLoan ? 1.6 : 1.5}>
                  <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      {isSpot ? 'Oluşturma Tarihi' : 'Talep Tarihi'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {getRequestDate(allowance)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Amount Fields - Conditional rendering based on product type */}
                {!isCheque && !isSupplier && !isReceiver && (
                  <Grid item xs={6} sm={4} md={isSpotWithoutInvoice || isCommercialLoan ? 2 : isSpot ? 2 : 1.5}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {getDiscountInitiatedAmountText()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {currencyFormatter(allowance.TotalPayableAmount, allowance.PayableAmountCurrency)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Buyer Company for Supplier/Receiver */}
                {(isSupplier || isReceiver) && (
                  <Grid item xs={6} sm={4} md={1.5}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Alıcı Firma
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {allowance.ReceiverCompanyName || '-'}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Total Amount for Supplier/Cheque/Receiver */}
                {(isSupplier || isCheque || isReceiver) && (
                  <Grid item xs={6} sm={4} md={isCheque ? 1.5 : 1.5}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {isSupplier ? 'Toplam Tutar' : isReceiver ? 'Alacak Tutarı' : 'Çek Tutarı'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {currencyFormatter(allowance.TotalPayableAmount, allowance.PayableAmountCurrency)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Paid Cheque Amount for Cheques */}
                {isCheque && (
                  <Grid item xs={6} sm={4} md={1.5}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Ödenen Çek Tutarı
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {currencyFormatter(allowance.TotalPaidAmount, allowance.PayableAmountCurrency)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Paid Amount - Not for Cheques, SpotWithoutInvoice, CommercialLoan, InstantBusinessLoan */}
                {!isCheque && !isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan && (
                  <Grid item xs={6} sm={4} md={2}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {isReceiver ? 'Ödenen Alacak Tutarı' : 'Ödenen Fatura Tutarı'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {currencyFormatter(allowance.TotalPaidAmount, allowance.PayableAmountCurrency)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Financer */}
                <Grid item xs={6} sm={4} md={isCheque || isSpotWithoutInvoice || isCommercialLoan ? 1 : 1.5}>
                  <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Finansör
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {allowance.FinancerName || allowance.WinnerFinancerCompanyName || '-'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Customer Manager */}
                <Grid item xs={6} sm={4} md={isCheque || isSpotWithoutInvoice || isCommercialLoan || isSpot ? 2 : 1.5}>
                  <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      Müşteri Temsilcisi
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {allowance.CustomerManagerName || '-'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Average Maturity - Not for Spot and InstantBusinessLoan */}
                {!isSpot && !isInstantBusinessLoan && (
                  <Grid item xs={6} sm={4} md={isCheque ? 1.5 : 1.5}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {isSpotWithoutInvoice || isCommercialLoan || isRevolvingCredit ? 'Vade' : 'Ortalama Vade'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {allowance.AvgDueDayCount} Gün
                      </Typography>
                      {isSpotWithoutInvoice && allowance.AllowanceDueDate && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(allowance.AllowanceDueDate).toLocaleDateString('tr-TR')}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}

                {/* Total Count - Not for SpotWithoutInvoice, CommercialLoan, InstantBusinessLoan */}
                {!isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan && (
                  <Grid item xs={6} sm={4} md={isCheque ? 1.5 : 1}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {getTotalText()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {(isCheque ? allowance.AllowanceBillCount : allowance.AllowanceInvoiceCount) || '0'} Adet
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Remaining Charged Amount for SME and Cheques */}
                {(isSME || isCheque) && (
                  <Grid item xs={6} sm={4} md={1.4}>
                    <Box sx={{ p: 1, borderRight: 1, borderColor: 'divider', height: '100%' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Kalan Tahsilat Tutarı
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {allowance.RemainingChargedAmount
                          ? currencyFormatter(allowance.RemainingChargedAmount, allowance.PayableAmountCurrency)
                          : '-'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {pagingConfig &&
        pagingConfig.totalCount &&
        pagingConfig.rowsPerPage &&
        pagingConfig.totalCount > pagingConfig.rowsPerPage && (
          <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              count={Math.ceil(pagingConfig.totalCount / pagingConfig.rowsPerPage)}
              page={pagingConfig.page || 1}
              onChange={(_, page) => pagingConfig.onPageChange?.(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
    </>
  );
};

export default DiscountOperationsList;
