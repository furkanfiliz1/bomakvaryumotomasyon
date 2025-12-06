import { Form, PageHeader, Slot, Table } from '@components';
import { Clear, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useState } from 'react';
import useServerSideQuery from 'src/hooks/useServerSideQuery';
import { useLazyGetBuyerReconciliationReportQuery } from '../buyer-reconciliation.api';
import { BuyerReconciliationFilters, BuyerReconciliationItem } from '../buyer-reconciliation.types';
import { getBuyerReconciliationTableColumns } from '../helpers';
import { useBuyerReconciliationFilterForm, useBuyerReconciliationQueryParams } from '../hooks';
import { AllowanceDueSlot, AllowanceInfoSlot } from './BuyerReconciliationTableSlots';

/**
 * Main page component for Buyer Reconciliation Report
 * Implements 100% feature parity with legacy ReceiverInvoiceReconciliation.js
 * Following OperationPricing patterns exactly
 */
export const BuyerReconciliationPage: React.FC = () => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<BuyerReconciliationFilters>>({});

  // Initialize filter form following OperationPricing pattern
  const {
    form,
    schema,
    handleSearch,
    handleReset: formReset,
    isBuyersSearchLoading,
  } = useBuyerReconciliationFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters from state (not direct form watching)
  const { baseQueryParams, shouldSkipQuery } = useBuyerReconciliationQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const serverSideQueryResult = useServerSideQuery(
    useLazyGetBuyerReconciliationReportQuery,
    baseQueryParams,
    { lazyQuery: shouldSkipQuery }, // Skip query if no identifier
  );

  // Return empty results if no identifier is provided, otherwise use real data
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = shouldSkipQuery
    ? {
        ...serverSideQueryResult,
        data: { Items: [], TotalCount: 0 },
        isLoading: false,
        isFetching: false,
      }
    : serverSideQueryResult;

  const handleReset = () => {
    formReset(); // Use form's built-in reset
    setAdditionalFilters({});
  };

  // Table columns configuration
  const tableColumns = getBuyerReconciliationTableColumns();

  return (
    <>
      <PageHeader title="Alıcı Bazlı Fatura Raporları" subtitle="Alıcı bazında fatura işlem raporu alınabilir." />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleReset} disabled={isBuyersSearchLoading} startIcon={<Clear />}>
                Temizle
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={isBuyersSearchLoading}
                startIcon={<Search />}>
                {isBuyersSearchLoading ? 'Yükleniyor...' : 'Uygula'}
              </Button>

              <Button
                startIcon={<Search />}
                variant="contained"
                onClick={() => handleExport('alici_bazli_fatura_raporlari')}
                disabled={isLoading || isFetching}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table
            id="buyerReconciliationTable"
            headers={tableColumns}
            data={data?.Items || []}
            rowId="AllowanceId"
            loading={isLoading || isFetching}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}>
            {/* Custom cell renderers - only for complex formatting, currency handled automatically */}
            <Slot<BuyerReconciliationItem> id="allowanceInfo">{(_, row) => <AllowanceInfoSlot row={row!} />}</Slot>
            <Slot<BuyerReconciliationItem> id="allowanceDue">{(_, row) => <AllowanceDueSlot row={row!} />}</Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};
