/**
 * Integrator Reconciliation Charts Main Page
 * Complete implementation matching legacy IntegratorConsensusCharts
 * Following OperationPricing page patterns with Form component
 */

import { PageHeader } from '@components';
import { Box } from '@mui/material';
import React from 'react';
import { useIntegratorChartForm } from '../hooks';
import { IntegratorReconciliationChartsForm } from './IntegratorReconciliationChartsForm';
import { IntegratorReconciliationChartsList } from './IntegratorReconciliationChartsList';

const IntegratorReconciliationChartsPage: React.FC = () => {
  const { form, schema, handleSubmit, isCreating, data, isLoading, refetch } = useIntegratorChartForm();

  return (
    <>
      <PageHeader title="Entegratör Mutabakat Baremleri" subtitle="Entegratör mutabakat baremi tanımlamaları" />

      <Box sx={{ mt: 3 }}>
        {/* Form Section - matches legacy renderCreate() */}
        <IntegratorReconciliationChartsForm
          form={form}
          schema={schema}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
        />

        {/* Table List Section - matches legacy renderListHeader() + renderList() */}
        <IntegratorReconciliationChartsList data={data} isLoading={isLoading} onRefetch={refetch} />
      </Box>
    </>
  );
};

export default IntegratorReconciliationChartsPage;
