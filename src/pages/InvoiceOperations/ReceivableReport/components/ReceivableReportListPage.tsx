import { Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Alert, Box, Card } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { receivableReportTableHeaders } from '../helpers';
import { useReceivableReportDropdownData, useReceivableReportQueryParams } from '../hooks';
import { useLazyExportReceivableReportQuery, useLazyGetReceivableReportQuery } from '../receivable-report.api';
import type { ReceivableReportFilters as FiltersType, ReceivableReportItem } from '../receivable-report.types';
import { ReceivableReportFilters } from './ReceivableReportFilters';
import { ReceivableReportTableSlots } from './ReceivableReportTableSlots';

export const ReceivableReportListPage: React.FC = () => {
  const navigate = useNavigate();
  const [additionalFilters, setAdditionalFilters] = useState<Partial<FiltersType>>({
    isDeleted: '0', // Default to not deleted
    PayableAmountCurrency: '1', // Default to TRY
  });

  // Build query parameters using our custom hook
  const { baseQueryParams } = useReceivableReportQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook - automatically refetches when baseQueryParams change
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig } = useServerSideQuery(
    useLazyGetReceivableReportQuery,
    baseQueryParams,
  );

  // Export functionality
  const [exportTrigger, { isLoading: isExporting }] = useLazyExportReceivableReportQuery();

  // Dropdown data for filters
  const { buyerList, currencyList, isLoading: isDropdownLoading } = useReceivableReportDropdownData();

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || ([] as ReceivableReportItem[]);

  // Table headers
  const tableHeaders = useMemo(() => receivableReportTableHeaders, []);

  // Filter change handler - updates state which triggers useServerSideQuery refetch
  const handleFilterChange = useCallback((filters: Partial<FiltersType>) => {
    setAdditionalFilters((prev) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  // Export handler - triggers Excel export with current filters
  const handleExport = useCallback(async () => {
    try {
      await exportTrigger(baseQueryParams).unwrap();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [exportTrigger, baseQueryParams]);

  // TODO: Implement row click handler when detail page is ready
  // const handleRowClick = useCallback((row: ReceivableReportItem) => {
  //   console.log('Row clicked:', row);
  // }, []);

  return (
    <Box mx={2}>
      <ReceivableReportFilters
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        isLoading={isFetching || isDropdownLoading || isExporting}
        buyerList={buyerList}
        currencyList={currencyList}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      )}
      <Card sx={{ p: 2 }}>
        <Table<ReceivableReportItem>
          id="receivable-report-table"
          rowId="Id"
          headers={tableHeaders}
          data={tableData}
          loading={isLoading || isFetching}
          // Server-side pagination from useServerSideQuery
          pagingConfig={pagingConfig}
          // Server-side sorting from useServerSideQuery
          sortingConfig={sortingConfig}
          // Table styling
          size="small"
          notFoundConfig={{ title: 'Alacak raporu bulunamadı' }}>
          {/* Custom cell renderers using Slot pattern */}
          <Slot<ReceivableReportItem> id="ReceiverName">
            {(_, row) => (
              <DoubleTextCell
                id={row?.Id.toString() || '-'}
                maxWidth={300}
                primaryText={row?.ReceiverName ? `${row?.ReceiverName}` : '-'}
                secondaryText={row?.ReceiverIdentifier ?? '-'}
              />
            )}
          </Slot>
          <Slot<ReceivableReportItem> id="SenderName">
            {(_, row) => (
              <DoubleTextCell
                id={row?.Id.toString() || '-'}
                maxWidth={300}
                primaryText={row?.SenderName ? `${row?.SenderName}` : '-'}
                secondaryText={row?.SenderIdentifier ?? '-'}
              />
            )}
          </Slot>

          <Slot<ReceivableReportItem> id="PayableAmount">
            {(_, row) => <ReceivableReportTableSlots columnId="PayableAmount" row={row!} />}
          </Slot>

          <Slot<ReceivableReportItem> id="AllowanceStatusDesc">
            {(_, row) => <ReceivableReportTableSlots columnId="AllowanceStatusDesc" row={row!} />}
          </Slot>
          <Slot<ReceivableReportItem> id="Actions">
            {(_, row) => <ReceivableReportTableSlots columnId="Actions" row={row!} navigate={navigate} />}
          </Slot>
        </Table>
      </Card>
    </Box>
  );
};

export default ReceivableReportListPage;
