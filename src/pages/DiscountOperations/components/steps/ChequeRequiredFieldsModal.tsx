import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { CHEQUE_REQUIRED_FIELDS } from './cheque.types';

export interface ChequeRequiredFieldsModalMethods {
  open: () => void;
  close: () => void;
}

interface ChequeRequiredFieldsModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Çek Excel template için zorunlu alanları gösteren modal
 * OperationPricing pattern'ini takip eder
 */
export const ChequeRequiredFieldsModal: React.FC<ChequeRequiredFieldsModalProps> = ({ open, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Çek Yükleme - Zorunlu Alanlar
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Excel dosyanızı hazırlarken aşağıdaki alan bilgilerini kullanın. Zorunlu alanların doldurulması
            gerekmektedir.
          </Typography>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Alan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Zorunlu/İsteğe Bağlı
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CHEQUE_REQUIRED_FIELDS.map((field) => (
                <TableRow key={field.field}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {field.label}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={field.required ? 'Zorunlu' : 'Opsiyonel'}
                      color={field.required ? 'error' : 'default'}
                      size="small"
                      variant={field.required ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {field.description ||
                        (field.required ? 'Bu alan mutlaka doldurulmalıdır.' : 'Bu alan isteğe bağlıdır.')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Anladım
        </Button>
      </DialogActions>
    </Dialog>
  );
};
