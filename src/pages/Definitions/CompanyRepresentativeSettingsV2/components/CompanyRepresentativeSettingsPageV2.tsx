/**
 * Company Representative Settings V2 Main Page
 * Optimized version with always-editable fields and memoized rows
 *
 * KEY PERFORMANCE IMPROVEMENTS:
 * 1. Memoized rows - rows don't re-render unless their specific data changes
 * 2. Optimized selection using Set for O(1) lookups
 * 3. Stable callback references prevent unnecessary child re-renders
 * 4. Always-editable fields with optimized form controls
 */

import { EnterEventHandle, Form, PageHeader, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Edit as EditIcon, Save as SaveIcon, Search } from '@mui/icons-material';
import { Box, Button, Card, Fab, Stack, Typography, Zoom } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// V2-specific imports
import {
  useLazyGetCompanyCustomerManagersQuery,
  useUpdateCompanyCustomerManagerMutation,
} from '../company-representative-settings.api';
import type {
  BulkUpdateFormData,
  CompanyCustomerManagerItem,
  CompanyCustomerManagerResponse,
} from '../company-representative-settings.types';
import { BulkUpdateDialog } from './BulkUpdateDialog';
import { OptimizedTableV2 } from './OptimizedTableV2';

// Hooks
import {
  useCompanyRepresentativeDropdownData,
  useCompanyRepresentativeFilterForm,
  useCompanyRepresentativeQueryParams,
  useOptimizedSelection,
  useRowEditState,
} from '../hooks';

// Helpers
import {
  isRowDisabled,
  transformBulkUpdateToApiRequest,
  transformRowToApiRequest,
  validateBulkUpdateData,
  validateRowData,
} from '../../CompanyRepresentativeSettings/helpers/company-representative-settings.helpers';

import type { CompanyRepresentativeFilters } from '../../CompanyRepresentativeSettings/company-representative-settings.types';

/**
 * Company Representative Settings Page V2
 * Optimized version with always-editable fields for better UX
 */
export const CompanyRepresentativeSettingsPageV2: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Filter state
  const [additionalFilters, setAdditionalFilters] = useState<Partial<CompanyRepresentativeFilters>>({
    isManagerAssigned: true,
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [savingRowId, setSavingRowId] = useState<number | null>(null);

  // V2 Hooks - optimized state management
  const editState = useRowEditState();
  const selection = useOptimizedSelection();

  // Get dropdown data
  const {
    customerManagerList,
    productTypeList,
    financersList,
    buyerCompaniesList,
    isLoading: isDropdownLoading,
  } = useCompanyRepresentativeDropdownData();

  // Memoize dropdown options bundle to prevent re-renders
  const dropdownOptions = useMemo(
    () => ({
      customerManagerList,
      productTypeList,
      financersList,
      buyerCompaniesList,
    }),
    [customerManagerList, productTypeList, financersList, buyerCompaniesList],
  );

  // Initialize filter form
  const { form, schema, handleSearch } = useCompanyRepresentativeFilterForm({
    customerManagerList,
    productTypeList,
    financersList,
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useCompanyRepresentativeQueryParams({ additionalFilters });

  // Server-side query
  const { data, error, isLoading, isFetching, pagingConfig, refetch } = useServerSideQuery(
    useLazyGetCompanyCustomerManagersQuery,
    isDropdownLoading ? undefined : baseQueryParams,
  );

  // Update mutation
  const [updateCompanyCustomerManager, { isLoading: isUpdating, error: isUpdateError }] =
    useUpdateCompanyCustomerManagerMutation();

  // Error handling
  useErrorListener([error, isUpdateError]);

  // Extract table data - memoized to prevent unnecessary re-renders
  const gridData = useMemo<CompanyCustomerManagerItem[]>(() => {
    const rawResponse = data as unknown as CompanyCustomerManagerResponse;
    return data?.Data || data?.Items || rawResponse?.CompanyList || [];
  }, [data]);

  const totalCount = useMemo(() => {
    const rawResponse = data as unknown as CompanyCustomerManagerResponse;
    return data?.TotalCount || rawResponse?.TotalCount || 0;
  }, [data]);

  // Memoized isRowDisabled function
  const checkRowDisabled = useCallback((row: CompanyCustomerManagerItem) => isRowDisabled(row, gridData), [gridData]);

  // Check if there are any unsaved changes
  const hasChanges = useMemo(() => editState.hasAnyChanges(), [editState]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleReset = useCallback(() => {
    form.reset();
    setAdditionalFilters({ isManagerAssigned: true });
    selection.clearSelection();
    editState.clearAllChanges();
  }, [form, selection, editState]);

  const handleFieldChange = useCallback(
    (rowId: number, field: string, value: unknown) => {
      editState.updateField(rowId, field, value);
    },
    [editState],
  );

  const handleRefresh = useCallback(
    (rowId: number) => {
      // Clear changes for this row only - no refetch needed
      editState.clearChanges(rowId);
    },
    [editState],
  );

  const handleSaveAll = useCallback(async () => {
    // Get all rows with changes
    const changedRowIds = editState.getChangedRowIds();
    if (changedRowIds.length === 0) {
      notice({
        variant: 'warning',
        title: 'Bilgi',
        message: 'Kaydedilecek değişiklik bulunamadı.',
      });
      return;
    }

    // Validate all changed rows
    const invalidRows: number[] = [];
    const validRequests: Array<{ rowId: number; request: ReturnType<typeof transformRowToApiRequest> }> = [];

    for (const rowId of changedRowIds) {
      const row = gridData.find((r) => r.CompanyCustomerManagerId === rowId);
      if (!row) continue;

      const updatedRow = editState.getRowWithChanges(row);
      const isValid = validateRowData(updatedRow);

      if (isValid) {
        validRequests.push({
          rowId,
          request: transformRowToApiRequest(updatedRow),
        });
      } else {
        invalidRows.push(rowId);
      }
    }

    if (invalidRows.length > 0) {
      notice({
        variant: 'error',
        title: 'Eksik veya Hatalı Alan',
        message: `${invalidRows.length} satırda eksik veya hatalı alan bulundu. Lütfen kontrol edin.`,
      });
      return;
    }

    // Save all valid rows
    try {
      let successCount = 0;
      let failCount = 0;

      for (const { rowId, request } of validRequests) {
        try {
          setSavingRowId(rowId);
          await updateCompanyCustomerManager(request).unwrap();
          editState.clearChanges(rowId);
          successCount++;
        } catch (err) {
          console.error(`Row ${rowId} update failed:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        const failMessage = failCount > 0 ? ` ${failCount} kayıt güncellenemedi.` : '';
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: `${successCount} kayıt başarıyla güncellendi.${failMessage}`,
        });
        // No refetch - changes are already applied locally via getRowWithChanges
        // Data will be fresh on next filter/search
      } else if (failCount > 0) {
        notice({
          variant: 'error',
          title: 'Hata',
          message: 'Kayıtlar güncellenirken hata oluştu.',
        });
      }
    } finally {
      setSavingRowId(null);
    }
  }, [editState, gridData, updateCompanyCustomerManager, notice]);

  const handleHistory = useCallback(
    (rowId: number) => {
      const row = gridData.find((r) => r.CompanyCustomerManagerId === rowId);
      if (row) {
        navigate(`/definitions/company-representative/${row.CompanyId}/history/${row.CompanyCustomerManagerId}`);
      }
    },
    [gridData, navigate],
  );

  const handleSelect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (rowId: number, _selected: boolean) => {
      selection.toggleSelection(rowId, gridData);
    },
    [selection, gridData],
  );

  const handleSelectAll = useCallback(() => {
    selection.selectAll(gridData, checkRowDisabled);
  }, [selection, gridData, checkRowDisabled]);

  const handleBulkUpdate = useCallback(
    async (formData: BulkUpdateFormData) => {
      if (!validateBulkUpdateData(formData)) {
        return;
      }

      try {
        const selectedItems = selection.getSelectedItems(gridData);
        const apiRequest = transformBulkUpdateToApiRequest(selectedItems, formData);
        await updateCompanyCustomerManager(apiRequest).unwrap();

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Seçilen Müşteri temsilcileri başarıyla güncellendi.',
        });

        setShowBulkModal(false);
        selection.clearSelection();
        // Bulk update needs refetch since we don't track bulk changes locally
        refetch();
      } catch (err) {
        console.error('Bulk update failed:', err);
      }
    },
    [selection, gridData, updateCompanyCustomerManager, notice, refetch],
  );

  // Get selected items for bulk modal
  const selectedItems = useMemo(() => selection.getSelectedItems(gridData), [selection, gridData]);

  return (
    <>
      <PageHeader title="Müşteri Temsilcisi" subtitle="Müşteri Temsilcisi Yönetimi (V2 - Optimized)" />

      <Box mx={2}>
        {/* Filter Form */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Temsilci Filtresi
          </Typography>

          <Form form={form} schema={schema}>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
              <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                Temizle
              </Button>

              <Button variant="contained" onClick={handleSearch} startIcon={<Search />} disabled={isDropdownLoading}>
                Ara
              </Button>
            </Stack>
          </Form>
        </Card>

        {/* DataGrid */}
        <Card sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Temsilci Listesi</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {selection.selectedCount > 0 && (
                <Typography variant="body2" color="primary">
                  {selection.selectedCount} kayıt seçildi
                </Typography>
              )}
              {hasChanges && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveAll}
                  disabled={isUpdating}>
                  Değişiklikleri Kaydet
                </Button>
              )}
            </Stack>
          </Stack>

          <OptimizedTableV2
            data={gridData}
            loading={isLoading || isFetching || isDropdownLoading}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : null}
            dropdownOptions={dropdownOptions}
            getRowWithChanges={editState.getRowWithChanges}
            selectedIds={selection.selectedIds}
            isRowDisabled={checkRowDisabled}
            onFieldChange={handleFieldChange}
            onRefresh={handleRefresh}
            onHistory={handleHistory}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            isSaving={isUpdating}
            savingRowId={savingRowId}
            pageSize={pagingConfig?.rowsPerPage || 100}
            currentPage={(pagingConfig?.page || 0) + 1}
            totalCount={totalCount}
            onPageChange={(page) => pagingConfig?.onPageChange?.(page - 1)}
            onPageSizeChange={(pageSize) => pagingConfig?.onPageSizeChange?.(pageSize)}
            emptyMessage="Müşteri temsilcisi verisi bulunamadı. Filtre kriterlerinizi değiştirerek tekrar deneyin."
            height={800}
          />
        </Card>
      </Box>

      {/* Floating Bulk Update Button */}
      <Zoom in={selection.selectedCount > 0}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            minWidth: 200,
            height: 56,
            borderRadius: 28,
          }}
          variant="extended"
          onClick={() => setShowBulkModal(true)}>
          <EditIcon sx={{ mr: 1 }} />
          Seçili Temsilci Güncelleme ({selection.selectedCount})
        </Fab>
      </Zoom>

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <BulkUpdateDialog
          open={showBulkModal}
          selectedItems={selectedItems}
          customerManagerList={customerManagerList}
          productTypeList={productTypeList}
          financersList={financersList}
          buyerCompaniesList={buyerCompaniesList}
          loading={isUpdating}
          onConfirm={handleBulkUpdate}
          onCancel={() => setShowBulkModal(false)}
        />
      )}

      {/* Enter key handler */}
      <EnterEventHandle onEnterPress={handleSearch} />
    </>
  );
};

export default CompanyRepresentativeSettingsPageV2;
