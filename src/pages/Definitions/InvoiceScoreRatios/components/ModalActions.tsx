import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const ModalActions: React.FC<ModalActionsProps> = ({ onCancel, onSubmit, isSubmitting, submitLabel }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <LoadingButton variant="outlined" onClick={onCancel} disabled={isSubmitting}>
        İptal
      </LoadingButton>
      <LoadingButton variant="contained" color="primary" onClick={onSubmit} loading={isSubmitting}>
        {submitLabel}
      </LoadingButton>
    </Box>
  );
};

export default ModalActions;
