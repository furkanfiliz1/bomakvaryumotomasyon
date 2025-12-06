/**
 * Excel Upload Modal Component
 * Modal for uploading Excel file with branch data
 * Shows validation errors and preview
 */

import { FigoLoading, LoadingButton, useNotice } from '@components';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import React, { useCallback, useState } from 'react';
import type { BranchToAdd, ExcelValidationError } from '../bank-branch-bulk-upload.types';
import { MAX_FILE_SIZE_MB } from '../helpers';
import { useExcelParser } from '../hooks';

interface ExcelUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (branches: BranchToAdd[], overWrite: boolean) => void;
  isSubmitting: boolean;
  bankName: string;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  bankName,
}) => {
  const notice = useNotice();
  const { excelData, excelValidation, isParsingExcel, parseExcelFile, clearExcelData, removeExcelRow } =
    useExcelParser();

  const [overWrite, setOverWrite] = useState<boolean>(false);

  const parsedData = excelData.data;
  const validationErrors = excelValidation;
  const isLoading = isParsingExcel;

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      if (!validTypes.includes(file.type)) {
        notice({
          variant: 'error',
          title: 'Uyarı',
          message: 'Lütfen geçerli bir Excel dosyası seçin (.xlsx veya .xls)',
        });
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        notice({
          variant: 'error',
          title: 'Uyarı',
          message: `Dosya boyutu ${MAX_FILE_SIZE_MB}MB'dan büyük olamaz`,
        });
        return;
      }

      const result = await parseExcelFile(file);
      if (!result.success && result.error) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: result.error,
        });
      }
    },
    [parseExcelFile, notice],
  );

  const handleRemoveRow = useCallback(
    (index: number) => {
      removeExcelRow(index);
    },
    [removeExcelRow],
  );

  const handleClose = useCallback(() => {
    clearExcelData();
    setOverWrite(false);
    onClose();
  }, [clearExcelData, onClose]);

  const handleSubmit = useCallback(() => {
    if (!parsedData || parsedData.length === 0) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Eklenecek şube bulunamadı',
      });
      return;
    }

    const hasErrors = validationErrors.length > 0;
    if (hasErrors) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Lütfen önce hataları düzeltin',
      });
      return;
    }

    onSubmit(parsedData, overWrite);
  }, [parsedData, validationErrors, overWrite, onSubmit, notice]);

  const getRowError = (index: number): ExcelValidationError | undefined => {
    return validationErrors.find((err) => err.index === index);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Excel ile Şube Yükle - {bankName}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* File Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading}
            sx={{ mb: 2 }}>
            Excel Dosyası Seç <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileChange} />
          </Button>

          <Typography variant="body2" color="text.secondary">
            Excel dosyasında &quot;subeKodu&quot; ve &quot;subeAdi&quot; sütunları bulunmalıdır.
          </Typography>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <FigoLoading />
          </Box>
        )}

        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }} icon={<WarningIcon />}>
            {validationErrors.length} satırda hata bulundu. Lütfen kontrol edin.
          </Alert>
        )}

        {/* Preview Table */}
        {parsedData && parsedData.length > 0 && (
          <Paper variant="outlined">
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Şube Kodu</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Şube Adı</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hata</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: 60 }}>Sil</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsedData.map((branch, index) => {
                    const rowError = getRowError(index);
                    const rowKey = `${branch.code}-${branch.name}-${index}`;
                    return (
                      <TableRow
                        key={rowKey}
                        sx={{
                          bgcolor: rowError ? 'error.lighter' : 'inherit',
                        }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell sx={{ color: rowError ? 'error.main' : 'inherit' }}>{branch.code}</TableCell>
                        <TableCell sx={{ color: rowError ? 'error.main' : 'inherit' }}>{branch.name}</TableCell>
                        <TableCell>
                          {rowError && (
                            <Typography variant="caption" color="error">
                              {rowError.errors.join(', ')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => handleRemoveRow(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Toplam {parsedData.length} şube {validationErrors.length > 0 && `(${validationErrors.length} hatalı)`}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Overwrite Option */}
        {parsedData && parsedData.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Checkbox checked={overWrite} onChange={(e) => setOverWrite(e.target.checked)} />}
              label="Mevcut şubelerin üzerine yaz"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          İptal
        </Button>
        <LoadingButton
          id="add-excel-branches-btn"
          variant="contained"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!parsedData || parsedData.length === 0 || validationErrors.length > 0}>
          Şubeleri Ekle
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelUploadModal;
