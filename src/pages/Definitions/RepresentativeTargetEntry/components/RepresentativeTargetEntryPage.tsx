import { Form, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Add, Clear, Delete, Download, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatMonthYear, getRepresentativeTargetTableHeaders } from '../helpers';
import {
  useRepresentativeTargetDropdownData,
  useRepresentativeTargetFilterForm,
  useRepresentativeTargetQueryParams,
} from '../hooks';
import {
  useDeleteRepresentativeTargetMutation,
  useLazyGetRepresentativeTargetsQuery,
} from '../representative-target-entry.api';
import type { RepresentativeTargetFilters, RepresentativeTargetItem } from '../representative-target-entry.types';
import { CreateTargetDialog } from './index';

/**
 * Representative Target Entry Page Component
 * Displays representative target data with filters and actions
 * Matches legacy AgentTargetEntry.js functionality exactly
 */
export const RepresentativeTargetEntryPage: React.FC = () => {
  const notice = useNotice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Get dropdown data
  const { customerManagerList, userTargetTypeList, monthOptions, yearOptions } = useRepresentativeTargetDropdownData();

  // Delete mutation
  const [deleteTarget, { error: deleteError }] = useDeleteRepresentativeTargetMutation();

  // Convert URL params to filter format
  const urlFilters = useMemo<Partial<RepresentativeTargetFilters>>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      userId: params.userId || undefined,
      month: params.month || undefined,
      year: params.year || undefined,
      page: params.page ? Number(params.page) : 1,
      pageSize: params.pageSize ? Number(params.pageSize) : 25,
    };
  }, [searchParams]);

  // Initialize filter form with URL filters
  const { form, schema, handleSearch } = useRepresentativeTargetFilterForm({
    customerManagerList,
    monthOptions,
    yearOptions,
    initialFilters: urlFilters,
    onFilterChange: (filters) => {
      // Update URL params when filters change
      const params: Record<string, string> = {};

      if (filters.userId) params.userId = filters.userId;
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.page) params.page = String(filters.page);
      if (filters.pageSize) params.pageSize = String(filters.pageSize);

      setSearchParams(params);
    },
  });

  // Generate query parameters from URL filters
  const { baseQueryParams } = useRepresentativeTargetQueryParams({ additionalFilters: urlFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  const { data, error, isLoading, isFetching, pagingConfig, sortingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetRepresentativeTargetsQuery,
    baseQueryParams,
  );

  // Override pagingConfig to update URL params
  const enhancedPagingConfig = useMemo(
    () => ({
      ...pagingConfig,
      onPageChange: (newPage: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, page: String(newPage) });
        pagingConfig.onPageChange?.(newPage);
      },
      onPageSizeChange: (newPageSize: number) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, pageSize: String(newPageSize), page: '1' });
        pagingConfig.onPageSizeChange?.(newPageSize);
      },
    }),
    [pagingConfig, searchParams, setSearchParams],
  );

  const handleReset = () => {
    form.reset({
      userId: '',
      month: '',
      year: '',
    });
    // Clear all URL params
    setSearchParams({});
  };

  // Error handling
  useErrorListener([error, deleteError]);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Table configuration
  const tableHeaders = useMemo(() => getRepresentativeTargetTableHeaders(), []);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteTarget(selectedDeleteId).unwrap();
      notice({
        variant: 'success',
        message: 'Hedef başarıyla silindi',
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
      refetch();
    } catch (err) {
      // Error handled by useErrorListener
      console.error('Failed to delete target:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const handleExportClick = () => {
    const customFilename = 'musteri_temsilcisi_hedefleri';
    handleExport(customFilename);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <>
      <PageHeader title="Müşteri Temsilcisi Hedef Girişi" subtitle="Temsilci bazlı hedef girişi tanımlamaları" />

      <Box sx={{ p: 3 }}>
        {/* Filter Section */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Form form={form} schema={schema} space={2}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                  color="primary">
                  Ekle
                </Button>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleReset}
                  disabled={isLoading || isFetching}>
                  Temizle
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={isLoading || isFetching}>
                  Uygula
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportClick}
                  disabled={!tableData.length}>
                  Excel
                </Button>
              </Stack>
            </Box>
          </Form>
        </Card>

        {/* Action Buttons */}

        {/* Table */}
        <Table<RepresentativeTargetItem>
          id="RepresentativeTargetTable"
          rowId="Id"
          headers={tableHeaders}
          data={tableData}
          loading={isLoading || isFetching}
          size="medium"
          striped
          pagingConfig={enhancedPagingConfig}
          sortingConfig={sortingConfig}>
          {/* Custom slot for full name display */}
          <Slot id="FullName">
            {(_value, row) => {
              const item = row as RepresentativeTargetItem;
              return <span>{`${item.FirstName} ${item.LastName}`}</span>;
            }}
          </Slot>

          {/* Custom slot for month/year display */}
          <Slot id="MonthYear">
            {(_value, row) => {
              const item = row as RepresentativeTargetItem;
              return <span>{formatMonthYear(item.Month, item.Year)}</span>;
            }}
          </Slot>

          {/* Custom slot for action buttons */}
          <Slot id="actions">
            {(_value, row) => {
              const item = row as RepresentativeTargetItem;
              return (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(item.Id);
                  }}
                  aria-label="Sil">
                  <Delete fontSize="small" />
                </IconButton>
              );
            }}
          </Slot>
        </Table>
      </Box>

      {/* Create Dialog */}
      <CreateTargetDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        customerManagerList={customerManagerList}
        userTargetTypeList={userTargetTypeList}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Hedefi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu hedefi silmek istediğinizden emin misiniz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RepresentativeTargetEntryPage;
