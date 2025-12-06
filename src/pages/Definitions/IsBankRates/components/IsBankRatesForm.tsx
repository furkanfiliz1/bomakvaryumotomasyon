/**
 * İş Bankası Oranları Create Form Component
 * Matches legacy Rates.js renderPost() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import { DEFAULT_CURRENCY_ID, isValidYear } from '../helpers';
import { useIsBankRatesForm } from '../hooks';
import { useCreateIsBankRateMutation } from '../is-bank-rates.api';

interface IsBankRatesFormProps {
  onSuccess: () => void;
}

export const IsBankRatesForm: React.FC<IsBankRatesFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { form, schema, resetForm } = useIsBankRatesForm();

  const [createIsBankRate, { isLoading: isCreating, error: createError }] = useCreateIsBankRateMutation();

  // Handle errors with useErrorListener
  useErrorListener(createError);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    // Validate required fields (matching legacy validation)
    if (!formData.Year || !formData.Month || !formData.BuyingRate) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Tüm alanların doldurulması zorunludur',
      });
      return;
    }

    const year = Number.parseInt(String(formData.Year), 10);

    // Validate year range (matching legacy: year > 1900 && year < 2030)
    if (!isValidYear(year)) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Geçerli bir yıl giriniz',
      });
      return;
    }

    try {
      await createIsBankRate({
        Year: year,
        Month: Number.parseInt(String(formData.Month), 10),
        BuyingRate: Number.parseFloat(String(formData.BuyingRate).replace(',', '.')),
        CurrencyId: DEFAULT_CURRENCY_ID,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kur başarıyla oluşturuldu',
      });
      resetForm();
      onSuccess();
    } catch {
      // Error handled by useErrorListener
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
        Oran Girişi
      </Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <Box>
          <Form form={form} schema={schema} childCol={2}>
            <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
              <LoadingButton
                id="create-is-bank-rate-btn"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                loading={isCreating}
                startIcon={<Add />}>
                Oluştur
              </LoadingButton>
            </Stack>
          </Form>
        </Box>
      </Card>
    </Box>
  );
};

export default IsBankRatesForm;
