import { Form } from '@components';
import { Button, Card, CardContent, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

interface BuyerReconciliationFiltersProps {
  form: UseFormReturn;
  schema: yup.AnyObjectSchema;
  onFilter: () => void;
  onReset: () => void;
  isLoading?: boolean;
  isBuyersSearchLoading?: boolean;
}

/**
 * Filter component for Buyer Reconciliation Report
 * Matches legacy ReceiverInvoiceReconciliation filter layout exactly
 */
export const BuyerReconciliationFilters: React.FC<BuyerReconciliationFiltersProps> = ({
  form,
  schema,
  onFilter,
  onReset,
  isLoading = false,
  isBuyersSearchLoading = false,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Form form={form} schema={schema}>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onReset} disabled={isLoading}>
              Temizle
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onFilter}
              disabled={isLoading || isBuyersSearchLoading}
              sx={{ minWidth: 100 }}>
              {isLoading ? 'Yükleniyor...' : 'Filtrele'}
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
