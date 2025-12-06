import { FigoLoading } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import React, { useEffect, useState } from 'react';
import { useGetSenderUsageDetailQuery } from '../discount-operations.api';

interface OffersTabProps {
  allowanceId: number;
  kind?: AllowanceKind;
  isSpot?: boolean;
  isSpotWithoutInvoice?: boolean;
  isReceivable?: boolean;
  isCommercialLoan?: boolean;
}

const OffersTab: React.FC<OffersTabProps> = ({
  allowanceId,
  isSpot,
  isSpotWithoutInvoice,
  isReceivable,
  isCommercialLoan,
}) => {
  const [showOffers, setShowOffers] = useState(false);

  const {
    data: offersData,
    isLoading,
    error,
  } = useGetSenderUsageDetailQuery({
    AllowanceId: allowanceId,
  });

  // Error handling
  useErrorListener([error]);

  useEffect(() => {
    if (offersData?.Details && offersData.Details.length > 0) {
      setShowOffers(true);
    } else if (offersData?.Details && offersData.Details.length === 0) {
      setShowOffers(false);
    }
  }, [offersData]);

  if (isLoading) {
    return (
      <Box position="relative" height="200px">
        <FigoLoading />
      </Box>
    );
  }

  if (!showOffers || !offersData?.Details || offersData.Details.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography color="text.secondary">Teklif bulunamadı</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {offersData.Details.map((bid) => {
        const {
          FinancerName = '',
          BidAmount = 0,
          BidAvgDueDayCount = 0,
          BsmvAmount = 0,
          BidAmountCurrency = 'TRY',
          InterestAmount = 0,
          InterestRate = 0,
          ComissionAmount = 0,
          CommissionRate = 0,
          Rebate = 0,
          ExtraDueDayCount = 0,
          ReceiverInterestRate = 0,
          CostAmount = 0,
          CostRate = 0,
          TotalKKDFAmount = 0,
          InstallmentAmount = 0,
          TotalPaymentAmount = 0,
          CreditInsuranceFee,
        } = bid;

        const amountToBeRepaid = BidAmount + BsmvAmount + InterestAmount + ComissionAmount;

        return (
          <Card key={bid.Id} sx={{ mb: 3 }}>
            <CardContent>
              {/* First Row */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Finans Şirketi
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                      {FinancerName}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      {isCommercialLoan ? 'Vade' : 'Teklif ortalama vade'}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {isCommercialLoan ? `${Math.floor(BidAvgDueDayCount / 30)} Ay` : `${BidAvgDueDayCount} Gün`}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      BSMV Tutarı
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {currencyFormatter(BsmvAmount, BidAmountCurrency)}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Faiz Tutarı
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {currencyFormatter(InterestAmount, BidAmountCurrency)}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Faiz Oranı
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      %{InterestRate}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Kredi Kullandırım Ücreti (Tutar)
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {currencyFormatter(ComissionAmount, BidAmountCurrency)}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Kredi Kullandırım Ücreti (Oran)
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      %{CommissionRate}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      {isCommercialLoan ? 'Kredi Tutarı' : 'Teklif Tutarı'}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {currencyFormatter(BidAmount, BidAmountCurrency)}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      Teklif Durumu
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      <Chip
                        label={bid.IsWinner === 1 ? 'Teklif Seçildi' : 'Teklif Seçilmedi'}
                        color={bid.IsWinner === 1 ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>

                {!isCommercialLoan && (
                  <>
                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Rebate Tutarı
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {currencyFormatter(Rebate, BidAmountCurrency)}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Ekstra Gün
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {ExtraDueDayCount} Gün
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Alıcı Faiz Oranı
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {ReceiverInterestRate || 0}%
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      {isReceivable ? 'Alacak Komisyon Tutarı' : ' TFS Komisyon Tutarı'}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      {currencyFormatter(CostAmount, BidAmountCurrency)}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Box>
                    <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                      {isReceivable ? 'Alacak Komisyon Orani' : ' TFS Komisyon Oranı'}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 'medium' }}>
                      %{CostRate}
                    </Box>
                  </Box>
                </Grid>

                {/* For Commercial Loans (TTK) */}
                {isCommercialLoan && (
                  <>
                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Aylık Taksit Tutarı
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {currencyFormatter(InstallmentAmount, BidAmountCurrency)}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Geri Ödeme Tutarı
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {currencyFormatter(TotalPaymentAmount, BidAmountCurrency)}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                      <Box>
                        <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                          Sigorta Tutarı
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {CreditInsuranceFee ? currencyFormatter(CreditInsuranceFee, BidAmountCurrency) : '-'}
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}

                {/* For other loan types */}
                {!isCommercialLoan && (
                  <Grid item xs={6} md={2}>
                    <Box>
                      <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block' }}>
                        {isSpot || isSpotWithoutInvoice
                          ? 'Geri Ödenecek Tutar'
                          : !isReceivable
                            ? 'KKDF Tutarı'
                            : 'Rebate Tutarı'}
                      </Box>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        {isSpot || isSpotWithoutInvoice
                          ? currencyFormatter(amountToBeRepaid, BidAmountCurrency)
                          : !isReceivable
                            ? currencyFormatter(TotalKKDFAmount, BidAmountCurrency)
                            : currencyFormatter(Rebate, BidAmountCurrency)}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default OffersTab;
