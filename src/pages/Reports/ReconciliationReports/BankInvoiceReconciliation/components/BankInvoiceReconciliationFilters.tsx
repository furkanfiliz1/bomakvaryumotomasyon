import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

interface BankInvoiceReconciliationFiltersProps {
  form: UseFormReturn;
  schema: yup.AnyObjectSchema;
  onFilter: () => void;
  onReset: () => void;
  isLoading?: boolean;
  handleExportReport: () => void;
}

/**
 * Filter form component for Bank Invoice Reconciliation
 * Following OperationPricing pattern with Form component
 */
export const BankInvoiceReconciliationFilters: React.FC<BankInvoiceReconciliationFiltersProps> = ({
  form,
  schema,
  onFilter,
  onReset,
  handleExportReport,
  isLoading = false,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form} schema={schema}>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
          <Button variant="outlined" onClick={onReset} startIcon={<Clear />}>
            Temizle
          </Button>
          <Button variant="contained" onClick={onFilter} disabled={isLoading} startIcon={<Search />}>
            Uygula
          </Button>
          <Button variant="contained" onClick={handleExportReport} disabled={isLoading} startIcon={<Download />}>
            Excel
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
