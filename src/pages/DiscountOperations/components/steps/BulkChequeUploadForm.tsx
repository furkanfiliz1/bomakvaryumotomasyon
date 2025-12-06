import { Dropzone, FigoLoading, useNotice } from '@components';
import { Box, Grid, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { useLazyGetCitiesQuery, useReadQrCodesFromFilesMutation } from '../../discount-operations.api';
import QrResultsEditableTable, { QrResultsEditableTableMethods } from './QrResultsEditableTable';

export interface BulkChequeUploadFormMethods {
  submit: () => void;
  clear: () => void;
}

interface BulkChequeUploadFormProps {
  companyId?: number;
  onSuccess?: () => void;
}

interface BulkChequeFormData {
  frontImage: File | null;
  backImage: File | null;
  invoiceFile: File | null;
}

// QR Result types based on API response - matching QrResultsEditableTable interface
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
  paymentDueDate?: Dayjs | string;
  // Row-specific document uploads
  frontImage?: File | null;
  backImage?: File | null;
  invoiceFile?: File | null;
}

// File type constants - following legacy patterns
const chequeImageTypes = ['png', 'jpeg', 'jpg', 'pdf'];
const invoiceFileTypes = ['png', 'jpeg', 'jpg', 'pdf', 'xml'];

const BulkChequeUploadFormComponent = (
  { onSuccess }: BulkChequeUploadFormProps,
  ref: Ref<BulkChequeUploadFormMethods>,
) => {
  const notice = useNotice();
  const [qrResults, setQrResults] = useState<QrResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const qrTableRef = useRef<QrResultsEditableTableMethods>(null);

  const [readQrCodes, { isLoading }] = useReadQrCodesFromFilesMutation();
  const [getCities] = useLazyGetCitiesQuery();

  // Helper function to get city name from BankBranchName - matching legacy logic
  const getCityNameFromBankBranch = useCallback(
    async (bankBranchName: string): Promise<string | null> => {
      try {
        if (!bankBranchName) return null;

        // Get cities from API
        const citiesResponse = await getCities();
        if (!citiesResponse.data) return null;

        const cities = citiesResponse.data;

        // BankBranchName'i direkt şehir listesi ile eşleştir
        // Önce "/" ile bölünmüş veri varsa son kısmı al, yoksa tamamını kullan
        let cityNameFromBranch = bankBranchName.trim();

        // Eğer "/" içeriyorsa son kısmı al
        if (bankBranchName.includes('/')) {
          const parts = bankBranchName.split('/');
          cityNameFromBranch = parts[parts.length - 1].trim();
        }

        // Find matching city in the cities response
        // Türkçe karakterleri normalize etmek için helper function
        const normalizeString = (str: string): string => {
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

        const matchingCity = cities.find((city) => {
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

  const form = useForm<BulkChequeFormData>({
    defaultValues: {
      frontImage: null,
      backImage: null,
      invoiceFile: null,
    },
    mode: 'onChange',
  });

  // Expose submit method to parent via ref
  useImperativeHandle(ref, () => ({
    submit: () => {
      // Trigger bulk save from QrResultsEditableTable
      qrTableRef.current?.saveBulkCheques();
    },
    clear: () => {
      // Clear the table data
      qrTableRef.current?.clearTable();
    },
  }));

  // Convert file to base64
  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix to get just the base64 part
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // Handle QR reading when front image is uploaded - Following legacy readQrCodesFromFiles logic
  const handleFrontImageUpload = useCallback(
    async (file: File) => {
      if (!file) {
        setIsProcessing(false);
        return;
      }

      try {
        setIsProcessing(true);

        // Convert to base64
        const base64File = await convertToBase64(file);

        // Call QR reading service with IsMultiple=true for bulk processing
        const response = await readQrCodes({
          IsMultiple: true,
          IncludeBarcodeTexts: true,
          Files: [
            {
              FileName: file.name,
              Base64File: base64File,
            },
          ],
        }).unwrap();

        if (response.IsSuccess) {
          const { TotalBillCount, FileResults } = response;

          if (TotalBillCount === 1) {
            // Tek çek varsa - Could implement form population logic here if needed
            const billDetail = FileResults[0].BillDetails[0];

            if (billDetail) {
              // For single cheque, we still show in table but could populate form
              let placeOfIssue = '';

              // BankBranchName'den şehir bilgisini çıkart
              if (billDetail.BankBranchName) {
                try {
                  const cityName = await getCityNameFromBankBranch(billDetail.BankBranchName);
                  if (cityName) {
                    placeOfIssue = cityName;
                  }
                } catch (error) {
                  console.error('City matching error:', error);
                }
              }

              const processedResult: QrResult = {
                ...billDetail,
                drawerName: billDetail?.DrawerName || '',
                drawerIdentifier: billDetail?.DrawerIdentifier || '',
                billNo: billDetail?.BillNo
                  ? billDetail.BillNo.replace(/\s/g, '').replace(/^0+/, '').slice(-7) || '0'
                  : '',
                accountNo: billDetail?.AccountNo
                  ? billDetail.AccountNo.replace(/\s/g, '').replace(/^0+/, '') || '0'
                  : '',
                bankName: billDetail?.BankName || '',
                bankBranchName: billDetail?.BankBranchName || '',
                payableAmount: undefined, // Default value, can be edited by user
                paymentDueDate: '', // Default value, can be edited by user
                placeOfIssue: placeOfIssue,
                // Don't attach the uploaded file - let each row handle its own frontImage
              };

              setQrResults([processedResult]);

              notice({
                variant: 'success',
                title: 'QR Kod Okundu',
                message: 'QR kod bilgileri başarıyla okundu.',
              });
            }
          } else if (TotalBillCount > 1) {
            // Birden fazla çek varsa tabloyu göster
            const processedResults: QrResult[] = [];

            // Process each result and get city information
            for (let index = 0; index < FileResults[0].BillDetails.length; index++) {
              const fileResult = FileResults[0].BillDetails[index];

              if (!fileResult.ErrorMessage) {
                let placeOfIssue = '';

                // BankBranchName'den şehir bilgisini çıkart
                if (fileResult.BankBranchName) {
                  try {
                    const cityName = await getCityNameFromBankBranch(fileResult.BankBranchName);
                    if (cityName) {
                      placeOfIssue = cityName;
                    }
                  } catch (error) {
                    console.error('City matching error for multiple results:', error);
                  }
                }

                processedResults.push({
                  ...fileResult,
                  drawerName: fileResult?.DrawerName || '',
                  drawerIdentifier: fileResult?.DrawerIdentifier || '',
                  billNo: fileResult?.BillNo
                    ? fileResult.BillNo.replace(/\s/g, '').replace(/^0+/, '').slice(-7) || '0'
                    : '',
                  accountNo: fileResult?.AccountNo
                    ? fileResult.AccountNo.replace(/\s/g, '').replace(/^0+/, '') || '0'
                    : '',
                  bankName: fileResult?.BankName || '',
                  bankBranchName: fileResult?.BankBranchName || '',
                  payableAmount: 0, // Default value, can be edited by user
                  paymentDueDate: '', // Default value, can be edited by user
                  placeOfIssue: placeOfIssue,
                  // Don't attach the uploaded file - let each row handle its own frontImage
                });
              }
            }

            setQrResults(processedResults);

            notice({
              variant: 'success',
              title: 'Birden Fazla Çek Bulundu',
              message: `${TotalBillCount} adet çek QR kodu okundu. Aşağıdaki tablodan çek bilgilerini düzenleyebilir ve seçebilirsiniz.`,
            });
          } else {
            notice({
              variant: 'warning',
              title: 'QR Kod Bulunamadı',
              message: 'Dosyalarda geçerli QR kod bulunamadı.',
            });
          }
        } else {
          throw new Error(response.ErrorMessage || 'QR kod okuma başarısız');
        }
      } catch (error) {
        console.error('QR reading error:', error);
        notice({
          variant: 'error',
          title: 'QR Kod Okuma Hatası',
          message: error instanceof Error ? error.message : 'QR kodlar okunurken bir hata oluştu.',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [convertToBase64, readQrCodes, notice, getCityNameFromBankBranch],
  );

  // Watch front image changes to trigger QR reading
  const frontImage = form.watch('frontImage');

  // Trigger QR reading when front image changes
  useEffect(() => {
    if (frontImage) {
      handleFrontImageUpload(frontImage);
    } else {
      setQrResults([]);
      setIsProcessing(false);
    }
  }, [frontImage, handleFrontImageUpload]);

  const handleSubmit = form.handleSubmit(async (data: BulkChequeFormData) => {
    if (!data.frontImage) {
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'Çek ön yüz görseli zorunludur.',
      });
      return;
    }

    if (qrResults.length === 0) {
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'QR kod okunabilir çek bilgisi bulunamadı.',
      });
      return;
    }

    // TODO: Implement bulk cheque save logic
    console.log('qrResults', qrResults);
    await notice({
      variant: 'success',
      title: 'Başarılı',
      message: `${qrResults.length} adet çek kaydedilecek.`,
    });

    onSuccess?.();
  });
  console.log('isProcessing', isProcessing);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', position: 'relative' }}>
      {/* QR Code Processing Loading Overlay */}
      {isProcessing && (
        <FigoLoading background="rgba(255, 255, 255, 0.9)" description="QR kod okunuyor, lütfen bekleyiniz..." />
      )}

      <Grid container spacing={3}>
        {/* Front Image Upload */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Çek Ön Yüz Görseli *
          </Typography>
          <Dropzone
            name="frontImage"
            form={form as unknown as UseFormReturn<FieldValues>}
            accept=".png,.jpeg,.jpg,.pdf"
            multiple={false}
            loading={isProcessing}
            supportedFormat={chequeImageTypes}
            maxSize={5}
            maxSizeType="MB"
          />
        </Grid>

        {/* Back Image Upload */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Çek Arka Yüz Görseli
          </Typography>
          <Dropzone
            name="backImage"
            form={form as unknown as UseFormReturn<FieldValues>}
            accept=".png,.jpeg,.jpg,.pdf"
            multiple={false}
            loading={false}
            supportedFormat={chequeImageTypes}
            maxSize={5}
            maxSizeType="MB"
          />
        </Grid>

        {/* Invoice File Upload */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Çek İle İlgili Fatura Dosyası
          </Typography>
          <Dropzone
            name="invoiceFile"
            form={form as unknown as UseFormReturn<FieldValues>}
            accept=".png,.jpeg,.jpg,.pdf,.xml"
            multiple={false}
            loading={false}
            supportedFormat={invoiceFileTypes}
            maxSize={5}
            maxSizeType="MB"
          />
        </Grid>

        {/* QR Results Editable Table */}
        <Grid item xs={12}>
          <QrResultsEditableTable
            ref={qrTableRef}
            qrResults={qrResults}
            setQrResults={setQrResults}
            pdfFile={form.watch('frontImage')}
            isQrProcessing={isLoading}
            onSuccess={onSuccess}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default forwardRef(BulkChequeUploadFormComponent);
