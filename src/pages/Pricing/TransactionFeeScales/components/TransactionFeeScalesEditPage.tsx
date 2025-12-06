import { Form, LoadingButton, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactionFeeScaleForm } from '../hooks/useTransactionFeeScaleForm';
import {
  useGetTransactionFeeScaleByIdQuery,
  useUpdateTransactionFeeScaleMutation,
} from '../transaction-fee-scales.api';
import { TransactionFeeScaleFormData } from '../transaction-fee-scales.types';

/**
 * Transaction Fee Scales Edit Page
 * 1:1 recreation of legacy TransactionScalesEdit.js
 * Matches all form fields, validation, and behavior exactly
 */
const TransactionFeeScalesEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notice = useNotice();

  // Fetch existing data for editing
  const {
    data: existingData,
    isLoading: isLoadingData,
    error: fetchError,
  } = useGetTransactionFeeScaleByIdQuery(Number(id), { skip: !id });

  // Form management hook
  const { form, schema, transformToUpdateRequest } = useTransactionFeeScaleForm();

  // Reset form with existing data when it loads
  useEffect(() => {
    if (existingData) {
      form.reset({
        minAmount: existingData.MinAmount,
        maxAmount: existingData.MaxAmount,
        transactionFee: existingData.TransactionFee,
        percentFee: existingData.PercentFee,
      });
    }
  }, [existingData, form]);

  // Update mutation
  const [updateScale, { isLoading: isUpdating, error: updateError }] = useUpdateTransactionFeeScaleMutation();

  // Error handling
  useErrorListener(fetchError);
  useErrorListener(updateError);

  // Handle form submission - matches legacy putTransactionFeeRate()
  const handleSubmit = async (formData: TransactionFeeScaleFormData) => {
    if (!id) return;

    try {
      const requestData = transformToUpdateRequest(formData, Number(id));
      await updateScale({ id: Number(id), data: requestData }).unwrap();

      // Success notification - matches legacy successfulApiNotify()
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem başarılı',
        buttonTitle: 'Tamam',
        onClick: () => navigate('/pricing/islem-ucreti-baremleri'),
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Update failed:', error);
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate('/pricing/islem-ucreti-baremleri');
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <>
        <PageHeader
          title="Web Sitesi İşlem Ücreti Baremleri"
          subtitle="İşlem ücreti baremlerini bu sayfada düzenleyebilirsiniz"
        />
        <Box mx={2}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" py={4}>
                Veriler yükleniyor...
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Web Sitesi İşlem Ücreti Baremleri"
        subtitle="İşlem ücreti baremlerini bu sayfada düzenleyebilirsiniz"
      />

      <Box mx={2}>
        {/* Form Card */}
        <Card>
          <CardContent>
            <Form form={form} schema={schema}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Form fields will be automatically rendered based on schema */}
              </Grid>

              {/* Action Buttons */}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button id="cancel-button" variant="outlined" onClick={handleCancel} disabled={isUpdating}>
                  İptal
                </Button>
                <LoadingButton
                  id="update-button"
                  onClick={form.handleSubmit(handleSubmit)}
                  variant="contained"
                  loading={isUpdating}
                  disabled={isUpdating}>
                  Güncelle
                </LoadingButton>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default TransactionFeeScalesEditPage;
