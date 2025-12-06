import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Form, LoadingButton } from '@components';
import type { InvoiceTransactionItem } from '../invoice-transaction.types';
import { useReturnInvoiceForm, ReturnInvoiceFormData } from '../hooks';

interface ReturnInvoiceDialogProps {
  open: boolean;
  invoice: InvoiceTransactionItem;
  onClose: () => void;
  onConfirm: (returnData: {
    ReturnInvoiceNumber?: string;
    ReturnInvoiceDate?: string;
    ReturnInvoiceAmount?: number;
  }) => void;
}

/**
 * Return Invoice Dialog Component
 * Modal for editing return invoice details using Form system
 * Following OperationPricing pattern for form handling
 */
export const ReturnInvoiceDialog: React.FC<ReturnInvoiceDialogProps> = ({ open, invoice, onClose, onConfirm }) => {
  const { form, schema, transformForSubmission } = useReturnInvoiceForm({ invoice });

  const handleConfirm = (data: ReturnInvoiceFormData) => {
    const transformedData = transformForSubmission(data);
    onConfirm(transformedData);
  };

  const handleClose = () => {
    // Reset form to initial values when closing
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">İade Faturası</Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice?.InvoiceNumber}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Form form={form} schema={schema} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          İptal
        </Button>
        <LoadingButton
          id="return-invoice-update"
          onClick={form.handleSubmit(handleConfirm)}
          variant="contained"
          color="primary">
          Güncelle
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
