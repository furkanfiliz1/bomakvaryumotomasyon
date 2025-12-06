import { Button, Card, CardContent, Grid, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';

import { Form } from '@components';
import type { CompaniesFilterFormData } from '../limit-operations.types';

interface CompaniesFilterFormProps {
  form: UseFormReturn<CompaniesFilterFormData>;
  schema: ObjectSchema<CompaniesFilterFormData>;
  handleSearch: () => void;
  handleReset: () => void;
  loading?: boolean;
}

const CompaniesFilterForm: React.FC<CompaniesFilterFormProps> = ({
  form,
  schema,
  handleSearch,
  handleReset,
  loading = false,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Form form={form} schema={schema}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSearch} disabled={loading}>
                Uygula
              </Button>
              <Button variant="outlined" onClick={handleReset} disabled={loading}>
                Temizle
              </Button>
            </Stack>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompaniesFilterForm;
