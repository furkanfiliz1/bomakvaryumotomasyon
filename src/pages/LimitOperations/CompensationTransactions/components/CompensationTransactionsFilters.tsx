import { Form } from '@components';
import { Add, Clear, Search } from '@mui/icons-material';
import { Button, Card, CardContent, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AnyObject, ObjectSchema } from 'yup';

interface CompensationTransactionsFiltersProps {
  form: UseFormReturn<Record<string, unknown>>;
  schema: ObjectSchema<Record<string, unknown>, AnyObject>;
  handleSearch: () => void;
  handleReset: () => void;
  isLoading?: boolean;
  handleCreate: () => void;
}

export const CompensationTransactionsFilters: React.FC<CompensationTransactionsFiltersProps> = ({
  form,
  schema,
  handleSearch,
  handleReset,
  isLoading = false,
  handleCreate,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Form form={form} schema={schema}>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} justifyContent="space-between" alignItems="center">
            <Button variant="outlined" color="primary" startIcon={<Add />} onClick={handleCreate}>
              Ekle
            </Button>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSearch} disabled={isLoading} startIcon={<Search />}>
                Uygula
              </Button>
              <Button variant="outlined" onClick={handleReset} disabled={isLoading} startIcon={<Clear />}>
                Temizle
              </Button>
            </Stack>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
