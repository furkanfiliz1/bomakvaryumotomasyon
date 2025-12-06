import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { AnyObjectSchema } from 'yup';

/**
 * Filter component for Guarantee Protocol report
 * Following OperationPricing pattern exactly - using Form component with React Hook Form
 */

interface FormData {
  FinancerIdentifier: string | number;
  SenderIdentifier: string | number;
  StartDate: string;
  EndDate: string;
}

interface GuaranteeProtocolFiltersProps {
  form: UseFormReturn<FormData>;
  schema: AnyObjectSchema;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const GuaranteeProtocolFilters: React.FC<GuaranteeProtocolFiltersProps> = ({
  form,
  schema,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form} schema={schema}>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
          <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
            Temizle
          </Button>
          <Button variant="contained" onClick={onSearch} disabled={isLoading} startIcon={<Search />}>
            Uygula
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
