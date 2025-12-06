import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNotice } from '@components';
// import type { ExcelInvoiceData } from '../invoice-add.types'; // Will be used when implementing Excel parsing

interface AddExcelInvoiceModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Excel Invoice Upload Modal
 * Following Portal AddExcelInvoiceModal pattern
 */
const AddExcelInvoiceModal: React.FC<AddExcelInvoiceModalProps> = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const notice = useNotice();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      if (!allowedTypes.includes(file.type)) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Lütfen geçerli bir Excel dosyası seçin (.xls veya .xlsx)',
          buttonTitle: 'Tamam',
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Implement actual Excel parsing logic here
      // This would typically involve:
      // 1. Reading Excel file using a library like xlsx
      // 2. Parsing rows into ExcelInvoiceData format
      // 3. Validating data
      // 4. Calling the API to create invoices

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing

      setProgress(100);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Excel dosyası başarıyla işlendi',
        buttonTitle: 'Tamam',
      });

      handleClose();
    } catch (error) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Excel dosyası işlenirken bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedFile(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excel ile Fatura Yükleme</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
          {!selectedFile ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main' }} />
              <Typography variant="body1" align="center">
                Excel dosyanızı seçin
              </Typography>
              <Button variant="outlined" component="label">
                Dosya Seç
                <input type="file" accept=".xls,.xlsx" hidden onChange={handleFileSelect} />
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1">
                Seçilen dosya: <strong>{selectedFile.name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dosya boyutu: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>

              {isProcessing && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    İşleniyor... {progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          İptal
        </Button>
        <Button onClick={handleUpload} variant="contained" disabled={!selectedFile || isProcessing}>
          {isProcessing ? 'İşleniyor...' : 'Yükle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExcelInvoiceModal;
