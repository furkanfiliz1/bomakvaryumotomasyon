import { Form, PageHeader, Table } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useState } from 'react';
import useServerSideQuery from 'src/hooks/useServerSideQuery';
import { useLazyGetBankDiscountReconciliationReportQuery } from '../bank-discount-reconciliation.api';
import {
  BankDiscountReconciliationFilters,
  BankDiscountReconciliationItem,
} from '../bank-discount-reconciliation.types';
import { getBankDiscountReconciliationTableColumns } from '../helpers';
import { useBankDiscountReconciliationFilterForm, useBankDiscountReconciliationQueryParams } from '../hooks';

/**
 * Main page component for Bank Discount Reconciliation Report
 * Implements 100% feature parity with legacy financerAllowanceAgreement report
 * Following BankInvoiceReconciliation patterns exactly
 */
export const BankDiscountReconciliationPage: React.FC = () => {
  const [additionalFilters, setAdditionalFilters] = useState<Partial<BankDiscountReconciliationFilters>>({});

  // Initialize filter form following BankInvoiceReconciliation pattern
  const {
    form,
    schema,
    handleSearch,
    handleReset: formReset,
    isBuyersSearchLoading,
    isBanksSearchLoading,
  } = useBankDiscountReconciliationFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters from state (not direct form watching)
  const { baseQueryParams, shouldSkipQuery } = useBankDiscountReconciliationQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following BankInvoiceReconciliation pattern
  const serverSideQueryResult = useServerSideQuery(
    useLazyGetBankDiscountReconciliationReportQuery,
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

  // Export handler using useServerSideQuery's handleExport
  const handleExportReport = () => {
    if (!additionalFilters.identifier || !additionalFilters.financerCompanyIdentifier) {
      return;
    }

    const filename = `banka_alici_iskonto_raporu_${additionalFilters.identifier}_${additionalFilters.financerCompanyIdentifier}_${additionalFilters.month}_${additionalFilters.year}`;
    handleExport(filename);
  };

  // Table columns configuration
  const tableColumns = getBankDiscountReconciliationTableColumns();

  return (
    <>
      <PageHeader
        title="Banka Alıcı Bazlı İskonto Raporları"
        subtitle="Her banka için alıcı bazında iskonto işlem raporu alınabilir"
      />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isBuyersSearchLoading || isBanksSearchLoading}
                startIcon={<Clear />}>
                Temizle
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
                disabled={isBuyersSearchLoading || isBanksSearchLoading}>
                {isBuyersSearchLoading || isBanksSearchLoading ? 'Yükleniyor...' : 'Uygula'}
              </Button>

              <Button
                variant="contained"
                onClick={handleExportReport}
                disabled={isLoading || isFetching}
                startIcon={<Download />}>
                Excel
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<BankDiscountReconciliationItem>
            id="bank-discount-reconciliation-table"
            rowId="AllowanceId"
            headers={tableColumns}
            data={data?.Items || []}
            loading={isLoading || isFetching}
            error={error ? 'Veri yüklenirken hata oluştu' : undefined}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            hidePaging={false}
              notFoundConfig={{ title: 'Banka iskonto uzlaştırma verisi bulunamadı' }}
          />
        </Card>
      </Box>
    </>
  );
};
