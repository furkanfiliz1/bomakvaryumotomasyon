import {
  CheckCircle,
  CloudUpload,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  FileDownload,
  List,
  Visibility,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChequeRequiredFieldsModal } from './ChequeRequiredFieldsModal';
import { checkFileSize } from './cheque-excel.helpers';
import { validateChequeExcelData } from './cheque-validation.helpers';
import { ChequeValidationError, Currency, ExcelChequeData } from './cheque.types';

interface ChequeExcelUploadFormProps {
  companyId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  file: FileList | null;
}

/**
 * Çek Excel yükleme formu - OperationPricing pattern'ini takip eder
 * Referans: /Users/furkanfiliz/Desktop/Project/Figopara.Operation/src/components/Discounts/_partials/CreateChequeAllowanceModal.js
 */
export const ChequeExcelUploadForm: React.FC<ChequeExcelUploadFormProps> = ({ onSuccess, onCancel }) => {
  // States
  const [requiredFieldsModalOpen, setRequiredFieldsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState<ExcelChequeData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ChequeValidationError[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form setup
  const form = useForm<FormData>({
    defaultValues: {
      file: null,
    },
  });

  // Template download function
  const downloadTemplate = useCallback(() => {
    // Excel template dosyasını indirme işlemi
    const link = document.createElement('a');
    link.href = '/assets/files/CekYukleme.xlsx'; // Template dosyası public klasöründe olmalı
    link.download = 'CekYukleme.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      form.clearErrors();
      setUploadedFile(file);
      setIsValidating(true);

      try {
        // Dosya boyutu kontrolü - helper kullanarak
        const fileSizeCheck = checkFileSize(file, 15);
        if (!fileSizeCheck.isValid) {
          form.setError('file', { message: fileSizeCheck.error || 'Dosya boyutu çok büyük' });
          return;
        }

        // Excel parsing işlemi - gerçek mock data
        const mockExcelData: ExcelChequeData[] = [
          {
            bankEftCode: '001',
            bankName: 'Türkiye İş Bankası',
            bankBranchEftCode: '001001',
            bankBranchName: 'Merkez Şubesi',
            no: '1234567',
            chequeAccountNo: '12345678901',
            drawerIdentifier: '12345678901',
            drawerName: 'Test Keşideci',
            placeOfIssue: 'İstanbul',
            paymentDueDate: '2025-01-30',
            payableAmount: 10000,
            payableAmountCurrency: Currency.TRY,
          },
          {
            bankEftCode: '', // Hatalı - boş banka kodu
            bankName: 'Garanti BBVA',
            bankBranchEftCode: '002001',
            bankBranchName: 'Şişli Şubesi',
            no: '', // Hatalı - boş çek no
            chequeAccountNo: '98765432100',
            drawerIdentifier: '9876543210',
            drawerName: 'Test Keşideci 2',
            placeOfIssue: 'Ankara',
            paymentDueDate: '2025-02-15',
            payableAmount: 5000,
            payableAmountCurrency: Currency.TRY,
          },
        ];

        setExcelData(mockExcelData);

        // Validation işlemi - helper kullanarak
        const validationErrors = validateChequeExcelData(mockExcelData);
        setValidationErrors(validationErrors);
        setSelectedRows([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Excel parsing error:', error);
        form.setError('file', { message: 'Excel dosyası okunurken hata oluştu' });
      } finally {
        setIsValidating(false);
      }
    },
    [form],
  );

  // Row selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(excelData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (index: number) => {
    setSelectedRows((prev) => {
      const newSelected = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      setSelectAll(newSelected.length === excelData.length);
      return newSelected;
    });
  };

  // Delete selected rows
  const deleteSelectedRows = () => {
    if (selectedRows.length === 0) return;

    const newData = excelData.filter((_, index) => !selectedRows.includes(index));
    const newErrors = validationErrors
      .filter((error) => !selectedRows.includes(error.index))
      .map((error) => ({
        ...error,
        index: error.index - selectedRows.filter((selected) => selected < error.index).length,
      }));

    setExcelData(newData);
    setValidationErrors(newErrors);
    setSelectedRows([]);
    setSelectAll(false);
  };

  // Clear all data
  const clearData = () => {
    setExcelData([]);
    setValidationErrors([]);
    setSelectedRows([]);
    setSelectAll(false);
    setUploadedFile(null);
    form.reset();
  };

  // Upload cheques
  const uploadCheques = async () => {
    if (validationErrors.length > 0) {
      console.error('Lütfen önce tüm hataları düzeltin');
      return;
    }

    setIsUploading(true);

    try {
      // API çağrısı burada yapılacak
      // Şimdilik mock success
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`${excelData.length} adet çek başarıyla yüklendi`);

      clearData();
      onSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Çekler yüklenirken hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  // Render error cell
  const renderErrorCell = (value: unknown, field: string, rowIndex: number) => {
    const hasError = validationErrors.some((error) => error.index === rowIndex && error.errors.includes(field));

    return (
      <TableCell
        sx={{
          backgroundColor: hasError ? 'error.light' : 'inherit',
          color: hasError ? 'error.contrastText' : 'inherit',
        }}>
        {String(value) || '-'}
      </TableCell>
    );
  };

  if (excelData.length === 0) {
    // Step view - Template download and file upload
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Çek Yükleme Adımları
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Step 1: Template Download */}
          <Grid item md={4} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FileDownload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Örnek excel şablonumuzu indirin.
                </Typography>
                <Button variant="outlined" startIcon={<FileDownload />} onClick={downloadTemplate} sx={{ mt: 1 }}>
                  Şablonu İndir
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Step 2: Required Fields */}
          <Grid item md={4} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <List sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Doldurulması zorunlu alanları doldurun.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => setRequiredFieldsModalOpen(true)}
                  sx={{ mt: 1 }}>
                  Zorunlu Alanları İncele
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Step 3: File Upload */}
          <Grid item md={4} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Doldurduğunuz şablonu yükleyin.
                </Typography>
                <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mt: 1 }}>
                  Dosya Seç
                  <input type="file" accept=".xlsx,.xls" hidden onChange={handleFileUpload} />
                </Button>
                {form.formState.errors.file && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                    {form.formState.errors.file.message}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isValidating && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Excel dosyası işleniyor...
            </Typography>
          </Box>
        )}

        {/* Required Fields Modal */}
        <ChequeRequiredFieldsModal open={requiredFieldsModalOpen} onClose={() => setRequiredFieldsModalOpen(false)} />
      </Box>
    );
  }

  // Data table view
  return (
    <Box>
      {/* Header with file info and actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Excel Verileri
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dosya: {uploadedFile?.name} | Toplam: {excelData.length} kayıt
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={clearData} startIcon={<DeleteIcon />}>
                Temizle
              </Button>
              {selectedRows.length > 0 && (
                <Button variant="outlined" color="error" onClick={deleteSelectedRows} startIcon={<DeleteIcon />}>
                  Seçilileri Sil ({selectedRows.length})
                </Button>
              )}
            </Stack>
          </Stack>

          {validationErrors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {validationErrors.length} satırda hata bulundu. Lütfen hataları düzeltin.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < excelData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Banka Adı</TableCell>
              <TableCell>Şube Adı</TableCell>
              <TableCell>Çek No</TableCell>
              <TableCell>Hesap No</TableCell>
              <TableCell>Keşideci</TableCell>
              <TableCell>Vade Tarihi</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {excelData.map((row, index) => {
              const hasError = validationErrors.some((error) => error.index === index);
              const isSelected = selectedRows.includes(index);

              return (
                <TableRow
                  key={index}
                  hover
                  selected={isSelected}
                  sx={{ backgroundColor: hasError ? 'error.light' : 'inherit' }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} onChange={() => handleRowSelect(index)} />
                  </TableCell>
                  {renderErrorCell(row.bankName, 'bankName', index)}
                  {renderErrorCell(row.bankBranchName, 'bankBranchName', index)}
                  {renderErrorCell(row.no, 'no', index)}
                  {renderErrorCell(row.chequeAccountNo, 'chequeAccountNo', index)}
                  {renderErrorCell(row.drawerName || row.drawerIdentifier, 'drawerIdentifier', index)}
                  {renderErrorCell(row.paymentDueDate, 'paymentDueDate', index)}
                  {renderErrorCell(
                    `${row.payableAmount?.toLocaleString()} ${row.payableAmountCurrency}`,
                    'payableAmount',
                    index,
                  )}
                  <TableCell>
                    {hasError ? (
                      <Chip icon={<ErrorIcon />} label="Hatalı" color="error" size="small" />
                    ) : (
                      <Chip icon={<CheckCircle />} label="Geçerli" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={isUploading}>
          İptal
        </Button>
        <Button
          variant="contained"
          onClick={uploadCheques}
          disabled={validationErrors.length > 0 || excelData.length === 0 || isUploading}
          startIcon={<CloudUpload />}>
          {isUploading ? 'Yükleniyor...' : `Çekleri Yükle (${excelData.length})`}
        </Button>
      </Box>

      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Çekler sisteme yükleniyor...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
