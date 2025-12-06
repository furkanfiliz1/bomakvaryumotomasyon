import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { AnyObjectSchema } from 'yup';

/**
 * Filter component for Integrator Consensus report
 * Following OperationPricing pattern exactly - using Form component with React Hook Form
 */

interface FormData {
  IntegratorId: number | string;
  StartDate: string;
  EndDate: string;
  IsIntegratorConnect: string;
}

interface IntegratorConsensusFiltersProps {
  form: UseFormReturn<FormData>;
  schema: AnyObjectSchema;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
  handleExcelExport: () => void;
}

export const IntegratorConsensusFilters: React.FC<IntegratorConsensusFiltersProps> = ({
  form,
  schema,
  onSearch,
  onReset,
  handleExcelExport,
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

          <Button variant="contained" onClick={handleExcelExport} disabled={isLoading} startIcon={<Download />}>
            Excel
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
