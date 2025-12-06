import { PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useLazyGetGuaranteeProtocolReportQuery } from '../guarantee-protocol.api';
import type { GuaranteeProtocolFilterFormValues, GuaranteeProtocolTableRow } from '../guarantee-protocol.types';
import { getGuaranteeProtocolTableColumns } from '../helpers';
import { useDropdownData, useGuaranteeProtocolFilterForm, useGuaranteeProtocolQueryParams } from '../hooks';
import { GuaranteeProtocolFilters } from './GuaranteeProtocolFilters';
import { GuaranteeProtocolTableSlots } from './GuaranteeProtocolTableSlots';

/**
 * Main page component for Guarantee Protocol Report
 * Implements 100% feature parity with legacy GuaranteeAgreement.js
 * Following OperationPricing patterns exactly
 */
export const GuaranteeProtocolPage: React.FC = () => {
  // Additional filters state for useServerSideQuery pattern
  const [additionalFilters, setAdditionalFilters] = useState<Partial<GuaranteeProtocolFilterFormValues>>({
    StartDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    EndDate: new Date(), // Today
  });

  // Get dropdown data for async search
  const {
    financiersCompanySearchResults,
    sendersCompanySearchResults,
    searchFinanciersByCompanyNameOrIdentifier,
    searchSendersByCompanyNameOrIdentifier,
    isFinanciersSearchLoading,
    isSendersSearchLoading,
  } = useDropdownData();

  // Initialize filter form following OperationPricing pattern
  const { form, schema, handleSubmit, handleReset } = useGuaranteeProtocolFilterForm({
    onFilterChange: setAdditionalFilters,
    financiersCompanySearchResults,
    sendersCompanySearchResults,
    searchFinanciersByCompanyNameOrIdentifier,
    searchSendersByCompanyNameOrIdentifier,
    isFinanciersSearchLoading,
    isSendersSearchLoading,
  });

  // Generate query parameters following OperationPricing pattern
  const { baseQueryParams } = useGuaranteeProtocolQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig } = useServerSideQuery(
    useLazyGetGuaranteeProtocolReportQuery,
    baseQueryParams,
  );

  // Error handling following OperationPricing pattern
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];
  const totalCount = data?.TotalCount || 0;

  // Table configuration
  const tableHeaders = useMemo(() => getGuaranteeProtocolTableColumns(), []);

  // Handle form submission
  const handleSearch = () => {
    form.handleSubmit(handleSubmit)();
  };
  return (
    <>
      <PageHeader title="Entegrasyon Raporları" subtitle="Entegrasyon raporlarına bu bölümden erişebilirsiniz." />

      <Box mx={2}>
        {/* Filters */}
        <GuaranteeProtocolFilters
          form={form}
          schema={schema}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isLoading || isFetching}
        />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<GuaranteeProtocolTableRow>
            id="guarantee-protocol-table"
            rowId="Date"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}
              notFoundConfig={{ title: 'Entegrasyon raporu bulunamadı' }}>
            {/* Custom cell renderer for download action */}
            <Slot<GuaranteeProtocolTableRow> id="DownloadAction">
              {(_, row) => (row ? <GuaranteeProtocolTableSlots.DownloadActionSlot item={row} /> : null)}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
