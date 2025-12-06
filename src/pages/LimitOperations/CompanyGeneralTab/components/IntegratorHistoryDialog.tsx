import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import type { IntegratorHistory } from '../company-general-tab.types';

interface IntegratorHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  integratorHistory: IntegratorHistory[];
}

/**
 * Integrator History Dialog Component
 * Following OperationPricing pattern for modal dialogs
 */
export const IntegratorHistoryDialog: React.FC<IntegratorHistoryDialogProps> = ({
  open,
  onClose,
  integratorHistory,
}) => {
  const formatDateTime = (date: string | undefined): string => {
    if (!date) return '-';
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Entegratör Geçmişi</DialogTitle>
      <DialogContent>
        {integratorHistory.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entegratör İsmi</TableCell>
                  <TableCell>Bağlanma Tarihi</TableCell>
                  <TableCell>Bağlantı Kopma Tarihi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {integratorHistory.map((history) => (
                  <TableRow key={history.Id}>
                    <TableCell>{history.IntegratorName || '-'}</TableCell>
                    <TableCell>{formatDateTime(history.ConnectedTime)}</TableCell>
                    <TableCell>{formatDateTime(history.DisconnectedTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Entegratör geçmişi bulunamadı</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};
