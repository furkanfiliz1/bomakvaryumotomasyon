import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Button, Card, Grid, Stack } from '@mui/material';
import React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import type { ScoreInvoiceReportsFilterForm } from '../score-invoice-reports.types';

interface ScoreInvoiceReportsFiltersProps {
  form: UseFormReturn<ScoreInvoiceReportsFilterForm>;
  schema: yup.ObjectSchema<ScoreInvoiceReportsFilterForm>;
  onSubmit: SubmitHandler<ScoreInvoiceReportsFilterForm>;
  onReset: () => void;
  isLoading: boolean;
  handleExport: () => void;
}

export const ScoreInvoiceReportsFilters: React.FC<ScoreInvoiceReportsFiltersProps> = ({
  form,
  schema,
  onSubmit,
  onReset,
  handleExport,
  isLoading,
}) => {
  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form} schema={schema}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
            <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
              Temizle
            </Button>
            <Button
              variant="contained"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              startIcon={<Search />}>
              Uygula
            </Button>

            <Button variant="contained" onClick={handleExport} disabled={isLoading} startIcon={<Download />}>
              Excel
            </Button>
          </Stack>
        </Grid>
      </Form>
    </Card>
  );
};
