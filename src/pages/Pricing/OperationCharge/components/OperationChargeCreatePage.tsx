import { PageHeader, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OperationChargeFormWithAmounts } from '../components';
import { useOperationChargeForm } from '../hooks';
import { useCreateOperationChargeMutation } from '../operation-charge.api';
import type { CreateOperationChargeRequest, OperationChargeAmount } from '../operation-charge.types';

/**
 * Operation Charge Create Page
 * Matches legacy /ucretlendirme/islem-basi-ucretlendirme/yeni exactly
 */
export const OperationChargeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [createOperationCharge, { data, isLoading: isCreating, error: createError, isSuccess }] =
    useCreateOperationChargeMutation();
  const [amounts, setAmounts] = useState<OperationChargeAmount[]>([]);

  // Error listener for mutation errors
  useErrorListener(createError);
  const handleCreateSubmit = async (apiRequestData: CreateOperationChargeRequest) => {
    const requestData: CreateOperationChargeRequest = {
      ...apiRequestData,
      OperationChargeAmounts: amounts.map((amount) => ({
        MinAmount: amount.MinAmount ?? 0,
        MaxAmount: amount.MaxAmount ?? 0,
        MinDueDay: amount.MinDueDay ?? 0,
        MaxDueDay: amount.MaxDueDay ?? 0,
        MinScore: amount.MinScore,
        MaxScore: amount.MaxScore,
        PercentFee: amount.PercentFee ?? 0,
        TransactionFee: amount.TransactionFee ?? 0,
        ProrationDays: amount.ProrationDays ?? 0,
      })),
    };

    createOperationCharge(requestData).unwrap();
  };

  useEffect(() => {
    if (isSuccess && data?.Id) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem başı ücretlendirme başarıyla oluşturuldu.',
        buttonTitle: 'Tamam',
      });

      // Navigate to edit page with the returned ID
      if (data?.Id) {
        navigate(`/pricing/islem-basi-ucretlendirme/duzenle/${data.Id}`);
      } else {
        navigate('/pricing/islem-basi-ucretlendirme');
      }
    }
  }, [isSuccess, data, navigate, notice]);

  const { form, handleSubmit } = useOperationChargeForm({
    onSubmit: (data) => {
      void handleCreateSubmit(data);
    },
  });

  // Handle save from amount table - directly call API
  const handleAmountSave = async (apiBody: unknown) => {
    try {
      const result = await createOperationCharge(apiBody as CreateOperationChargeRequest).unwrap();

      // Check if the API returned validation errors
      if (!result.IsSuccess && result.ValidationMessage) {
        notice({
          variant: 'error',
          title: 'Doğrulama Hatası',
          message: result.ValidationMessage,
          buttonTitle: 'Tamam',
        });
        return;
      }

      // Success case is handled by the existing useEffect with isSuccess
    } catch (error) {
      // Check if error response contains validation message
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { ValidationMessage?: string };
        if (errorData?.ValidationMessage) {
          notice({
            variant: 'error',
            title: 'Doğrulama Hatası',
            message: errorData.ValidationMessage,
            buttonTitle: 'Tamam',
          });
          return;
        }
      }

      // Let the existing error listener handle other types of errors
      console.error('Operation charge creation failed:', error);
    }
  };

  const handleBack = () => {
    navigate('/pricing/islem-basi-ucretlendirme');
  };

  return (
    <>
      <PageHeader title="İşlem Başı Ücretlendirme Ekle" subtitle="Ücretlendirme" />

      <Box sx={{ m: 3 }}>
        <Stack spacing={2}>
          {/* Main Form */}
          <OperationChargeFormWithAmounts
            form={form}
            onSubmit={handleSubmit}
            disabled={isCreating}
            amounts={amounts}
            onAmountsChange={setAmounts}
            onSave={handleAmountSave}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            <Button variant="outlined" onClick={handleBack} disabled={isCreating}>
              Geri
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
