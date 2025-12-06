import { Form, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddFinancialRecordForm, useDropdownData } from '../hooks';
import { useCreateFinancialRecordMutation } from '../manual-transaction-entry.api';
import { CompanySearchResult, FinancialRecord } from '../manual-transaction-entry.types';

// Form data type that allows SenderIdentifier to be either string or CompanySearchResult object
interface FinancialRecordFormData extends Omit<FinancialRecord, 'SenderIdentifier'> {
  SenderIdentifier?: string | CompanySearchResult | null;
}

export const AddFinancialRecordPage = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // API mutation
  const [createFinancialRecord, { isLoading: isCreating, isSuccess, error }] = useCreateFinancialRecordMutation();

  useErrorListener(error);
  // Load dropdown data
  const {
    currencies,
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    invoiceParty,
    bankList,
    buyerList,
    isLoading: dropdownLoading,
  } = useDropdownData();

  // Initialize form
  const { form, createSchema } = useAddFinancialRecordForm({
    currencies,
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    invoiceParty,
    bankList,
    buyerList,
  });

  // Mock company search - in real app this would come from API
  // const getCompaniesSearch = useCallback(async (inputValue: string) => {
  //   if (!inputValue || inputValue.length < 3) {
  //     return [];
  //   }
  //
  //   // Mock data - replace with actual API call
  //   return [
  //     {
  //       Identifier: '1234567890',
  //       CompanyName: `${inputValue} Test Şirketi`,
  //       label: `${inputValue} Test Şirketi / 1234567890`,
  //       value: '1234567890'
  //     },
  //     {
  //       Identifier: '0987654321',
  //       CompanyName: `${inputValue} Demo Firma`,
  //       label: `${inputValue} Demo Firma / 0987654321`,
  //       value: '0987654321'
  //     }
  //   ];
  // }, []);

  // Watch form values for dynamic schema
  const watchedValues = form.watch();

  // Create dynamic schema based on current form values
  const currentSchema = createSchema(watchedValues);

  // Update field values based on conditions - mirroring reference file logic
  useEffect(() => {
    const financialRecordType = watchedValues.FinancialRecordType;
    const processType = watchedValues.FinancialRecordProcessType;

    // Reset conditional fields when record type changes (from reference file logic)
    if (financialRecordType === 1) {
      form.setValue('SenderIdentifier', null);
      form.setValue('FinancerIdentifier', null);
      form.setValue('SystemGuaranteedAmount', null);
      form.setValue('InvoiceParty', null);
    }

    if (financialRecordType !== 0) {
      form.setValue('BankGuaranteedAmount', null);
    }

    // Process type specific resets
    if (processType === 1) {
      form.setValue('ReceiverIdentifier', null);
      form.setValue('SystemGuaranteedAmount', null);
      form.setValue('BankGuaranteedAmount', null);
    }

    if (processType === 0) {
      form.setValue('SystemGuaranteedAmount', null);
      form.setValue('BankGuaranteedAmount', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.FinancialRecordType, watchedValues.FinancialRecordProcessType, form]);

  const handleSubmit = async (data: FinancialRecordFormData) => {
    try {
      // Convert form data to API data format
      // Extract Identifier from company object if it's an object, otherwise use as string
      const senderIdentifierValue =
        typeof data.SenderIdentifier === 'object' && data.SenderIdentifier && 'Identifier' in data.SenderIdentifier
          ? data.SenderIdentifier.Identifier
          : data.SenderIdentifier;

      // Remove UI-only fields and send API data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selectedSenderValue, ...formData } = data;

      const apiData: Partial<FinancialRecord> = {
        ...formData,
        SenderIdentifier: senderIdentifierValue,
      };

      await createFinancialRecord(apiData).unwrap();
    } catch (error) {
      // Error is handled by useErrorListener in the mutation
      console.error('Failed to create financial record:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Navigate back to list page on success
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Başarıyla eklendi',
        buttonTitle: 'Devam Et',
      }).then(() => {
        navigate('/manual-transaction-entry/financial-records');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleCancel = () => {
    navigate('/manual-transaction-entry/financial-records');
  };

  if (dropdownLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Gelir-Gider Ekle" subtitle="Gelir-gider kaydını ekleyebilirsiniz." />
      {/* Form Card */}
      <Card sx={{ mx: 2, p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
          Kayıt Girişi
        </Typography>

        {/* Dynamic form with conditional fields based on meta.visible */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form} schema={currentSchema as any} />

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 3 }} justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={handleCancel} disabled={isCreating}>
              İptal
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton variant="contained" loading={isCreating} onClick={form.handleSubmit(handleSubmit)}>
              Ekle
            </LoadingButton>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
