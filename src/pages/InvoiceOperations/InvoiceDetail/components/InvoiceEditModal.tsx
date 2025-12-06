import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useUpdateInvoiceMutation } from '../../invoice-operations.api';
import type { InvoiceEditFormData, InvoiceItem, InvoiceUpdateRequest } from '../../invoice-operations.types';
import { useInvoiceEditForm } from '../hooks';

interface InvoiceEditModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
  onUpdate: () => void;
}

export const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({ open, onClose, invoice, onUpdate }) => {
  const notice = useNotice();

  // Update invoice mutation
  const [updateInvoice, { isLoading: isUpdating, error }] = useUpdateInvoiceMutation();

  // Error handling
  useErrorListener(error);

  // Use the invoice edit form hook
  const { form, schema, isLoading } = useInvoiceEditForm(invoice || undefined);

  const handleSubmit = useCallback(
    async (formData: InvoiceEditFormData) => {
      if (!invoice) return;

      try {
        // Transform form data to match API structure
        const updateData: InvoiceUpdateRequest = {
          ...invoice, // Keep all existing fields
          // Update only the editable fields
          ReceiverName: formData.ReceiverName,
          CurrencyId: formData.CurrencyId,
          IssueDate: formData.IssueDate ? `${formData.IssueDate}T00:00:00` : invoice.IssueDate,
          PaymentDueDate: formData.PaymentDueDate ? `${formData.PaymentDueDate}T00:00:00` : undefined,
          PayableAmount: formData.PayableAmount,
          ApprovedPayableAmount: formData.ApprovedPayableAmount,
          RemainingAmount: formData.RemainingAmount,
          Type: formData.Type,
          EInvoiceType: formData.EInvoiceType || undefined,
          Status: formData.Status ? 1 : 2,
          IsDeleted: formData.IsDeleted,
          IsGibApproved: formData.IsGibApproved === null ? null : formData.IsGibApproved === true,
          GibMessage: formData.GibMessage || undefined,
          ProfileId: formData.ProfileId || undefined,
          TaxFreeAmount: formData.TaxFreeAmount || undefined,
          InvoiceNumber: formData.InvoiceNumber || undefined,
          HashCode: formData.HashCode || undefined,
          SerialNumber: formData.SerialNumber || undefined,
          SequenceNumber: formData.SequenceNumber || undefined,
        };

        // Apply business logic based on Type and EInvoiceType
        if (updateData.Type === 2) {
          // Paper Invoice
          updateData.EInvoiceType = updateData.EInvoiceType === 2 ? 2 : 1;
          if (updateData.EInvoiceType !== 2) {
            updateData.TaxFreeAmount = undefined;
          }
        } else if (updateData.Type === 1) {
          // e-Invoice
          if (updateData.EInvoiceType === 2) {
            // e-Archive
            updateData.HashCode = undefined;
          } else if (updateData.EInvoiceType === 1 || updateData.ProfileId === 'TICARIFATURA') {
            // Standard Commercial Invoice
            updateData.TaxFreeAmount = undefined;
            updateData.SerialNumber = undefined;
            updateData.SequenceNumber = undefined;
          }
        }

        // Update GIB message based on approval status
        if (updateData.IsGibApproved === true) {
          updateData.GibMessage = 'GİB Tarafından Onaylandı';
        } else if (updateData.IsGibApproved === false) {
          updateData.GibMessage = 'GİB Tarafından Onaylanmadı';
        }

        await updateInvoice({ id: invoice.Id, data: updateData }).unwrap();

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: updateData.IsDeleted ? 'Fatura başarıyla silindi.' : 'Fatura başarıyla güncellendi.',
          buttonTitle: 'Tamam',
        });

        onClose();
        onUpdate();
      } catch (error) {
        // Network or other errors - handled by error listener
        console.error('Invoice update failed:', error);
      }
    },
    [invoice, updateInvoice, notice, onClose, onUpdate],
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  if (!invoice) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon color="primary" />
            <Typography variant="h6">Fatura Düzenle</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Fatura No: {invoice.InvoiceNumber || `${invoice.SerialNumber} - ${invoice.SequenceNumber}`}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Typography>Yükleniyor...</Typography>
          </Box>
        ) : (
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Form form={form as any} schema={schema} space={3} />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button id="invoice-edit-cancel" variant="outlined" onClick={handleClose}>
          İptal
        </Button>
        <LoadingButton
          id="invoice-edit-submit"
          variant="contained"
          loading={isUpdating}
          onClick={form.handleSubmit(handleSubmit)}
          loadingPosition="start"
          disabled={isLoading}>
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceEditModal;
