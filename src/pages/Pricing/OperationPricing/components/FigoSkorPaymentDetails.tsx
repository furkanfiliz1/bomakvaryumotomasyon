import { Box, Chip, Divider, Grid, Typography } from '@mui/material';
import { currencyFormatter } from '@utils';
import React from 'react';
import type { PaymentDetail } from '../operation-pricing.types';

interface FigoSkorPaymentDetailsProps {
  paymentDetail: PaymentDetail;
}

// Payment status enum
enum PaymentStatus {
  PAID = 1,
  CANCELED = 2,
  FAILED = 3,
  REFUND = 6,
  PARTIAL_RETURN = 7,
}

/**
 * FigoSkor Payment Details Component
 * Displays FigoSkor-specific payment information
 */
export const FigoSkorPaymentDetails: React.FC<FigoSkorPaymentDetailsProps> = ({ paymentDetail }) => {
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

  return (
    <>
      {/* FigoSkor Payment Details */}
      <Typography variant="subtitle2" color="primary" gutterBottom>
        FigoSkor Ödeme Detayları
      </Typography>
      <Divider sx={{ mb: 2 }} />
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
          <Typography variant="body2">{formatValue(paymentDetail.FigoscorePaymentDetailDescription)}</Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            KDV Dahil mi?
          </Typography>
          <Typography variant="body2">Evet</Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            FigoSkor Tutar
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatCurrency(paymentDetail.FigoscoreAmount)}
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            FigoSkor İndirim
          </Typography>
          <Typography variant="body2">{formatCurrency(paymentDetail.FigoscoreDiscountAmount)}</Typography>
        </Grid>

        <Grid item xs={12} md={1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Durum
          </Typography>
          <Box>{getPaymentStatusChip(paymentDetail.FigoscorePaymentStatus)}</Box>
        </Grid>
      </Grid>
    </>
  );
};
