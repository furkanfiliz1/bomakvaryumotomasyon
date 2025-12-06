import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Block } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useRejectTargetCompanyRequestMutation } from '../customer-request-branch-list.api';
import type { CustomerRequestBranchItem } from '../customer-request-branch-list.types';

interface RejectRequestModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  onSuccess: () => void;
}

/**
 * Reject Request Modal Component
 * Matches legacy RejectModal functionality for rejecting company requests
 */
export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
  open,
  onClose,
  selectedRequest,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const notice = useNotice();

  // Reject request mutation
  const [rejectRequest, { isLoading: isRejecting, error: rejectError }] = useRejectTargetCompanyRequestMutation();

  useErrorListener(rejectError);

  // Handle rejection
  const handleReject = async () => {
    try {
      setSubmitError(null);

      // Prepare API request data
      const requestData = {
        targetCompanyId: selectedRequest.Id,
      };

      // Make API call
      await rejectRequest(requestData).unwrap();

      // Success - close modal and refresh parent
      onSuccess();
      onClose();

      notice({
        variant: 'success',
        title: 'Firma talebi başarıyla reddedildi.',
        message: `${selectedRequest.TargetCompanyTitle} firma talebi başarıyla reddedildi.`,
      });
    } catch (error) {
      console.error('Firma reddetme hatası:', error);
      setSubmitError('Firma reddedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { minHeight: 300 } }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Block color="error" />
          Firma Talebini Reddet
        </Box>
      </DialogTitle>

      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {/* Warning Alert */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Box>
              <Typography>Bu işlem geri alınamaz ve firma durumu &quot;Red&quot; olarak güncellenecektir.</Typography>
            </Box>
          </Box>
        </Alert>

        {/* Company Information */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            Reddedilecek Firma Bilgileri
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" gap={2}>
              <Typography variant="body2" fontWeight="bold" minWidth="80px">
                VKN:
              </Typography>
              <Typography variant="body2">{selectedRequest.TargetCompanyIdentifier}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography variant="body2" fontWeight="bold" minWidth="80px">
                Ünvan:
              </Typography>
              <Typography variant="body2">{selectedRequest.TargetCompanyTitle}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography variant="body2" fontWeight="bold" minWidth="80px">
                Yetkili:
              </Typography>
              <Typography variant="body2">{selectedRequest.ContactPerson || 'Bulunamadı'}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography variant="body2" fontWeight="bold" minWidth="80px">
                Email:
              </Typography>
              <Typography variant="body2">{selectedRequest.MailAddress || 'Bulunamadı'}</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Typography variant="body2" fontWeight="bold" minWidth="80px">
                Telefon:
              </Typography>
              <Typography variant="body2">{selectedRequest.Phone || 'Bulunamadı'}</Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isRejecting}>
          İptal
        </Button>
        <LoadingButton
          onClick={handleReject}
          loading={isRejecting}
          variant="contained"
          color="error"
          startIcon={<Block />}>
          Firma Talebini Reddet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
