import {
  CheckCircle,
  CloudUpload,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  FileDownload,
  List,
  Visibility,
} from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import React, { forwardRef, Ref, useCallback, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Slot, Table } from '../../../../components';
import type { HeadCell } from '../../../../components/common/Table/types';
import { parseChequeExcel } from '../../../../utils/excel-parser';
import { ChequeRequiredFieldsModal } from './ChequeRequiredFieldsModal';
import { checkFileSize } from './cheque-excel.helpers';
import { validateChequeExcelData } from './cheque-validation.helpers';
import { ChequeValidationError, Currency, ExcelChequeData } from './cheque.types';

export interface ChequeExcelUploadFormMethods {
  submit: () => void;
  clear: () => void;
}

interface ChequeExcelUploadFormProps {
  companyId?: number;
  onSuccess?: () => void;
}

interface FormData {
  file: FileList | null;
}

/**
 * Çek Excel yükleme formu - OperationPricing pattern'ini takip eder
 * Referans: /Users/furkanfiliz/Desktop/Project/Figopara.Operation/src/components/Discounts/_partials/CreateChequeAllowanceModal.js
 */
const ChequeExcelUploadFormComponent = (
  { onSuccess }: ChequeExcelUploadFormProps,
  ref: Ref<ChequeExcelUploadFormMethods>,
) => {
  // States
  const [requiredFieldsModalOpen, setRequiredFieldsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState<ExcelChequeData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ChequeValidationError[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Form setup
  const form = useForm<FormData>({
    defaultValues: {
      file: null,
    },
  });

  // Expose submit method to parent via ref
  useImperativeHandle(ref, () => ({
    submit: () => {
      uploadCheques();
    },
    clear: () => {
      clearData();
    },
  }));

  // Template download function
  const downloadTemplate = useCallback(() => {
    // Excel template dosyasını indirme işlemi - legacy projeden alınan path
    const link = document.createElement('a');
    link.href = '/assets/files/CekYukleme.xlsx'; // Template dosyası public/assets/files klasöründe
    link.download = 'CekYukleme.xlsx';
    link.target = '_blank'; // Yeni sekmede aç
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

        // Excel parsing işlemi - gerçek Excel okuma
        const parserResult = await parseChequeExcel(file);

        if (parserResult.errors.length > 0) {
          form.setError('file', { message: `Excel hatası: ${parserResult.errors.join(', ')}` });
          return;
        }
        console.log('parserResult', parserResult);
        // Veriyi ExcelChequeData tipine dönüştür
        const processedData: ExcelChequeData[] = parserResult.data.map((row: Record<string, unknown>) => ({
          bankEftCode: String(row.bankEftCode || ''),
          bankName: String(row.bankName || ''),
          bankBranchEftCode: String(row.bankBranchEftCode || ''),
          bankBranchName: String(row.bankBranchName || ''),
          no: String(row.no || ''),
          chequeAccountNo: String(row.chequeAccountNo || ''),
          drawerIdentifier: String(row.drawerIdentifier || ''),
          drawerName: String(row.drawerName || ''),
          placeOfIssue: String(row.placeOfIssue || ''),
          paymentDueDate: String(row.paymentDueDate || ''),
          payableAmount: typeof row.payableAmount === 'number' ? row.payableAmount : 0,
          payableAmountCurrency: (row.payableAmountCurrency as Currency) || Currency.TRY,
          endorserIdentifier: String(row.endorserIdentifier || ''),
        }));

        setExcelData(processedData);

        // Validation işlemi - helper kullanarak
        const validationErrors = validateChequeExcelData(processedData);
        setValidationErrors(validationErrors);
        setSelectedRows([]);
      } catch (error) {
        console.error('Excel parsing error:', error);
        form.setError('file', { message: 'Excel dosyası okunurken hata oluştu' });
      } finally {
        setIsValidating(false);
      }
    },
    [form],
  );

  // Row selection için Table component'i kendi yönetimini yapacak

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
  };

  // Clear all data
  const clearData = () => {
    setExcelData([]);
    setValidationErrors([]);
    setSelectedRows([]);
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

  // Table headers - attachment'taki alanlar esas alınarak
  const tableHeaders: HeadCell[] = [
    { id: 'bankEftCode', label: 'Banka Kodu', width: 120 },
    { id: 'bankName', label: 'Banka Adı', width: 200 },
    { id: 'bankBranchEftCode', label: 'Şube Kodu', width: 120 },
    { id: 'bankBranchName', label: 'Şube Adı', width: 150 },
    { id: 'no', label: 'Çek No', width: 120 },
    { id: 'chequeAccountNo', label: 'Çek Hesap No', width: 140 },
    { id: 'placeOfIssue', label: 'Keşide Yeri', width: 120 },
    { id: 'drawerIdentifier', label: 'Keşideci VKN', width: 140 },
    { id: 'drawerName', label: 'Keşideci Adı', width: 120 },
    { id: 'paymentDueDate', label: 'Çek Vade Tarihi', width: 130, type: 'date' },
    { id: 'payableAmountCurrency', label: 'Döviz', width: 80 },
    { id: 'payableAmount', label: 'Tutar', width: 120, type: 'currency' },
    { id: 'endorserIdentifier', label: 'Borçlu VKN', width: 140 },
    { id: 'status', label: 'İşlemler', width: 100, slot: true },
  ];

  if (excelData.length === 0) {
    // Step view - Template download and file upload
    return (
      <Box>
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
  console.log('excelData', excelData);
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

      {/* Data Table - Common Table Component Kullanımı */}
      <Box sx={{ mb: 3 }}>
        <Table<ExcelChequeData>
          id="cheque-excel-data"
          rowId="no"
          headers={tableHeaders}
          data={excelData}
          size="small"
          checkbox={true}
          onCheckboxSelect={(selectedData) => {
            const indices = selectedData.map((item) => excelData.findIndex((data) => data.no === item.no));
            setSelectedRows(indices.filter((idx) => idx !== -1));
          }}
          initialCheckedIds={selectedRows.map((index) => excelData[index]?.no).filter(Boolean)}
          striped={true}
          maxHeight="600px"
          hidePaging={true}>
          <Slot id="status">
            {(_, __, rowIndex) => {
              const hasError = validationErrors.some((error) => error.index === rowIndex);
              return hasError ? (
                <Chip icon={<ErrorIcon />} label="Hatalı" color="error" size="small" />
              ) : (
                <Chip icon={<CheckCircle />} label="Geçerli" color="success" size="small" />
              );
            }}
          </Slot>
        </Table>
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

export const ChequeExcelUploadForm = forwardRef(ChequeExcelUploadFormComponent);
