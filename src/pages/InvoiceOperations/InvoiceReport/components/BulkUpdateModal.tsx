import { Button, Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import React, { useCallback, useMemo } from 'react';
import { useBulkUpdateForm } from '../hooks';
import { useBulkUpdateInvoicesMutation } from '../invoice-report.api';
import type { BulkUpdateRequest, InvoiceItem } from '../invoice-report.types';

// Set Turkish locale for dayjs
dayjs.locale('tr');

interface BulkUpdateModalProps {
  open: boolean;
  onClose: () => void;
  selectedInvoices: InvoiceItem[];
  onBulkUpdate: () => void;
}

export const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({ open, onClose, selectedInvoices, onBulkUpdate }) => {
  const notice = useNotice();

  // Bulk update mutation
  const [bulkUpdateInvoices, { isLoading: isUpdating, error }] = useBulkUpdateInvoicesMutation();

  // Error handling
  useErrorListener(error);

  // Calculate max issue date and min payable amount from selected invoices for validation
  const { maxIssueDate, minPayableAmount } = useMemo(() => {
    if (!selectedInvoices?.length) {
      return { maxIssueDate: null, minPayableAmount: null };
    }

    const invoicesWithDates = selectedInvoices.filter((invoice) => invoice.IssueDate);
    let maxIssueDate: dayjs.Dayjs | null = null;
    if (invoicesWithDates.length > 0) {
      const maxIssueDateStr = invoicesWithDates.reduce((max, invoice) => {
        const currentDate = dayjs(invoice.IssueDate);
        const maxDate = dayjs(max);
        return currentDate.isAfter(maxDate) ? invoice.IssueDate : max;
      }, invoicesWithDates[0].IssueDate);
      maxIssueDate = dayjs(maxIssueDateStr);
    }

    // Find the minimum payableAmount
    const invoicesWithPayableAmount = selectedInvoices.filter((invoice) => invoice.PayableAmount);
    let minPayableAmount: number | null = null;
    if (invoicesWithPayableAmount.length > 0) {
      minPayableAmount = Math.min(...invoicesWithPayableAmount.map((invoice) => invoice.PayableAmount));
    }

    return { maxIssueDate, minPayableAmount };
  }, [selectedInvoices]);

  const handleBulkUpdateSubmit = useCallback(
    async (formData: {
      issueDate: string;
      paymentDueDate: string;
      payableAmount?: number;
      approvedPayableAmount?: number;
      remainingAmount?: number;
      IsResetPaymentDueDate?: boolean;
    }) => {
      // Validation: Issue date cannot be in the future
      if (formData.issueDate && dayjs(formData.issueDate).isAfter(dayjs(), 'day')) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Fatura tarihi, bugünden ileri bir tarih olamaz.',
          buttonTitle: 'Tamam',
        });
        return;
      }

      // Validation: Payment due date cannot be before max issue date
      if (formData.paymentDueDate && maxIssueDate && dayjs(formData.paymentDueDate).isBefore(maxIssueDate, 'day')) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Vade tarihi, fatura tarihinden önce olamaz.',
          buttonTitle: 'Tamam',
        });
        return;
      }

      // Validation: Remaining amount cannot be greater than min payable amount
      if (formData.remainingAmount && minPayableAmount && formData.remainingAmount > minPayableAmount) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'İskontolanabilir tutar, fatura tutarından büyük olamaz.',
          buttonTitle: 'Tamam',
        });
        return;
      }

      try {
        const params: BulkUpdateRequest = {
          selectedInvoices: selectedInvoices.map((invoice) => invoice.Id),
          issueDate: formData.issueDate || undefined,
          paymentDueDate: formData.paymentDueDate || undefined,
          payableAmount: formData.payableAmount || undefined,
          approvedPayableAmount: formData.approvedPayableAmount || undefined,
          remainingAmount: formData.remainingAmount || undefined,
          IsResetPaymentDueDate: formData.IsResetPaymentDueDate || false,
          maxIssueDate: maxIssueDate?.toISOString() || undefined,
          minPayableAmount: minPayableAmount || undefined,
        };

        const response = await bulkUpdateInvoices(params).unwrap();

        if (response.IsSuccess) {
          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Faturalarınız başarıyla güncellendi.',
            buttonTitle: 'Tamam',
          });
          onClose();
          onBulkUpdate();
        } else {
          // Handle failed invoices
          const failedInvoices = response.FailedInvoiceList || [];
          if (failedInvoices.length > 0) {
            const errorMessages = failedInvoices
              .map(
                (failed: { InvoiceNumber: string; ErrorMessage: string }) =>
                  `${failed.InvoiceNumber}: ${failed.ErrorMessage}`,
              )
              .join('\n');

            notice({
              variant: 'error',
              title: 'Güncelleme Başarısız',
              message: `Aşağıdaki faturalar güncellenemedi:\n\n${errorMessages}`,
              buttonTitle: 'Tamam',
            });
          } else {
            notice({
              variant: 'error',
              title: 'Güncelleme Başarısız',
              message: response.Message || 'Faturalar güncellenirken bir hata oluştu.',
              buttonTitle: 'Tamam',
            });
          }
        }
      } catch (error) {
        // Network or other errors - handled by error listener
        console.error('Bulk update failed:', error);
      }
    },
    [maxIssueDate, minPayableAmount, notice, selectedInvoices, bulkUpdateInvoices, onClose, onBulkUpdate],
  );

  // Use the bulk update form hook
  const { form, schema, handleSubmit } = useBulkUpdateForm({
    onBulkUpdate: handleBulkUpdateSubmit,
    maxIssueDate: maxIssueDate?.toDate() || null,
  });

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon color="primary" />
            <Typography variant="h6">Toplu Güncelleme</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedInvoices.length} fatura güncelleniyor
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Form form={form} schema={schema} space={3}>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Not:</strong> Boş bırakılan alanlar güncellenmeyecektir. Sadece dolu alanlar seçili faturalarda
              güncellenecektir.
            </Typography>
          </Alert>
        </Form>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button id="bulk-update-cancel" variant="outlined" onClick={handleClose}>
          İptal
        </Button>
        <LoadingButton
          id="bulk-update-submit"
          variant="contained"
          loading={isUpdating}
          onClick={handleSubmit}
          loadingPosition="start">
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUpdateModal;
