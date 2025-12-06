import { PageHeader, Table } from '@components';
import { Box, Card } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useErrorListener, useServerSideQuery } from 'src/hooks';
import { getScoreInvoiceReportsTableHeaders } from '../helpers';
import { useScoreInvoiceReportsFilterForm, useScoreInvoiceReportsQueryParams } from '../hooks';
import { useLazyGetScoreInvoiceReportsQuery } from '../score-invoice-reports.api';
import type { ScoreInvoiceReportItem, ScoreInvoiceReportsFilters } from '../score-invoice-reports.types';
import { ScoreInvoiceReportsFilters as ScoreInvoiceReportsFiltersComponent } from './ScoreInvoiceReportsFilters';

/**
 * Score Invoice Reports Page Component
 * Updated to use useServerSideQuery for paging, filtering and export
 * Route: /reports/score-invoice-reports (matching /raporlar/skor-fatura)
 */
export const ScoreInvoiceReportsPage: React.FC = () => {
  // Additional filters state for useServerSideQuery
  const [additionalFilters, setAdditionalFilters] = useState<Partial<ScoreInvoiceReportsFilters>>({});

  // Initialize filter form with callback to update additionalFilters
  const { form, schema, handleSearch, handleReset } = useScoreInvoiceReportsFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useScoreInvoiceReportsQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook for pagination, filtering, and export
  const {
    data,
    error,
    isLoading,
    isFetching,
    pagingConfig,
    sortingConfig,
    handleExport: handleServerSideExport,
  } = useServerSideQuery(useLazyGetScoreInvoiceReportsQuery, baseQueryParams);

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration - matching legacy headers exactly
  const tableHeaders = useMemo(() => getScoreInvoiceReportsTableHeaders(), []);

  // Handle Excel export with proper filename
  const handleExport = () => {
    const filename = 'skor_fatura_raporlari';
    handleServerSideExport(filename);
  };
  return (
    <>
      <PageHeader title="Skor Fatura Raporları" subtitle="Tedarikçi fatura skor raporları" />
      <Box mx={2}>
        {/* Filters - Following DiscountOperations pattern */}
        <ScoreInvoiceReportsFiltersComponent
          form={form}
          schema={schema}
          onSubmit={handleSearch}
          onReset={handleReset}
          handleExport={handleExport}
          isLoading={isLoading || isFetching}
        />

        {/* Data Table - Following Integration Reports Excel button pattern */}
        <Card sx={{ p: 2 }}>
          <Table<ScoreInvoiceReportItem>
            id="score-invoice-reports-table"
            rowId="companyIdentifier" // Use companyIdentifier as unique key
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            size="small"
            striped
              notFoundConfig={{ title: 'Skor fatura raporu bulunamadı' }}
          />
        </Card>
      </Box>
    </>
  );
};
