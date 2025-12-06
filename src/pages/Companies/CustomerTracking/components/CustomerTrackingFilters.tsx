import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

interface CustomerTrackingFiltersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: yup.ObjectSchema<any>;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const CustomerTrackingFilters: React.FC<CustomerTrackingFiltersProps> = ({
  form,
  schema,
  onSearch,
  onReset,
  isLoading,
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

export default CustomerTrackingFilters;
