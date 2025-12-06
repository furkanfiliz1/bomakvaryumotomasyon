import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Grid, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { RevolvingLoanLimitsFormValues } from '../revolving-loan-limits.types';

interface RevolvingLoanLimitsFormProps {
  form: UseFormReturn<RevolvingLoanLimitsFormValues>;
  schema: ObjectSchema<RevolvingLoanLimitsFormValues>;
  onSubmit: (values: RevolvingLoanLimitsFormValues) => Promise<void>;
  isSearching: boolean;
  onReset: () => void;
}

const RevolvingLoanLimitsForm: React.FC<RevolvingLoanLimitsFormProps> = ({
  form,
  schema,
  onSubmit,
  isSearching,
  onReset,
}) => {
  const handleFormSubmit = async () => {
    const values = form.getValues();
    await onSubmit(values);
  };

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Form form={form} schema={schema} />
        </Grid>
        <Grid item xs={4}>
          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button
              variant="outlined"
              onClick={onReset}
              disabled={isSearching}
              sx={{ minWidth: 120 }}
              startIcon={<Clear />}>
              Temizle
            </Button>{' '}
            <Button
              variant="contained"
              disabled={isSearching}
              onClick={() => form.handleSubmit(handleFormSubmit)()}
              sx={{ minWidth: 120 }}
              startIcon={<Search />}>
              {isSearching ? 'Aranıyor...' : 'Sorgula'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RevolvingLoanLimitsForm;
