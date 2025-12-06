import { Button, EnterEventHandle, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Delete } from '@mui/icons-material';
import { Box, Card, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from 'src/components/shared';
import { operationChargeTableColumns } from '../helpers/table-config.helpers';
import { useOperationChargeFilters } from '../hooks/useOperationChargeFilters';
import { useDeleteOperationChargesMutation, useLazyGetOperationChargesQuery } from '../operation-charge.api';
import type { OperationChargeFilters } from '../operation-charge.types';
import { OperationCharge } from '../operation-charge.types';
import OperationChargeFiltersComponent from './OperationChargeFilters';
import {
  ActionsSlot,
  FinancerNameSlot,
  OperationChargeDefinitionTypeSlot,
  ProductTypeSlot,
  ReceiverNameSlot,
  SenderNameSlot,
} from './OperationChargeTableSlots';

/**
 * Operation Charge List Page - 1:1 recreation of legacy OperationChargeList.js
 * Implements all original functionality with modern architecture
 */
const OperationChargeListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Additional filters state
  const [additionalFilters, setAdditionalFilters] = useState<OperationChargeFilters>({});

  // Selected rows for delete
  const [selectedRows, setSelectedRows] = useState<OperationCharge[]>([]);

  // Initialize filter form (URL sync handled by hook)
  const { form, schema, handleSearch, handleReset } = useOperationChargeFilters({
    onFilterChange: setAdditionalFilters,
  });

  // Memoize query parameters to prevent infinite loop
  const queryParams = useMemo(
    () => ({
      ...additionalFilters,
      pageSize: 25, // Specific pageSize for this page to match legacy
    }),
    [additionalFilters],
  );

  // Use server-side query with filters
  const { data, error, isLoading, isFetching, pagingConfig, refetch } = useServerSideQuery(
    useLazyGetOperationChargesQuery,
    queryParams,
  );

  // Delete mutation
  const [deleteOperationCharges, { isLoading: isDeleting }] = useDeleteOperationChargesMutation();

  // Error handling
  useErrorListener(error);

  // Extract table data
  const tableData = useMemo(() => data?.Items ?? [], [data?.Items]);

  // Table headers
  const tableHeaders = useMemo(() => operationChargeTableColumns, []);

  // Handle navigation to edit operation charge
  const handleEdit = (id: number) => {
    navigate(`/pricing/islem-basi-ucretlendirme/duzenle/${id}`);
  };

  // Handle row selection
  const handleRowSelection = (rows: OperationCharge[]) => {
    setSelectedRows(rows);
  };

  // Handle bulk delete with confirmation dialog
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'İşlem Ücreti Tanımlarını Sil',
      message: `${selectedRows.length} adet işlem ücreti tanımını kalıcı olarak silmek istediğinize emin misiniz?`,
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: executeDelete,
      catchOnCancel: true,
    });
  };

  // Execute delete operation
  const executeDelete = async () => {
    try {
      const selectedIds = selectedRows.map((row) => row.Id);
      await deleteOperationCharges({
        OperationChargeIds: selectedIds,
      }).unwrap();

      // Success - refresh data and clear selection
      refetch();
      setSelectedRows([]);

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem ücreti tanımları başarıyla silindi.',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      // Error handling is managed by the error listener
      console.error('Delete failed:', error);
    }
  };

  return (
    <>
      <PageHeader title="İşlem Başı Ücretlendirme" subtitle="Ürün ve finansör bazlı işlem ücreti tanımlayın" />

      <Box mx={2}>
        {/* Filters */}
        <OperationChargeFiltersComponent
          form={form}
          schema={schema}
          onApply={handleSearch}
          onReset={handleReset}
          isLoading={isLoading || isFetching}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            id="delete"
            color="error"
            disabled={selectedRows.length === 0 || isDeleting}
            onClick={handleBulkDelete}
            startIcon={<Delete />}>
            {`Seçilenleri Sil (${selectedRows.length})`}
          </Button>
        </Stack>

        {/* Table */}
        <Card sx={{ p: 2 }}>
          <Table
            id="operation-charge-list-table"
            rowId="Id"
            headers={tableHeaders}
            data={tableData}
            loading={isLoading || isFetching}
            error={error ? String(error) : undefined}
            pagingConfig={pagingConfig}
            disableSorting
            checkbox
            onCheckboxSelect={handleRowSelection}
            notFoundConfig={{ title: 'İşlem başı ücretlendirme tanımı bulunamadı' }}>
            {/* Custom cell renderers for operation charge columns */}
            <Slot<OperationCharge> id="ReceiverName">{(_, row) => <ReceiverNameSlot row={row!} />}</Slot>

            <Slot<OperationCharge> id="SenderName">{(_, row) => <SenderNameSlot row={row!} />}</Slot>

            <Slot<OperationCharge> id="FinancerName">{(_, row) => <FinancerNameSlot row={row!} />}</Slot>

            <Slot<OperationCharge> id="ProductType">{(_, row) => <ProductTypeSlot row={row!} />}</Slot>

            <Slot<OperationCharge> id="OperationChargeDefinitionType">
              {(_, row) => <OperationChargeDefinitionTypeSlot row={row!} />}
            </Slot>

            <Slot<OperationCharge> id="actions">{(_, row) => <ActionsSlot row={row!} onUpdate={handleEdit} />}</Slot>
          </Table>
        </Card>
        <EnterEventHandle onEnterPress={handleSearch} />
      </Box>
    </>
  );
};

export default OperationChargeListPage;
