import { Form, PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateDifferenceEntryMutation,
  useGetDifferenceEntryProcessTypesQuery,
  useGetDifferenceEntryStatusQuery,
  useGetDifferenceEntryTypesQuery,
  useLazySearchGroupCompaniesQuery,
} from '../../difference-entry.api';
import { useDifferenceEntryForm } from './hooks';

interface FormSubmitData {
  CompanyId: number;
  ProductType: number | null;
  DeficiencyType: number;
  DeficiencyStatus: number;
  ExpectedDueDate: string;
  Description: string;
}

export default function AddDifferenceEntryPage() {
  const navigate = useNavigate();

  // API hooks
  const [createDifferenceEntry, { isLoading: isCreating, error: createError }] = useCreateDifferenceEntryMutation();
  const { data: differenceTypes = [] } = useGetDifferenceEntryTypesQuery();
  const { data: statusList = [] } = useGetDifferenceEntryStatusQuery();
  const { data: processTypes = [] } = useGetDifferenceEntryProcessTypesQuery();
  const [searchCompanies, { data: companiesResult, isLoading: isCompanySearchLoading }] =
    useLazySearchGroupCompaniesQuery();

  // Error handling
  useErrorListener(createError);

  // Company search handling
  const handleCompanySearch = useCallback(
    async (value: string) => {
      if (value && value.length >= 2) {
        await searchCompanies({ CompanyName: value });
      }
    },
    [searchCompanies],
  );

  // Form setup using custom hook
  const { form, schema, transformFormData } = useDifferenceEntryForm({
    processTypes,
    differenceTypes,
    statusList,
    companiesResult: companiesResult?.Items || [],
    onCompanySearch: handleCompanySearch,
    isCompanySearchLoading,
  });

  // Form submission
  const handleSubmit = async (data: FormSubmitData) => {
    try {
      // Convert form data to proper types
      const processedData = {
        CompanyId: data.CompanyId,
        ProductType: data.ProductType,
        DeficiencyType: data.DeficiencyType,
        DeficiencyStatus: data.DeficiencyStatus,
        ExpectedDueDate: data.ExpectedDueDate,
        Description: data.Description,
      };

      const differenceEntry = transformFormData(processedData);
      await createDifferenceEntry(differenceEntry).unwrap();

      navigate('/manual-transaction-entry/difference-entry');
    } catch (error) {
      console.error('Farklılık girişi oluşturulamadı:', error);
    }
  };

  const handleCancel = () => {
    navigate('/manual-transaction-entry/difference-entry');
  };

  return (
    <Box>
      <PageHeader title="Farklılık Girişi Ekle" subtitle="Farklılık Girişi Ekle" />
      <Card sx={{ mx: 2, p: 2 }}>
        <CardContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                Farklılık Girişi
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Form form={form} schema={schema} />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={handleCancel} disabled={isCreating}>
              İptal
            </Button>
            <Button
              variant="contained"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isCreating}
              sx={{ minWidth: 120 }}>
              {isCreating ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
