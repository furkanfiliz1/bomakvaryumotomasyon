import { Form, PageHeader, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Alert, Box, Button, Card, CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetCompensationTransactionByIdQuery,
  useGetCompensationTransactionTypesQuery,
  useGetFinancerCompaniesForCompensationQuery,
  useUpdateCompensationTransactionMutation,
} from '../compensation-transactions.api';
import type { CompensationTransactionFormData } from '../compensation-transactions.types';
import {
  createCompensationTransactionUpdateSchema,
  transformFinancerCompanies,
  transformTransactionTypes,
} from '../helpers';

/**
 * Update Compensation Transaction Page Component
 * Based on legacy UpdateCompensationTransaction.js but following OperationPricing patterns
 */
export const UpdateCompensationTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const { id } = useParams<{ id: string }>();

  const compensationTransactionId = id ? parseInt(id, 10) : 0;

  // API hooks
  const {
    data: compensationTransaction,
    isLoading: isLoadingTransaction,
    error: transactionError,
  } = useGetCompensationTransactionByIdQuery(compensationTransactionId, {
    skip: !compensationTransactionId,
  });

  const { data: transactionTypes, isLoading: isLoadingTypes } = useGetCompensationTransactionTypesQuery();
  const { data: financerCompanies, isLoading: isLoadingFinancers } = useGetFinancerCompaniesForCompensationQuery();

  const [updateCompensationTransaction, { isLoading: isUpdating, error: updateError }] =
    useUpdateCompensationTransactionMutation();

  // Error handling
  useErrorListener([transactionError, updateError]);

  // Form setup
  const schema = useMemo(
    () =>
      createCompensationTransactionUpdateSchema(
        transformTransactionTypes(transactionTypes || []),
        transformFinancerCompanies(financerCompanies || []),
      ),
    [transactionTypes, financerCompanies],
  );

  const form = useForm<CompensationTransactionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      operationType: '',
      identifier: '',
      customerName: '',
      financerCompany: undefined,
      transactionDate: '',
      amount: 0,
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (compensationTransaction) {
      form.reset({
        operationType: String(compensationTransaction.Type),
        identifier: compensationTransaction.Identifier,
        customerName: compensationTransaction.CustomerName,
        financerCompany: compensationTransaction.FinancerId > 0 ? compensationTransaction.FinancerId : undefined,
        transactionDate: compensationTransaction.TransactionDate,
        amount: compensationTransaction.Amount,
      });
    }
  }, [compensationTransaction, form]);

  // Handle form submission
  const handleSubmit = async (formData: CompensationTransactionFormData) => {
    try {
      const updateData = {
        Identifier: formData.identifier,
        TransactionDate: formData.transactionDate,
        Amount: formData.amount,
        Type: formData.operationType,
        FinancerId: formData.financerCompany,
      };

      await updateCompensationTransaction({
        id: compensationTransactionId,
        data: updateData,
      }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: formData.operationType === '1' ? 'Tahsilat başarıyla güncellendi' : 'Maliyet başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      navigate('/limit-operations/legal-proceedings/compensation-transactions');
    } catch (error) {
      console.error('Update failed:', error);
      // Error handling is managed by the error listener
    }
  };

  const handleBack = () => {
    navigate('/limit-operations/legal-proceedings/compensation-transactions');
  };

  // Loading state
  if (isLoadingTransaction || isLoadingTypes || isLoadingFinancers) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (transactionError || !compensationTransaction) {
    return (
      <Box sx={{ p: 3 }}>
        <PageHeader title="Tazmin İşlemi Güncelle" subtitle="Kanuni Takip - Muhasebe İşlemleri" />
        <Alert severity="error">Tazmin işlemi bulunamadı veya yüklenirken bir hata oluştu.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Tazmin İşlemi Güncelle" subtitle="Kanuni Takip - Muhasebe İşlemleri" />
      <Box mx={2}>
        <Card sx={{ p: 2, mt: 2 }}>
          <Form
            form={form}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema={schema as any}
            space={3}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 4, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleBack} disabled={isUpdating}>
              İptal
            </Button>
            <Button variant="contained" color="primary" onClick={form.handleSubmit(handleSubmit)} disabled={isUpdating}>
              {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};
