import { FigoLoading, Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../../components/shared';
import { useManualTransactionFeeEditForm } from '../hooks';
import {
  useGetManualTransactionFeeByIdQuery,
  useGetOperationManualChargeStatusQuery,
  useUpdateManualTransactionFeeMutation,
} from '../manual-transaction-fee-tracking.api';
import { UpdateManualTransactionFeeRequest } from '../manual-transaction-fee-tracking.types';

/**
 * Manual Transaction Fee Edit Page Component
 * Refactored using Form component following OperationPricing pattern
 */
const ManualTransactionFeeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notice = useNotice();

  // Fetch record data and status options
  const { data: transaction, error, isLoading } = useGetManualTransactionFeeByIdQuery(Number(id));
  const { data: statusOptions = [], isLoading: isLoadingStatus } = useGetOperationManualChargeStatusQuery();
  const [updateTransaction, { isLoading: isUpdating, isSuccess, error: updateError }] =
    useUpdateManualTransactionFeeMutation();

  // Memoize initial data to prevent unnecessary form resets
  const initialData = React.useMemo(() => {
    if (!transaction) return undefined;
    return {
      IsInvoiceBilled: transaction.IsInvoiceBilled || false,
      IsExtraFinancialRecorded: transaction.IsExtraFinancialRecorded || false,
      Status: transaction.Status || '',
      Description: transaction.Description || '',
    };
  }, [transaction]);

  // Initialize form with hook following OperationPricing pattern
  const { form, schema } = useManualTransactionFeeEditForm({
    statusOptions,
    initialData,
  });

  // Error handling
  useErrorListener([error, updateError]);

  // Success notification following OperationPricing pattern
  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        message: 'Manuel işlem ücreti başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
      // Delay navigation to allow user to see the success message
      setTimeout(() => {
        navigate('/pricing/manual-transaction-fee-tracking');
      }, 1500);
    }
  }, [isSuccess, notice, navigate]);

  if (isLoading || isLoadingStatus) {
    return <FigoLoading />;
  }

  if (!transaction) {
    return (
      <>
        <PageHeader title="Manuel İşlem Ücreti Düzenle" subtitle="İşlem bulunamadı" />
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            İşlem bulunamadı
          </Typography>
        </Box>
      </>
    );
  }

  const handleSave = form.handleSubmit(async (formData) => {
    try {
      // Helper function to remove empty/null/undefined values (legacy parity)
      const removeEmptyValues = (obj: Record<string, unknown>) => {
        const cleaned: Record<string, unknown> = {};
        Object.keys(obj).forEach((key) => {
          if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            cleaned[key] = obj[key];
          }
        });
        return cleaned;
      };

      // Exact payload structure matching legacy _putTransactionsPayTracking
      const payload = {
        AllowanceId: transaction.AllowanceId,
        IsInvoiceBilled: formData.IsInvoiceBilled,
        IsExtraFinancialRecorded: formData.IsExtraFinancialRecorded,
        Status: Number(formData.Status),
        Description: formData.Description,
      };

      const updateData = {
        Id: Number(id),
        ...removeEmptyValues(payload),
      } as UpdateManualTransactionFeeRequest;

      await updateTransaction(updateData).unwrap();
      // Success navigation is handled by useEffect when isSuccess becomes true
    } catch (error) {
      // Error will be handled by useErrorListener and displayed via notification system
      console.error('Failed to update transaction:', error);
    }
  });

  return (
    <>
      <PageHeader title="Manuel İşlem Ücreti Düzenle" subtitle="Manuel işlem ücreti kayıtlarını düzenle" />

      <Box sx={{ p: 2 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography variant="h6" gutterBottom>
                Manuel İşlem Ücreti Düzenleme
              </Typography>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box sx={{ mt: 2 }}>
                <Form form={form} schema={schema} space={2} />
              </Box>
            </Grid>
          </Grid>

          {/* Form Component with schema-based rendering */}

          <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </Stack>
        </Card>
      </Box>
    </>
  );
};

export default ManualTransactionFeeEditPage;
