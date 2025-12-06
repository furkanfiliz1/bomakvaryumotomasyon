/**
 * Integrator Reconciliation Charts Form Component
 * Form for creating new integrator chart entries using Form component
 * Matches legacy renderCreate() method exactly
 * Following forms.instructions.md patterns
 */

import { Form, LoadingButton } from '@components';
import { Card, Grid } from '@mui/material';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { ObjectSchema } from 'yup';
import type { IntegratorChartFormData } from '../integrator-reconciliation-charts.types';

interface IntegratorReconciliationChartsFormProps {
  form: UseFormReturn<IntegratorChartFormData>;
  schema: ObjectSchema<IntegratorChartFormData>;
  onSubmit: (data: IntegratorChartFormData) => void;
  isSubmitting: boolean;
}

/**
 * Form component with 4 currency input fields using Form schema
 * Matches legacy UI layout and behavior exactly
 */
export const IntegratorReconciliationChartsForm: React.FC<IntegratorReconciliationChartsFormProps> = ({
  form,
  schema,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="flex-end">
        {/* Form fields (4 currency inputs) */}
        <Grid item xs={12} md={10}>
          <Form form={form} schema={schema} space={2} />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} md={2}>
          <LoadingButton
            id="submit-integrator-chart"
            fullWidth
            variant="contained"
            color="primary"
            onClick={form.handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            sx={{ height: '56px' }}>
            Ekle
          </LoadingButton>
        </Grid>
      </Grid>
    </Card>
  );
};
