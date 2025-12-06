/**
 * Modal Actions Component
 * Reusable action buttons for modals
 * Follows InvoiceScoreRatios pattern exactly
 */

import { LoadingButton } from '@components';
import { Button, Stack } from '@mui/material';
import React from 'react';

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  submitLabel = 'Kaydet',
  cancelLabel = 'İptal',
}) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
        {cancelLabel}
      </Button>
      <LoadingButton id="modal-submit-btn" variant="contained" onClick={onSubmit} loading={isSubmitting}>
        {submitLabel}
      </LoadingButton>
    </Stack>
  );
};

export default ModalActions;
