import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Send } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useSendBulkEmailsToTargetCompaniesMutation } from '../customer-request-branch-list.api';
import type { CustomerRequestBranchItem, ParentCustomer, ParentRequest } from '../customer-request-branch-list.types';
import { filterCompaniesWithEmails } from '../helpers';

interface BulkEmailModalProps {
  open: boolean;
  onClose: () => void;
  requests: CustomerRequestBranchItem[];
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

/**
 * Bulk Email Modal Component
 * Simple modal matching the screenshot design
 */
export const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  open,
  onClose,
  requests,
  parentCustomer,
  parentRequest,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Bulk email sending mutation
  const [sendBulkEmails, { isLoading: isSending, error: sendError }] = useSendBulkEmailsToTargetCompaniesMutation();

  useErrorListener(sendError);

  const notice = useNotice();

  // Filter companies that have email addresses
  const companiesWithEmails = useMemo(() => {
    return filterCompaniesWithEmails(requests);
  }, [requests]);

  // Handle bulk email sending
  const handleSendBulkEmails = async () => {
    try {
      setSubmitError(null);

      if (companiesWithEmails.length === 0) {
        setSubmitError('Email gönderilecek firma bulunamadı.');
        return;
      }

      // Prepare API request data
      const requestData = {
        clientCompanyId: parentCustomer.Id,
        reportRequestId: parentRequest.Id,
      };

      // Make API call
      await sendBulkEmails(requestData).unwrap();

      // Success - close modal and refresh parent
      onSuccess();
      onClose();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: `${companiesWithEmails.length} bayiye email başarıyla gönderildi.`,
      });
    } catch (error) {
      console.error('Toplu email gönderimi hatası:', error);
      setSubmitError('Toplu email gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 300,
          maxHeight: 500,
        },
      }}>
      <DialogTitle sx={{ pb: 1, borderBottom: 1, borderColor: 'grey.200' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Send color="primary" />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            Tüm Bayilere Email Gönder
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {/* Main Info Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            bgcolor: '#e3f2fd',
            border: 'none',
            '& .MuiAlert-icon': {
              color: '#1976d2',
            },
          }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1565c0' }}>
            Toplam <strong>{requests.length} bayi</strong> listelenmektedir. Bunlardan{' '}
            <strong>{companiesWithEmails.length} tanesinin</strong> email adresi bulunmaktadır.
          </Typography>
        </Alert>

        {/* Content sections */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Gönderilecek İçerik:</strong>
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
            <strong>Email Türü:</strong> Figoskor Pro Bilgilendirme Emaili
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Mevcut Sayfadaki Email Sayısı:</strong> <strong>{companiesWithEmails.length} bayi</strong>
          </Typography>

          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
            Mevcut sayfada email adresi bulunan her bayi için ayrı ayrı Figoskor Pro bilgilendirme emaili
            gönderilecektir.
          </Typography>
        </Box>

        {companiesWithEmails.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography>
              Email gönderilecek bayi bulunamadı. Tüm bayilerin email adresleri eksik veya geçersiz.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isSending}
          variant="outlined"
          sx={{
            color: 'grey.600',
            borderColor: 'grey.400',
            minWidth: 80,
            '&:hover': {
              borderColor: 'grey.500',
              bgcolor: 'grey.50',
            },
          }}>
          İptal
        </Button>
        <LoadingButton
          onClick={handleSendBulkEmails}
          loading={isSending}
          variant="contained"
          color="success"
          startIcon={<Send />}
          disabled={companiesWithEmails.length === 0}
          sx={{
            fontWeight: 600,
            minWidth: 200,
            bgcolor: 'success.800',
          }}>
          Toplu Email Gönder ({companiesWithEmails.length})
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
