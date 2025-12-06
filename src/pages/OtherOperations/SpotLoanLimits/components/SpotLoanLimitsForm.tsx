import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { SpotLoanLimitsFormValues } from '../spot-loan-limits.types';

interface SpotLoanLimitsFormProps {
  form: UseFormReturn<SpotLoanLimitsFormValues>;
  schema: ObjectSchema<SpotLoanLimitsFormValues>;
  onSubmit: (values: SpotLoanLimitsFormValues) => Promise<void>;
  isSearching: boolean;
  onReset: () => void;
}

const SpotLoanLimitsForm: React.FC<SpotLoanLimitsFormProps> = ({ form, schema, onSubmit, isSearching, onReset }) => {
  const handleFormSubmit = async () => {
    const values = form.getValues();
    await onSubmit(values);
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Müşteri Bilgileri
      </Typography>

      <Form form={form} schema={schema} />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
        <Button
          variant="outlined"
          onClick={onReset}
          disabled={isSearching}
          sx={{ minWidth: 120 }}
          startIcon={<Clear />}>
          Temizle
        </Button>
        <Button
          variant="contained"
          disabled={isSearching}
          onClick={() => form.handleSubmit(handleFormSubmit)()}
          sx={{ minWidth: 120 }}
          startIcon={<Search />}>
          {isSearching ? 'Aranıyor...' : 'Uygula'}
        </Button>
      </Stack>
    </Card>
  );
};

export default SpotLoanLimitsForm;
