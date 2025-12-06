import { Form } from '@components';
import { Button, Card, CardContent, Grid, Stack } from '@mui/material';
import yup from '@validation';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CompanyListItem } from '../integration-reports.types';

interface IntegrationReportsFiltersProps {
  form: UseFormReturn<Record<string, unknown>>;
  schema: yup.ObjectSchema<Record<string, unknown>>;
  companyList: CompanyListItem[];
  onSearch: () => void;
  onReset: () => void;
}

/**
 * Integration Reports Filters Component
 * Following OperationPricing filters pattern with legacy field layout
 */
export const IntegrationReportsFilters: React.FC<IntegrationReportsFiltersProps> = ({
  form,
  schema,
  companyList,
  onSearch,
  onReset,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Form form={form} schema={schema}>
          {/* Additional company identifier dropdown like legacy system */}
          {companyList.length > 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                {/* Company dropdown will be handled by the form system through CompanyIdentifier field */}
              </Grid>
            </Grid>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={onSearch}>
              Uygula
            </Button>
            <Button variant="outlined" onClick={onReset}>
              Temizle
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
