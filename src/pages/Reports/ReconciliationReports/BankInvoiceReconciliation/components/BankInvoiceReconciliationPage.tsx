import { PageHeader, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Card } from '@mui/material';
import React, { useState } from 'react';
import { BankInvoiceReconciliationFilters, BankInvoiceReconciliationTableSlots } from '.';
import { useLazyGetBankInvoiceReconciliationReportQuery } from '../bank-invoice-reconciliation.api';
import type {
  BankInvoiceReconciliationFilterFormValues,
  BankInvoiceReconciliationItem,
} from '../bank-invoice-reconciliation.types';
import { getBankInvoiceReconciliationTableConfig } from '../helpers';
import { useBankInvoiceReconciliationFilterForm, useBankInvoiceReconciliationQueryParams } from '../hooks';

export const BankInvoiceReconciliationPage: React.FC = () => {
  // Additional filters state for useServerSideQuery pattern
  const [additionalFilters, setAdditionalFilters] = useState<Partial<BankInvoiceReconciliationFilterFormValues>>({
    month: 1,
    year: new Date().getFullYear(),
  });

  // Initialize filter form following OperationPricing pattern
  const { form, schema, handleSearch } = useBankInvoiceReconciliationFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters following OperationPricing pattern
  const { baseQueryParams } = useBankInvoiceReconciliationQueryParams(additionalFilters);

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = useServerSideQuery(
    useLazyGetBankInvoiceReconciliationReportQuery,
    baseQueryParams,
  );

  // Table configuration
  const tableConfig = getBankInvoiceReconciliationTableConfig();

  // Error handling
  useErrorListener(error);

  const handleReset = () => {
    form.reset();
    setAdditionalFilters({
      month: 1,
      year: new Date().getFullYear(),
    });
  };

  // Export handler using useServerSideQuery's handleExport
  const handleExportReport = () => {
    if (!additionalFilters.financerIdentifier) {
      return;
    }

    const filename = `banka_alici_bazli_fatura_raporu_${additionalFilters.receiverIdentifier || 'all'}_${additionalFilters.financerIdentifier}_${additionalFilters.month}_${additionalFilters.year}`;
    handleExport(filename);
  };

  return (
    <>
      <PageHeader
        title="Banka Alıcı Bazlı Fatura Raporları"
        subtitle="Her banka için Alıcı bazında fatura işlem raporu alınabilir"
      />

      <Box mx={2}>
        {/* Filters */}
        <BankInvoiceReconciliationFilters
          form={form}
          schema={schema}
          onFilter={handleSearch}
          onReset={handleReset}
          isLoading={isLoading || isFetching}
          handleExportReport={handleExportReport}
        />

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          <Table<BankInvoiceReconciliationItem>
            id="bank-invoice-reconciliation-table"
            rowId={tableConfig.rowId}
            headers={tableConfig.headers}
            data={data?.Items || []}
            loading={isLoading || isFetching}
            error={error ? 'Veri yüklenirken hata oluştu' : undefined}
            size={tableConfig.size}
            striped={tableConfig.striped}
            maxHeight={tableConfig.maxHeight}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
              notFoundConfig={{ title: 'Banka Alıcı Bazlı Fatura Raporu verisi bulunamadı' }}
            hidePaging={false}>
            <BankInvoiceReconciliationTableSlots />
          </Table>
        </Card>
      </Box>
    </>
  );
};
