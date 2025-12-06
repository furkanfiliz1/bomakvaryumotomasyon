import { Form } from '@components';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React from 'react';
import { PaymentFormData, usePaymentForm } from '../hooks/usePaymentForm';

interface PaymentModalProps {
  open: boolean;
  allowanceId?: number | null;
  onClose: () => void;
  onConfirm: (data: PaymentFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<PaymentFormData>;
}

/**
 * Payment modal component for discount operations
 * Based on PayChequeModalPopup from legacy system but using modern form patterns
 * Follows OperationPricing modal patterns
 */
export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  allowanceId,
  onClose,
  onConfirm,
  isLoading = false,
  initialData,
}) => {
  // Debug logging

  // Use the payment form hook
  const { form, schema, handleSubmit, handleReset, handleGetPaymentInfo, isLoadingBids, isSubmittingPayment } =
    usePaymentForm({
      allowanceId,
      initialData,
      onSubmit: onConfirm,
    });

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Ödeme Detayları
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Get payment info button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGetPaymentInfo}
            disabled={isLoading || isLoadingBids || isSubmittingPayment}
            sx={{ mb: 2 }}>
            {isLoadingBids ? 'Yükleniyor...' : 'Tekliften Ödeme Bilgilerini Al'}
          </Button>
        </Box>

        {/* Form fields using the modern Form component */}
        <Box sx={{ mt: 2 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form as any} schema={schema as any} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading || isSubmittingPayment}>
          İptal
        </Button>
        <LoadingButton
          loading={isLoading || isSubmittingPayment}
          onClick={handleSubmit}
          variant="contained"
          color="primary">
          Ödeme Bilgilerini Kaydet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
