import { PageHeader, useNotice } from '@components';
import { Alert, Box, Card, CircularProgress, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useErrorListener } from '@hooks';
import { ChargeHistoryTable, OperationChargeFormWithAmounts } from '../components';
import { transformFormDataToApiRequest } from '../helpers';
import { useOperationChargeForm } from '../hooks';
import {
  useGetOperationChargeByIdQuery,
  useLazyGetDiscountAutoFillItemsQuery,
  useUpdateOperationChargeMutation,
} from '../operation-charge.api';
import type { OperationChargeAmount } from '../operation-charge.types';
import { UpdateOperationChargeRequest } from '../operation-charge.types';
import type { ChargeHistoryTableRef } from './ChargeHistoryTable';

/**
 * Operation Charge Edit Page
 * Matches legacy /ucretlendirme/islem-basi-ucretlendirme/duzenle/{id} exactly
 */
export const OperationChargeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const { id } = useParams<{ id: string }>();
  const [amounts, setAmounts] = useState<OperationChargeAmount[]>([]);
  const chargeHistoryTableRef = useRef<ChargeHistoryTableRef>(null);

  // Callback to refetch charge history when amount is deleted
  const handleDeleteSuccess = () => {
    chargeHistoryTableRef.current?.refetch();
    refetchOperationCharge();
  };

  // RTK Query hooks
  const {
    data: operationChargeData,
    isLoading: isLoadingData,
    error: loadError,
    refetch: refetchOperationCharge,
  } = useGetOperationChargeByIdQuery(Number(id), { skip: !id });
  const [updateOperationCharge, { isLoading: isUpdating, error: updateError }] = useUpdateOperationChargeMutation();
  const [getDiscountAutoFillItems, { error: autoFillError }] = useLazyGetDiscountAutoFillItemsQuery();

  // Error listeners for API errors
  useErrorListener([loadError, updateError, autoFillError]);

  // Load amounts data when API data is received
  React.useEffect(() => {
    if (operationChargeData?.OperationChargeAmounts) {
      const transformedAmounts: OperationChargeAmount[] = operationChargeData.OperationChargeAmounts.map((amount) => ({
        Id: amount.ID,
        MinAmount: amount.MinAmount,
        MaxAmount: amount.MaxAmount,
        TransactionFee: amount.TransactionFee,
        PercentFee: amount.PercentFee,
        MinDueDay: amount.MinDueDay,
        MaxDueDay: amount.MaxDueDay,
        MinScore: amount.MinScore,
        MaxScore: amount.MaxScore,
        ProrationDays: amount.ProrationDays,
        InsertDate: amount.CreatedAt,
      }));
      setAmounts(transformedAmounts);
    }
  }, [operationChargeData]);

  // Handle amounts change with refetch
  const handleAmountsChange = (newAmounts: OperationChargeAmount[]) => {
    setAmounts(newAmounts);
    // Refetch operation charge data to get updated amounts from server
    void refetchOperationCharge();
    // Also refetch charge history table
    chargeHistoryTableRef.current?.refetch();
  };

  // Call getDiscountAutoFillItems when data is loaded and has required fields
  React.useEffect(() => {
    if (
      operationChargeData &&
      (operationChargeData.SenderIdentifier ||
        operationChargeData.ReceiverIdentifier ||
        operationChargeData.FinancerIdentifier) &&
      operationChargeData.ProductType
    ) {
      // Determine which identifier to use based on available data
      const identifier =
        operationChargeData.SenderIdentifier ||
        operationChargeData.ReceiverIdentifier ||
        operationChargeData.FinancerIdentifier;

      if (identifier) {
        void getDiscountAutoFillItems({
          Identifier: identifier,
          ProductType: String(operationChargeData.ProductType),
        });
      }
    }
  }, [operationChargeData, getDiscountAutoFillItems]);

  const handleUpdateSubmit = async (apiRequestData: ReturnType<typeof transformFormDataToApiRequest>) => {
    if (!id) return;

    try {
      const requestData: UpdateOperationChargeRequest = {
        Id: Number(id),
        ...apiRequestData,
        OperationChargeAmounts: amounts,
      };

      await updateOperationCharge(requestData).unwrap();

      // Show success notification
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem başı ücretlendirme başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });

      // Navigate back to list on success
      navigate('/pricing/islem-basi-ucretlendirme');
    } catch (error) {
      // Error handling is managed by useErrorListener
    }
  };

  const { form, handleSubmit: formHandleSubmit } = useOperationChargeForm({
    initialData: operationChargeData,
    onSubmit: (data) => {
      void handleUpdateSubmit(data);
    },
  });

  if (!id) {
    return (
      <Box>
        <Alert severity="error">Geçersiz ID parametresi</Alert>
      </Box>
    );
  }

  if (isLoadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box>
        <Alert severity="error">Veri yüklenirken hata oluştu. Lütfen tekrar deneyin.</Alert>
      </Box>
    );
  }

  if (!operationChargeData) {
    return (
      <Box>
        <Alert severity="warning">İşlem başı ücretlendirme kaydı bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <>
      <PageHeader title="İşlem Başı Ücretlendirme Düzenle" subtitle="Ücretlendirme" />

      <Box sx={{ m: 3 }}>
        <Stack spacing={3}>
          {/* Main Form with Amounts */}
          <OperationChargeFormWithAmounts
            form={form}
            onSubmit={formHandleSubmit}
            disabled={isUpdating}
            amounts={amounts}
            onAmountsChange={handleAmountsChange}
            isEditMode={true} // Enable edit mode to disable main form fields (matching old project inputDisabled pattern)
            onDeleteSuccess={handleDeleteSuccess}
            operationChargeId={Number(id)}
          />

          {/* Charge History Table */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Geçmiş İşlemler
            </Typography>
            <ChargeHistoryTable
              ref={chargeHistoryTableRef}
              operationChargeId={Number(id)}
              transactionType={form.watch('TransactionType') || String(operationChargeData?.TransactionType ?? '2')}
            />
          </Card>
        </Stack>
      </Box>
    </>
  );
};
