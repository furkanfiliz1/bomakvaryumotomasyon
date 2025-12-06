import { Form, LoadingButton } from '@components';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React from 'react';
import { usePassiveStatusReasonForm } from '../hooks';

interface PassiveStatusReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reasonValue: string) => void;
}

export const PassiveStatusReasonDialog: React.FC<PassiveStatusReasonDialogProps> = ({ open, onClose, onSubmit }) => {
  const { form, schema, handleSubmit, handleReset, isLoadingReasons } = usePassiveStatusReasonForm(onSubmit, onClose);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableEscapeKeyDown={isLoadingReasons}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Pasif Olma Nedeni Seçiniz
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form} schema={schema as any} space={2} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" color="secondary" onClick={handleClose} disabled={isLoadingReasons}>
          Vazgeç
        </Button>
        <LoadingButton
          id="save-passive-reason-button"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          loading={isLoadingReasons}>
          Kaydet
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PassiveStatusReasonDialog;
