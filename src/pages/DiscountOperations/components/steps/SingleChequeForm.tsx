import { Dropzone, FigoLoading, Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
  Typography,
} from '@mui/material';
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  useLazyGetBankBranchesQuery,
  useLazyGetCitiesQuery,
  useReadQrCodesFromFilesMutation,
  useUploadSingleBillMutation,
} from '../../discount-operations.api';
import { useSingleChequeForm } from '../../hooks';
import { BillReferenceEndorsersInput } from './BillReferenceEndorsersInput';
import { ChequeDocument, SINGLE_CHEQUE_INITIAL_VALUES, SingleChequeUploadRequest } from './single-cheque-form.types';

// Document types based on legacy ChequeForm.js
enum DocumentType {
  FRONT_IMAGE = 1,
  BACK_IMAGE = 2,
  INVOICE_FILE = 3,
}

// File type constants
const CHEQUE_IMAGE_TYPES = ['png', 'jpeg', 'jpg', 'pdf'];
const INVOICE_FILE_TYPES = ['png', 'jpeg', 'jpg', 'pdf', 'xml'];
const CHEQUE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,application/pdf';
const INVOICE_FILE_ACCEPT = 'image/png,image/jpeg,image/jpg,application/pdf,application/xml,text/xml';

export interface SingleChequeFormMethods {
  submit: () => void;
  clear: () => void;
}

interface SingleChequeFormProps {
  onSuccess?: () => void;
  companyId?: number;
}

/**
 * Single Check Upload Form Component
 * Following OperationPricing patterns with Form component integration
 * Based on legacy ChequeForm.js structure
 *
 * Features:
 * - Image editing with ReactCrop (rotation, cropping)
 * - Automatic QR code reading from front image
 * - Image previews with edit/remove functionality
 * - File upload for front/back images and invoice files
 * - Form validation and submission
 */
const SingleChequeFormComponent = (
  { onSuccess, companyId }: SingleChequeFormProps,
  ref: Ref<SingleChequeFormMethods>,
) => {
  const notice = useNotice();
  const [uploadSingleBill, { isLoading: isUploading, error }] = useUploadSingleBillMutation();
  const [readQrCodesFromFiles, { isLoading: isReadingQr }] = useReadQrCodesFromFilesMutation();
  const [isProcessingQr, setIsProcessingQr] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(new Set<string>());
  const lastProcessedFile = useRef<string | null>(null);

  useErrorListener(error);

  // Image editing states
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingImageData, setEditingImageData] = useState<string | null>(null);
  const [editingImageType, setEditingImageType] = useState<'frontImageFile' | 'backImageFile' | 'invoiceFile' | null>(
    null,
  );
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

  // Combined loading state - Dropzone loading için QR okuma ve form submit işlemleri
  const isLoading = isReadingQr || isProcessingQr || isUploading;

  // Form setup with dynamic dropdown data - following OperationPricing patterns
  const { form, schema, setFormValue, dropdownData } = useSingleChequeForm();

  // Expose submit method to parent via ref
  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit(handleSubmit)();
    },
    clear: () => {
      form.reset(SINGLE_CHEQUE_INITIAL_VALUES);
      setProcessedFiles(new Set());
      lastProcessedFile.current = null;
    },
  }));

  // Lazy query for getting bank branches when QR code is read
  const [getBankBranches] = useLazyGetBankBranchesQuery();

  // Lazy query for getting cities when QR code is read
  const [getCities] = useLazyGetCitiesQuery();

  // Helper function to get city name from BankBranchName - Following legacy pattern
  const getCityNameFromBankBranch = useCallback(
    async (bankBranchName: string): Promise<string | null> => {
      try {
        if (!bankBranchName) return null;

        // Get cities from API
        const citiesResponse = await getCities().unwrap();
        if (!citiesResponse) return null;

        // BankBranchName'i direkt şehir listesi ile eşleştir
        // Önce "/"  ile bölünmüş veri varsa son kısmı al, yoksa tamamını kullan
        let cityNameFromBranch = bankBranchName.trim();

        // Eğer "/" içeriyorsa son kısmı al
        if (bankBranchName.includes('/')) {
          const parts = bankBranchName.split('/');
          cityNameFromBranch = parts[parts.length - 1].trim();
        }

        // Find matching city in the cities response
        // Türkçe karakterleri normalize etmek için helper function
        const normalizeString = (str: string) => {
          if (!str) return '';
          return str
            .toUpperCase()
            .replace(/İ/g, 'I')
            .replace(/I/g, 'I')
            .replace(/Ş/g, 'S')
            .replace(/Ğ/g, 'G')
            .replace(/Ü/g, 'U')
            .replace(/Ö/g, 'O')
            .replace(/Ç/g, 'C')
            .trim();
        };

        const matchingCity = citiesResponse.find((city) => {
          if (!city.Name) return false;

          const normalizedCityName = normalizeString(city.Name);
          const normalizedSearchName = normalizeString(cityNameFromBranch);

          return normalizedCityName === normalizedSearchName;
        });

        return matchingCity ? matchingCity.Name : null;
      } catch (error) {
        console.error('Error fetching cities:', error);
        return null;
      }
    },
    [getCities],
  );

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data:image/png;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert files to ChequeDocument format
  const convertFilesToDocuments = async (files: File[], documentType: DocumentType): Promise<ChequeDocument[]> => {
    const documents: ChequeDocument[] = [];

    for (const file of files) {
      try {
        const base64Data = await convertToBase64(file);
        documents.push({
          name: file.name,
          type: file.type.split('/')[1] || 'jpg',
          data: base64Data,
          documentType: documentType,
        });
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }

    return documents;
  };

  // Convert all form files to documents
  const convertAllFilesToDocuments = async (formData: Record<string, unknown>): Promise<ChequeDocument[]> => {
    const allDocuments: ChequeDocument[] = [];

    // Front image file
    if (formData.frontImageFile) {
      const frontDocs = await convertFilesToDocuments([formData.frontImageFile as File], DocumentType.FRONT_IMAGE);
      allDocuments.push(...frontDocs);
    }

    // Back image file
    if (formData.backImageFile) {
      const backDocs = await convertFilesToDocuments([formData.backImageFile as File], DocumentType.BACK_IMAGE);
      allDocuments.push(...backDocs);
    }

    // Invoice file
    if (formData.invoiceFile) {
      const invoiceDocs = await convertFilesToDocuments([formData.invoiceFile as File], DocumentType.INVOICE_FILE);
      allDocuments.push(...invoiceDocs);
    }

    return allDocuments;
  };

  // Handle QR code reading from uploaded front image
  const handleQrCodeReading = useCallback(
    async (file: File) => {
      if (!file || isProcessingQr) return;

      // Dosya signature oluştur (name + size + lastModified)
      const fileSignature = `${file.name}-${file.size}-${file.lastModified}`;

      // Bu dosya daha önce işlendiyse tekrar işleme
      if (processedFiles.has(fileSignature)) {
        return;
      }

      try {
        setIsProcessingQr(true);

        // İşlenen dosyalar listesine ekle
        setProcessedFiles((prev) => new Set(prev).add(fileSignature));

        const base64Data = await convertToBase64(file);

        const response = await readQrCodesFromFiles({
          IsMultiple: false,
          IncludeBarcodeTexts: false,
          Files: [
            {
              FileName: file.name,
              Base64File: base64Data,
            },
          ],
        }).unwrap();

        if (response.IsSuccess && response.FileResults && response.FileResults.length > 0) {
          const fileResult = response.FileResults[0];

          if (fileResult.BillDetails && fileResult.BillDetails.length > 0) {
            const billDetail = fileResult.BillDetails[0];

            // Form alanlarını QR kod verisiyle doldur - Clean the data following legacy pattern
            if (billDetail.BillNo) {
              // Başındaki sıfırları ve ara boşlukları temizle, son 7 hanesi al
              const cleanedBillNo = billDetail.BillNo.replace(/\s/g, '').replace(/^0+/, '') || '0';
              const last7Digits = cleanedBillNo.slice(-7);
              setFormValue('no', last7Digits);
            }

            if (billDetail.AccountNo) {
              // Başındaki sıfırları ve ara boşlukları temizle
              const cleanedAccountNo = billDetail.AccountNo.replace(/\s/g, '').replace(/^0+/, '') || '0';
              setFormValue('chequeAccountNo', cleanedAccountNo);
            }

            // Banka bilgilerini bul ve set et - Following legacy pattern
            if (billDetail.BankCode && dropdownData.banksOptions.length > 0) {
              const matchingBank = dropdownData.banksOptions.find((bank) => bank.code === billDetail.BankCode);

              if (matchingBank) {
                setFormValue('bankEftCode', matchingBank.id);

                // Şube bilgilerini yükle ve set et
                if (billDetail.BankBranchCode) {
                  try {
                    // Use the getBankBranches query to fetch branches for the matching bank
                    const branchesResponse = await getBankBranches({
                      BankId: matchingBank.id,
                      pageSize: 99999,
                    }).unwrap();

                    if (branchesResponse?.Items) {
                      const matchingBranch = branchesResponse.Items.find(
                        (branch) => branch.Code === billDetail.BankBranchCode,
                      );

                      if (matchingBranch) {
                        setFormValue('bankBranchEftCode', matchingBranch.Id);
                      }
                    }
                  } catch (branchError) {
                    console.error('Şube bilgileri yüklenirken hata:', branchError);
                  }
                }
              }
            }

            if (billDetail.DrawerName) {
              setFormValue('drawerName', billDetail.DrawerName);
            }

            if (billDetail.DrawerIdentifier) {
              setFormValue('drawerIdentifier', billDetail.DrawerIdentifier);
            }

            // BankBranchName'den şehir bilgisini çıkart ve placeOfIssue'ya set et
            if (billDetail.BankBranchName) {
              try {
                const cityName = await getCityNameFromBankBranch(billDetail.BankBranchName);
                if (cityName) {
                  setFormValue('placeOfIssue', cityName);
                }
              } catch (error) {
                console.error('Şehir bilgisi eşleştirme hatası:', error);
              }
            }

            notice({
              variant: 'success',
              title: 'QR Kod Okundu',
              message: 'Çek bilgileri QR koddan başarıyla okundu ve forma dolduruldu.',
              buttonTitle: 'Tamam',
            });
          }
        } else if (response.ErrorMessage) {
          notice({
            variant: 'warning',
            title: 'QR Kod Okunamadı',
            message: response.ErrorMessage || 'QR kod okunamadı.',
            buttonTitle: 'Tamam',
          });
        }
      } catch (error) {
        console.error('QR kod okuma hatası:', error);
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'QR kod okuma sırasında bir hata oluştu.',
          buttonTitle: 'Tamam',
        });
      } finally {
        setIsProcessingQr(false);
      }
    },
    [
      readQrCodesFromFiles,
      notice,
      processedFiles,
      setProcessedFiles,
      isProcessingQr,
      setFormValue,
      dropdownData.banksOptions,
      getBankBranches,
      getCityNameFromBankBranch,
    ],
  );

  // Watch for front image file changes to trigger QR reading
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frontImageFile = form.watch('frontImageFile' as any);

  useEffect(() => {
    if (!frontImageFile || isProcessingQr) return;

    // Dosya signature oluştur
    const fileSignature = `${frontImageFile.name}-${frontImageFile.size}-${frontImageFile.lastModified}`;

    // Aynı dosya son işlenen dosya ise veya daha önce işlendiyse skip et
    if (lastProcessedFile.current === fileSignature || processedFiles.has(fileSignature)) {
      return;
    }

    // Son işlenen dosyayı güncelle
    lastProcessedFile.current = fileSignature;

    handleQrCodeReading(frontImageFile as File);
  }, [frontImageFile, handleQrCodeReading, isProcessingQr, processedFiles]);

  // Image editing functions (following CheckDetailPage pattern)
  const handleEditImage = (file: File) => {
    try {
      // Validate file first
      if (!file || file.size === 0) {
        notice({
          variant: 'error',
          message: 'Geçersiz dosya seçildi.',
        });
        return;
      }

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        notice({
          variant: 'error',
          message: 'Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.',
        });
        return;
      }

      console.log('Starting image edit for file:', file.name, 'size:', file.size);

      // Hangi resim türünün düzenlendiğini belirle
      const frontImage = form.watch('frontImageFile');
      const backImage = form.watch('backImageFile');
      const invoiceImage = form.watch('invoiceFile');

      let imageType: 'frontImageFile' | 'backImageFile' | 'invoiceFile' | null = null;

      if (frontImage && frontImage.name === file.name && frontImage.size === file.size) {
        imageType = 'frontImageFile';
      } else if (backImage && backImage.name === file.name && backImage.size === file.size) {
        imageType = 'backImageFile';
      } else if (invoiceImage && invoiceImage.name === file.name && invoiceImage.size === file.size) {
        imageType = 'invoiceFile';
      }

      if (!imageType) {
        console.error('Could not determine image type for file:', file.name);
        notice({
          variant: 'error',
          message: 'Dosya türü belirlenemedi.',
        });
        return;
      }

      console.log('Image type determined:', imageType);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (e.target?.result) {
            console.log('File read successfully, opening edit modal');
            setEditingImageFile(file);
            setEditingImageData(e.target.result as string);
            setEditingImageType(imageType);
            setShowImageEditModal(true);
            setCrop(undefined);
            setCompletedCrop(null);
            setRotate(0);
            setIsRotateApplied(false);
            setRotatedImageData(null);
          } else {
            throw new Error('FileReader result is empty');
          }
        } catch (error) {
          console.error('Error in FileReader onload:', error);
          notice({
            variant: 'error',
            message: 'Dosya okuma hatası oluştu.',
          });
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        notice({
          variant: 'error',
          message: 'Dosya okunamadı.',
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleEditImage:', error);
      notice({
        variant: 'error',
        message: 'Resim düzenleme başlatılamadı.',
      });
    }
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
    return new Promise<Blob>((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        if (!image.complete || image.naturalWidth === 0) {
          reject(new Error('Image not fully loaded'));
          return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Validation for crop dimensions
        if (crop.width <= 0 || crop.height <= 0) {
          reject(new Error('Invalid crop dimensions'));
          return;
        }

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
      } catch (error) {
        reject(new Error(`Crop operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  };

  const getRotatedImg = (image: HTMLImageElement, rotation = 0) => {
    return new Promise<Blob>((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        if (!image.complete || image.naturalWidth === 0) {
          reject(new Error('Image not fully loaded'));
          return;
        }

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

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const rotatedData = {
                    blob: blob,
                    dataURL: reader.result as string,
                    base64: (reader.result as string).split(',')[1],
                  };
                  setRotatedImageData(rotatedData);
                  resolve(blob);
                } catch (readerError) {
                  reject(
                    new Error(
                      `FileReader error: ${readerError instanceof Error ? readerError.message : 'Unknown error'}`,
                    ),
                  );
                }
              };
              reader.onerror = () => reject(new Error('FileReader failed'));
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Canvas to blob conversion failed'));
            }
          },
          'image/jpeg',
          0.9,
        );
      } catch (error) {
        reject(new Error(`Rotation operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
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
        console.log('Processing cropped image for:', editingImageType);
        processedImageBlob = await getCroppedImg(imgRef.current, completedCrop, 0);
      } else if (isRotateApplied && rotatedImageData) {
        // Only rotation was done, no cropping
        console.log('Using rotated image for:', editingImageType);
        processedImageBlob = rotatedImageData.blob;
      } else {
        notice({
          variant: 'warning',
          message: 'Kırpmak için fare ile istediğiniz alanı seçin veya döndürme işlemi yapın.',
        });
        return;
      }

      if (processedImageBlob) {
        try {
          console.log('Creating processed file for:', editingImageType);
          // Create new File from processed blob
          const processedFile = new File([processedImageBlob], editingImageFile.name, {
            type: editingImageFile.type || 'image/jpeg',
          });

          console.log('Updating form field:', editingImageType, 'with file:', processedFile.name);
          // Update the correct form field based on image type
          setFormValue(editingImageType, processedFile);

          // Run QR code reading only for front image
          if (editingImageType === 'frontImageFile') {
            console.log('Starting QR code reading for front image');
            await handleQrCodeReading(processedFile);
            notice({
              variant: 'success',
              message: 'Ön yüz resmi başarıyla düzenlendi ve QR kod okundu.',
            });
          } else {
            console.log('Back/invoice image updated successfully:', editingImageType);
            notice({
              variant: 'success',
              message: 'Resim başarıyla düzenlendi.',
            });
          }

          hideEditModal();
        } catch (fileError) {
          console.error('File processing error for', editingImageType, ':', fileError);
          notice({
            variant: 'error',
            message: `Dosya işleme hatası: ${fileError instanceof Error ? fileError.message : 'Bilinmeyen hata'}`,
          });
        }
      }
    } catch (error) {
      console.error('Image processing error for', editingImageType, ':', error);
      notice({
        variant: 'error',
        message: `Resim işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
      });
    }
  };

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      // Transform form data to API request format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = formData as any;

      // Find bank and branch codes from dropdown data
      const selectedBank = dropdownData.banksOptions.find((bank) => bank.id === data.bankEftCode);
      const selectedBranch = dropdownData.branchesOptions.find((branch) => branch.id === data.bankBranchEftCode);

      const billData: SingleChequeUploadRequest = {
        drawerName: data.drawerName as string | null,
        drawerIdentifier: data.drawerIdentifier as string,
        placeOfIssue: data.placeOfIssue as string,
        bankEftCode: selectedBank?.code || '',
        bankBranchEftCode: selectedBranch?.code || '',
        no: data.no as string,
        billPaymentType: (data.billPaymentType as number) || 1,
        chequeAccountNo: data.chequeAccountNo as string,
        payableAmount: (data.payableAmount as number).toString(),
        paymentDueDate: new Date(data.paymentDueDate as string).toISOString().split('T')[0],
        referenceEndorserName: (data.referenceEndorserName as string) || '',
        referenceEndorserIdentifier: (data.referenceEndorserIdentifier as string) || '',
        endorserName: (data.endorserName as string) || '',
        endorserIdentifier: (data.endorserIdentifier as string) || '',
        payableAmountCurrency: (data.payableAmountCurrency as string) || 'TRY',
        type: (data.type as number) || 1,
        companyId: companyId || 0,
        billDocumentList: await convertAllFilesToDocuments(data),
        billReferenceEndorsersList: (data.billReferenceEndorsers || []).filter(
          (endorser: { endorserIdentifier?: string }) =>
            endorser.endorserIdentifier && endorser.endorserIdentifier.trim() !== '',
        ),
        ImageIndex: 0, // Default value for single cheque upload
      };

      await uploadSingleBill({ BillList: [billData] }).unwrap();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çek başarıyla kaydedildi',
        buttonTitle: 'Tamam',
      });

      // Reset form and files
      form.reset(SINGLE_CHEQUE_INITIAL_VALUES);
      setProcessedFiles(new Set()); // İşlenen dosyaları temizle
      lastProcessedFile.current = null; // Son işlenen dosya ref'ini temizle

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log('Error uploading check:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Loading Overlay - QR Reading or Uploading */}
      {isProcessingQr && (
        <FigoLoading background="rgba(255, 255, 255, 0.9)" description="QR kod okunuyor, lütfen bekleyiniz..." />
      )}
      {isUploading && (
        <FigoLoading background="rgba(255, 255, 255, 0.9)" description="Çek kaydediliyor, lütfen bekleyiniz..." />
      )}

      <Box component="form" onSubmit={form.handleSubmit(handleSubmit)}>
        <Box>
          {/* Unified Form Fields - Single Schema Approach */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Form form={form} schema={schema as any} />
          {/* Bill Reference Endorsers Section */}
          <Box>
            <BillReferenceEndorsersInput
              endorsers={form.watch('billReferenceEndorsers') || []}
              onChange={(endorsers) => {
                form.setValue('billReferenceEndorsers', endorsers);
              }}
              disabled={isLoading}
              error={form.formState.errors.billReferenceEndorsers?.message}
            />
          </Box>
          {/* CheckFileSection - 3 Different Dropzone Upload Areas */}
          <Grid container spacing={1}>
            {/* Çek Ön Yüz Görseli */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Çek Ön Yüz Görseli</Typography>
              <Dropzone
                name="frontImageFile"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form={form as any}
                accept={CHEQUE_IMAGE_ACCEPT}
                multiple={false}
                loading={isLoading}
                supportedFormat={CHEQUE_IMAGE_TYPES}
                canEdit={true}
                onEdit={handleEditImage}
                title="Çek Ön Yüz Görseli"
              />
            </Grid>

            {/* Çek Arka Yüz Görseli */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Çek Arka Yüz Görseli</Typography>
              <Dropzone
                name="backImageFile"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form={form as any}
                accept={CHEQUE_IMAGE_ACCEPT}
                multiple={false}
                loading={isLoading}
                supportedFormat={CHEQUE_IMAGE_TYPES}
                canEdit={true}
                onEdit={handleEditImage}
                title="Çek Arka Yüz Görseli"
              />
            </Grid>

            {/* Çek ile İlgili Fatura Dosyası */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2">Çek ile İlgili Fatura Dosyası</Typography>
              <Dropzone
                name="invoiceFile"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form={form as any}
                accept={INVOICE_FILE_ACCEPT}
                multiple={false}
                loading={isLoading}
                supportedFormat={INVOICE_FILE_TYPES}
                canEdit={false}
                title="Fatura Dosyası"
              />
            </Grid>
          </Grid>{' '}
        </Box>
      </Box>

      {/* Image Edit Modal (following CheckDetailPage pattern) */}
      {showImageEditModal && editingImageData && (
        <Dialog open={showImageEditModal} onClose={hideEditModal} maxWidth="lg" fullWidth>
          <DialogTitle>Resmi Düzenle - {editingImageFile?.name}</DialogTitle>
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
            {editingImageData && (
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
                    src={rotatedImageData ? rotatedImageData.dataURL : editingImageData}
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
    </Box>
  );
};

export const SingleChequeForm = forwardRef(SingleChequeFormComponent);
