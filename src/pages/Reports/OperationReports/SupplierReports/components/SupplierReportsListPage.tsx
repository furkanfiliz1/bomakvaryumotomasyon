import { Form, PageHeader, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { getSupplierReportsTableHeaders } from '../helpers';
import { useSupplierReportsFilterForm, useSupplierReportsQueryParams } from '../hooks';
import { useLazyGetSupplierReportsQuery } from '../supplier-reports.api';
import type { SupplierReportItem, SupplierReportsFilters } from '../supplier-reports.types';
import { SupplierReportsTableSlots } from './SupplierReportsTableSlots';

/**
 * Supplier Reports List Page Component
 * Displays supplier reports data with filters and collapse details
 * Matches legacy Tedarikçi Raporları UI and functionality exactly
 */
export const SupplierReportsListPage: React.FC = () => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<SupplierReportsFilters>>({});

  // Initialize filter form following OperationPricing pattern
  const { form, schema, handleSearch, handleClear } = useSupplierReportsFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useSupplierReportsQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = useServerSideQuery(
    useLazyGetSupplierReportsQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items ?? [];
  const totalCount = data?.TotalCount ?? 0;

  // Table configuration
  const tableHeaders = useMemo(() => getSupplierReportsTableHeaders(), []);

  const handleExportClick = () => {
    const customFilename = 'tedarikci_raporlari';
    handleExport(customFilename);
  };

  return (
    <>
      <PageHeader title="Tedarikçi Raporları" subtitle="Tedarikçi bazlı işlem raporları ve detayları" />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleClear} startIcon={<Clear />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Search />}>
                Uygula
              </Button>
              <Button
                variant="contained"
                onClick={handleExportClick}
                disabled={isLoading || isFetching}
                startIcon={<Download />}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<SupplierReportItem>
            id="supplier-reports-table"
            rowId="ReceiverIdentifier"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            total={totalCount}>
            {/* Custom cell renderers matching legacy system */}
            <Slot<SupplierReportItem> id="ActiveContract">
              {(_, row) => <SupplierReportsTableSlots.IsActiveSlot isActive={row!.ActiveContract} />}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
