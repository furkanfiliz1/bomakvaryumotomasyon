import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Grid, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { SupplierQueryFormValues } from '../supplier-query.types';

interface SupplierQueryFormProps {
  form: UseFormReturn<SupplierQueryFormValues>;
  schema: ObjectSchema<SupplierQueryFormValues>;
  onSubmit: (values: SupplierQueryFormValues) => Promise<void>;
  isSearching: boolean;
  onReset: () => void;
}

const SupplierQueryForm: React.FC<SupplierQueryFormProps> = ({ form, schema, onSubmit, isSearching, onReset }) => {
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
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onReset} disabled={isSearching} startIcon={<Clear />}>
              Temizle
            </Button>
            <Button
              variant="contained"
              disabled={isSearching}
              onClick={() => form.handleSubmit(handleFormSubmit)()}
              startIcon={<Search />}>
              {isSearching ? 'Aranıyor...' : 'Uygula'}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Action Buttons */}
    </Card>
  );
};

export default SupplierQueryForm;
