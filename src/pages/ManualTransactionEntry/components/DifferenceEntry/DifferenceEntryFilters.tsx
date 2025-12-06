import { Form } from '@components';
import { Add, Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { AnyObject, ObjectSchema } from 'yup';
import type { DifferenceEntryFilterFormData } from './hooks/useDifferenceEntryFilterForm';

interface DifferenceEntryFiltersProps {
  form: UseFormReturn<DifferenceEntryFilterFormData, unknown, undefined>;
  schema: ObjectSchema<AnyObject>;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
  isExporting?: boolean;
  handleExportRecords?: () => void;
  handleAddRecord?: () => void;
}

/**
 * Filter form component for Difference Entry following OperationPricing pattern exactly
 * Uses Form component with schema-based approach following project patterns
 */
const DifferenceEntryFilters: React.FC<DifferenceEntryFiltersProps> = ({
  form,
  schema,
  onApply,
  onReset,
  isLoading = false,
  isExporting = false,
  handleExportRecords,
  handleAddRecord,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form as unknown as UseFormReturn<FieldValues>} schema={schema}>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="space-between">
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddRecord}>
            Ekle
          </Button>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
              Temizle
            </Button>
            <Button variant="contained" color="primary" onClick={onApply} disabled={isLoading} startIcon={<Search />}>
              Uygula
            </Button>

            <Button variant="contained" onClick={handleExportRecords} disabled={isLoading || isExporting}>
              {isExporting ? 'İndiriliyor...' : 'Excel'}
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Card>
  );
};

export default DifferenceEntryFilters;
