import { Form, LoadingButton, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactionFeeScaleForm } from '../hooks/useTransactionFeeScaleForm';
import { useCreateTransactionFeeScaleMutation } from '../transaction-fee-scales.api';
import { TransactionFeeScaleFormData } from '../transaction-fee-scales.types';

/**
 * Transaction Fee Scales Create Page
 * 1:1 recreation of legacy TransactionScalesCreate.js
 * Matches all form fields, validation, and behavior exactly
 */
const TransactionFeeScalesCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Form management hook
  const { form, schema, transformToCreateRequest } = useTransactionFeeScaleForm();

  // Create mutation
  const [createScale, { isLoading: isCreating, error }] = useCreateTransactionFeeScaleMutation();

  // Error handling
  useErrorListener(error);

  // Handle form submission - matches legacy postTransactionFeeRate()
  const handleSubmit = async (formData: TransactionFeeScaleFormData) => {
    try {
      const requestData = transformToCreateRequest(formData);
      await createScale(requestData).unwrap();

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
      console.error('Create failed:', error);
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate('/pricing/islem-ucreti-baremleri');
  };

  return (
    <>
      <PageHeader
        title="Web Sitesi İşlem Ücreti Baremleri"
        subtitle="İşlem ücreti baremlerini bu sayfada tanımlayabilirsiniz"
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
                <Button id="cancel-button" variant="outlined" onClick={handleCancel} disabled={isCreating}>
                  İptal
                </Button>
                <LoadingButton
                  id="create-button"
                  onClick={form.handleSubmit(handleSubmit)}
                  variant="contained"
                  loading={isCreating}
                  disabled={isCreating}>
                  Oluştur
                </LoadingButton>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default TransactionFeeScalesCreatePage;
