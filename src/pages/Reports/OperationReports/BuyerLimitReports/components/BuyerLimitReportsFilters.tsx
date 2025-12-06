import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { BuyerLimitReportsFilterForm } from '../buyer-limit-reports.types';

interface BuyerLimitReportsFiltersProps {
  form: UseFormReturn<BuyerLimitReportsFilterForm>;
  schema: ObjectSchema<BuyerLimitReportsFilterForm>;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitDisabled: boolean;
  isLoading?: boolean;
}

export const BuyerLimitReportsFilters: React.FC<BuyerLimitReportsFiltersProps> = ({
  form,
  schema,
  onSubmit,
  onReset,
  isSubmitDisabled,
  isLoading = false,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      {/* Form Component with Schema - following OperationPricing pattern */}
      <Form form={form} schema={schema} />
      {/* Action Buttons - matching legacy button layout */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
        <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
          Temizle
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitDisabled || isLoading} startIcon={<Search />}>
          Uygula
        </Button>
      </Stack>
    </Card>
  );
};
