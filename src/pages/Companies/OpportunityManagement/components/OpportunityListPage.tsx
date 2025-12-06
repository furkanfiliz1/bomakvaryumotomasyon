/**
 * Opportunity List Page
 * Following LeadManagement pattern for list pages with filters
 * Uses Form component with schema-based field definitions
 * Implements server-side pagination, sorting, and filtering
 * Supports bulk status update (Won/Lost) with checkbox selection
 */

import { Form, Icon, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableState } from 'src/components/common/Table/types';
import { OpportunityWinningStatus } from '../constants';
import {
  getOpportunityStatusColor,
  getSalesScenarioColor,
  getWinningStatusColor,
} from '../helpers/opportunity-management.helpers';
import { getOpportunityTableHeaders } from '../helpers/opportunity-table-config.helpers';
import { useOpportunityDropdownData, useOpportunityFilterForm } from '../hooks';
import useOpportunityQueryParams from '../hooks/useOpportunityQueryParams';
import {
  useDeleteOpportunityMutation,
  useLazyGetOpportunitiesQuery,
  useUpdateOpportunityStatusBulkMutation,
} from '../opportunity-management.api';
import type { OpportunityFilterFormData, OpportunityListItem } from '../opportunity-management.types';

const OpportunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  const { isLoading: isDropdownLoading, receiverList } = useOpportunityDropdownData();

  // Table reference for controlling checkbox state
  const tableRef = useRef<TableState | null>(null);

  // State for managing filter changes - following LeadManagement pattern
  const [additionalFilters, setAdditionalFilters] = useState<Partial<OpportunityFilterFormData>>({});

  // Selected rows for bulk operations - following OperationChargeListPage pattern
  const [selectedRows, setSelectedRows] = useState<OpportunityListItem[]>([]);

  // Initialize filter form with callback to update additionalFilters
  const { form, schema, handleSearch, handleReset } = useOpportunityFilterForm({
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters from filters
  const { baseQueryParams } = useOpportunityQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook for pagination, filtering
  const { data, error, isLoading, pagingConfig, sortingConfig, refetch } = useServerSideQuery(
    useLazyGetOpportunitiesQuery,
    baseQueryParams,
  );

  const [deleteOpportunity, { isLoading: isDeleting }] = useDeleteOpportunityMutation();
  const [updateOpportunityStatusBulk, { isLoading: isUpdatingStatus }] = useUpdateOpportunityStatusBulkMutation();

  // Error handling
  useErrorListener(error);

  const handleAddOpportunity = () => {
    navigate('/companies/opportunities/add');
  };

  // Handle row selection - following OperationChargeListPage pattern
  const handleRowSelection = (rows: OpportunityListItem[]) => {
    setSelectedRows(rows);
  };

  // Handle bulk status update (Won/Lost)
  const handleBulkStatusUpdate = (winningStatus: OpportunityWinningStatus) => {
    if (selectedRows.length === 0) return;

    const statusLabel = winningStatus === OpportunityWinningStatus.WON ? 'Kazanıldı' : 'Kaybedildi';

    notice({
      type: 'confirm',
      variant: winningStatus === OpportunityWinningStatus.WON ? 'success' : 'warning',
      title: 'Durum Güncelleme',
      message: `${selectedRows.length} adet fırsatı "${statusLabel}" olarak işaretlemek istediğinize emin misiniz? Bu işlem kapanış tarihini otomatik olarak kaydedecektir.`,
      buttonTitle: isUpdatingStatus ? 'Güncelleniyor...' : `Evet, ${statusLabel} Olarak İşaretle`,
      onClick: () => void executeBulkStatusUpdate(winningStatus),
      catchOnCancel: true,
    });
  };

  // Execute bulk status update
  const executeBulkStatusUpdate = async (winningStatus: OpportunityWinningStatus) => {
    try {
      const selectedIds = selectedRows.map((row) => row.Id);
      await updateOpportunityStatusBulk({
        ids: selectedIds,
        winningStatus,
      }).unwrap();

      // Success - refresh data and clear selection
      refetch();
      setSelectedRows([]);
      tableRef.current?.resetCheckboxRow();

      const statusLabel = winningStatus === OpportunityWinningStatus.WON ? 'Kazanıldı' : 'Kaybedildi';
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: `${selectedIds.length} adet fırsat başarıyla "${statusLabel}" olarak işaretlendi.`,
        buttonTitle: 'Tamam',
      });
    } catch (err) {
      // Error handling is managed by the error listener
      console.error('Bulk status update failed:', err);
    }
  };

  // Handle delete - following LeadManagement pattern
  const handleDeleteClick = (opportunity: OpportunityListItem) => {
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Silme İşlemi',
      message: 'Bu fırsat kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: () => void executeDelete(opportunity.Id),
      catchOnCancel: true,
    });
  };

  // Execute delete operation
  const executeDelete = async (opportunityId: number) => {
    try {
      await deleteOpportunity({ id: opportunityId }).unwrap();

      // Refetch list after successful delete
      refetch();

      // Show success message
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Fırsat başarıyla silindi',
        buttonTitle: 'Tamam',
      });
    } catch (err) {
      // Error handling is managed by the error listener
      console.error('Delete failed:', err);
    }
  };

  const headers = getOpportunityTableHeaders();

  return (
    <>
      <PageHeader title="Fırsatlar" subtitle="Fırsat yönetimi ve takip sistemi" />

      <Box mx={2}>
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema} />
          <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<Icon icon="plus" size={20} />}
              onClick={handleAddOpportunity}
              id="addOpportunityButton">
              Yeni Fırsat
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<Icon icon="x" size={16} />}>
                Temizle
              </Button>
              <Button variant="contained" onClick={handleSearch} startIcon={<Icon icon="search-lg" size={16} />}>
                Uygula
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Bulk Action Buttons - Following OperationChargeListPage pattern */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            id="markAsWon"
            variant="outlined"
            color="success"
            disabled={selectedRows.length === 0 || isUpdatingStatus}
            onClick={() => handleBulkStatusUpdate(OpportunityWinningStatus.WON)}
            startIcon={<Icon icon="check-circle" size={16} />}>
            {`Kazanıldı Olarak İşaretle (${selectedRows.length})`}
          </Button>
          <Button
            id="markAsLost"
            variant="outlined"
            color="error"
            disabled={selectedRows.length === 0 || isUpdatingStatus}
            onClick={() => handleBulkStatusUpdate(OpportunityWinningStatus.LOST)}
            startIcon={<Icon icon="x-circle" size={16} />}>
            {`Kaybedildi Olarak İşaretle (${selectedRows.length})`}
          </Button>
        </Stack>

        {/* Results Table */}
        <Card>
          <Table<OpportunityListItem>
            id="OpportunitiesTable"
            rowId="Id"
            reference={tableRef}
            headers={headers}
            data={(data?.Items as OpportunityListItem[]) || []}
            loading={isLoading || isDropdownLoading}
            pagingConfig={pagingConfig}
            sortingConfig={sortingConfig}
            checkbox
            onCheckboxSelect={handleRowSelection}
            notFoundConfig={{
              title: 'Fırsat bulunamadı',
              subTitle: 'Henüz kayıtlı fırsat bulunmamaktadır',
              buttonTitle: 'Fırsat Ekle',
              onClick: handleAddOpportunity,
            }}>
            {/* Receiver Name Column - Show from receiverList if receiverId exists, otherwise show ReceiverName */}
            <Slot<OpportunityListItem> id="ReceiverName">
              {(_value, row) => {
                // If receiverId exists, find the company name from receiverList
                if (row?.ReceiverId) {
                  const receiver = receiverList.find((r) => r.Id === row.ReceiverId);
                  if (receiver) {
                    return <Typography variant="body2">{receiver.CompanyName}</Typography>;
                  }
                }
                // If no receiverId or not found in list, show ReceiverName directly
                if (row?.ReceiverName) {
                  return <Typography variant="body2">{row.ReceiverName}</Typography>;
                }
                return <Typography variant="body2">-</Typography>;
              }}
            </Slot>

            {/* Status Column - Status Chip */}
            <Slot<OpportunityListItem> id="StatusDescriptionText">
              {(_value, row) => {
                if (!row?.StatusDescriptionText) return <Typography variant="body2">-</Typography>;

                return (
                  <Chip
                    label={row.StatusDescriptionText}
                    color={getOpportunityStatusColor(row.StatusDescription)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                );
              }}
            </Slot>

            {/* Sales Scenario Column - Status Chip */}
            <Slot<OpportunityListItem> id="SalesScenarioDescription">
              {(_value, row) => {
                if (!row?.SalesScenarioDescription) return <Typography variant="body2">-</Typography>;

                return (
                  <Chip
                    label={row.SalesScenarioDescription}
                    color={getSalesScenarioColor(row.SalesScenario)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                );
              }}
            </Slot>

            {/* Winning Status Column - Status Chip */}
            <Slot<OpportunityListItem> id="WinningStatusDescription">
              {(_value, row) => {
                if (!row?.WinningStatusDescription) return <Typography variant="body2">-</Typography>;

                return (
                  <Chip
                    label={row.WinningStatusDescription}
                    color={getWinningStatusColor(row.WinningStatus)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                );
              }}
            </Slot>

            {/* Actions Column - Detail and Delete Buttons */}
            <Slot<OpportunityListItem> id="actions">
              {(_value, row) => {
                return (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      id={`opportunity-detail-button-${row?.Id}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Icon icon="eye" size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/companies/opportunities/${row?.Id}`);
                      }}>
                      Detay
                    </Button>
                    <Button
                      id={`opportunity-delete-button-${row?.Id}`}
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Icon icon="trash-01" size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        row && handleDeleteClick(row);
                      }}
                      disabled={isDeleting}>
                      Sil
                    </Button>
                  </Box>
                );
              }}
            </Slot>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default OpportunityListPage;
