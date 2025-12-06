import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { InvoiceTransactionFilterFormData } from '../hooks/useInvoiceTransactionFilterForm';

interface InvoiceTransactionFiltersComponentProps {
  form: UseFormReturn<InvoiceTransactionFilterFormData, unknown, undefined>;
  schema: ObjectSchema<InvoiceTransactionFilterFormData>;
  onSubmit: () => void;
  onReset: () => void;
  isLoading?: boolean;
  handleExportClick: () => void;
  isFetching?: boolean;
}

/**
 * Invoice Transaction Filters Component
 * Form component for filtering invoice transactions
 */
export const InvoiceTransactionFilters: React.FC<InvoiceTransactionFiltersComponentProps> = ({
  form,
  schema,
  onSubmit,
  onReset,
  isLoading,
  isFetching,
  handleExportClick,
}) => {
  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Form form={form as unknown as UseFormReturn<FieldValues>} schema={schema} space={1} childCol={6} />
      <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
          Temizle
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isLoading} startIcon={<Search />}>
          Uygula
        </Button>
        <Button
          variant="contained"
          onClick={handleExportClick}
          disabled={isLoading || isFetching}
          startIcon={<Download />}>
          Excel
        </Button>
      </Stack>
    </Card>
  );
};
