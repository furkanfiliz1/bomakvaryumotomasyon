import { LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { CalendarMonth, Close, Delete, Download, Edit, ExpandMore, Upload } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import * as FileSaver from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import {
  DocumentResponseModel,
  useDeleteDocumentsByIdMutation,
  useGetDocumentsQuery,
  useGetLabelsQuery,
  useLazyGetDocumentsByIdFileQuery,
} from '../../../api/figoParaApi';
import Dropzone from '../../../components/common/Dropzone';
import {
  useGetDocumentStatusesQuery,
  useUpdateDocumentExpireDateMutation,
  useUpdateDocumentStatusMutation,
  useUploadCompanyDocumentMutation,
} from '../companies.api';
import { DocumentUpdateFormData } from '../helpers';
import { useDocumentForm } from '../hooks';
import DocumentFormComponent from './DocumentFormComponent';

interface CompanyDocumentsProps {
  companyId: number;
}

interface DocumentUploadForm {
  documentType: number;
  documentYear?: number;
  documentMonth?: number;
  documentQuarter?: number;
  file?: File;
}

// Content type helper function
const contentType = (fileType: string): string => {
  const type = fileType.toLowerCase();
  switch (type) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'txt':
      return 'text/plain';
    case 'zip':
      return 'application/zip';
    case 'rar':
      return 'application/x-rar-compressed';
    default:
      return 'application/octet-stream';
  }
};

// Buffer to base64 converter
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// MASAK dokümanları (Kaçakçılık ile Mücadele ve Mali Suçları Araştırma Kurulu)
const masakDocumentIds = [1, 3, 4, 28, 29, 43, 44, 46];

// Mali dokümanlar
const financialDocumentIds = [
  2, 5, 6, 7, 8, 20, 21, 22, 23, 24, 25, 26, 27, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 45, 47, 48,
];

const CompanyDocuments: React.FC<CompanyDocumentsProps> = ({ companyId }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponseModel | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [documentForms, setDocumentForms] = useState<Record<number, ReturnType<typeof useDocumentForm>['form']>>({});
  const {
    data: documents = [],
    error: documentsError,
    isLoading: documentsLoading,
    refetch: refetchDocuments,
  } = useGetDocumentsQuery(
    { sendercompanyId: companyId },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: labels = [], error: labelsError } = useGetLabelsQuery();

  const { data: documentStatusOptions = [], error: statusesError } = useGetDocumentStatusesQuery();
  const notice = useNotice();
  const [deleteDocument] = useDeleteDocumentsByIdMutation();
  const [downloadDocument] = useLazyGetDocumentsByIdFileQuery();
  const [updateDocumentStatus, { isSuccess: isSuccessDocumentStatus, error: updateStatusError }] =
    useUpdateDocumentStatusMutation();
  const [updateDocumentExpireDate, { isSuccess: isSuccessDocumentExpireDate, error: documentExpireDAteError }] =
    useUpdateDocumentExpireDateMutation();
  const [uploadCompanyDocument, { isLoading: uploadLoading, isSuccess, error: uploadDocumentError }] =
    useUploadCompanyDocumentMutation();

  const form = useForm<DocumentUploadForm>();
  const { control, handleSubmit, reset, watch } = form;
  const documentType = watch('documentType');

  useErrorListener([
    documentsError,
    labelsError,
    statusesError,
    updateStatusError,
    uploadDocumentError,
    documentExpireDAteError,
  ]);

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      notice({
        type: 'dialog',
        message: 'Dosya Başarıyla Yüklendi',
      });
    }
  }, [form, isSuccess, notice]);

  useEffect(() => {
    if (isSuccessDocumentStatus) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Doküman durumu başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccessDocumentStatus, notice]);

  useEffect(() => {
    if (isSuccessDocumentExpireDate) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Son geçerlilik tarihi başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccessDocumentExpireDate, notice]);

  // Categorize documents
  const masakDocuments = documents.filter((doc) => doc.LabelId && masakDocumentIds.includes(doc.LabelId));
  const financialDocuments = documents.filter((doc) => doc.LabelId && financialDocumentIds.includes(doc.LabelId));

  const handleDownload = async (doc: DocumentResponseModel) => {
    if (!doc.Id) return;

    try {
      const result = await downloadDocument(doc.Id);
      if ('data' in result && result.data) {
        // Get the file blob from the API response
        const blob = result.data as Blob;

        // Convert blob to array buffer for base64 conversion
        const arrayBuffer = await blob.arrayBuffer();

        // Determine file type and name
        const fileType = doc.Type || 'pdf';
        const fileName = `${doc.LabelName || doc.Name || `document_${doc.Id}`}.${fileType}`;

        // Use FileSaver with base64 data URL as specified by user
        FileSaver.saveAs(`data:${contentType(fileType)};base64,${bufferToBase64(arrayBuffer)}`, fileName);

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Dosya başarıyla indirildi',
          buttonTitle: 'Tamam',
        });
      } else {
        throw new Error('Dosya verisi bulunamadı');
      }
    } catch (error) {
      console.error('Download failed:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Dosya indirme işlemi başarısız oldu',
        buttonTitle: 'Tamam',
      });
    }
  };

  const handleDelete = async (document: DocumentResponseModel) => {
    notice({
      type: 'confirm',
      variant: 'error',
      title: 'Dokümanı Sil',
      message: 'Bu dokümanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      buttonTitle: 'Sil',
      onClick: async () => {
        if (!document.Id) return;

        try {
          await deleteDocument(document.Id).unwrap();
          refetchDocuments();
          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Doküman başarıyla silindi',
            buttonTitle: 'Tamam',
          });
        } catch (error) {
          console.error('Delete failed:', error);
          notice({
            variant: 'error',
            title: 'Hata',
            message: 'Doküman silme işlemi başarısız oldu',
            buttonTitle: 'Tamam',
          });
        }
      },
      catchOnCancel: true,
    });
  };

  const handleUpload = async (data: DocumentUploadForm) => {
    if (!data.file) {
      throw Error('File not found');
    }

    const fileName = data.file.name;
    const fileNameExceptExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    const fileType = fileName?.split?.('.').pop()?.toLocaleLowerCase() || '';

    try {
      // Companies.api'deki uploadCompanyDocument mutation'ını kullanıyoruz

      // type: fileType,
      // labelId: data.documentType,
      // senderCompanyId: companyId,
      // file: data.file,
      // ...(data.documentYear && { periodYear: data.documentYear }),
      // ...(data.documentMonth && { periodMonth: data.documentMonth }),
      // ...(data.documentQuarter && { periodQuarter: data.documentQuarter }),

      const formData = new FormData();
      formData.append('name', fileNameExceptExtension);
      formData.append('type', fileType);
      formData.append('labelId', data.documentType.toString());
      formData.append('senderCompanyId', companyId.toString());
      formData.append('file', data.file);

      if (data.documentYear) {
        formData.append('periodYear', data.documentYear.toString());
      }
      if (data.documentMonth) {
        formData.append('periodMonth', data.documentMonth.toString());
      }
      if (data.documentQuarter) {
        formData.append('periodQuarter', data.documentQuarter.toString());
      }

      const uploadRes = await uploadCompanyDocument(formData);

      if ('data' in uploadRes) {
        refetchDocuments();
        setShowUploadDialog(false);
        reset();
        // Success notification could be added here
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const getContractDocument = () => {
    const contractDoc = masakDocuments.find((doc) => doc.LabelId === 28);
    if (contractDoc) {
      handleDownload(contractDoc);
    } else {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'Sözleşme belgesi bulunamadı.',
        buttonTitle: 'Tamam',
      });
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD.MM.YYYY HH:mm:ss');
  };

  const handleStatusUpdate = async (documentId: number, data: DocumentUpdateFormData) => {
    try {
      await updateDocumentStatus({
        Id: documentId,
        status: data.status ?? 0,
        message: data.message || '',
      }).unwrap();
      refetchDocuments();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleDateUpdate = async () => {
    if (!selectedDocument?.Id || !selectedDate) return;

    try {
      await updateDocumentExpireDate({
        documentId: selectedDocument.Id,
        expireDate: selectedDate.format('YYYY-MM-DD'),
      }).unwrap();
      refetchDocuments();
      setShowDateDialog(false);
      setSelectedDocument(null);
      setSelectedDate(null);
    } catch (error) {
      console.error('Date update failed:', error);
    }
  };

  const handleFormReady = useCallback((documentId: number, form: ReturnType<typeof useDocumentForm>['form']) => {
    setDocumentForms((prev) => ({
      ...prev,
      [documentId]: form,
    }));
  }, []);

  const handleDocumentFormSubmit = (documentId: number) => {
    const form = documentForms[documentId];
    if (form) {
      form.handleSubmit((data: DocumentUpdateFormData) => {
        if (documentId) {
          handleStatusUpdate(documentId, data);
        }
      })();
    }
  };

  const renderDocumentItem = (doc: DocumentResponseModel) => (
    <Card key={doc.Id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" gutterBottom>
              {doc.LabelName}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {formatDateTime(doc.InsertDatetime)}
            </Typography>
            {doc.LabelId === 30 && doc.PeriodMonth && doc.PeriodYear && (
              <Typography variant="caption" color="text.secondary" display="block">
                Ay: {doc.PeriodMonth} - Yıl: {doc.PeriodYear}
              </Typography>
            )}
            {doc.LabelId === 32 && doc.PeriodYear && (
              <Typography variant="caption" color="text.secondary" display="block">
                Yıl: {doc.PeriodYear}
              </Typography>
            )}
            {(doc.LabelId === 33 || doc.LabelId === 34) && doc.PeriodQuarter && doc.PeriodYear && (
              <Typography variant="caption" color="text.secondary" display="block">
                Dönem: {doc.PeriodQuarter} - Yıl: {doc.PeriodYear}
              </Typography>
            )}
            {doc.ExpireDate && (
              <Typography variant="caption" color="text.warning" display="block">
                Son Geçerlilik Tarihi: {dayjs(doc.ExpireDate).format('DD.MM.YYYY')}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <DocumentFormComponent
              document={doc}
              documentStatusOptions={documentStatusOptions}
              onFormReady={(form) => handleFormReady(doc.Id!, form)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              {doc.LabelId === 1 && (
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedDocument(doc);
                    setSelectedDate(doc.ExpireDate ? dayjs(doc.ExpireDate) : null);
                    setShowDateDialog(true);
                  }}>
                  <CalendarMonth />
                </IconButton>
              )}
              <IconButton
                color="primary"
                onClick={() => {
                  handleDocumentFormSubmit(doc.Id!);
                }}>
                <Edit />
              </IconButton>
              <IconButton color="default" onClick={() => handleDownload(doc)}>
                <Download />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(doc)}>
                <Delete />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (documentsLoading) {
    return (
      <Box p={3}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Yüklenen Dokümanlar</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={getContractDocument} startIcon={<Download />}>
              Sözleşme İndir
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                reset();
                setShowUploadDialog(true);
              }}
              startIcon={<Upload />}>
              Doküman Yükle
            </Button>
          </Stack>
        </Box>

        {/* Documents */}
        {documents.length > 0 ? (
          <Box>
            {/* MASAK Documents */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Masak Evraklar</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {masakDocuments.length > 0 ? (
                  masakDocuments.map((doc) => renderDocumentItem(doc))
                ) : (
                  <Alert severity="info">Masak Evraklar bulunamadı.</Alert>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Financial Documents */}
            <Accordion defaultExpanded sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Mali Belgeler</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {financialDocuments.length > 0 ? (
                  financialDocuments.map((doc) => renderDocumentItem(doc))
                ) : (
                  <Alert severity="info">Mali Belgeler bulunamadı.</Alert>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Henüz doküman yüklenmemiş.
          </Alert>
        )}

        {/* Upload Dialog */}
        <Dialog
          open={showUploadDialog}
          onClose={() => {
            setShowUploadDialog(false);
            reset();
          }}
          maxWidth="sm"
          fullWidth>
          <DialogTitle>
            Doküman Yükle
            <IconButton
              onClick={() => {
                setShowUploadDialog(false);
                reset();
              }}
              sx={{ position: 'absolute', right: 8, top: 8 }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(handleUpload)}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Controller
                    name="documentType"
                    control={control}
                    rules={{ required: 'Doküman türü seçiniz' }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error}>
                        <InputLabel>Doküman Türü</InputLabel>
                        <Select {...field} label="Doküman Türü">
                          {labels.map((label) => (
                            <MenuItem key={label.Id} value={label.Id}>
                              {label.Name}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography color="error" variant="caption">
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Period fields for specific document types */}
                {documentType >= 30 && documentType <= 34 && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="documentYear"
                      control={control}
                      render={({ field }) => <TextField {...field} fullWidth label="Yıl" type="number" />}
                    />
                  </Grid>
                )}

                {documentType >= 30 && documentType <= 31 && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="documentMonth"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Ay" type="number" inputProps={{ min: 1, max: 12 }} />
                      )}
                    />
                  </Grid>
                )}

                {documentType >= 33 && documentType <= 34 && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="documentQuarter"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} fullWidth label="Dönem" type="number" inputProps={{ min: 1, max: 4 }} />
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Dropzone
                    name="file"
                    form={form as unknown as UseFormReturn<FieldValues>}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.eml"
                    multiple={false}
                    loading={uploadLoading}
                    supportedFormat={['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'eml']}
                    maxSize={15}
                    maxSizeType="MB"
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowUploadDialog(false);
                reset();
              }}>
              İptal
            </Button>
            <LoadingButton
              id="upload-button"
              loading={uploadLoading}
              variant="contained"
              onClick={handleSubmit(handleUpload)}>
              Yükle
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* Date Update Dialog */}
        <Dialog open={showDateDialog} onClose={() => setShowDateDialog(false)}>
          <DialogTitle>Son Geçerlilik Tarihi</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography mb={2}>Son geçerlilik tarihini güncelleyin</Typography>
              <DatePicker label="Tarih" value={selectedDate} onChange={setSelectedDate} sx={{ width: '100%' }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDateDialog(false)}>İptal</Button>
            <Button variant="contained" onClick={handleDateUpdate}>
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CompanyDocuments;
