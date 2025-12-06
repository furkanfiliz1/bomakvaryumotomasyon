/**
 * Bank Figo Rebate Create Form Component
 * Matches legacy renderPost() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Box, Card, Stack } from '@mui/material';
import React from 'react';
import { useCreateBankFigoRebateMutation } from '../bank-figo-rebate.api';
import { formatDateForApi } from '../helpers';
import { useBankFigoRebateDropdownData, useBankFigoRebateForm } from '../hooks';

interface BankFigoRebateFormProps {
  onSuccess: () => void;
}

export const BankFigoRebateForm: React.FC<BankFigoRebateFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { financerCompanyList, isLoading: isDropdownLoading } = useBankFigoRebateDropdownData();
  const { form, schema, resetForm } = useBankFigoRebateForm({ financerCompanyList });

  const [createRebate, { isLoading: isCreating, error: createError }] = useCreateBankFigoRebateMutation();

  // Handle errors with useErrorListener
  useErrorListener(createError);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    // Validate required fields (matching legacy validation)
    if (!formData.FinancerCompanyId || !formData.StartDate || !formData.Rate) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Finansör, Tarih Aralığı veya Oran girmek zorunludur',
      });
      return;
    }

    try {
      await createRebate({
        FinancerCompanyId: Number(formData.FinancerCompanyId),
        StartDate: formatDateForApi(formData.StartDate) as string,
        FinishDate: formatDateForApi(formData.FinishDate || null),
        Rate: parseFloat(formData.Rate),
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kayıt Başarı ile Oluşturuldu',
      });
      resetForm();
      onSuccess();
    } catch {
      // Error handled by useErrorListener
    }
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box>
        <Form form={form} schema={schema}>
          <Stack direction="row" justifyContent="flex-start" sx={{ mt: 1 }}>
            <LoadingButton
              id="create-rebate-btn"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              loading={isCreating || isDropdownLoading}
              startIcon={<Add />}>
              Oluştur
            </LoadingButton>
          </Stack>
        </Form>
      </Box>
    </Card>
  );
};

export default BankFigoRebateForm;
