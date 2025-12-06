import { Form, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddFinancialRecordForm, useDropdownData } from '../hooks';
import { useGetFinancialRecordQuery, useUpdateFinancialRecordMutation } from '../manual-transaction-entry.api';
import { CompanySearchResult, FinancialRecord } from '../manual-transaction-entry.types';

// Form data type that allows SenderIdentifier to be either string or CompanySearchResult object
interface FinancialRecordFormData extends Omit<FinancialRecord, 'SenderIdentifier'> {
  SenderIdentifier?: string | CompanySearchResult | null;
}

export const EditFinancialRecordPage = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const { id } = useParams<{ id: string }>();

  // Convert id to number
  const recordId = id ? parseInt(id, 10) : 0;

  // API queries and mutations
  const {
    data: existingRecord,
    isLoading: isLoadingRecord,
    error: recordError,
    refetch: refetchRecord,
  } = useGetFinancialRecordQuery(recordId, {
    skip: !recordId,
  });
  const [updateFinancialRecord, { isLoading: isUpdating, isSuccess, error }] = useUpdateFinancialRecordMutation();

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

  // Initialize form with existing record data
  const { form, createSchema } = useAddFinancialRecordForm({
    currencies,
    financialRecordTypes,
    financialActivityTypes,
    processTypes,
    invoiceParty,
    bankList,
    buyerList,
    initialData: existingRecord, // Pass existing record as initial data
  });

  // Watch form values for dynamic schema
  const watchedValues = form.watch();

  // Create dynamic schema based on current form values
  const currentSchema = createSchema(watchedValues);

  // Log current form values for debugging
  useEffect(() => {
    if (existingRecord) {
      console.log('existingRecord', existingRecord);
      const currentValues = form.getValues();
      console.log('Current form values:', currentValues);
      console.log(
        'Form visibility conditions - FinancialRecordType:',
        currentValues.FinancialRecordType,
        'FinancialRecordProcessType:',
        currentValues.FinancialRecordProcessType,
      );
    }
  }, [existingRecord, form]);

  const handleSubmit = async (data: FinancialRecordFormData) => {
    try {
      // Convert form data to API data format
      // Extract Identifier from company object if it's an object, otherwise use as string
      let senderIdentifierValue: string | null = null;

      if (typeof data.SenderIdentifier === 'object' && data.SenderIdentifier && 'Identifier' in data.SenderIdentifier) {
        // Extract identifier and clean any JSON string formatting
        let identifier = data.SenderIdentifier.Identifier;
        // Remove JSON string quotes if they exist
        if (typeof identifier === 'string' && identifier.startsWith('"') && identifier.endsWith('"')) {
          identifier = identifier.slice(1, -1);
        }
        senderIdentifierValue = identifier;
      } else if (typeof data.SenderIdentifier === 'string') {
        // Clean string value if it has JSON formatting
        let identifier = data.SenderIdentifier;
        if (identifier.startsWith('"') && identifier.endsWith('"')) {
          identifier = identifier.slice(1, -1);
        }
        senderIdentifierValue = identifier;
      } else {
        senderIdentifierValue = data.SenderIdentifier || null;
      }

      // Remove UI-only fields and send API data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { selectedSenderValue, ...formData } = data;

      const apiData: Partial<FinancialRecord> = {
        ...formData,
        SenderIdentifier: senderIdentifierValue,
      };

      console.log('API data to be sent:', apiData);

      await updateFinancialRecord({
        id: recordId,
        body: apiData,
      }).unwrap();

      // Navigate back to list page on success
    } catch (error) {
      // Error is handled by useErrorListener in the mutation
      console.error('Failed to update financial record:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Navigate back to list page on success
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Başarıyla güncellendi',
        buttonTitle: 'Devam Et',
      });
      refetchRecord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleCancel = () => {
    navigate('/manual-transaction-entry/financial-records');
  };

  // Loading state for dropdown data or record data
  if (dropdownLoading || isLoadingRecord) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Yükleniyor...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state for record loading
  if (recordError || !existingRecord) {
    return (
      <Box mx={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Gelir gider kaydı yüklenirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
        </Alert>
        <Button variant="outlined" onClick={handleCancel}>
          Geri Dön
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <PageHeader title="Gelir-Gider Düzenle" subtitle="Gelir-gider kaydını düzenleyebilirsiniz. " />
      {/* Form Card */}
      <Card sx={{ mx: 2, p: 2 }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form} schema={currentSchema as any} />

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={handleCancel} disabled={isUpdating}>
              İptal
            </Button>
          </Grid>
          <Grid item>
            <LoadingButton variant="contained" loading={isUpdating} onClick={form.handleSubmit(handleSubmit)}>
              Güncelle
            </LoadingButton>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
