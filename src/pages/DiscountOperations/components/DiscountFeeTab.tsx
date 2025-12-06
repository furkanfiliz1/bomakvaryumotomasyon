import { FigoLoading, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { AllowanceKind } from '@types';
import { currencyFormatter } from '@utils';
import React, { useState } from 'react';
import {
  useCreateTransactionFeeMutation,
  useGetOperationChargeHistoryQuery,
  useSetAllowanceIsCompleteMutation,
} from '../discount-operations.api';

interface DiscountFeeTabProps {
  allowanceId: number;
  kind?: AllowanceKind;
  isSpot?: boolean;
  isSpotWithoutInvoice?: boolean;
  isReceivable?: boolean;
  isCommercialLoan?: boolean;
  isCheque?: boolean;
  isCreatedWithTransactionFee?: boolean;
}

const DiscountFeeTab: React.FC<DiscountFeeTabProps> = ({
  allowanceId,
  isSpot,
  isSpotWithoutInvoice,
  isReceivable,
  isCommercialLoan,
  isCheque,
  isCreatedWithTransactionFee,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const notice = useNotice();
  const { data: discountFees = [], isLoading, error, refetch } = useGetOperationChargeHistoryQuery(allowanceId);
  const [createTransactionFee, { isLoading: isCreating, error: createError }] = useCreateTransactionFeeMutation();
  const [setAllowanceIsComplete, { isLoading: isCompleting, error: completeError }] =
    useSetAllowanceIsCompleteMutation();

  // Error handling
  useErrorListener([error, createError, completeError]);

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getAmountText = () => {
    if (isSpot || isSpotWithoutInvoice || isCommercialLoan) {
      return 'Kredi Tutarı';
    } else if (isReceivable) {
      return 'Alacak Tutarı';
    } else {
      return 'İskonto Tutarı';
    }
  };

  const handleCreateTransactionFee = async () => {
    try {
      await createTransactionFee({ allowanceId }).unwrap();
    } catch (error) {
      console.error('Failed to create transaction fee:', error);
    } finally {
      refetch();
    }
  };

  const handleSetAllowanceIsComplete = async () => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Emin misiniz?',
        message: 'İskonto sıfır işlem ücreti ile portala yansıyacaktır devam etmek istiyor musunuz?',
        buttonTitle: 'Evet, tamamla!',
        catchOnCancel: true,
      });

      try {
        await setAllowanceIsComplete({ allowanceId }).unwrap();
      } catch (error) {
        console.error('Failed to set allowance as complete:', error);
      } finally {
        refetch();
      }
    } catch (error) {
      // User cancelled the confirmation
      console.log('User cancelled the confirmation');
    }
  };

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
        Hata: İşlem ücretleri yüklenirken bir sorun oluştu.
      </Alert>
    );
  }

  if (!discountFees || discountFees.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4} gap={2}>
        {isCheque && !isCreatedWithTransactionFee ? (
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTransactionFee}
              disabled={isCreating || isCompleting}
              startIcon={isCreating ? <CircularProgress size={20} /> : null}>
              İşlem Ücreti Oluştur
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSetAllowanceIsComplete}
              disabled={isCreating || isCompleting}
              startIcon={isCompleting ? <CircularProgress size={20} /> : null}>
              İşlem Ücretsiz Oluştur
            </Button>
          </Box>
        ) : (
          <Typography color="text.secondary">Liste bulunamadı</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {discountFees.map((fee, index) => (
        <Card key={fee.Id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tedarikçi VKN
                </Typography>
                <Typography variant="body2">{fee.ChargeCompanyIdentifier}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tedarikçi Ünvanı
                </Typography>
                <Typography variant="body2" noWrap>
                  {fee.ChargeCompanyName}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getAmountText()}
                </Typography>
                <Typography variant="body2">
                  {currencyFormatter(fee.TotalInvoicePayableAmount, fee.CurrencyName)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Toplam Ücret
                </Typography>
                <Typography variant="body2">{currencyFormatter(fee.DiscountedAmount, 'TRY')}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary" size="small" onClick={() => toggleExpand(index)}>
                    Detaylar
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Collapse in={expandedItems.has(index)} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                {fee.Details?.map((detail, detailIndex) => (
                  <Card key={detailIndex} variant="outlined" sx={{ mb: 1, backgroundColor: 'grey.50' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {isReceivable ? 'Alacak ID' : 'Fatura ID'}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {isReceivable ? detail.OrderId : detail.InvoiceId}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {isReceivable ? 'Alacak No' : 'Fatura Numarası'}
                          </Typography>
                          <Typography variant="body2">{detail.InvoiceNumber}</Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Min Tutar
                          </Typography>
                          <Typography variant="body2">
                            {currencyFormatter(detail.MinAmountInfo, fee.CurrencyName)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Max Tutar
                          </Typography>
                          <Typography variant="body2">
                            {currencyFormatter(detail.MaxAmountInfo, fee.CurrencyName)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {isReceivable ? 'Alacak Tutarı' : 'Fatura Tutarı'}
                          </Typography>
                          <Typography variant="body2">
                            {currencyFormatter(detail.InvoicePayableAmount, fee.CurrencyName)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            İşlem Ücreti
                          </Typography>
                          <Typography variant="body2">{currencyFormatter(detail.DiscountedAmount, 'TRY')}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DiscountFeeTab;
