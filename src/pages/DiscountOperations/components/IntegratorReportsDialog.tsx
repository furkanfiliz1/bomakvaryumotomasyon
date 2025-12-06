import { Info as InfoIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import IntegratorReportsTab from './IntegratorReportsTab';

interface IntegratorReportsDialogProps {
  open: boolean;
  onClose: () => void;
  allowanceId: number;
}

/**
 * Integrator Reports Dialog Component
 * Following OperationPricing pattern for modal dialogs
 * Shows integration reports for a specific allowance using IntegratorReportsTab
 */
export const IntegratorReportsDialog: React.FC<IntegratorReportsDialogProps> = ({ open, onClose, allowanceId }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Entegrasyon Raporu - İskonto No: {allowanceId}</DialogTitle>
      <DialogContent>
        <IntegratorReportsTab allowanceId={allowanceId} isDialog />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface IntegratorReportsIconProps {
  allowanceId: number;
}

/**
 * Integrator Reports Icon Component
 * Info icon with tooltip that opens the integrator reports dialog
 */
export const IntegratorReportsIcon: React.FC<IntegratorReportsIconProps> = ({ allowanceId }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="İstasyon bilgileri için tıklayın" arrow>
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            color: 'info.main',
            '&:hover': {
              backgroundColor: 'info.main',
              color: 'white',
            },
          }}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <IntegratorReportsDialog open={open} onClose={handleClose} allowanceId={allowanceId} />
    </>
  );
};

export default IntegratorReportsDialog;
