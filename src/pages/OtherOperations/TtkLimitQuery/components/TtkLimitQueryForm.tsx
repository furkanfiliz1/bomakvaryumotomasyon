import { Form } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { createTtkLimitQuerySchema } from '../helpers';
import type { TtkLimitQueryFormValues } from '../ttk-limit-query.types';

interface TtkLimitQueryFormProps {
  form: UseFormReturn<TtkLimitQueryFormValues>;
  onSubmit: (values: TtkLimitQueryFormValues) => Promise<void>;
  isSearching: boolean;
  onReset: () => void;
}

const TtkLimitQueryForm: React.FC<TtkLimitQueryFormProps> = ({ form, onSubmit, isSearching, onReset }) => {
  const handleFormSubmit = async () => {
    const values = form.getValues();
    await onSubmit(values);
  };

  // Watch form values to handle conditional logic
  const watchedValues = form.watch(['IsExistCustomer', 'searchType']);
  const [isExistCustomer, searchType] = watchedValues;

  // Create a new schema with updated disabled states
  const dynamicSchema = React.useMemo(() => {
    return createTtkLimitQuerySchema({ IsExistCustomer: isExistCustomer, searchType });
  }, [isExistCustomer, searchType]);

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filtreler
      </Typography>

      <Form form={form} schema={dynamicSchema} />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
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
          startIcon={<Search />}
          onClick={() => form.handleSubmit(handleFormSubmit)()}
          sx={{ minWidth: 120 }}>
          {isSearching ? 'Aranıyor...' : 'Uygula'}
        </Button>
      </Stack>
    </Card>
  );
};

export default TtkLimitQueryForm;
