import { Form, useNotice } from '@components';
import { ArrowBack } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useCreateAllowanceMutation, useLazyGetFinancersQuery } from '../../discount-operations.api';
import type {
  CreateAllowanceRequest,
  FinancerCompany,
  FinancialSettingsStepProps,
} from '../../discount-operations.types';
import { useFinancialSettingsForm } from '../../hooks/useFinancialSettingsForm';

// Environment-based Figo Finans configuration
const isQa = process.env.REACT_APP_ENV_NAME === 'qa';
const isProduction = process.env.REACT_APP_ENV_NAME === 'production';

// Default Figo Finans ID based on environment
let figoFinansId = 25163; // Test environment default
if (isQa) {
  figoFinansId = 11000;
} else if (isProduction) {
  figoFinansId = 30399;
}

export const initialFinancerFigoFinans = {
  label: 'FİGO FİNANS FAKTORİNG ANONİM ŞİRKETİ  (7450380576)',
  value: '7450380576',
  id: figoFinansId,
};

// Helper function to format currency
const formatCurrency = (amount: number, currency = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const FinancialSettingsStep: React.FC<FinancialSettingsStepProps> = ({
  onBack,
  onSubmit,
  initialData,
  formData,
  onSuccess,
}) => {
  const notice = useNotice();
  const [getFinancers, { data: financersResponse, isLoading: isLoadingFinancers }] = useLazyGetFinancersQuery();
  const [createAllowance, { isLoading: isCreatingAllowance }] = useCreateAllowanceMutation();

  // Fetch financers on component mount
  useEffect(() => {
    getFinancers({
      sort: 'CompanyName',
      sortType: 'Asc',
      type: 2, // Financer type
      page: 1,
      pageSize: 999,
    });
  }, [getFinancers]);

  // Transform financer options for select
  const financerOptions = useMemo(() => {
    const options = (financersResponse?.Items || []).map((financer: FinancerCompany) => ({
      id: financer.Id,
      name: `${financer.CompanyName} (${financer.Identifier})`,
    }));

    // Add initial Figo Finans option if not already present and set as default
    const figoFinansExists = options.some((option) => option.id === initialFinancerFigoFinans.id);
    if (!figoFinansExists) {
      options.unshift({
        id: initialFinancerFigoFinans.id,
        name: initialFinancerFigoFinans.label,
      });
    }

    return options;
  }, [financersResponse?.Items]);

  // Form management with financer options and initial Figo Finans selection
  const formInitialData = useMemo(() => {
    if (!initialData?.AllowanceFinancers) {
      return {
        ...initialData,
        AllowanceFinancers: [initialFinancerFigoFinans.id], // Set Figo Finans as default
      };
    }
    return initialData;
  }, [initialData]);

  const { form, schema } = useFinancialSettingsForm(formInitialData, financerOptions);

  // Calculate summary data
  const selectedCheques = useMemo(() => formData.step2?.selectedCheques || [], [formData.step2?.selectedCheques]);
  const totalAmount = selectedCheques.reduce((sum, cheque) => sum + cheque.payableAmount, 0);
  const totalCount = selectedCheques.length;

  // Watch form values for reactive updates
  const formValues = form.watch();

  const selectedFinancerIds = useMemo(() => {
    const financers = formValues.AllowanceFinancers;
    if (Array.isArray(financers)) {
      return financers;
    }
    // Handle single value (when it comes as a single ID like 6521)
    if (financers) {
      return [financers];
    }
    return [];
  }, [formValues.AllowanceFinancers]);

  const isCreatedWithTransactionFee = formValues.IsCreatedWithTransactionFee;

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!selectedFinancerIds.length) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen en az bir finansör seçiniz.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    if (!formData.step0?.companyId) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şirket bilgisi bulunamadı.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      // Prepare the final request payload based on the curl example
      const allowanceRequest: CreateAllowanceRequest = {
        AllowanceBills: selectedCheques.map((cheque) => ({
          billId: cheque.billId,
          payableAmount: cheque.payableAmount,
          payableAmountCurrency: cheque.payableAmountCurrency,
          paymentDueDate: cheque.paymentDueDate,
        })),
        AllowanceDueDate: new Date().toISOString().split('T')[0], // Today's date
        AllowanceFinancers: selectedFinancerIds.map((financerId) => ({
          CompanyId: financerId,
        })),
        IsCreatedWithTransactionFee: isCreatedWithTransactionFee,
        NotifyBuyer: 0, // Default value from curl example
        AllowanceInvoices: [], // Empty array as per curl example
        SenderCompanyId: formData.step0.companyId,
        Kind: 2, // Cheque allowance type from curl example
      };

      await createAllowance(allowanceRequest).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Talep başarıyla oluşturuldu.',
        buttonTitle: 'Tamam',
      });

      // Call the onSubmit callback with the final data
      onSubmit(allowanceRequest);

      // Call onSuccess callback to refetch the list
      onSuccess?.();
    } catch (error) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Talep oluşturulurken bir hata oluştu.',
        buttonTitle: 'Tamam',
      });
      console.error('Create allowance error:', error);
    }
  }, [
    selectedFinancerIds,
    isCreatedWithTransactionFee,
    formData,
    selectedCheques,
    createAllowance,
    onSubmit,
    notice,
    onSuccess,
  ]);

  return (
    <Box sx={{ py: 2 }}>
      {/* Summary Card */}
      <Card sx={{ mb: 2, bgcolor: 'primary.50', border: '2px dashed', borderColor: 'primary.200' }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Toplam Çek Sayısı:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {totalCount}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Toplam Tutar:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(totalAmount, 'TRY')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Financial Settings Form */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Finansal Ayarlar
          </Typography>

          {isLoadingFinancers ? (
            <Typography variant="body2" color="text.secondary">
              Finansörler yükleniyor...
            </Typography>
          ) : (
            <>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form as any} schema={schema as any} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
          Önceki
        </Button>
        <LoadingButton
          variant="contained"
          color="success"
          loading={isCreatingAllowance}
          onClick={handleSubmit}
          disabled={selectedFinancerIds.length === 0}>
          Talep Oluştur
        </LoadingButton>
      </Box>
    </Box>
  );
};
