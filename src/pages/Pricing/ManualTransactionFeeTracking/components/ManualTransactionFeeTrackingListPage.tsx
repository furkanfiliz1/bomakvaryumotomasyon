import { EnterEventHandle, Form, Slot, Table } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Edit, Search } from '@mui/icons-material';
import { Box, Button, Card, Stack } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../../components/shared';
import { getExportFilename, getTableHeaders } from '../helpers';
import { useDropdownData, useManualTransactionFeeFilterForm, useQueryParams } from '../hooks';
import { useLazyGetManualTransactionFeeListQuery } from '../manual-transaction-fee-tracking.api';
import { ManualTransactionFeeFilters, ManualTransactionFeeItem } from '../manual-transaction-fee-tracking.types';
import { StatusSlot } from './ManualTransactionFeeTableSlots';

/**
 * Manual Transaction Fee Tracking List Page Component
 * Displays manual transaction fee tracking data with filters and actions
 * Matches legacy system UI and functionality exactly
 */
const ManualTransactionFeeTrackingListPage: React.FC = () => {
  const navigate = useNavigate();

  // Additional filters state for the form
  const [additionalFilters, setAdditionalFilters] = useState<Partial<ManualTransactionFeeFilters>>({ Status: 1 });

  // Load dropdown data
  const { isLoading: dropdownLoading } = useDropdownData();

  // Initialize filter form following CompanyComments pattern
  const { form, schema, handleSearch, handleReset } = useManualTransactionFeeFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useQueryParams({ additionalFilters });

  // Use the useServerSideQ
  // uery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport } = useServerSideQuery(
    useLazyGetManualTransactionFeeListQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration
  const tableHeaders = useMemo(() => getTableHeaders(), []);

  // Event handlers
  const handleUpdateStatus = useCallback(
    (id: number) => {
      navigate(`/pricing/manual-transaction-fee-tracking/${id}/edit`);
    },
    [navigate],
  );

  const handleExportClick = () => {
    const customFilename = getExportFilename();
    handleExport(customFilename);
  };

  // Row actions - only update, no detail view
  const rowActions = useMemo(
    () => [
      {
        Element: ({ row }: { row?: ManualTransactionFeeItem }) => {
          if (!row) return null;

          return (
            <Button size="small" startIcon={<Edit />} variant="outlined" onClick={() => handleUpdateStatus(row.Id)}>
              Güncelle
            </Button>
          );
        },
      },
    ],
    [handleUpdateStatus],
  );

  return (
    <>
      <PageHeader
        title="Manuel İşlem Ücreti Ödemeleri Takibi"
        subtitle="Manuel işlem ücreti ödemelerini takip edin ve yönetin"
      />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form as unknown as UseFormReturn<FieldValues>} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleReset} disabled={dropdownLoading} startIcon={<Clear />}>
                Temizle
              </Button>

              <Button variant="contained" onClick={handleSearch} disabled={dropdownLoading} startIcon={<Search />}>
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
          <Table<ManualTransactionFeeItem>
            id="manual-transaction-fee-tracking-table"
            rowId="Id"
            data={tableData}
            headers={tableHeaders}
            loading={isLoading || isFetching || dropdownLoading}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            rowActions={rowActions}
            notFoundConfig={{ title: 'Manuel işlem ücreti ödemesi bulunamadı' }}>
            {/* Custom cell renderer for status column */}
            <Slot<ManualTransactionFeeItem> id="StatusDescription">{(_, row) => <StatusSlot row={row!} />}</Slot>
          </Table>
          <EnterEventHandle onEnterPress={handleSearch} />
        </Card>
      </Box>
    </>
  );
};

export default ManualTransactionFeeTrackingListPage;
