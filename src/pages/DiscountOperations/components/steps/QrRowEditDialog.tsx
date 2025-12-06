import { Dropzone, Form, useNotice } from '@components';
import { Close as CloseIcon, RotateLeft as RotateLeftIcon, RotateRight as RotateRightIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useExtractPdfPageMutation } from '../../discount-operations.api';
import { extractPdfPageAsImage, isPdfFile } from '../../helpers';
import { useSingleChequeForm } from '../../hooks';
import { BillReferenceEndorsersInput } from './BillReferenceEndorsersInput';
import { BillReferenceEndorser, SINGLE_CHEQUE_INITIAL_VALUES, SingleChequeFormData } from './single-cheque-form.types';

// File type constants
const CHEQUE_IMAGE_TYPES = ['png', 'jpeg', 'jpg', 'pdf'];
const INVOICE_FILE_TYPES = ['png', 'jpeg', 'jpg', 'pdf', 'xml'];
const CHEQUE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,application/pdf';
const INVOICE_FILE_ACCEPT = 'image/png,image/jpeg,image/jpg,application/pdf,application/xml,text/xml';

interface QrResult {
  BillNo: string;
  AccountNo: string;
  BankName: string;
  BankBranchName: string;
  BankBranchCode: string;
  BankCode: string;
  DrawerName: string;
  DrawerIdentifier: string;
  MersisNo?: string;
  BarcodeText?: string;
  ErrorMessage: string | null;
  ImageIndex: number;
  // Additional editable fields
  drawerName?: string;
  drawerIdentifier?: string;
  placeOfIssue?: string;
  billNo?: string;
  accountNo?: string;
  bankName?: string;
  bankBranchName?: string;
  payableAmount?: number;
  paymentDueDate?: dayjs.Dayjs | string;
  // Row-specific document uploads
  frontImage?: File | null;
  backImage?: File | null;
  invoiceFile?: File | null;
  // Endorser information
  referenceEndorserName?: string;
  referenceEndorserIdentifier?: string;
  endorserName?: string;
  endorserIdentifier?: string;
  billReferenceEndorsers?: BillReferenceEndorser[];
}

interface QrRowEditDialogProps {
  open: boolean;
  onClose: () => void;
  row: QrResult | null;
  onSave: (updatedRow: QrResult) => void;
  pdfFile?: File | null;
}

/**
 * QR Row Edit Dialog Component
 * Based on SingleChequeForm structure for editing table rows
 */
export const QrRowEditDialog: React.FC<QrRowEditDialogProps> = ({ open, onClose, row, onSave, pdfFile }) => {
  const notice = useNotice();

  // PDF extraction state and mutation
  const [extractPdfPage] = useExtractPdfPageMutation();
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [extractedPdfImage, setExtractedPdfImage] = useState<File | null>(null);

  // Image editing states
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingImageData, setEditingImageData] = useState<string | null>(null);
  const [editingImageType, setEditingImageType] = useState<
    'frontImageFile' | 'backImageFile' | 'invoiceFile' | 'extractedPdfImage' | null
  >(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [rotate, setRotate] = useState(0);
  const [isRotateApplied, setIsRotateApplied] = useState(false);
  const [rotatedImageData, setRotatedImageData] = useState<{
    blob: Blob;
    dataURL: string;
    base64: string;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Form setup with dynamic dropdown data - following OperationPricing patterns
  const { form, schema, setFormValue, dropdownData } = useSingleChequeForm();

  // Image editing functions (following SingleChequeForm pattern)
  const handleEditImage = (file: File) => {
    // Hangi resim türünün düzenlendiğini belirle
    const frontImage = form.watch('frontImageFile');
    const backImage = form.watch('backImageFile');
    const invoiceImage = form.watch('invoiceFile');

    let imageType: 'frontImageFile' | 'backImageFile' | 'invoiceFile' | 'extractedPdfImage' | null = null;

    // Check if this is the extracted PDF image
    if (extractedPdfImage && file.name === extractedPdfImage.name && file.size === extractedPdfImage.size) {
      imageType = 'extractedPdfImage';
    } else if (frontImage && frontImage.name === file.name && frontImage.size === file.size) {
      imageType = 'frontImageFile';
    } else if (backImage && backImage.name === file.name && backImage.size === file.size) {
      imageType = 'backImageFile';
    } else if (invoiceImage && invoiceImage.name === file.name && invoiceImage.size === file.size) {
      imageType = 'invoiceFile';
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEditingImageFile(file);
        setEditingImageData(e.target.result as string);
        setEditingImageType(imageType);
        setShowImageEditModal(true);
        setCrop(undefined);
        setCompletedCrop(null);
        setRotate(0);
        setIsRotateApplied(false);
        setRotatedImageData(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const hideEditModal = () => {
    setCrop(undefined);
    setCompletedCrop(null);
    setRotate(0);
    setIsRotateApplied(false);
    setRotatedImageData(null);
    setShowImageEditModal(false);
    setEditingImageFile(null);
    setEditingImageData(null);
    setEditingImageType(null);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop, rotation = 0) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return Promise.reject(new Error('Canvas context not available'));

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

    if (!ctx) return Promise.reject(new Error('Canvas context not available'));

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
    if (!imgRef.current || !editingImageFile || !editingImageType) {
      notice({
        variant: 'warning',
        message: 'Resim yüklenemedi.',
      });
      return;
    }

    if (rotate !== 0 && !isRotateApplied) {
      notice({
        variant: 'warning',
        message: 'Önce döndürme işlemini kaydedin, sonra kırpma yapabilirsiniz.',
      });
      return;
    }

    try {
      let processedImageBlob;

      // Only perform cropping operation
      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
        processedImageBlob = await getCroppedImg(imgRef.current, completedCrop, 0);
      } else if (isRotateApplied && rotatedImageData) {
        // Only rotation was done, no cropping
        processedImageBlob = rotatedImageData.blob;
      } else {
        notice({
          variant: 'warning',
          message: 'Kırpmak için fare ile istediğiniz alanı seçin veya döndürme işlemi yapın.',
        });
        return;
      }

      if (processedImageBlob) {
        // Create new File from processed blob
        const processedFile = new File([processedImageBlob], editingImageFile.name, { type: editingImageFile.type });

        // Update the correct form field or extracted image based on image type
        if (editingImageType === 'extractedPdfImage') {
          // Update the extracted PDF image
          setExtractedPdfImage(processedFile);
          // Also set it as the front image
          setFormValue('frontImageFile', processedFile);
        } else {
          setFormValue(editingImageType, processedFile);
        }

        notice({
          variant: 'success',
          message: 'Resim başarıyla düzenlendi.',
        });

        hideEditModal();
      }
    } catch (error) {
      console.error('Image processing error:', error);
      notice({
        variant: 'error',
        message: 'Resim işlenirken hata oluştu.',
      });
    }
  };

  // Function to extract PDF page as image - matches legacy loadFrontImage functionality
  const handleExtractPdfPage = useCallback(async () => {
    if (!pdfFile || !isPdfFile(pdfFile) || !row || typeof row.ImageIndex !== 'number') {
      return;
    }

    try {
      setIsExtractingPdf(true);

      // Extract the PDF page as image using the helper function
      const imageDataUrl = await extractPdfPageAsImage(pdfFile, row.ImageIndex, extractPdfPage);

      if (imageDataUrl) {
        // Convert the data URL back to a File and set it as front image
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        const extractedFile = new File([blob], `extracted_page_${row.ImageIndex + 1}.jpg`, { type: 'image/jpeg' });

        // Set the extracted image to separate state (will be shown separately)
        setExtractedPdfImage(extractedFile);
      } else {
        throw new Error('PDF sayfa çıkarma başarısız');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'PDF sayfası çıkarılırken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setIsExtractingPdf(false);
    }
  }, [pdfFile, row, extractPdfPage, notice]);

  // Track if form has been initialized to prevent infinite re-initialization
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [pendingBranchCode, setPendingBranchCode] = useState<string | null>(null);

  // Load row data into form when dialog opens
  useEffect(() => {
    if (open && row && !dropdownData.isLoading && !isFormInitialized) {
      // Find bank ID from dropdown data using BankCode
      const matchingBank = dropdownData.banksOptions.find((bank) => bank.code === row.BankCode);
      const bankId = matchingBank ? matchingBank.id : row.BankCode ? Number(row.BankCode) : 0;

      // Find branch ID from dropdown data using BankBranchCode
      const matchingBranch = dropdownData.branchesOptions.find((branch) => branch.code === row.BankBranchCode);
      const branchId = matchingBranch ? matchingBranch.id : row.BankBranchCode ? Number(row.BankBranchCode) : 0;

      // Map QrResult data to form data structure
      const formData: Partial<SingleChequeFormData> = {
        drawerName: row.drawerName || row.DrawerName || '',
        drawerIdentifier: row.drawerIdentifier || row.DrawerIdentifier || '',
        placeOfIssue: row.placeOfIssue || '',
        bankEftCode: bankId,
        bankBranchEftCode: 0, // Will be set later when branches are loaded
        no: row.billNo || row.BillNo || '',
        billPaymentType: 1, // Default value
        chequeAccountNo: row.accountNo || row.AccountNo || '',
        payableAmount: row.payableAmount || 0,
        paymentDueDate: row.paymentDueDate
          ? typeof row.paymentDueDate === 'string'
            ? row.paymentDueDate
            : dayjs(row.paymentDueDate).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
        referenceEndorserName: row.referenceEndorserName || '',
        referenceEndorserIdentifier: row.referenceEndorserIdentifier || '',
        endorserName: row.endorserName || '',
        endorserIdentifier: row.endorserIdentifier || '',
        payableAmountCurrency: 'TRY',
        type: 1,
        frontImageFile: row.frontImage || null,
        backImageFile: row.backImage || null,
        invoiceFile: row.invoiceFile || null,
        billReferenceEndorsers: row.billReferenceEndorsers || [{ id: '1', endorserName: '', endorserIdentifier: '' }],
      };

      console.log('Loading form data:', {
        bankCode: row.BankCode,
        branchCode: row.BankBranchCode,
        matchingBank,
        matchingBranch,
        selectedBankId: bankId,
        selectedBranchId: branchId,
      });

      // Set form values
      Object.entries(formData).forEach(([key, value]) => {
        setFormValue(key, value);
      });

      // Set existing files to form fields
      if (row.frontImage) {
        setFormValue('frontImageFile', row.frontImage);
      }
      if (row.backImage) {
        setFormValue('backImageFile', row.backImage);
      }
      if (row.invoiceFile) {
        setFormValue('invoiceFile', row.invoiceFile);
      }

      // Store branch code to set later when branches are loaded
      if (row.BankBranchCode) {
        setPendingBranchCode(row.BankBranchCode);
      }

      // Mark form as initialized
      setIsFormInitialized(true);

      // Auto-extract PDF page if pdfFile is provided and no front image exists and no extraction already done
      if (
        pdfFile &&
        isPdfFile(pdfFile) &&
        !row.frontImage &&
        !extractedPdfImage &&
        typeof row.ImageIndex === 'number'
      ) {
        handleExtractPdfPage();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row, setFormValue, pdfFile, dropdownData.isLoading, isFormInitialized]);

  // Set branch when branches are loaded and we have a pending branch code
  useEffect(() => {
    if (pendingBranchCode && dropdownData.branchesOptions.length > 0 && !dropdownData.branchesLoading) {
      const matchingBranch = dropdownData.branchesOptions.find((branch) => branch.code === pendingBranchCode);
      const branchId = matchingBranch ? matchingBranch.id : 0;

      console.log('Setting branch after branches loaded:', {
        pendingBranchCode,
        matchingBranch,
        branchId,
        availableBranches: dropdownData.branchesOptions.length,
      });

      if (branchId > 0) {
        setFormValue('bankBranchEftCode', branchId);
        setPendingBranchCode(null); // Clear pending branch code
      }
    }
  }, [pendingBranchCode, dropdownData.branchesOptions, dropdownData.branchesLoading, setFormValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(SINGLE_CHEQUE_INITIAL_VALUES);
      setExtractedPdfImage(null);
      setIsFormInitialized(false);
      setPendingBranchCode(null);
    }
  }, [open, form]);

  // Handle form submission
  const handleSubmit = async (formData: SingleChequeFormData) => {
    if (!row) return;

    try {
      // Find bank and branch information from dropdown data
      const selectedBank = dropdownData.banksOptions.find((bank) => bank.id === formData.bankEftCode);
      const selectedBranch = dropdownData.branchesOptions.find((branch) => branch.id === formData.bankBranchEftCode);
      // Map form data back to QrResult structure
      const updatedRow: QrResult = {
        ...row,
        drawerName: formData.drawerName || undefined,
        drawerIdentifier: formData.drawerIdentifier,
        placeOfIssue: formData.placeOfIssue,
        billNo: formData.no,
        accountNo: formData.chequeAccountNo,
        payableAmount: formData.payableAmount,
        paymentDueDate: formData.paymentDueDate,
        referenceEndorserName: formData.referenceEndorserName || undefined,
        referenceEndorserIdentifier: formData.referenceEndorserIdentifier || undefined,
        endorserName: formData.endorserName || undefined,
        endorserIdentifier: formData.endorserIdentifier || undefined,
        billReferenceEndorsers: formData.billReferenceEndorsers || [],
        frontImage: formData.frontImageFile,
        backImage: formData.backImageFile,
        invoiceFile: formData.invoiceFile,
        // Update bank information with selected values
        BankName: selectedBank?.name.split(' (')[0] || row.BankName,
        BankCode: selectedBank?.code || row.BankCode,
        BankBranchName: selectedBranch?.name.split(' (')[0] || row.BankBranchName,
        BankBranchCode: selectedBranch?.code || row.BankBranchCode,
        // Also update the editable field versions
        bankName: selectedBank?.name.split(' (')[0] || row.BankName,
        bankBranchName: selectedBranch?.name.split(' (')[0] || row.BankBranchName,
      };

      onSave(updatedRow);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çek bilgileri güncellendi',
        buttonTitle: 'Tamam',
      });

      onClose();
    } catch (error) {
      console.error('Error updating row:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Güncelleme sırasında bir hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  // Watch frontImageFile to conditionally show extractedPdfImage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frontImageFile = (form.watch as any)('frontImageFile');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Çek Bilgilerini Düzenle </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} sx={{ mt: 2 }}>
          {/* Show loading while dropdown data is being fetched */}
          {dropdownData.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Dropdown verileri yükleniyor...</Typography>
            </Box>
          ) : (
            <>
              {/* Form Fields */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form as any} schema={schema as any} space={3} />

              {/* Bill Reference Endorsers Section */}
              <Box sx={{ mb: 3 }}>
                <BillReferenceEndorsersInput
                  endorsers={form.watch('billReferenceEndorsers') || []}
                  onChange={(endorsers) => {
                    form.setValue('billReferenceEndorsers', endorsers);
                  }}
                  disabled={false}
                  error={form.formState.errors.billReferenceEndorsers?.message}
                />
              </Box>

              {/* File Upload Section */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" gutterBottom>
                Çek Görseli / Belgeleri
              </Typography>

              <Grid container spacing={2}>
                {/* Front Image Upload */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Çek Ön Yüz Görseli
                  </Typography>
                  <Dropzone
                    name="frontImageFile"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form={form as any}
                    accept={CHEQUE_IMAGE_ACCEPT}
                    multiple={false}
                    loading={false}
                    supportedFormat={CHEQUE_IMAGE_TYPES}
                    canEdit={true}
                    onEdit={handleEditImage}
                  />
                  {pdfFile && isPdfFile(pdfFile) && !extractedPdfImage && (
                    <Box mt={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleExtractPdfPage}
                        disabled={isExtractingPdf}
                        startIcon={isExtractingPdf ? <CircularProgress size={16} /> : undefined}>
                        {isExtractingPdf ? "PDF'den Çıkarılıyor..." : "PDF'den Sayfa Çıkar"}
                      </Button>
                    </Box>
                  )}

                  {/* Show extracted PDF image separately (non-deletable) only if no frontImageFile */}
                  {extractedPdfImage && !frontImageFile && (
                    <Paper
                      sx={{
                        p: 2,
                        mt: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        backgroundColor: 'primary.50',
                      }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2" color="primary.main">
                          PDF&apos;den Çıkarılan Görsel (Otomatik)
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditImage(extractedPdfImage)}
                          sx={{ minWidth: 'auto', px: 1 }}>
                          Düzenle
                        </Button>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <img
                          src={URL.createObjectURL(extractedPdfImage)}
                          alt="PDF'den çıkarılan görsel"
                          style={{ maxWidth: '100%', maxHeight: '200px', cursor: 'pointer' }}
                          onClick={() => handleEditImage(extractedPdfImage)}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {extractedPdfImage.name} ({(extractedPdfImage.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Paper>
                  )}

                  {/* Regular Dropzone for manual uploads (only show if no extracted PDF image) */}
                </Grid>

                {/* Back Image Upload */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Çek Arka Yüz Görseli
                  </Typography>
                  <Dropzone
                    name="backImageFile"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form={form as any}
                    accept={CHEQUE_IMAGE_ACCEPT}
                    multiple={false}
                    loading={false}
                    supportedFormat={CHEQUE_IMAGE_TYPES}
                    canEdit={true}
                    onEdit={handleEditImage}
                  />
                </Grid>

                {/* Invoice File Upload */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Fatura Dosyası
                  </Typography>
                  <Dropzone
                    name="invoiceFile"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form={form as any}
                    accept={INVOICE_FILE_ACCEPT}
                    multiple={false}
                    loading={false}
                    supportedFormat={INVOICE_FILE_TYPES}
                    canEdit={true}
                    onEdit={handleEditImage}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          İptal
        </Button>
        <Button onClick={form.handleSubmit(handleSubmit)} variant="contained" color="primary">
          Kaydet
        </Button>
      </DialogActions>

      {/* Image Edit Modal */}
      <Dialog open={showImageEditModal} onClose={hideEditModal} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="span">
            Resim Düzenle
          </Typography>
          <IconButton
            onClick={hideEditModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingImageData && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {/* Rotation Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handleRotateLeft} size="small">
                    <RotateLeftIcon />
                  </IconButton>
                  <Slider
                    value={rotate}
                    min={-180}
                    max={180}
                    step={1}
                    onChange={handleSliderChange}
                    sx={{ width: 120 }}
                    size="small"
                  />
                  <IconButton onClick={handleRotateRight} size="small">
                    <RotateRightIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {rotate}°
                  </Typography>
                </Box>

                {/* Apply Rotation Button */}
                {rotate !== 0 && (
                  <Button variant="outlined" size="small" onClick={handleApplyRotation}>
                    Döndürmeyi Uygula
                  </Button>
                )}
              </Box>

              {/* React Crop Component */}
              <Box sx={{ maxWidth: '100%', maxHeight: '500px', overflow: 'auto', textAlign: 'center' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={undefined}
                  minWidth={50}
                  minHeight={50}>
                  <img
                    ref={imgRef}
                    alt="Crop"
                    src={isRotateApplied && rotatedImageData ? rotatedImageData.dataURL : editingImageData}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      transform: isRotateApplied ? 'none' : `rotate(${rotate}deg)`,
                    }}
                  />
                </ReactCrop>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button onClick={hideEditModal} color="inherit">
                  İptal
                </Button>
                <Button onClick={handleSaveEdit} variant="contained" color="primary">
                  Kaydet
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
