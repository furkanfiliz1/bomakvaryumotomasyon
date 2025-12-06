import {
  CheckCircle,
  Close,
  CloudUpload,
  Delete,
  Description,
  Error as ErrorIcon,
  FileDownload,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

import { useNotice } from '@components';
import InputDatePicker from 'src/components/common/Form/_partials/InputDatePicker';
import InputRadio from 'src/components/common/Form/_partials/InputRadio';
import CustomInputLabel from 'src/components/common/Form/_partials/components/CustomInputLabel';

// Types for the component
interface CompanyData {
  vkn: string;
  unvan: string;
  telefon: string;
  email: string;
  yetkiliKisiAd?: string;
  yetkiliKisiSoyad?: string;
}

interface ValidationError {
  index: number;
  name: string;
  errors: string[];
  rowData: CompanyData | null;
}

interface SelectedRequest {
  Id: number;
  RequestDate: string;
  TargetCompanyCount: number;
  ShowReference: boolean;
}

// Reference type options
const referenceTypeOptions = [
  { value: 'true', label: 'Açık Referans' },
  { value: 'false', label: 'Kapalı Referans' },
];

interface CompanyExcelUploadProps {
  open: boolean;
  onClose: () => void;
  updateMode?: boolean;
  selectedRequest?: SelectedRequest;
  onDataSubmit: (
    companyData: CompanyData[],
    requestDate: string,
    showReference: boolean,
  ) => Promise<{ message?: string }>;
  onSuccess?: (message: string) => void;
  onCancelUpdate?: () => void;
}

// Error message mapping
const getErrorMessage = (error: string): string => {
  const errorMessages: Record<string, string> = {
    vkn: 'VKN alanı zorunludur',
    vkn_invalid: 'Geçersiz VKN formatı (10 veya 11 hane olmalı)',
    unvan: 'Unvan alanı zorunludur',
    telefon: 'Telefon alanı zorunludur',
    telefon_invalid: 'Geçersiz telefon formatı',
    email: 'E-mail alanı zorunludur',
    email_invalid: 'Geçersiz e-mail formatı',
    yetkiliKisiAd_invalid: 'Geçersiz yetkili kişi ad formatı',
    yetkiliKisiSoyad_invalid: 'Geçersiz yetkili kişi soyad formatı',
    file_corrupt: 'Dosya bozuk veya okunamıyor',
  };
  return errorMessages[error] || error;
};

// Company validation function
const validateCompanyData = (data: CompanyData[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowErrors: string[] = [];

    // VKN validation
    if (!row.vkn || row.vkn.trim() === '') {
      rowErrors.push('vkn');
    } else {
      const cleanVkn = row.vkn
        .toString()
        .split('')
        .filter((char) => /\d/.test(char))
        .join('');
      if (cleanVkn.length !== 10 && cleanVkn.length !== 11) {
        rowErrors.push('vkn_invalid');
      }
    }

    // Unvan validation
    if (!row.unvan || row.unvan.trim() === '') {
      rowErrors.push('unvan');
    }

    // Telefon validation
    if (!row.telefon || row.telefon.trim() === '') {
      rowErrors.push('telefon');
    } else {
      const cleanPhone = row.telefon
        .toString()
        .split('')
        .filter((char) => /\d/.test(char))
        .join('');
      if (cleanPhone.length < 10) {
        rowErrors.push('telefon_invalid');
      }
    }

    // Email validation
    if (!row.email || row.email.trim() === '') {
      rowErrors.push('email');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email.trim())) {
        rowErrors.push('email_invalid');
      }
    }

    // Optional fields validation
    if (row.yetkiliKisiAd && row.yetkiliKisiAd.trim().length > 0 && row.yetkiliKisiAd.trim().length < 2) {
      rowErrors.push('yetkiliKisiAd_invalid');
    }

    if (row.yetkiliKisiSoyad && row.yetkiliKisiSoyad.trim().length > 0 && row.yetkiliKisiSoyad.trim().length < 2) {
      rowErrors.push('yetkiliKisiSoyad_invalid');
    }

    if (rowErrors.length > 0) {
      errors.push({
        index,
        name: row.unvan || 'Bilinmeyen',
        errors: rowErrors,
        rowData: row,
      });
    }
  });

  return errors;
};

// File size validation
const checkFileSize = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Dosya boyutu 10MB'dan büyük olamaz",
    };
  }
  return { isValid: true };
};

// Excel parser function
const parseExcelFile = async (file: File): Promise<{ data: CompanyData[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and convert to CompanyData format
        const companyData: CompanyData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as unknown[];

          // Skip empty rows
          if (!row || row.length === 0 || !row.some((cell) => cell && cell.toString().trim())) {
            continue;
          }

          companyData.push({
            vkn: row[0] ? row[0].toString().trim() : '',
            unvan: row[1] ? row[1].toString().trim() : '',
            telefon: row[2] ? row[2].toString().trim() : '',
            email: row[3] ? row[3].toString().trim() : '',
            yetkiliKisiAd: row[4] ? row[4].toString().trim() : '',
            yetkiliKisiSoyad: row[5] ? row[5].toString().trim() : '',
          });
        }

        resolve({ data: companyData });
      } catch (error) {
        reject(new Error('Excel dosyası okunamadı. Lütfen dosya formatını kontrol edin.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Dosya okuma hatası oluştu.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Download template function
const downloadTemplate = () => {
  const templateData = [
    ['VKN', 'Unvan', 'Telefon', 'E-mail', 'Yetkili Kişi Ad', 'Yetkili Kişi Soyad'],
    ['1234567890', 'Örnek Şirket A.Ş.', '02121234567', 'info@ornek.com', 'Ahmet', 'Yılmaz'],
    ['0987654321', 'Test Ltd. Şti.', '02129876543', 'contact@test.com', 'Mehmet', 'Demir'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Şirket Listesi');
  XLSX.writeFile(wb, 'sirket_listesi_template.xlsx');
};

const CompanyExcelUpload: React.FC<CompanyExcelUploadProps> = ({
  open,
  onClose,
  updateMode = false,
  selectedRequest,
  onDataSubmit,
  onSuccess,
  onCancelUpdate,
}) => {
  const notice = useNotice();
  const theme = useTheme();

  // State management
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // Form management
  const form = useForm<FieldValues>({
    defaultValues: {
      requestDate: '',
      referenceType: '',
    },
  });

  // Initialize form values
  useEffect(() => {
    if (open) {
      const initialDate =
        updateMode && selectedRequest
          ? dayjs(selectedRequest.RequestDate).startOf('day').format('YYYY-MM-DD')
          : dayjs().startOf('day').format('YYYY-MM-DD');

      const initialReferenceType = updateMode && selectedRequest ? selectedRequest.ShowReference.toString() : '';

      form.reset({
        requestDate: initialDate,
        referenceType: initialReferenceType,
      });
      setUploadedFile(null);
      setCompanyData([]);
      setValidationErrors([]);
      setValidationComplete(false);
      setShowPreview(false);
      form.clearErrors();
    }
  }, [open, updateMode, selectedRequest, form]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    form.clearErrors();

    // Check file size
    const fileSizeCheck = checkFileSize(file);
    if (!fileSizeCheck.isValid) {
      notice({
        variant: 'error',
        title: 'Dosya Boyutu Hatası',
        message: fileSizeCheck.error!,
      });
      event.target.value = '';
      return;
    }

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
      });
      event.target.value = '';
      return;
    }

    // Update state and start validation
    setUploadedFile(file);
    setIsValidating(true);
    setValidationComplete(false);
    setCompanyData([]);
    setValidationErrors([]);

    try {
      const excelData = await parseExcelFile(file);
      const errors = validateCompanyData(excelData.data);

      setCompanyData(excelData.data);
      setValidationErrors(errors);
      setValidationComplete(true);
      setShowPreview(true);
    } catch (error) {
      console.error('Excel parsing error:', error);
      setValidationErrors([
        {
          index: -1,
          name: 'FileError',
          errors: ['file_corrupt'],
          rowData: null,
        },
      ]);
      setValidationComplete(true);
    } finally {
      setIsValidating(false);
    }
  };

  // Remove file
  const removeFile = () => {
    setUploadedFile(null);
    setCompanyData([]);
    setValidationErrors([]);
    setValidationComplete(false);
    setShowPreview(false);

    // Reset file input
    const fileInput = document.getElementById('companyFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const formData = form.getValues();
    let isValid = true;

    if (!formData.requestDate) {
      form.setError('requestDate', { message: 'Talep tarihi zorunludur' });
      isValid = false;
    }

    if (!formData.referenceType) {
      form.setError('referenceType', { message: 'Referans türü seçimi zorunludur' });
      isValid = false;
    }

    if (!uploadedFile) {
      form.setError('file', { message: 'Excel dosyası zorunludur' });
      isValid = false;
    }

    return isValid;
  };

  // Get validation summary
  const getValidationSummary = () => {
    const totalRows = companyData.length;
    const errorRows = validationErrors.length;
    const validRows = totalRows - errorRows;

    return {
      total: totalRows,
      valid: validRows,
      invalid: errorRows,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (validationErrors.length > 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen hatalı kayıtları düzeltin ve tekrar yükleyin.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Format date properly to prevent timezone issues - ensure we get the selected date without timezone offset
      const formattedRequestDate = requestDate ? dayjs(requestDate).startOf('day').format('YYYY-MM-DD') : '';

      const result = await onDataSubmit(companyData, formattedRequestDate, referenceType === 'true');

      onClose();
      onSuccess?.(result.message || `${companyData.length} şirket başarıyla yüklendi.`);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: result.message || `${companyData.length} şirket başarıyla yüklendi.`,
      });
    } catch (error: unknown) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (updateMode && onCancelUpdate) {
      onCancelUpdate();
    }
    onClose();
  };

  // Render validation badge
  const renderValidationBadge = (hasErrors: boolean) => {
    return (
      <Chip
        icon={hasErrors ? <ErrorIcon /> : <CheckCircle />}
        label={hasErrors ? 'Hatalı' : 'Geçerli'}
        color={hasErrors ? 'error' : 'success'}
        size="small"
        sx={{
          fontWeight: 600,
          ...(hasErrors
            ? {
                backgroundColor: 'error.200',
                color: 'error.800',
                '& .MuiChip-icon': {
                  color: 'error.800',
                },
              }
            : {
                backgroundColor: 'success.200',
                color: 'success.800',
                '& .MuiChip-icon': {
                  color: 'success.800',
                },
              }),
        }}
      />
    );
  };

  // Render preview table
  const renderPreviewTable = () => {
    if (!showPreview || companyData.length === 0) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Veri Önizlemesi
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Satır</TableCell>
                <TableCell>VKN</TableCell>
                <TableCell>Unvan</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Yetkili Ad</TableCell>
                <TableCell>Yetkili Soyad</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companyData.map((row, index) => {
                const rowError = validationErrors.find((error) => error.index === index);
                const hasErrors = !!rowError;

                return (
                  <TableRow
                    key={`${row.vkn || 'empty'}-${index}`}
                    sx={{
                      backgroundColor: hasErrors ? 'error.100' : 'success.100',
                      '&:hover': {
                        backgroundColor: hasErrors ? 'error.200' : 'success.200',
                      },
                    }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell
                      sx={{
                        color: rowError?.errors.some((e) => e.includes('vkn')) ? 'error.700' : 'text.primary',
                        fontWeight: rowError?.errors.some((e) => e.includes('vkn')) ? 600 : 400,
                        backgroundColor: rowError?.errors.some((e) => e.includes('vkn')) ? 'error.50' : 'transparent',
                      }}>
                      {row.vkn || '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: rowError?.errors.includes('unvan') ? 'error.700' : 'text.primary',
                        fontWeight: rowError?.errors.includes('unvan') ? 600 : 400,
                        backgroundColor: rowError?.errors.includes('unvan') ? 'error.50' : 'transparent',
                      }}>
                      {row.unvan || '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: rowError?.errors.some((e) => e.includes('telefon')) ? 'error.700' : 'text.primary',
                        fontWeight: rowError?.errors.some((e) => e.includes('telefon')) ? 600 : 400,
                        backgroundColor: rowError?.errors.some((e) => e.includes('telefon'))
                          ? 'error.50'
                          : 'transparent',
                      }}>
                      {row.telefon || '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: rowError?.errors.some((e) => e.includes('email')) ? 'error.700' : 'text.primary',
                        fontWeight: rowError?.errors.some((e) => e.includes('email')) ? 600 : 400,
                        backgroundColor: rowError?.errors.some((e) => e.includes('email')) ? 'error.50' : 'transparent',
                      }}>
                      {row.email || '-'}
                    </TableCell>
                    <TableCell>{row.yetkiliKisiAd || '-'}</TableCell>
                    <TableCell>{row.yetkiliKisiSoyad || '-'}</TableCell>
                    <TableCell>
                      {renderValidationBadge(hasErrors)}
                      {hasErrors && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            backgroundColor: 'error.100',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'error.300',
                          }}>
                          {rowError?.errors.map((error, errorIdx) => (
                            <Typography
                              key={`${index}-error-${errorIdx}`}
                              variant="caption"
                              sx={{ color: 'error.700', fontWeight: 500 }}
                              display="block">
                              • {getErrorMessage(error)}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const summary = getValidationSummary();
  const hasErrors = validationErrors.length > 0;

  // Watch form values for reactive updates
  const requestDate = form.watch('requestDate');
  const referenceType = form.watch('referenceType');

  // Clear errors when values are selected
  useEffect(() => {
    if (requestDate) {
      form.clearErrors('requestDate');
    }
  }, [requestDate, form]);

  useEffect(() => {
    if (referenceType) {
      form.clearErrors('referenceType');
    }
  }, [referenceType, form]);

  // Helper for button text
  const getSubmitButtonText = () => {
    if (isUploading) {
      return updateMode ? 'Güncelleniyor...' : 'Yükleniyor...';
    }
    return updateMode ? `Güncelle (${summary.valid} Kayıt)` : `Onayla ve Yükle (${summary.valid} Kayıt)`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Description sx={{ mr: 1 }} />
            {updateMode ? 'Figoskor Talebini Güncelle' : 'Şirket Listesi Excel Yükleme'}
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Update Mode Info */}
        {updateMode && selectedRequest && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Güncelleme Bilgileri
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <strong>Mevcut Talep ID:</strong> {selectedRequest.Id}
              </Grid>
              <Grid item md={6}>
                <strong>Mevcut Firma Sayısı:</strong> {selectedRequest.TargetCompanyCount}
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Yeni Excel dosyası yükleyerek bu talebi güncelleyebilirsiniz.
            </Typography>
          </Alert>
        )}

        {/* Template Download Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box>
                <Typography variant="h6" gutterBottom>
                  Excel Template İndir
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Önce Excel template dosyasını indirin ve gerekli alanları doldurun.
                </Typography>
                <Button variant="outlined" startIcon={<FileDownload />} onClick={downloadTemplate}>
                  Template İndir
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={8}>
                <Typography variant="h6" gutterBottom>
                  Excel Dosyası Seçin
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {uploadedFile ? (
                    <Box
                      sx={{
                        border: 2,
                        borderColor: 'success.600',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'success.100',
                      }}>
                      <Box display="flex" alignItems="center">
                        <Description sx={{ mr: 2, color: 'success.700' }} />
                        <Box>
                          <Typography variant="body1" fontWeight="600" sx={{ color: 'success.800' }}>
                            {uploadedFile.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'success.600' }}>
                            Boyut: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton onClick={removeFile} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        border: 2,
                        borderStyle: 'dashed',
                        borderColor: form.formState.errors.file ? theme.palette.error[700] : theme.palette.primary.main,
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      component="label">
                      <input id="companyFileInput" type="file" accept=".xlsx,.xls" hidden onChange={handleFileUpload} />
                      <CloudUpload
                        sx={{
                          fontSize: 48,
                          color: form.formState.errors.file ? theme.palette.error[700] : 'primary.main',
                          mb: 2,
                        }}
                      />
                      <Typography variant="body1" gutterBottom>
                        Excel dosyanızı seçin veya sürükleyip bırakın
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Desteklenen formatlar: .xlsx, .xls
                      </Typography>
                    </Box>
                  )}
                  {form.formState.errors.file && (
                    <Typography variant="caption" sx={{ color: theme.palette.error[700], mt: -1 }}>
                      {form.formState.errors.file.message as string}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item md={4}>
                <Typography variant="h6" gutterBottom>
                  Gerekli Alanlar
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                  <Typography component="li" variant="body2">
                    <strong>VKN</strong> (Zorunlu - 10 veya 11 hane)
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Unvan</strong> (Zorunlu)
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Telefon</strong> (Zorunlu)
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>E-mail</strong> (Zorunlu)
                  </Typography>
                  <Typography component="li" variant="body2">
                    Yetkili Kişi Ad (Opsiyonel)
                  </Typography>
                  <Typography component="li" variant="body2">
                    Yetkili Kişi Soyad (Opsiyonel)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Talep Bilgileri
            </Typography>

            {updateMode && selectedRequest ? (
              /* Display selected values in update mode */
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: 'primary.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'primary.200',
                      }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.600', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Talep Tarihi
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.800', fontWeight: 700 }}>
                        {dayjs(selectedRequest.RequestDate).format('DD.MM.YYYY')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: selectedRequest.ShowReference ? 'success.50' : 'info.50',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: selectedRequest.ShowReference ? 'success.200' : 'info.200',
                      }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: selectedRequest.ShowReference ? 'success.600' : 'info.600',
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.5,
                        }}>
                        Referans Türü
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: selectedRequest.ShowReference ? 'success.800' : 'info.800',
                            fontWeight: 700,
                          }}>
                          {selectedRequest.ShowReference ? '✅ Açık Referans' : '🔒 Kapalı Referans'}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: selectedRequest.ShowReference ? 'success.600' : 'info.600',
                          display: 'block',
                          mt: 0.5,
                        }}>
                        {selectedRequest.ShowReference
                          ? 'Müşteri isimleri e-postalarda görünür'
                          : 'Müşteri isimleri e-postalarda görünmez'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ℹ️ Güncelleme Modu
                  </Typography>
                  <Typography variant="body2">
                    Yukarıdaki talep tarihi ve referans türü önceden seçilmiştir. Bu alanlar güncellenemez. Yeni talep
                    oluşturulmalıdır.
                  </Typography>
                </Alert>
              </Box>
            ) : (
              /* Show form inputs in create mode */
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputDatePicker name="requestDate" label="Talep Tarihi" form={form} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInputLabel label="Referans Türü" />
                  <InputRadio name="referenceType" form={form} radios={referenceTypeOptions} />
                </Grid>
              </Grid>
            )}

            {/* Reference Type Info - Only show in create mode */}
            {!updateMode && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Açıklama
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: 'success.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'success.500',
                    }}>
                    <Typography variant="body2" sx={{ color: 'success.800', fontWeight: 600 }}>
                      ✅ Açık Referans:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.600' }}>
                      Müşteri isimleri e-postalarda görünür
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'info.light',
                    }}>
                    <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                      🔒 Kapalı Referans:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      Müşteri isimleri e-postalarda görünmez
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Validation Status */}
        {isValidating && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center">
              <WarningIcon sx={{ mr: 1 }} />
              Excel dosyası kontrol ediliyor...
            </Box>
            <LinearProgress sx={{ mt: 1 }} />
          </Alert>
        )}

        {/* Validation Summary */}
        {validationComplete && summary.total > 0 && (
          <Alert severity={hasErrors ? 'error' : 'success'} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doğrulama Sonucu
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                  Toplam Kayıt:{' '}
                  <Box component="span" sx={{ color: 'primary.700' }}>
                    {summary.total}
                  </Box>
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'success.700' }}>
                  Geçerli:{' '}
                  <Box component="span" sx={{ color: 'success.800' }}>
                    {summary.valid}
                  </Box>
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'error.700' }}>
                  Hatalı:{' '}
                  <Box component="span" sx={{ color: 'error.800' }}>
                    {summary.invalid}
                  </Box>
                </Typography>
              </Grid>
            </Grid>
            {hasErrors && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  backgroundColor: 'error.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'error.300',
                }}>
                <Typography variant="body2" sx={{ color: 'error.700', fontWeight: 600 }}>
                  ⚠️ Lütfen hatalı kayıtları düzeltin ve tekrar yükleyin.
                </Typography>
              </Box>
            )}
          </Alert>
        )}

        {/* Data Preview */}
        {renderPreviewTable()}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: hasErrors && validationComplete ? 'error.50' : 'transparent',
          borderTop: hasErrors && validationComplete ? '2px solid' : 'none',
          borderColor: 'error.300',
        }}>
        <Button onClick={handleClose} disabled={isUploading} variant="outlined">
          İptal
        </Button>
        <LoadingButton
          loading={isUploading}
          variant="contained"
          color={updateMode ? 'warning' : 'success'}
          onClick={handleSubmit}
          sx={{
            minWidth: 200,
            fontWeight: 600,
            ...(hasErrors &&
              validationComplete && {
                backgroundColor: 'error.300',
                '&:disabled': {
                  backgroundColor: 'error.200',
                  color: 'error.600',
                },
              }),
          }}>
          {getSubmitButtonText()}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyExcelUpload;
