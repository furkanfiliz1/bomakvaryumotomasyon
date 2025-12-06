import { PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete as DeleteIcon, Download, Edit as EditIcon, Upload, Visibility } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Slider,
  Typography,
} from '@mui/material';
import { currencyFormatter } from '@utils';
import React, { useCallback, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useNavigate, useParams } from 'react-router-dom';

import { CheckEditModal, CheckHistoryTable } from '.';
import { useLazyGetBankBranchesQuery } from '../../../DiscountOperations/discount-operations.api';
import type { BankBranchOption } from '../../../DiscountOperations/discount-operations.types';
import {
  useDeleteCheckMutation,
  useGetBanksQuery,
  useGetCheckAllowancesQuery,
  useGetCheckDetailQuery,
  useGetCheckDocumentsQuery,
  useLazyDownloadCheckDocumentQuery,
  useUpdateCheckDocumentMutation,
  useUploadCheckDocumentMutation,
} from '../check-report.api';
import type { BranchOption, DocumentItem } from '../check-report.types';

// Date formatting utility
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR');
};

// Document type labels
const getDocumentTypeLabel = (documentType: number): string => {
  switch (documentType) {
    case 1:
      return 'Çek Ön Yüz Görseli';
    case 2:
      return 'Çek Arka Yüz Görseli';
    case 3:
      return 'Çek ile ilgili fatura dosyası';
    default:
      return 'Belge';
  }
};

export const CheckDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const checkId = Number(id);
  const navigate = useNavigate();
  const notice = useNotice();

  const [uploadingDocument, setUploadingDocument] = useState<Record<number, boolean>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Document view modal states
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [viewDocumentData, setViewDocumentData] = useState<string | null>(null);
  const [viewDocumentType, setViewDocumentType] = useState<string>('');
  const [viewDocumentName, setViewDocumentName] = useState<string>('');

  // Image editing states
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [documentData, setDocumentData] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [rotate, setRotate] = useState(0);
  const [isRotateApplied, setIsRotateApplied] = useState(false);
  const [rotatedImageData, setRotatedImageData] = useState<{
    blob: Blob;
    dataURL: string;
    base64: string;
  } | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [loadingDocument, setLoadingDocument] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const {
    data: check,
    isLoading: checkLoading,
    error: checkError,
    refetch: refetchCheck,
  } = useGetCheckDetailQuery(checkId, {
    skip: !checkId,
  });

  const {
    data: checkAllowances = [],
    isLoading: allowancesLoading,
    error: allowancesError,
  } = useGetCheckAllowancesQuery(checkId, {
    skip: !checkId,
  });

  const { data: checkDocuments = [], refetch: refetchDocuments } = useGetCheckDocumentsQuery(checkId, {
    skip: !checkId,
  });

  // Fetch banks data for displaying proper names
  const { data: banksData = [] } = useGetBanksQuery();

  // Lazy query for getting bank branches
  const [getBankBranches, { data: branchesData }] = useLazyGetBankBranchesQuery();

  // Find the bank by BankEftCode to get the bank ID
  const selectedBank = banksData.find((bank) => bank.Code === check?.BankEftCode);

  // Convert BankBranchOption to BranchOption for consistency
  const convertedBranchesData: BranchOption[] = React.useMemo(() => {
    if (!branchesData?.Items) return [];
    return branchesData.Items.map((branch: BankBranchOption) => ({
      Id: branch.Id.toString(),
      Code: branch.Code,
      Name: branch.Name,
      BankId: selectedBank?.Id || '',
    }));
  }, [branchesData?.Items, selectedBank?.Id]);

  // Trigger branch loading when bank is found - using discount-operations pattern
  React.useEffect(() => {
    if (selectedBank?.Id && check?.BankEftCode && banksData.length > 0) {
      getBankBranches({
        BankId: parseInt(selectedBank.Id),
        pageSize: 99999,
      });
    }
  }, [selectedBank?.Id, check?.BankEftCode, banksData.length, getBankBranches]);

  const [downloadDocument] = useLazyDownloadCheckDocumentQuery();
  const [uploadDocument] = useUploadCheckDocumentMutation();
  const [updateDocument] = useUpdateCheckDocumentMutation();
  const [deleteCheck, { isLoading: isDeleting, error }] = useDeleteCheckMutation();

  useErrorListener([error]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    // Refetch check data after successful update
    setIsEditModalOpen(false);
    refetchCheck();
  };

  const handleDeleteClick = async () => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Çek Silme Onayı',
        message: 'Bu çeki silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
        catchOnCancel: true,
      });

      await deleteCheck(checkId).unwrap();

      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çek başarıyla silindi.',
      });

      navigate('/invoice-operations/check-report');
    } catch (error) {
      if (error !== 'cancelled') {
        console.error('Error deleting check:', error);
      }
    }
  };

  const handleDownloadDocument = async (documentId: number, fileName: string) => {
    try {
      const response = await downloadDocument({ billId: checkId, documentId }).unwrap();

      // Create blob and download
      const byteCharacters = atob(response.Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.Type });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.Name || fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = useCallback(
    async (documentType: number) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf,.doc,.docx';
      input.multiple = false;

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        setUploadingDocument((prev) => ({ ...prev, [documentType]: true }));

        try {
          const base64Data = await convertFileToBase64(file);

          const existingDocument = checkDocuments.find((doc) => doc.DocumentType === documentType);

          const uploadData = {
            DocumentType: documentType,
            data: base64Data,
            billId: String(checkId),
            name: file.name,
            type: file.type.split('/')[1] || 'jpeg',
          };

          if (existingDocument) {
            // Update existing document
            await updateDocument({
              billId: checkId,
              documentId: existingDocument.Id,
              data: uploadData,
            }).unwrap();

            await notice({
              variant: 'success',
              title: 'Başarılı',
              message: 'Belge başarıyla güncellendi.',
            });
          } else {
            // Upload new document
            await uploadDocument({
              billId: checkId,
              data: uploadData,
            }).unwrap();

            await notice({
              variant: 'success',
              title: 'Başarılı',
              message: 'Belge başarıyla yüklendi.',
            });
          }

          // Refresh documents list
          refetchDocuments();
        } catch (error) {
          console.error('Error uploading document:', error);
          await notice({
            variant: 'error',
            title: 'Hata',
            message: 'Belge yüklenirken hata oluştu.',
          });
        } finally {
          setUploadingDocument((prev) => ({ ...prev, [documentType]: false }));
        }
      };

      input.click();
    },
    [checkId, checkDocuments, uploadDocument, updateDocument, refetchDocuments, notice],
  );

  const hasDocument = (documentType: number): boolean => {
    return checkDocuments.some((doc) => doc.DocumentType === documentType);
  };

  const getDocumentByType = (documentType: number): DocumentItem | undefined => {
    return checkDocuments.find((doc) => doc.DocumentType === documentType);
  };

  const handleViewDocument = async (documentId: number, fileType: string) => {
    try {
      setLoadingDocument(true);
      const response = await downloadDocument({ billId: checkId, documentId }).unwrap();
      const document = checkDocuments.find((doc) => doc.Id === documentId);

      const isImage = ['png', 'jpeg', 'jpg'].includes(fileType.toLowerCase());

      if (isImage) {
        // For image files, open editing modal directly
        if (document) {
          setEditingDocument(document);
          setDocumentData(`data:image/${fileType.toLowerCase()};base64,${response.Data}`);
          setShowImageEditModal(true);
        }
      } else {
        // For PDF and other files, show in view modal
        setViewDocumentData(response.Data);
        setViewDocumentType(fileType.toLowerCase());
        setViewDocumentName(document?.Name || 'Document');
        setShowDocumentModal(true);
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    } finally {
      setLoadingDocument(false);
    }
  };

  // Image editing functions (similar to reference file)
  const hideEditModal = () => {
    setCrop(undefined);
    setCompletedCrop(null);
    setRotate(0);
    setIsRotateApplied(false);
    setRotatedImageData(null);
    setShowImageEditModal(false);
    setEditingDocument(null);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop, rotation = 0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return Promise.reject('Canvas context not available');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Rotation calculations
    const rotRad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));

    // Crop dimensions
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    // Rotated canvas dimensions
    const rotatedWidth = cropWidth * cos + cropHeight * sin;
    const rotatedHeight = cropWidth * sin + cropHeight * cos;

    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    // Set canvas center
    ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
    ctx.rotate(rotRad);

    // Draw image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      cropWidth,
      cropHeight,
      -cropWidth / 2,
      -cropHeight / 2,
      cropWidth,
      cropHeight,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        'image/jpeg',
        0.9,
      );
    });
  };

  const getRotatedImg = (image: HTMLImageElement, rotation = 0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return Promise.reject('Canvas context not available');

    const { naturalWidth, naturalHeight } = image;

    // Rotation calculations
    const rotRad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));

    // Rotated image dimensions
    const rotatedWidth = naturalWidth * cos + naturalHeight * sin;
    const rotatedHeight = naturalWidth * sin + naturalHeight * cos;

    // Set canvas size to rotated image size
    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    // Set canvas center
    ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
    ctx.rotate(rotRad);

    // Draw image centered
    ctx.drawImage(image, -naturalWidth / 2, -naturalHeight / 2, naturalWidth, naturalHeight);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const rotatedData = {
                blob: blob,
                dataURL: reader.result as string,
                base64: (reader.result as string).split(',')[1],
              };
              setRotatedImageData(rotatedData);
              resolve(blob);
            };
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        'image/jpeg',
        0.9,
      );
    });
  };

  const handleRotateLeft = () => {
    setRotate((prevRotate) => (prevRotate - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotate((prevRotate) => (prevRotate + 90) % 360);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setRotate(Array.isArray(newValue) ? newValue[0] : newValue);
  };

  const handleApplyRotation = async () => {
    if (!imgRef.current || rotate === 0) {
      console.warn('No rotation applied.');
      return;
    }

    try {
      const rotatedImageBlob = await getRotatedImg(imgRef.current, rotate);

      if (rotatedImageBlob) {
        setRotate(0);
        setIsRotateApplied(true);
        setCrop(undefined);
        setCompletedCrop(null);
        console.log('Rotation applied, you can now crop.');
      }
    } catch (error) {
      console.error('Image rotation error:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!imgRef.current) {
      alert('Image not loaded.');
      return;
    }

    if (rotate !== 0 && !isRotateApplied) {
      alert('Please apply rotation first, then crop.');
      return;
    }

    try {
      let processedImageBlob;
      let shouldUseRotatedData = false;

      // Only perform cropping operation
      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
        processedImageBlob = await getCroppedImg(imgRef.current, completedCrop, 0);
      } else if (isRotateApplied && rotatedImageData) {
        // Only rotation was done, no cropping
        processedImageBlob = rotatedImageData.blob;
        shouldUseRotatedData = true;
      } else {
        alert('Please select an area to crop or apply rotation.');
        return;
      }

      if (processedImageBlob && editingDocument) {
        // Convert processed blob to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data =
            shouldUseRotatedData && rotatedImageData
              ? rotatedImageData.base64
              : (reader.result as string).split(',')[1];

          try {
            const uploadData = {
              DocumentType: editingDocument.DocumentType,
              data: base64Data,
              billId: checkId.toString(),
              name: editingDocument.Name,
              type: editingDocument.Type,
            };

            await updateDocument({
              billId: checkId,
              documentId: editingDocument.Id,
              data: uploadData,
            }).unwrap();

            await notice({
              variant: 'success',
              title: 'Başarılı',
              message: 'Resim başarıyla güncellendi.',
            });

            refetchDocuments();
            hideEditModal();
          } catch (error) {
            console.error('Error updating document:', error);
            await notice({
              variant: 'error',
              title: 'Hata',
              message: 'Resim güncellenirken hata oluştu.',
            });
          }
        };
        reader.readAsDataURL(processedImageBlob);
      }
    } catch (error) {
      console.error('Image processing error:', error);
      alert('Error processing image.');
    }
  };

  if (checkLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (checkError || !check) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Çek detayları yüklenirken hata oluştu.</Alert>
      </Box>
    );
  }

  return (
    <>
      <PageHeader title="Çek Detayı" subtitle="Çek bilgileri ve işlem geçmişi" />

      <Box sx={{ p: 3, pt: 1 }}>
        <Grid container spacing={2}>
          {/* Main Check Details */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {/* Drawer Information */}
                <Grid container sx={{ mb: 1 }}>
                  <Grid item xs={12} md={6} mb={1}>
                    <Typography variant="h6" gutterBottom>
                      Keşideci Adı
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {check.DrawerName || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Keşideci VKN / TCKN
                    </Typography>
                    <Typography variant="body1">{check.DrawerIdentifier || '-'}</Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Keşide Yeri
                    </Typography>
                    <Typography variant="body1">{check.PlaceOfIssue || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Banka Adı / Şubesi
                    </Typography>
                    <Typography variant="body1">
                      {check.BankName || '-'}/{check.BankBranchName || '-'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Check Details */}
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Box mb={2}>
                      <Typography variant="h6" gutterBottom>
                        Çek No
                      </Typography>
                      <Typography variant="body1">{check.No || '-'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Çek Hesap No
                      </Typography>
                      <Typography variant="body1">{check.ChequeAccountNo || '-'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Çek Ödeme Tarihi
                      </Typography>
                      <Typography variant="body1">{formatDate(check.PaymentDueDate)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Çek Yüklenme Tarihi
                      </Typography>
                      <Typography variant="body1">{formatDate(check.InsertDatetime)}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Endorser Information */}
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura Borçlusu Ünvan
                      </Typography>
                      <Typography variant="body1">{check.EndorserName || '-'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Ciranta Ünvan
                      </Typography>
                      <Typography variant="body1">{check.ReferenceEndorserName || '-'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Fatura Borçlusu VKN / TCKN
                      </Typography>
                      <Typography variant="body1">{check.EndorserIdentifier || '-'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Ciranta VKN / TCKN
                      </Typography>
                      <Typography variant="body1">{check.ReferenceEndorserIdentifier || '-'}</Typography>
                    </Box>
                  </Grid>

                  {/* Intermediate Endorsers Section */}
                  {check.ReferenceEndorsers && check.ReferenceEndorsers.length > 0 && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Ara Cirantalar
                        </Typography>
                        {check.ReferenceEndorsers.map((endorser, index) => (
                          <Box
                            key={endorser.Id}
                            sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Ara Ciranta #{index + 1} VKN/TCKN
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {endorser.EndorserIdentifier || '-'}
                                </Typography>
                              </Grid>
                              {endorser.EndorserName && (
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    Ara Ciranta #{index + 1} Ünvan
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {endorser.EndorserName}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Document Management Section */}
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Belgeler
                </Typography>
                <Grid container spacing={2}>
                  {[1, 2, 3].map((documentType) => {
                    const document = getDocumentByType(documentType);
                    const hasDoc = hasDocument(documentType);
                    const isUploading = uploadingDocument[documentType];

                    return (
                      <Grid item xs={12} md={4} key={documentType}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {getDocumentTypeLabel(documentType)}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {hasDoc && document ? (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                                  startIcon={<Download />}
                                  onClick={() => handleDownloadDocument(document.Id, document.Name)}>
                                  İndir
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Visibility />}
                                  sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                                  onClick={() => handleViewDocument(document.Id, document.Type)}
                                  disabled={loadingDocument}>
                                  {loadingDocument ? 'Yükleniyor...' : 'Göster'}
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<Upload />}
                                  sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                                  onClick={() => handleFileUpload(documentType)}
                                  disabled={isUploading}>
                                  {isUploading ? 'Yükleniyor...' : 'Güncelle'}
                                </Button>
                                <Typography variant="caption" color="text.secondary">
                                  {document.Name}
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Chip label="Dosya bulunamadı" size="small" color="default" />
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<Upload />}
                                  onClick={() => handleFileUpload(documentType)}
                                  disabled={isUploading}>
                                  {isUploading ? 'Yükleniyor...' : 'Yükle'}
                                </Button>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar with Actions and Summary */}
          <Grid item xs={12} lg={4}>
            {/* Edit Action */}

            {/* Amount Summary */}
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6">Çek Tutarı</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {currencyFormatter(check.PayableAmount || 0, check.PayableAmountCurrency)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
                  <Typography variant="h6">Yükleme Tarihi</Typography>
                  <Typography variant="h6">{formatDate(check.InsertDatetime)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    disabled={isDeleting}>
                    {isDeleting ? 'Siliniyor...' : 'Çek Sil'}
                  </Button>
                  <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditClick}>
                    Çek Düzenle
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Check History Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Çek Tarihçesi
          </Typography>
          <CheckHistoryTable allowances={checkAllowances} loading={allowancesLoading} error={allowancesError} />
        </Box>
      </Box>

      {/* Check Edit Modal */}
      <CheckEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        checkData={check}
        onSuccess={handleEditSuccess}
        banksData={banksData}
        branchesData={convertedBranchesData}
      />

      {/* Document View Modal */}
      <Dialog open={showDocumentModal} onClose={() => setShowDocumentModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{viewDocumentName}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            {viewDocumentData && (
              <Box
                sx={{
                  overflowY: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                }}>
                {viewDocumentType === 'pdf' ? (
                  <iframe
                    title="Doküman"
                    src={`data:application/pdf;base64,${viewDocumentData}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', minHeight: '600px' }}
                  />
                ) : (
                  <img
                    title="Çek Resmi"
                    src={`data:image/${viewDocumentType};base64,${viewDocumentData}`}
                    alt={viewDocumentName}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDocumentModal(false)} color="secondary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Edit Modal */}
      {showImageEditModal && editingDocument && (
        <Dialog open={showImageEditModal} onClose={hideEditModal} maxWidth="lg" fullWidth>
          <DialogTitle>Resmi Düzenle - {editingDocument.Name}</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>Kullanım:</strong> Resmi döndürebilir ve/veya kırpabilirsiniz. Kırpmak için fare ile istediğiniz
              alanı çizin. Her iki işlem de isteğe bağlıdır.
            </Alert>

            {/* Rotation Controls */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Döndürme Kontrolleri
              </Typography>

              {/* Quick rotation buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" onClick={handleRotateLeft} sx={{ minWidth: 'auto' }}>
                    ↺ 90° Sol
                  </Button>
                  <Button variant="outlined" onClick={handleRotateRight} sx={{ minWidth: 'auto' }}>
                    ↻ 90° Sağ
                  </Button>
                  <Button variant="outlined" color="warning" onClick={() => setRotate(0)} sx={{ minWidth: 'auto' }}>
                    🔄 Sıfırla
                  </Button>
                </Box>
              </Box>

              {/* Slider control */}
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2">İstediğiniz açı:</Typography>
                </Grid>
                <Grid item xs={8} md={7}>
                  <Slider
                    value={rotate}
                    onChange={handleSliderChange}
                    min={-180}
                    max={180}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: -180, label: '-180°' },
                      { value: -90, label: '-90°' },
                      { value: 0, label: '0°' },
                      { value: 90, label: '90°' },
                      { value: 180, label: '180°' },
                    ]}
                  />
                </Grid>
                <Grid item xs={4} md={2}>
                  <Typography variant="body2" textAlign="center">
                    {rotate}°
                  </Typography>
                </Grid>
              </Grid>

              {rotate !== 0 && !isRotateApplied && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="contained" color="warning" onClick={handleApplyRotation}>
                    Döndürmeyi Kaydet
                  </Button>
                  <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                    Kırpma işlemi için önce döndürmeyi kaydedin.
                  </Typography>
                </Box>
              )}

              {isRotateApplied && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="success.main">
                    ✓ Döndürme kaydedildi. Artık kırpabilirsiniz.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Image with cropping */}
            {documentData && (
              <Box sx={{ textAlign: 'center' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(crop) => {
                    if (isRotateApplied || rotate === 0) {
                      setCrop(crop);
                    }
                  }}
                  onComplete={(crop) => {
                    if (isRotateApplied || rotate === 0) {
                      setCompletedCrop(crop);
                    }
                  }}
                  minWidth={50}
                  minHeight={50}
                  disabled={!isRotateApplied && rotate !== 0}>
                  <img
                    ref={imgRef}
                    src={rotatedImageData ? rotatedImageData.dataURL : documentData}
                    alt="Düzenlenecek resim"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      transform: `rotate(${rotate}deg)`,
                      transition: 'transform 0.2s ease',
                      opacity: !isRotateApplied && rotate !== 0 ? 0.7 : 1,
                    }}
                  />
                </ReactCrop>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={hideEditModal} color="secondary">
              İptal
            </Button>
            {!isRotateApplied && rotate !== 0 ? (
              <Button onClick={handleApplyRotation} color="warning" variant="contained">
                Döndürmeyi Kaydet
              </Button>
            ) : (
              <Button
                onClick={handleSaveEdit}
                color="primary"
                variant="contained"
                disabled={!isRotateApplied && rotate !== 0}>
                {completedCrop && completedCrop.width > 0 && completedCrop.height > 0
                  ? 'Kırpmayı Kaydet'
                  : isRotateApplied
                    ? 'Değişikliği Kaydet'
                    : 'Kaydet'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
