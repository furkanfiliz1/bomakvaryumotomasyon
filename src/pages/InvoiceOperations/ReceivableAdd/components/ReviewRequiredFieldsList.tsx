import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
} from '@mui/material';

interface ReviewRequiredFieldsListProps {
  show: boolean;
  onClose: () => void;
}

const ReviewRequiredFieldsList: React.FC<ReviewRequiredFieldsListProps> = ({ show, onClose }) => {
  // Required fields for receivables - this should match your actual requirements
  const requiredFields = [
    {
      field: 'Alıcı VKN',
      required: true,
    },
    {
      field: 'Alıcı Unvan',
      required: false,
    },
    {
      field: 'Satıcı VKN',
      required: true,
    },
    {
      field: 'Satıcı Unvan',
      required: false,
    },
    {
      field: 'Alacak Tutarı',
      required: true,
    },
    {
      field: 'Alacak Para Birimi',
      required: true,
    },
    {
      field: 'Alacak Numarası',
      required: true,
    },
    {
      field: 'Vade Tarihi',
      required: true,
    },
    {
      field: 'Oluşturulma Tarihi',
      required: true,
    },
  ];

  return (
    <Dialog open={show} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Zorunlu Alanlar Listesi</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Excel dosyanızda bulunması gereken alanların listesi aşağıdadır:
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Alan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Zorunlu/İsteğe Bağlı</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requiredFields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell>{field.field}</TableCell>
                  <TableCell>
                    <Chip
                      label={field.required ? 'Zorunlu' : 'İsteğe Bağlı'}
                      color={field.required ? 'error' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewRequiredFieldsList;
