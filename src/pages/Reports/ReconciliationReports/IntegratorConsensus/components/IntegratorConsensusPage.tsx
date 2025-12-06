import { PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { getIntegratorConsensusTableHeaders } from '../helpers';
import { useIntegratorConsensusDropdownData, useIntegratorConsensusFilterForm } from '../hooks';
import { useLazyGetIntegratorConsensusReportQuery } from '../integrator-consensus.api';
import type {
  IntegratorConsensusFilters,
  IntegratorConsensusItem,
  IntegratorConsensusQueryParams,
} from '../integrator-consensus.types';
import { IntegratorConsensusFilters as FiltersComponent } from './IntegratorConsensusFilters';
import { ConnectionStatusSlot } from './IntegratorConsensusTableSlots';

/**
 * Integrator Consensus Page Component
 * Following OperationPricing pattern exactly with 100% legacy feature parity
 *
 * Legacy URL: /raporlar/entegrator-mutabakat
 * API: /integrators/commission/getreport
 */

export const IntegratorConsensusPage: React.FC = () => {
  // Dropdown data hook following OperationPricing pattern
  const { integratorOptions } = useIntegratorConsensusDropdownData();

  const [additionalFilters, setAdditionalFilters] = useState<Partial<IntegratorConsensusFilters>>({});

  // Form hook following GuaranteeProtocol pattern
  const { form, schema, handleSubmit, handleReset } = useIntegratorConsensusFilterForm({
    onFilterChange: setAdditionalFilters,
    integratorOptions,
  });

  // Convert filters to query parameters
  const queryParams = useMemo(
    (): IntegratorConsensusQueryParams => ({
      IntegratorId: additionalFilters.IntegratorId || undefined,
      StartDate: additionalFilters.StartDate ? additionalFilters.StartDate.toISOString().split('T')[0] : undefined,
      EndDate: additionalFilters.EndDate ? additionalFilters.EndDate.toISOString().split('T')[0] : undefined,
      IsIntegratorConnect:
        additionalFilters.IsIntegratorConnect !== null ? additionalFilters.IsIntegratorConnect : undefined,
    }),
    [additionalFilters],
  );

  // Server-side query hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, getQuery, handleExport } =
    useServerSideQuery(
      useLazyGetIntegratorConsensusReportQuery,
      queryParams,
      { lazyQuery: true }, // Make it lazy so we control when to fetch
    );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table headers configuration
  const tableHeaders = useMemo(() => getIntegratorConsensusTableHeaders(), []);

  // Search handler - manually trigger the API call
  const handleSearch = useCallback(() => {
    const formData = form.getValues();
    handleSubmit(formData);

    // Process form data directly and trigger API call immediately
    if (formData.IntegratorId && formData.StartDate && formData.EndDate) {
      const searchParams: IntegratorConsensusQueryParams = {
        IntegratorId: Number(formData.IntegratorId),
        StartDate: formData.StartDate,
        EndDate: formData.EndDate,
        IsIntegratorConnect:
          formData.IsIntegratorConnect === 'all' ? undefined : formData.IsIntegratorConnect === 'true',
      };
      getQuery(searchParams);
    }
  }, [handleSubmit, form, getQuery]);

  // Excel export handler
  const handleExcelExport = useCallback(() => {
    const formData = form.getValues();

    // Validate form data before export
    if (formData.IntegratorId && formData.StartDate && formData.EndDate) {
      // Find selected integrator to use name instead of ID
      const selectedIntegrator = integratorOptions.find((option) => option.value === formData.IntegratorId);
      const integratorName = selectedIntegrator?.label || formData.IntegratorId;

      // Use integrator name in filename: {IntegratorName}_entegrator_mutabakatı
      const fileName = `${integratorName}_entegrator_mutabakatı`;
      handleExport(fileName);
    }
  }, [form, handleExport, integratorOptions]);

  return (
    <>
      <PageHeader title="Figoskor Entegratör Mutabakatı" subtitle="Entegratör Bazında Mutabakat Detayları" />

      <Box mx={2}>
        {/* Filter Component */}
        <FiltersComponent
          form={form}
          schema={schema}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isFetching || isLoading}
          handleExcelExport={handleExcelExport}
        />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<IntegratorConsensusItem>
            id="integrator-consensus-table"
            rowId="AllowanceId"
            data={tableData}
            headers={tableHeaders}
            loading={isFetching || isLoading}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
              notFoundConfig={{ title: 'Entegratör Bazında Mutabakat verisi bulunamadı' }}
            total={totalCount}>
            {/* Custom cell renderer for connection status column */}
            <Slot<IntegratorConsensusItem> id="IsIntegratorConnect">
              {(_, row) => <ConnectionStatusSlot isConnected={row?.IsIntegratorConnect ?? null} />}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
