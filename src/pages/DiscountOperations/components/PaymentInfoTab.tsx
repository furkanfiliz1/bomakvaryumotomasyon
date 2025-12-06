import { FigoLoading } from '@components';
import { useErrorListener } from '@hooks';
import { Alert, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { AllowanceKind, ProductTypes } from '@types';
import { currencyFormatter } from '@utils';
import React from 'react';
import { useGetPaymentInfoQuery } from '../discount-operations.api';

interface PaymentInfoTabProps {
  allowanceId: number;
  kind?: number;
  productType?: number;
}

const PaymentInfoTab: React.FC<PaymentInfoTabProps> = ({ allowanceId, kind, productType }) => {
  const { data: paymentInfoData, isLoading, error } = useGetPaymentInfoQuery({ allowanceId });

  // Error handling
  useErrorListener([error]);

  // Determine allowance type based on kind and productType
  const isReceivable = kind === AllowanceKind.RECEIVABLE;
  const isCheque = kind === AllowanceKind.CHEQUE;
  const isSpotWithoutInvoice =
    kind === AllowanceKind.SPOT_WITHOUT_INVOICE || productType === ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE;
  const isCommercialLoan = kind === AllowanceKind.COMMERCIAL_LOAN || productType === ProductTypes.COMMERCIAL_LOAN;
  const isInstantBusinessLoan = productType === ProductTypes.INSTANT_BUSINESS_LOAN;
  const isSpot = isSpotWithoutInvoice || productType === ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE;

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Hata: Ödeme bilgileri yüklenirken bir sorun oluştu.
      </Alert>
    );
  }

  if (!paymentInfoData) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            {isSpot || isSpotWithoutInvoice || isCommercialLoan ? 'Fonlanmamış spot kredisi' : 'Fonlanmamış'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          {isReceivable ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Alacak Toplam Tutarı
                  </Typography>
                  <Typography variant="body1">
                    {currencyFormatter(paymentInfoData.TotalOrderAmount, paymentInfoData.CurrencyName)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Alacak Toplam Adedi
                  </Typography>
                  <Typography variant="body1">{paymentInfoData.TotalPaidOrderCount}</Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {!isInstantBusinessLoan && (
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {isCheque
                        ? 'Toplam Çek Tutarı'
                        : isSpotWithoutInvoice || isCommercialLoan || isInstantBusinessLoan
                          ? 'Kredi Tutarı'
                          : 'Toplam Fatura Tutarı'}
                    </Typography>
                    <Typography variant="body1">
                      {currencyFormatter(
                        isCheque
                          ? paymentInfoData.TotalBillAmount
                          : kind === AllowanceKind.SPOT_WITHOUT_INVOICE
                            ? paymentInfoData.TotalOrderAmount
                            : paymentInfoData.TotalAmount,
                        paymentInfoData.CurrencyName,
                      )}
                    </Typography>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    {isCheque
                      ? 'Ödenen Çek Tutarı'
                      : isSpotWithoutInvoice || isCommercialLoan || isInstantBusinessLoan
                        ? 'Ödenen Kredi Tutarı'
                        : 'Ödenen Fatura Tutarı'}
                  </Typography>
                  <Typography variant="body1">
                    {currencyFormatter(paymentInfoData.TotalPaidAmount, paymentInfoData.CurrencyName)}
                  </Typography>
                </Box>
              </Grid>
              {!isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan && (
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {isCheque ? 'Toplam Çek Adedi' : 'Toplam Fatura Adedi'}
                    </Typography>
                    <Typography variant="body1">
                      {isCheque ? paymentInfoData.TotalBillCount : paymentInfoData.TotalInvoiceCount}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {!isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan && (
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {isCheque ? 'Ödenen Çek Adedi' : 'Ödenen Fatura Adedi'}
                    </Typography>
                    <Typography variant="body1">
                      {isCheque ? paymentInfoData.TotalPaidBillCount : paymentInfoData.TotalPaidInvoiceCount}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentInfoTab;
