import { Form, LoadingButton } from '@components';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import { CompanyStatusUpdateRequest, OnboardingStatus } from '../companies.types';
import { useCompanyStatusUpdateForm } from '../hooks/useCompanyStatusUpdateForm';

interface CompanyStatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyStatusUpdateRequest) => void;
  availableStatuses: OnboardingStatus[];
  currentStatus?: string;
  isLoading?: boolean;
}

export const CompanyStatusUpdateModal: React.FC<CompanyStatusUpdateModalProps> = ({
  open,
  onClose,
  onSubmit,
  availableStatuses,
  currentStatus,
  isLoading = false,
}) => {
  // Use custom form hook following OperationPricing patterns
  const { form, schema, handleSubmit, handleReset, showExtraFields } = useCompanyStatusUpdateForm({
    availableStatuses,
    currentStatus,
    onSubmit,
  });

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableEscapeKeyDown={isLoading}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Şirket Durumu Güncelle
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 1 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form} schema={schema as any} space={3} />

          {/* Show extra fields conditionally */}
          {showExtraFields && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Bu duruma özel ek bilgiler gereklidir
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isLoading}>
          Vazgeç
        </Button>
        <LoadingButton id="save-button" onClick={handleSubmit} variant="contained" color="primary" loading={isLoading}>
          Kaydet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyStatusUpdateModal;
