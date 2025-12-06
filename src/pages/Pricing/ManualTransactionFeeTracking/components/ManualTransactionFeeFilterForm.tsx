import { Form } from '@components';
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useManualTransactionFeeFilterForm } from '../hooks';
import { ManualTransactionFeeFilters } from '../manual-transaction-fee-tracking.types';

interface ManualTransactionFeeFilterFormProps {
  onFilterChange: (filters: Partial<ManualTransactionFeeFilters>) => void;
}

const ManualTransactionFeeFilterForm: React.FC<ManualTransactionFeeFilterFormProps> = ({ onFilterChange }) => {
  const { form, schema, handleSearch, handleReset, dropdownLoading } = useManualTransactionFeeFilterForm({
    onFilterChange,
  });

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Arama Filtreleri
        </Typography>

        <Form form={form as unknown as UseFormReturn<FieldValues>} schema={schema}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSearch} disabled={dropdownLoading}>
                Uygula
              </Button>
              <Button variant="outlined" onClick={handleReset} disabled={dropdownLoading}>
                Temizle
              </Button>
            </Stack>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualTransactionFeeFilterForm;
