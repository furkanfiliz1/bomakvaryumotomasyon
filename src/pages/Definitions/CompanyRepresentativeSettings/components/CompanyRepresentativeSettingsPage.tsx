/**
 * Company Representative Settings Main Page
 * Matches legacy CustomerManagerList functionality exactly
 * Following OperationPricing main page patterns
 */

import { EnterEventHandle, Form, PageHeader, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Edit as EditIcon, Search } from '@mui/icons-material';
import { Box, Button, Card, Fab, Stack, Typography, Zoom } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VirtualTable, VirtualTableColumn } from 'src/components/common/VirtualTable';

// Local imports following OperationPricing patterns
import {
  useLazyGetCompanyCustomerManagersQuery,
  useUpdateCompanyCustomerManagerMutation,
} from '../company-representative-settings.api';
import {
  isFinancerDisabled,
  isRowDisabled,
  transformBulkUpdateToApiRequest,
  transformRowToApiRequest,
  validateBulkUpdateData,
  validateRowData,
} from '../helpers/company-representative-settings.helpers';

import {
  useCompanyRepresentativeDropdownData,
  useCompanyRepresentativeFilterForm,
  useCompanyRepresentativeQueryParams,
} from '../hooks';
import { BulkUpdateDialog } from './BulkUpdateDialog';
import { CompanyRepresentativeTableSlots } from './CompanyRepresentativeTableSlots';

import type {
  BulkUpdateFormData,
  CompanyCustomerManagerItem,
  CompanyCustomerManagerResponse,
  CompanyRepresentativeFilters,
} from '../company-representative-settings.types';

/**
 * Company Representative Settings Page Component
 * Displays editable table of company customer manager assignments
 * Matches legacy system UI and functionality exactly
 */
const CompanyRepresentativeSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // State management
  const [additionalFilters, setAdditionalFilters] = useState<Partial<CompanyRepresentativeFilters>>({
    isManagerAssigned: true, // Default to "Temsilci Atanmış" matching legacy
  });
  const [selectedItems, setSelectedItems] = useState<CompanyCustomerManagerItem[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Track row-level changes for inline editing
  const [rowChanges, setRowChanges] = useState<Record<number, Partial<CompanyCustomerManagerItem>>>({});

  // Get dropdown data
  const {
    customerManagerList,
    productTypeList,
    financersList,
    buyerCompaniesList,
    isLoading: isDropdownLoading,
  } = useCompanyRepresentativeDropdownData();

  // Initialize filter form
  const { form, schema, handleSearch } = useCompanyRepresentativeFilterForm({
    customerManagerList,
    productTypeList,
    financersList,
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useCompanyRepresentativeQueryParams({ additionalFilters });

  // Use the useServerSideQuery hook following OperationPricing pattern
  // Wait for dropdown data to load before making the query
  const { data, error, isLoading, isFetching, pagingConfig, refetch } = useServerSideQuery(
    useLazyGetCompanyCustomerManagersQuery,
    isDropdownLoading ? undefined : baseQueryParams, // Don't query until dropdowns are loaded
  );

  // Update mutation
  const [updateCompanyCustomerManager, { isLoading: isUpdating, error: isUpdateError }] =
    useUpdateCompanyCustomerManagerMutation();

  // Error handling
  useErrorListener([error, isUpdateError]);

  // Extract table data - handle both ServerSideQueryResult and raw API response formats
  const rawResponse = data as unknown as CompanyCustomerManagerResponse;
  const gridData: CompanyCustomerManagerItem[] = data?.Data || data?.Items || rawResponse?.CompanyList || [];
  const totalCount = data?.TotalCount || rawResponse?.TotalCount || 0;

  // Event handlers
  const handleReset = useCallback(() => {
    form.reset();
    setAdditionalFilters({
      isManagerAssigned: true, // Reset to default
    });
    setSelectedItems([]);
  }, [form]);

  // Handle individual field changes from slots
  const handleFieldChange = useCallback((rowId: number, field: string, value: unknown) => {
    setRowChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  }, []);

  // Get current row data with any pending changes applied
  const getRowWithChanges = useCallback(
    (row: CompanyCustomerManagerItem) => {
      const changes = rowChanges[row.CompanyCustomerManagerId];
      return changes ? { ...row, ...changes } : row;
    },
    [rowChanges],
  );

  const handleRowUpdate = useCallback(
    async (row: CompanyCustomerManagerItem) => {
      // Get the row with any pending changes applied
      const updatedRow = getRowWithChanges(row);

      if (!validateRowData(updatedRow)) {
        notice({
          variant: 'error',
          title: 'Eksik veya Hatalı Alan',
          message: 'Lütfen tüm zorunlu alanları doğru şekilde doldurduğunuzdan emin olun.',
        });
        return;
      }

      try {
        const apiRequest = transformRowToApiRequest(updatedRow);
        await updateCompanyCustomerManager(apiRequest).unwrap();

        // Clear changes for this row after successful update
        setRowChanges((prev) => {
          const newChanges = { ...prev };
          delete newChanges[row.CompanyCustomerManagerId];
          return newChanges;
        });

        // Refresh data after successful update

        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Müşteri temsilcisi başarıyla güncellendi.',
        });
        refetch();
      } catch (error) {
        // Error will be handled by global error handler
        console.error('Row update failed:', error);
      }
    },
    [getRowWithChanges, updateCompanyCustomerManager, notice, refetch],
  );

  const handleHistoryView = useCallback(
    (row: CompanyCustomerManagerItem) => {
      // Navigate to history page matching legacy route exactly
      navigate(`/definitions/company-representative/${row.CompanyId}/history/${row.CompanyCustomerManagerId}`);
    },
    [navigate],
  );

  const handleBulkUpdate = useCallback(
    async (formData: BulkUpdateFormData) => {
      if (!validateBulkUpdateData(formData)) {
        // Show validation error
        return;
      }

      try {
        const apiRequest = transformBulkUpdateToApiRequest(selectedItems, formData);
        await updateCompanyCustomerManager(apiRequest).unwrap();
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Seçilen Müşteri temsilcileri başarıyla güncellendi.',
        });
        // Success - close modal and refresh
        setShowBulkModal(false);
        setSelectedItems([]);
        refetch();
      } catch (error) {
        // Error will be handled by global error handler
        console.error('Bulk update failed:', error);
      }
    },
    [selectedItems, updateCompanyCustomerManager, notice, refetch],
  );

  // VirtualTable column definitions
  const columns: VirtualTableColumn<CompanyCustomerManagerItem>[] = useMemo(
    () => [
      {
        id: 'CompanyIdentifier',
        label: 'ŞİRKET VKN / ADI',
        width: 200,
        minWidth: 250,
        render: (row: CompanyCustomerManagerItem) => <CompanyRepresentativeTableSlots.CompanyDisplaySlot row={row} />,
      },
      {
        id: 'ManagerUserId',
        label: 'MÜŞTERİ TEMSİLCİSİ',
        width: 280,
        minWidth: 220,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.CustomerManagerSlot
            row={getRowWithChanges(row)}
            options={customerManagerList}
            onChange={(value) => handleFieldChange(row.CompanyCustomerManagerId, 'ManagerUserId', value)}
          />
        ),
      },
      {
        id: 'ProductType',
        label: 'ÜRÜN',
        width: 250,
        minWidth: 200,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.ProductTypeSlot
            row={getRowWithChanges(row)}
            options={productTypeList}
            onChange={(value) => {
              handleFieldChange(row.CompanyCustomerManagerId, 'ProductType', value);
              // If new product type disables financer, clear financer value
              if (value && isFinancerDisabled(value)) {
                handleFieldChange(row.CompanyCustomerManagerId, 'FinancerCompanyId', null);
              }
            }}
          />
        ),
      },
      {
        id: 'FinancerCompanyId',
        label: 'FİNANSÖR',
        width: 250,
        minWidth: 200,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.FinancerSlot
            row={getRowWithChanges(row)}
            options={financersList}
            onChange={(value) => handleFieldChange(row.CompanyCustomerManagerId, 'FinancerCompanyId', value)}
          />
        ),
      },
      {
        id: 'BuyerCompanyId',
        label: 'ALICI',
        width: 250,
        minWidth: 200,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.BuyerCompanySlot
            row={getRowWithChanges(row)}
            options={buyerCompaniesList}
            onChange={(value) => handleFieldChange(row.CompanyCustomerManagerId, 'BuyerCompanyId', value)}
          />
        ),
      },
      {
        id: 'StartDate',
        label: 'BAŞLANGIÇ TARİHİ',
        width: 220,
        minWidth: 180,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.StartDateSlot
            row={getRowWithChanges(row)}
            onChange={(value) => handleFieldChange(row.CompanyCustomerManagerId, 'StartDate', value)}
          />
        ),
      },
      {
        id: 'actions',
        label: 'İŞLEMLER',
        width: 150,
        minWidth: 120,
        render: (row: CompanyCustomerManagerItem) => (
          <CompanyRepresentativeTableSlots.ActionsSlot
            row={row}
            onRefresh={handleRowUpdate}
            onHistory={handleHistoryView}
          />
        ),
      },
    ],
    [
      customerManagerList,
      productTypeList,
      financersList,
      buyerCompaniesList,
      getRowWithChanges,
      handleFieldChange,
      handleRowUpdate,
      handleHistoryView,
    ],
  );

  return (
    <>
      <PageHeader title="Müşteri Temsilcisi" subtitle="Müşteri Temsilcisi Yönetimi" />

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
          <Typography variant="h5" sx={{ mb: 2 }}>
            Temsilci Listesi
          </Typography>

          <VirtualTable<CompanyCustomerManagerItem>
            data={gridData}
            columns={columns}
            loading={isLoading || isFetching || isDropdownLoading}
            error={error ? 'Veriler yüklenirken bir hata oluştu' : null}
            selectable={true}
            selectedIds={selectedItems.map((item) => item.CompanyCustomerManagerId)}
            onSelectionChange={(_selectedIds, selectedRows) => {
              setSelectedItems(selectedRows);
            }}
            getRowId={(row) => row.CompanyCustomerManagerId}
            // VKN-based disabled rule: Only first record per VKN is selectable
            isRowDisabled={(row) => isRowDisabled(row, gridData)}
            pageSize={pagingConfig?.rowsPerPage || 100}
            currentPage={(pagingConfig?.page || 0) + 1}
            totalCount={totalCount}
            onPageChange={(page) => {
              if (pagingConfig?.onPageChange) {
                pagingConfig.onPageChange(page - 1);
              }
            }}
            onPageSizeChange={(pageSize) => pagingConfig?.onPageSizeChange?.(pageSize)}
            emptyMessage="Müşteri temsilcisi verisi bulunamadı. Filtre kriterlerinizi değiştirerek tekrar deneyin."
            height={800}
          />
        </Card>
      </Box>

      {/* Floating Bulk Update Button - matches legacy bubble design exactly */}
      <Zoom in={selectedItems.length > 0}>
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
          Seçili Temsilci Güncelleme ({selectedItems.length})
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

export default CompanyRepresentativeSettingsPage;
