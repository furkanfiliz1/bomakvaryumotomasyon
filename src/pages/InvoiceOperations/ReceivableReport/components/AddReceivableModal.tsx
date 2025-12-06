import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAddReceivableForm } from '../hooks';
import { useUpdateReceivableMutation } from '../receivable-report.api';
import { AddReceivableFormData, CreateReceivableRequest, ReceivableReportItem } from '../receivable-report.types';

interface AddReceivableModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receivableData?: ReceivableReportItem; // Add receivable data for pre-filling form
}

/**
 * Update Receivable Modal Component
 * Following OperationPricing RefundDialog pattern with Form component integration
 */
export const AddReceivableModal: React.FC<AddReceivableModalProps> = ({ open, onClose, receivableData, onSuccess }) => {
  const notice = useNotice();
  const [updateReceivable, { isLoading: isSubmitting, error }] = useUpdateReceivableMutation();
  const { form, schema, handleReset } = useAddReceivableForm(receivableData);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Error handling
  useErrorListener(error);

  // Handle form submission
  const handleSubmit = async (data: AddReceivableFormData) => {
    if (!receivableData) {
      setSubmitError('Alacak verisi bulunamadı. Lütfen sayfayı yenileyin.');
      return;
    }

    try {
      setSubmitError(null);

      // Transform form data to API request format
      const payload: CreateReceivableRequest = {
        Id: receivableData.Id, // Include ID for update
        OrderNo: data.OrderNo,
        SenderIdentifier: data.SenderIdentifier,
        SenderCompanyId: receivableData.SenderCompanyId,
        SenderName: data.SenderName,
        ReceiverIdentifier: data.ReceiverIdentifier,
        ReceiverCompanyId: receivableData.ReceiverCompanyId,
        ReceiverName: data.ReceiverName,
        PayableAmount: data.PayableAmount,
        ApprovedPayableAmount: data.ApprovedPayableAmount,
        CurrencyId: Number(data.CurrencyId),
        CurrencyCode: receivableData.CurrencyCode,
        PaymentDueDate: data.PaymentDueDate,
        IssueDate: data.IssueDate,
        Status: receivableData.Status,
        AllowanceStatus: receivableData.AllowanceStatus || undefined,
        ProductType: data.ProductType,
      };

      await updateReceivable(payload).unwrap();

      // Show success notification
      // Reset form and close modal
      notice({
        type: 'dialog',
        variant: 'success',
        title: 'Başarılı',
        message: 'Alacak başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
      onSuccess();
      handleReset();
      onClose();

      // Call success callback if provided
    } catch (error) {
      console.error('Update receivable error:', error);
      setSubmitError('Alacak güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      handleReset();
      setSubmitError(null);
      onClose();
    }
  };

  // Check if form is valid for submission
  const isValid = form.formState.isValid;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' },
      }}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Alacak Güncelle
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Alacak bilgilerini güncelleyerek kaydedin
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Error Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Form Fields */}
            <Form form={form} schema={schema} space={3} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isSubmitting} variant="outlined">
            İptal
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            disabled={!isValid}
            loadingPosition="start">
            {isSubmitting ? 'Güncelleniyor...' : 'Alacak Güncelle'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
