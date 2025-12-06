import { fields, Form, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import yup from '@validation';
import { useCallback, useEffect, useMemo } from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { AnyObject } from 'yup';

import { useErrorListener } from '@hooks';
import dayjs from 'dayjs';
import Dropzone from 'src/components/common/Dropzone';
import { SchemaField } from 'src/components/common/Form/enums';
import {
  useCreateChequeAllowanceMutation,
  useGetBanksQuery,
  useGetFinancersQuery,
  useLazyGetBankBranchesQuery,
  useLazySearchByCompanyNameOrIdentifierQuery,
} from '../manual-transaction-entry.api';

interface ChequeFormData {
  AllowanceFinancers: string;
  SenderIdentifier: string;
  interestRate?: number | null;
  bidAmount: number | null;
  paymentDueDate: string;
  no: string;
  drawerName: string;
  drawerIdentifier?: number | null;
  placeOfIssue: string;
  chequeAccountNo: string;
  bankEftCode: string;
  bankBranchEftCode: string;
  frontImage?: File | null;
  backImage?: File | null;
  invoiceFile?: File | null;
}

interface ChequeAllowanceModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChequeAllowanceModal = ({ open, onClose }: ChequeAllowanceModalProps) => {
  // API hooks
  const [createChequeAllowance, { isLoading: isSubmitting, error }] = useCreateChequeAllowanceMutation();
  const { data: financersData } = useGetFinancersQuery({});
  const { data: banksData } = useGetBanksQuery();
  const [getBankBranches, { data: branchesData }] = useLazyGetBankBranchesQuery();
  const [searchCompanies, { data: companiesData, isLoading: isCompanySearchLoading }] =
    useLazySearchByCompanyNameOrIdentifierQuery();

  const notice = useNotice();
  useErrorListener(error);
  // Supported file types
  const chequeImageTypes = useMemo(() => ['png', 'jpeg', 'jpg', 'pdf'], []);

  // Transform API data for form usage
  const financiers = useMemo(() => {
    return (
      financersData?.Items?.map((item) => ({
        id: item.Id,
        value: item.Identifier,
        label: `${item.CompanyName} (${item.Identifier})`,
      })) || []
    );
  }, [financersData]);

  const banks = useMemo(() => {
    return (
      banksData?.map((bank) => ({
        ...bank,
        Code: bank.Code || bank.EftCode || bank.Id.toString(),
      })) || []
    );
  }, [banksData]);

  const branches = useMemo(() => {
    return (
      branchesData?.Items?.map((branch) => ({
        ...branch,
        Code: branch.Code || branch.EftCode || branch.Id.toString(),
      })) || []
    );
  }, [branchesData]);

  // Transform companies data for async autocomplete - matching reference pattern
  const companies = useMemo(() => {
    return (
      companiesData?.Items?.map((item) => ({
        Id: item.Id,
        Identifier: item.Identifier, // Use original Identifier for matching reference pattern
        CompanyName: item.CompanyName,
      })) || []
    );
  }, [companiesData]);

  // Debug: Log companies data when it changes
  useEffect(() => {
    console.log('🔄 Companies data updated:', companies);
  }, [companies]);

  // Search function for async autocomplete
  const handleCompanySearch = useCallback(
    async (searchTerm: string): Promise<void> => {
      console.log('🔍 handleCompanySearch çağırıldı:', searchTerm);

      if (searchTerm && searchTerm.length >= 2) {
        try {
          console.log('📞 API çağrısı yapılıyor:', {
            CompanyNameOrIdentifier: searchTerm,
            Status: 1,
            ActivityType: 2,
          });

          const result = await searchCompanies({
            CompanyNameOrIdentifier: searchTerm,
            Status: 1,
            ActivityType: 2,
          }).unwrap();

          console.log('✅ API sonucu:', result);
        } catch (error) {
          console.error('❌ Arama hatası:', error);
        }
      } else {
        console.log('⚠️ Arama terimi çok kısa:', searchTerm);
      }
    },
    [searchCompanies],
  );

  // Default financer (FigoFinans)
  const initialFinancerFigoFinans = useMemo(() => {
    const isQa = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    let figoFinansId = 25163;
    if (isQa) {
      figoFinansId = 11000;
    } else if (isProduction) {
      figoFinansId = 30399;
    }

    return {
      id: figoFinansId,
      value: '7450380576',
      label: 'FİGO FİNANS FAKTORİNG ANONİM ŞİRKETİ (7450380576)',
    };
  }, []);

  // Initial form values
  const initialValues: ChequeFormData = {
    AllowanceFinancers: initialFinancerFigoFinans.value,
    SenderIdentifier: '',
    interestRate: null,
    bidAmount: null,
    paymentDueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    no: '',
    drawerName: '',
    drawerIdentifier: null,
    placeOfIssue: '',
    chequeAccountNo: '',
    bankEftCode: '',
    bankBranchEftCode: '',
    frontImage: null,
    backImage: null,
    invoiceFile: null,
  };

  // Form validation schema - basit schema
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        AllowanceFinancers: fields
          .select(financiers, 'string', ['value', 'label'])
          .required('Finansör zorunludur')
          .label('Finansör')
          .meta({
            col: 6,
            field: SchemaField.InputSelect,
          }),
        SenderIdentifier: fields
          .asyncAutoComplete(
            companies,
            'string',
            ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
            handleCompanySearch,
            isCompanySearchLoading,
            3, // minimum search length like reference
          )
          .required('Satıcı Ünvan / VKN zorunludur')
          .label('Satıcı Ünvan / VKN')
          .meta({
            col: 6,
            field: SchemaField.InputAsyncAutoComplete,
            placeholder: 'VKN/Ünvan arayın...',
          }),
        interestRate: fields.number
          .nullable()
          .min(0, 'Faiz oranı negatif olamaz')
          .max(100, "Faiz oranı 100'den büyük olamaz")
          .label('Faiz Oranı (%)')
          .meta({
            col: 6,
            field: SchemaField.InputText,
          }),
        bidAmount: fields.currency
          .required('Ödenen Tutar zorunludur')
          .min(0.01, "Tutar 0'dan büyük olmalıdır")
          .label('Ödenen Tutar')
          .meta({
            col: 6,
            field: SchemaField.InputCurrency,
            currency: 'TRY',
          })
          .nullable(),
        paymentDueDate: fields.date.label('Çek Ödeme Tarihi').meta({
          col: 6,
          field: SchemaField.InputDate,
        }),
        no: fields.text.label('Çek No').meta({
          col: 6,
          field: SchemaField.InputText,
        }),
        drawerName: fields.text.required('Keşideci adı zorunludur').label('Keşideci Adı').meta({
          col: 6,
          field: SchemaField.InputText,
        }),
        drawerIdentifier: fields.number.nullable().label('Keşideci VKN/TCKN').meta({
          col: 6,
          field: SchemaField.InputText,
        }),
        placeOfIssue: fields.text.label('Keşide Yeri').meta({
          col: 6,
          field: SchemaField.InputText,
        }),
        chequeAccountNo: fields.text.label('Çek Hesap No').meta({
          col: 6,
          field: SchemaField.InputText,
        }),
        bankEftCode: fields.select(banks, 'string', ['Id', 'Name']).label('Banka Adı').meta({
          col: 6,
          field: SchemaField.InputSelect,
        }),
        bankBranchEftCode: fields.select(branches, 'string', ['Id', 'Name']).label('Banka Şube').meta({
          col: 6,
          field: SchemaField.InputSelect,
        }),
        // File fields for Dropzone
        frontImage: yup.mixed().nullable().label('Çek Ön Yüz Görseli'),
        backImage: yup.mixed().nullable().label('Çek Arka Yüz Görseli'),
        invoiceFile: yup.mixed().nullable().label('Çek İle İlgili Fatura Dosyası'),
      }),
    [financiers, companies, banks, branches, handleCompanySearch, isCompanySearchLoading],
  );

  // Form setup
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  // File handling functions
  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }, []);

  // Bank selection handler
  const selectedBankId = form.watch('bankEftCode');
  useEffect(() => {
    if (selectedBankId) {
      getBankBranches({ BankId: parseInt(selectedBankId.toString()) });
      form.setValue('bankBranchEftCode', ''); // Reset branch selection
    }
  }, [selectedBankId, getBankBranches, form]);

  const handleSubmit = async (data: FieldValues) => {
    try {
      // Find selected bank and branch codes
      const selectedBank = banks.find((bank) => bank.Id.toString() === data.bankEftCode);
      const selectedBranch = branches.find((branch) => branch.Id.toString() === data.bankBranchEftCode);

      const findFinancer = financiers.find((f) => f.value === data.AllowanceFinancers);

      // SenderIdentifier contains the Identifier string, we need to find the Id
      const selectedCompany = companies.find((company) => company.Identifier === data.SenderIdentifier);
      const selectedSellerId = selectedCompany ? selectedCompany.Id : null;

      // Prepare file list from Dropzone files
      const billDocumentList = [];

      // Add Dropzone files
      if (data.frontImage) {
        const frontImageData = await convertToBase64(data.frontImage);
        billDocumentList.push({
          file: data.frontImage,
          name: data.frontImage.name,
          type: data.frontImage.type.split('/')[1],
          data: frontImageData,
          DocumentType: 1,
          imagePath: URL.createObjectURL(data.frontImage),
          dataURL: `data:${data.frontImage.type};base64,${frontImageData}`,
        });
      }

      if (data.backImage) {
        const backImageData = await convertToBase64(data.backImage);
        billDocumentList.push({
          file: data.backImage,
          name: data.backImage.name,
          type: data.backImage.type.split('/')[1],
          data: backImageData,
          DocumentType: 2,
          imagePath: URL.createObjectURL(data.backImage),
          dataURL: `data:${data.backImage.type};base64,${backImageData}`,
        });
      }

      if (data.invoiceFile) {
        const invoiceFileData = await convertToBase64(data.invoiceFile);
        billDocumentList.push({
          file: data.invoiceFile,
          name: data.invoiceFile.name,
          type: data.invoiceFile.type.split('/')[1],
          data: invoiceFileData,
          DocumentType: 3,
          imagePath: URL.createObjectURL(data.invoiceFile),
          dataURL: `data:${data.invoiceFile.type};base64,${invoiceFileData}`,
        });
      }

      const submitData = {
        senderCompanyId: selectedSellerId,
        allowanceBills: {
          type: 1,
          no: data.no,
          payableAmount: data.bidAmount,
          bidAmount: data.bidAmount,
          payableAmountCurrency: 'TRY',
          bidAmountCurrency: 'TRY',
          paymentDueDate: dayjs(data.paymentDueDate).format('YYYY-MM-DD'),
          bankEftCode: selectedBank?.Code || data.bankEftCode,
          bankBranchEftCode: selectedBranch?.Code || data.bankBranchEftCode,
          drawerName: data.drawerName,
          drawerIdentifier: data.drawerIdentifier,
          placeOfIssue: data.placeOfIssue,
          chequeAccountNo: data.chequeAccountNo,
          companyId: selectedSellerId,
          currencyId: 1,
          billDocumentList: billDocumentList,
        },
        AllowanceFinancers: [
          {
            financerCompanyId: findFinancer?.id,
            bidAmount: data.bidAmount,
            interestRate: data?.interestRate,
          },
        ],
        currencyId: 1,
      };

      const response = await createChequeAllowance(submitData).unwrap();

      notice({
        variant: 'success',
        message: `İskonto başarıyla oluşturuldu. İskonto Numarası: ${response.Id}`,
      });

      // Reset form and close modal
      form.reset(initialValues);
      onClose();
    } catch (error) {
      console.error('Error creating allowance:', error);
      notice({
        variant: 'error',
        message: 'İskonto oluşturulurken bir hata oluştu.',
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Teklif Detayları
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 2 }}>
          {/* Dinamik Form Component */}
          <Form form={form} schema={validationSchema} />

          {/* File Upload Sections */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Dosya Yüklemeleri
            </Typography>
            <Grid container spacing={2}>
              {/* Çek Ön Yüz Görseli */}
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Çek Ön Yüz Görseli
                </Typography>
                <Dropzone
                  name="frontImage"
                  form={form as unknown as UseFormReturn<FieldValues>}
                  accept=".png,.jpeg,.jpg,.pdf"
                  multiple={false}
                  loading={false}
                  supportedFormat={chequeImageTypes}
                  maxSize={5}
                  maxSizeType="MB"
                />
              </Grid>

              {/* Çek Arka Yüz Görseli */}
              <Grid item xs={12} sm={4}>
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

              {/* Çek İle İlgili Fatura Dosyası */}
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Çek İle İlgili Fatura Dosyası
                </Typography>
                <Dropzone
                  name="invoiceFile"
                  form={form as unknown as UseFormReturn<FieldValues>}
                  accept=".png,.jpeg,.jpg,.pdf"
                  multiple={false}
                  loading={false}
                  supportedFormat={chequeImageTypes}
                  maxSize={5}
                  maxSizeType="MB"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleCancel} variant="outlined">
          İptal
        </Button>
        <LoadingButton onClick={form.handleSubmit(handleSubmit)} variant="contained" loading={isSubmitting}>
          Teklif Oluştur
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
