import { Form, LoadingButton, PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropdownData, useTransactionFeeDiscountForm } from '../hooks';
import {
  useGetCompanyDiscountByIdQuery,
  useGetDiscountTypesQuery,
  useUpdateCompanyDiscountMutation,
} from '../transaction-fee-discount.api';
import { TransactionFeeDiscountFormData } from '../transaction-fee-discount.types';

/**
 * Transaction Fee Discount Edit Page
 * 1:1 recreation of legacy DiscountPricingEdit.js
 * Matches all form fields, validation, and behavior exactly
 */
const TransactionFeeDiscountEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  // Get existing discount data
  const {
    data: discountData,
    isLoading: isDiscountLoading,
    error: fetchError,
  } = useGetCompanyDiscountByIdQuery(Number(id!), { skip: !id });

  // Get discount types for dropdown
  const { data: discountTypesData, isLoading: isDiscountTypesLoading } = useGetDiscountTypesQuery();

  // Transform discount types to form options - matches actual API response
  const discountTypes = useMemo(() => {
    return (discountTypesData || []).map((type) => ({
      label: type.Description,
      value: parseInt(type.Value, 10), // Convert string to number for form handling
    }));
  }, [discountTypesData]);

  // Transform existing data to form format
  const initialValues = useMemo((): TransactionFeeDiscountFormData | undefined => {
    if (!discountData) return undefined;

    return {
      Type: discountData.Type,
      ReceiverCompanyIdentifier: discountData.ReceiverCompanyIdentifier,
      SenderCompanyIdentifier: discountData.SenderCompanyIdentifier,
      Percent: discountData.Percent,
      Amount: discountData.Amount,
      StartDate: discountData.StartDate,
      ExpireDateTime: discountData.ExpireDateTime,
    };
  }, [discountData]);

  // Form management hook
  const { form, schema, transformToUpdateRequest } = useTransactionFeeDiscountForm({
    discountTypes,
    initialValues,
    isEditing: true,
    buyersCompanySearchResults,
    sellersCompanySearchResults,
    searchBuyersByCompanyNameOrIdentifier,
    searchSellersByCompanyNameOrIdentifier,
    isBuyersSearchLoading,
    isSellersSearchLoading,
  });

  // Reset form when initial values change
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Update mutation
  const [updateDiscount, { isLoading: isUpdating, error: updateError }] = useUpdateCompanyDiscountMutation();

  // Error handling
  useErrorListener(fetchError);
  useErrorListener(updateError);

  // Handle form submission - matches legacy update flow
  const handleSubmit = async (formData: TransactionFeeDiscountFormData) => {
    try {
      const requestData = transformToUpdateRequest(formData, Number(id!));
      await updateDiscount({ id: Number(id!), data: requestData }).unwrap();

      // Success notification - matches legacy exactly
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İndirim Güncellendi',
        buttonTitle: 'Tamam',
        onClick: () => navigate('/pricing/indirim-tanimlama'),
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Update failed:', error);
    }
  };

  // Handle cancel/back navigation
  const handleCancel = () => {
    navigate('/pricing/indirim-tanimlama');
  };

  // Show loading state while data is loading
  if (isDiscountLoading || isDiscountTypesLoading || !discountData) {
    return (
      <>
        <PageHeader title="İşlem Ücreti İndirimi Güncelle" subtitle="Bu sayfadan indirim güncelleyebilirsiniz" />
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
      <PageHeader title="İşlem Ücreti İndirimi Güncelle" subtitle="Bu sayfadan indirim güncelleyebilirsiniz" />

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

export default TransactionFeeDiscountEditPage;
