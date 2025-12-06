import { Form, LoadingButton, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropdownData, useTransactionFeeDiscountForm } from '../hooks';
import { useCreateCompanyDiscountMutation, useGetDiscountTypesQuery } from '../transaction-fee-discount.api';
import { TransactionFeeDiscountFormData } from '../transaction-fee-discount.types';

/**
 * Transaction Fee Discount Create Page
 * 1:1 recreation of legacy İşlem Ücreti İndirim Tanımlama Ekleme page
 * Matches all form fields, validation, and behavior exactly
 */
const TransactionFeeDiscountCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Get dropdown data for async search
  const {
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  } = useDropdownData();

  // Get discount types for dropdown
  const { data: discountTypesData, isLoading: isDiscountTypesLoading } = useGetDiscountTypesQuery();

  // Transform discount types to form options - matches actual API response
  const discountTypes = useMemo(() => {
    return (discountTypesData || []).map((type) => ({
      label: type.Description,
      value: parseInt(type.Value, 10), // Convert string to number for form handling
    }));
  }, [discountTypesData]);

  // Form management hook
  const { form, schema, transformToCreateRequest } = useTransactionFeeDiscountForm({
    discountTypes,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  });

  // Create mutation
  const [createDiscount, { isLoading: isCreating, error }] = useCreateCompanyDiscountMutation();

  // Error handling
  useErrorListener(error);

  // Handle form submission - matches legacy creation flow
  const handleSubmit = async (formData: TransactionFeeDiscountFormData) => {
    try {
      const requestData = transformToCreateRequest(formData);
      await createDiscount(requestData).unwrap();

      // Success notification - matches legacy exactly
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İndirim Eklendi',
        buttonTitle: 'Tamam',
        onClick: () => navigate('/pricing/indirim-tanimlama'),
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Create failed:', error);
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate('/pricing/indirim-tanimlama');
  };

  // Show loading state while discount types are loading
  if (isDiscountTypesLoading) {
    return (
      <>
        <PageHeader title="İşlem Ücreti İndirimi Tanımla" subtitle="Bu sayfadan indirim tanımlayabilirsiniz" />
        <Box mx={2}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" p={4}>
                Yükleniyor...
              </Box>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="İşlem Ücreti İndirimi Tanımla" subtitle="Bu sayfadan indirim tanımlayabilirsiniz" />

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
                  Ekle
                </LoadingButton>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default TransactionFeeDiscountCreatePage;
