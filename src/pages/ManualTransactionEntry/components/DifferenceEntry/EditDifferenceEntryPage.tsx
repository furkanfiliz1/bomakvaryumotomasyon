import { Form, PageHeader } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetDifferenceEntryProcessTypesQuery,
  useGetDifferenceEntryQuery,
  useGetDifferenceEntryStatusQuery,
  useGetDifferenceEntryTypesQuery,
  useLazySearchGroupCompaniesQuery,
  useUpdateDifferenceEntryMutation,
} from '../../difference-entry.api';
import { useDifferenceEntryForm } from './hooks';

interface DifferenceEntryFormData {
  CompanyId: number;
  ProductType: number | null;
  DeficiencyType: number;
  DeficiencyStatus: number;
  ExpectedDueDate: string;
  Description: string;
}

export default function EditDifferenceEntryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const differenceEntryId = id ? parseInt(id, 10) : 0;

  // API hooks
  const {
    data: differenceEntry,
    isLoading: isLoadingEntry,
    error: fetchError,
  } = useGetDifferenceEntryQuery(differenceEntryId, {
    skip: !differenceEntryId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updateDifferenceEntry, { isLoading: isUpdating, error: updateError }] = useUpdateDifferenceEntryMutation();
  const { data: differenceTypes = [] } = useGetDifferenceEntryTypesQuery();
  const { data: statusList = [] } = useGetDifferenceEntryStatusQuery();
  const { data: processTypes = [] } = useGetDifferenceEntryProcessTypesQuery();
  const [searchCompanies, { data: companiesResult, isLoading: isCompanySearchLoading }] =
    useLazySearchGroupCompaniesQuery();

  // Error handling
  useErrorListener(fetchError);
  useErrorListener(updateError);

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

  // Pre-populate form when data is loaded
  useEffect(() => {
    if (differenceEntry) {
      form.reset({
        CompanyId: differenceEntry.CompanyId,
        ProductType: differenceEntry.ProductType,
        DeficiencyType: differenceEntry.DeficiencyType,
        DeficiencyStatus: differenceEntry.DeficiencyStatus,
        ExpectedDueDate: differenceEntry.ExpectedDueDate ? differenceEntry.ExpectedDueDate.split('T')[0] : '',
        Description: differenceEntry.Description,
      });

      // If we have company info, search for it to populate the autocomplete
      if (differenceEntry.CompanyName) {
        searchCompanies({ CompanyName: differenceEntry.CompanyName });
      }
    }
  }, [differenceEntry, form, searchCompanies]);

  // Form submission
  const handleSubmit = async (data: DifferenceEntryFormData) => {
    if (!differenceEntryId) return;

    try {
      // Convert form data to proper types
      const processedData = {
        CompanyId: data.CompanyId,
        ProductType: data.ProductType || 0, // Handle null case
        DeficiencyType: data.DeficiencyType,
        DeficiencyStatus: data.DeficiencyStatus,
        ExpectedDueDate: data.ExpectedDueDate,
        Description: data.Description,
      };

      const updatedDifferenceEntry = transformFormData(processedData);
      await updateDifferenceEntry({
        id: differenceEntryId,
        data: {
          ...updatedDifferenceEntry,
          Id: differenceEntryId,
        },
      }).unwrap();

      navigate('/manual-transaction-entry/difference-entry');
    } catch (error) {
      console.error('Farklılık girişi güncellenemedi:', error);
    }
  };

  const handleCancel = () => {
    navigate('/manual-transaction-entry/difference-entry');
  };

  // Loading state
  if (isLoadingEntry) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Farklılık girişi yükleniyor...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (fetchError || !differenceEntry) {
    return (
      <Box sx={{ p: 3 }}>
        <PageHeader title="Farklılık Girişi Düzenle" subtitle="Hata" />
        <Card>
          <CardContent>
            <Typography color="error" align="center">
              Farklılık girişi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
            </Typography>
            <Stack direction="row" justifyContent="center" mt={2}>
              <Button variant="outlined" onClick={handleCancel}>
                Geri Dön
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Farklılık Girişi Düzenle" subtitle="Farklılık Girişi Düzenle" />
      <Card sx={{ p: 2, mx: 2 }}>
        <CardContent>
          <Grid container>
            <Grid item lg={5}>
              <Typography variant="h6" gutterBottom>
                Farklılık Girişi
              </Typography>
            </Grid>
            <Grid item lg={7}>
              <Form form={form} schema={schema} />
              <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}>
                <Button variant="outlined" onClick={handleCancel} disabled={isUpdating}>
                  İptal
                </Button>
                <Button
                  variant="contained"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isUpdating}
                  sx={{ minWidth: 120 }}>
                  {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Action Buttons */}
        </CardContent>
      </Card>
    </Box>
  );
}
